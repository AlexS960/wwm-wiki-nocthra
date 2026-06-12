/**
 * ИИ-обогащение парсеров: LM Studio (локально) или DeepSeek (облако).
 * По умолчанию — LM Studio + mistralai/ministral-3-3b.
 */

const SECTION_HINTS = {
  weapons: 'оружие Where Winds Meet — поля name (рус), description (кратко)',
  riddles: 'загадки — clueRu, answersRu, nameRu у загадочников',
  innerpath: 'внутренний путь — nameRu, effectRu, howToGetRu',
  bosses: 'боссы — name (рус), strategy (массив кратких советов на русском)',
  mystic: 'мистические навыки — nameRu, effectRu',
  cooking: 'рецепты/профессии — nameRu, effectRu',
  'npcs-locations': 'NPC — locationDetailRu (краткий перевод локации)',
};

export function getAiConfig() {
  const provider = (process.env.AI_PROVIDER || 'lmstudio').toLowerCase();

  if (provider === 'deepseek') {
    return {
      provider: 'deepseek',
      label: 'DeepSeek',
      baseUrl: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY?.trim() || '',
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
      enrichLimit: Number(process.env.AI_ENRICH_LIMIT || process.env.DEEPSEEK_ENRICH_LIMIT || 25),
      jsonMode: true,
      timeoutMs: Number(process.env.AI_TIMEOUT_MS || 90000),
    };
  }

  return {
    provider: 'lmstudio',
    label: 'LM Studio',
    baseUrl: (process.env.LM_STUDIO_BASE_URL || 'http://127.0.0.1:1234/v1').replace(/\/$/, ''),
    apiKey: process.env.LM_STUDIO_API_KEY?.trim() || 'lm-studio',
    model: process.env.LM_STUDIO_MODEL || 'mistralai/ministral-3-3b',
    enrichLimit: Number(process.env.AI_ENRICH_LIMIT || 12),
    jsonMode: false,
    timeoutMs: Number(process.env.AI_TIMEOUT_MS || 180000),
  };
}

export function isAiConfigured() {
  const cfg = getAiConfig();
  if (cfg.provider === 'deepseek') return Boolean(cfg.apiKey);
  if (process.env.VERCEL === '1') return false;
  return true;
}

export async function getAiStatus() {
  const cfg = getAiConfig();

  if (cfg.provider === 'deepseek' && !cfg.apiKey) {
    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: false,
      active: false,
      message: 'DEEPSEEK_API_KEY не задан',
      model: cfg.model,
    };
  }

  if (cfg.provider === 'lmstudio' && process.env.VERCEL === '1') {
    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: true,
      active: false,
      message: 'LM Studio доступен только локально (npm run dev на вашем ПК)',
      model: cfg.model,
      localOnly: true,
    };
  }

  try {
    const res = await fetchWithTimeout(`${cfg.baseUrl}/models`, {
      headers: authHeaders(cfg),
    }, Math.min(cfg.timeoutMs, 8000));

    let modelLoaded = res.ok;
    let message = res.ok ? `${cfg.label} подключён` : `HTTP ${res.status}`;

    if (res.ok) {
      try {
        const data = await res.json();
        const ids = (data.data || data.models || []).map(m => m.id || m.name).filter(Boolean);
        if (ids.length && !ids.some(id => id.includes(cfg.model) || cfg.model.includes(id))) {
          message = `${cfg.label} запущен · модель «${cfg.model}» не в списке (${ids.slice(0, 3).join(', ')}…)`;
        }
      } catch { /* ignore */ }
    }

    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: true,
      active: modelLoaded,
      message,
      model: cfg.model,
      baseUrl: cfg.provider === 'lmstudio' ? cfg.baseUrl : undefined,
      localOnly: cfg.provider === 'lmstudio',
    };
  } catch (e) {
    const hint =
      cfg.provider === 'lmstudio'
        ? 'Запустите LM Studio → Load model → Start Server (порт 1234)'
        : 'Проверьте ключ и сеть';
    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: true,
      active: false,
      message: `${e.message || 'Нет соединения'}. ${hint}`,
      model: cfg.model,
      baseUrl: cfg.provider === 'lmstudio' ? cfg.baseUrl : undefined,
      localOnly: cfg.provider === 'lmstudio',
    };
  }
}

/** @deprecated use getAiStatus */
export const getDeepSeekStatus = getAiStatus;

export function isDeepSeekConfigured() {
  return isAiConfigured();
}

export async function enrichPayloadWithAi(section, payload, onProgress) {
  if (!isAiConfigured() || !payload) {
    return { payload, ai: { used: false, reason: 'no_ai_or_payload' } };
  }

  const cfg = getAiConfig();
  const items = extractEnrichableItems(section, payload).slice(0, cfg.enrichLimit);

  if (!items.length) {
    return { payload, ai: { used: false, reason: 'nothing_to_enrich' } };
  }

  onProgress?.({
    phase: 'ai',
    done: 0,
    total: items.length,
    message: `Запрос к ${cfg.label} (${cfg.model})…`,
  });

  const hint = SECTION_HINTS[section] || section;
  const userContent = [
    `Раздел: ${section}`,
    `Задача: ${hint}`,
    'Верни ТОЛЬКО JSON без markdown: { "items": [ ...объекты с теми же id ] }',
    `Данные (${items.length} шт.):`,
    JSON.stringify(items),
  ].join('\n');

  const body = {
    model: cfg.model,
    temperature: 0.15,
    messages: [
      {
        role: 'system',
        content:
          'Ты редактор русскоязычной вики Where Winds Meet. Переводи на русский и дополняй только нужные поля. Сохраняй id без изменений. Ответ — только валидный JSON.',
      },
      { role: 'user', content: userContent },
    ],
  };

  if (cfg.jsonMode) {
    body.response_format = { type: 'json_object' };
  }

  const res = await fetchWithTimeout(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(cfg) },
    body: JSON.stringify(body),
  }, cfg.timeoutMs);

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    const short = errText.slice(0, 200);
    if (cfg.provider === 'deepseek' && res.status === 402) {
      return {
        payload,
        ai: {
          used: false,
          provider: cfg.provider,
          error: 'Недостаточно баланса DeepSeek — данные парсера сохранены без ИИ',
          httpStatus: 402,
        },
      };
    }
    throw new Error(`${cfg.label} HTTP ${res.status}: ${short}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  const parsed = parseJsonFromResponse(raw);
  const enriched = parsed.items || parsed.data || [];
  const merged = mergeEnrichedItems(section, payload, enriched);

  onProgress?.({
    phase: 'ai',
    done: enriched.length,
    total: items.length,
    message: `${cfg.label}: обработано ${enriched.length} записей`,
  });

  return {
    payload: merged,
    ai: {
      used: true,
      provider: cfg.provider,
      enriched: enriched.length,
      model: cfg.model,
      message: `Обогащено ${enriched.length} из ${items.length} (${cfg.label})`,
    },
  };
}

/** @deprecated */
export const enrichPayloadWithDeepSeek = enrichPayloadWithAi;

function authHeaders(cfg) {
  if (!cfg.apiKey) return {};
  return { Authorization: `Bearer ${cfg.apiKey}` };
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error(`Таймаут ${Math.round(timeoutMs / 1000)}с — модель отвечает слишком долго`);
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonFromResponse(raw) {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch { /* continue */ }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch { /* continue */ }
  }

  const obj = trimmed.match(/\{[\s\S]*\}/);
  if (obj) {
    return JSON.parse(obj[0]);
  }

  throw new Error('Модель вернула невалидный JSON');
}

function extractEnrichableItems(section, payload) {
  if (payload.riddles) {
    return [
      ...(payload.riddles.masters || []).slice(0, 8),
      ...(payload.riddles.clues || []).slice(0, 6),
    ];
  }
  if (payload.innerpath?.items) return payload.innerpath.items.slice(0, 15);
  if (payload.npcLocations?.items) return payload.npcLocations.items.slice(0, 12);
  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    return (payload.sectionOverrides[key] || []).slice(0, 15);
  }
  return [];
}

function mergeEnrichedItems(section, payload, enriched) {
  if (!enriched?.length) return payload;
  const map = new Map(enriched.filter(x => x.id).map(x => [x.id, x]));

  const mergeList = list =>
    list.map(item => (map.has(item.id) ? { ...item, ...map.get(item.id) } : item));

  if (payload.riddles) {
    return {
      ...payload,
      riddles: {
        ...payload.riddles,
        masters: mergeList(payload.riddles.masters || []),
        clues: mergeList(payload.riddles.clues || []),
      },
    };
  }
  if (payload.innerpath) {
    return {
      ...payload,
      innerpath: { ...payload.innerpath, items: mergeList(payload.innerpath.items || []) },
    };
  }
  if (payload.npcLocations) {
    return {
      ...payload,
      npcLocations: { ...payload.npcLocations, items: mergeList(payload.npcLocations.items || []) },
    };
  }
  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    return {
      ...payload,
      sectionOverrides: {
        ...payload.sectionOverrides,
        [key]: mergeList(payload.sectionOverrides[key] || []),
      },
    };
  }
  return payload;
}

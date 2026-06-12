/**
 * ИИ-обогащение парсеров через LM Studio (локально на ПК).
 * Документация: https://lmstudio.ai
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

function normalizeBaseUrl(raw) {
  let url = (raw || 'http://127.0.0.1:1234/v1').trim().replace(/\/+$/, '');
  url = url.replace(/\/models$/i, '').replace(/\/+$/, '');
  if (!url.endsWith('/v1')) {
    if (url.endsWith('/api')) url += '/v1';
    else if (!/\/v\d+$/.test(url)) url += '/v1';
  }
  return url;
}

export function getAiConfig() {
  return {
    provider: 'lmstudio',
    label: 'LM Studio',
    baseUrl: normalizeBaseUrl(process.env.LM_STUDIO_BASE_URL),
    apiKey: process.env.LM_STUDIO_API_KEY?.trim() || 'lm-studio',
    model: process.env.LM_STUDIO_MODEL || 'mistralai/ministral-3-3b',
    enrichLimit: Number(process.env.AI_ENRICH_LIMIT || 12),
    timeoutMs: Number(process.env.AI_TIMEOUT_MS || 180000),
  };
}

export function isAiConfigured() {
  if (process.env.VERCEL === '1') return false;
  return true;
}

export async function getAiStatus() {
  const cfg = getAiConfig();

  if (process.env.VERCEL === '1') {
    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: true,
      active: false,
      message: 'LM Studio работает только на вашем ПК (npm run dev). На Vercel ИИ отключён.',
      model: cfg.model,
      localOnly: true,
    };
  }

  try {
    const res = await fetchWithTimeout(`${cfg.baseUrl}/models`, {
      headers: authHeaders(cfg),
    }, 8000);

    let message = res.ok ? 'LM Studio подключён — можно синхронизировать с ИИ' : `Сервер ответил HTTP ${res.status}`;

    if (res.status === 401) {
      return {
        provider: cfg.provider,
        label: cfg.label,
        configured: true,
        active: false,
        message: 'Нужен токен: LM_STUDIO_API_KEY в .env (Manage Tokens в LM Studio)',
        model: cfg.model,
        baseUrl: cfg.baseUrl,
        localOnly: true,
      };
    }

    if (res.ok) {
      try {
        const data = await res.json();
        const ids = (data.data || data.models || []).map(m => m.id || m.name).filter(Boolean);
        if (ids.length && !ids.some(id => id.includes(cfg.model) || cfg.model.includes(id))) {
          message = `Сервер запущен, но модель «${cfg.model}» не найдена. Загружено: ${ids.slice(0, 2).join(', ')}… Скопируйте точное имя в LM_STUDIO_MODEL`;
        }
      } catch { /* ignore */ }
    }

    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: true,
      active: res.ok,
      message,
      model: cfg.model,
      baseUrl: cfg.baseUrl,
      localOnly: true,
    };
  } catch (e) {
    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: true,
      active: false,
      message: e.message || 'LM Studio не отвечает',
      model: cfg.model,
      baseUrl: cfg.baseUrl,
      localOnly: true,
    };
  }
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
    message: `LM Studio (${cfg.model})…`,
  });

  const hint = SECTION_HINTS[section] || section;
  const userContent = [
    `Раздел: ${section}`,
    `Задача: ${hint}`,
    'Верни ТОЛЬКО JSON без markdown: { "items": [ ...объекты с теми же id ] }',
    `Данные (${items.length} шт.):`,
    JSON.stringify(items),
  ].join('\n');

  const res = await fetchWithTimeout(`${cfg.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(cfg) },
    body: JSON.stringify({
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
    }),
  }, cfg.timeoutMs);

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`LM Studio HTTP ${res.status}: ${errText.slice(0, 200)}`);
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
    message: `LM Studio: ${enriched.length} записей`,
  });

  return {
    payload: merged,
    ai: {
      used: true,
      provider: cfg.provider,
      enriched: enriched.length,
      model: cfg.model,
      message: `Переведено ${enriched.length} из ${items.length}`,
    },
  };
}

function authHeaders(cfg) {
  return { Authorization: `Bearer ${cfg.apiKey}` };
}

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error(`Таймаут ${Math.round(timeoutMs / 1000)}с`);
    }
    throw new Error('LM Studio не запущен — откройте программу и нажмите Start Server');
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

  throw new Error('Модель вернула невалидный JSON — попробуйте ещё раз или отключите ИИ');
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

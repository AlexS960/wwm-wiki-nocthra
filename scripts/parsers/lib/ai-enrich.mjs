/**
 * ИИ-перевод через LM Studio — небольшими пакетами для слабых моделей.
 */
import {
  applyRuleBasedTranslation,
  collectItemsForAi,
  mergeAiTranslations,
  hasCyrillic,
} from './translate-fields.mjs';

const SECTION_SCHEMA = {
  innerpath: 'Для каждого id верни: nameRu (русское название), effectRu (перевод effect), howToGetRu (перевод howToGet). Только кириллица.',
  riddles: 'Для master: nameRu. Для clue: clueRu (перевод подсказки), answersRu (массив переводов ответов).',
  'npcs-locations': 'Для каждого id: locationDetailRu — краткий перевод locationDetail на русский.',
  weapons: 'Для каждого id: name (русское название оружия), description (краткое описание на русском).',
  bosses: 'Для каждого id: name (имя босса по-русски), strategy (массив из 2–3 коротких советов на русском).',
  mystic: 'Для каждого id: name, effectRu (перевод effect), howToGetRu.',
  cooking: 'Для каждого id: name, effectRu (перевод effect).',
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
    enrichLimit: Number(process.env.AI_ENRICH_LIMIT || 40),
    batchSize: Number(process.env.AI_BATCH_SIZE || 2),
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
      message: 'LM Studio только на ПК (npm run dev)',
      model: cfg.model,
      localOnly: true,
    };
  }
  try {
    const res = await fetchWithTimeout(`${cfg.baseUrl}/models`, { headers: authHeaders(cfg) }, 8000);
    if (res.status === 401) {
      return {
        provider: cfg.provider,
        label: cfg.label,
        configured: true,
        active: false,
        message: 'Нужен LM_STUDIO_API_KEY в .env',
        model: cfg.model,
        localOnly: true,
      };
    }
    return {
      provider: cfg.provider,
      label: cfg.label,
      configured: true,
      active: res.ok,
      message: res.ok ? 'LM Studio подключён' : `HTTP ${res.status}`,
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
      message: `${e.message || 'Нет связи'}. Developer → Start server ON`,
      model: cfg.model,
      localOnly: true,
    };
  }
}

export async function enrichPayloadWithAi(section, payload, onProgress) {
  if (!payload) return { payload, ai: { used: false, reason: 'no_payload' } };

  let working = applyRuleBasedTranslation(payload);
  const needAi = isAiConfigured() && section !== false;

  if (!needAi) {
    return { payload: working, ai: { used: false, reason: 'ai_disabled' } };
  }

  const cfg = getAiConfig();
  const queue = collectItemsForAi(section, working).slice(0, cfg.enrichLimit);

  if (!queue.length) {
    return {
      payload: working,
      ai: { used: false, reason: 'already_russian', message: 'Rule-based перевод уже применён' },
    };
  }

  const schema = SECTION_SCHEMA[section] || 'Переведи текстовые поля на русский.';
  const allTranslated = [];
  let errors = 0;

  for (let i = 0; i < queue.length; i += cfg.batchSize) {
    const batch = queue.slice(i, i + cfg.batchSize);
    onProgress?.({
      phase: 'ai',
      done: i,
      total: queue.length,
      message: `Перевод ${i + 1}–${Math.min(i + batch.length, queue.length)} из ${queue.length}…`,
    });

    try {
      const items = await callLmStudioBatch(cfg, section, schema, batch);
      allTranslated.push(...items);
    } catch (e) {
      errors += 1;
      if (errors >= 3) break;
    }
  }

  working = mergeAiTranslations(section, working, allTranslated);

  const cyrillicCount = countTranslatedFields(section, working);
  return {
    payload: working,
    ai: {
      used: allTranslated.length > 0,
      enriched: allTranslated.length,
      model: cfg.model,
      message: allTranslated.length
        ? `Переведено ${allTranslated.length} записей (≈${cyrillicCount} полей с кириллицей)`
        : errors
          ? 'LM Studio не смог перевести — проверьте модель или увеличьте AI_TIMEOUT_MS'
          : 'Нечего переводить',
      errors: errors || undefined,
    },
  };
}

async function callLmStudioBatch(cfg, section, schema, batch) {
  const example = batch.length === 1
    ? `Пример ответа: {"items":[{"id":"${batch[0].id}","nameRu":"Русское имя"}]}`
    : `Пример: {"items":[{"id":"...","nameRu":"..."},{"id":"...","effectRu":"..."}]}`;

  const userContent = [
    `Раздел: ${section}`,
    schema,
    example,
    'Верни ТОЛЬКО JSON объект {"items":[...]} без markdown.',
    `Вход (${batch.length}):`,
    JSON.stringify(batch),
  ].join('\n');

  const res = await fetchWithTimeout(
    `${cfg.baseUrl}/chat/completions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(cfg) },
      body: JSON.stringify({
        model: cfg.model,
        temperature: 0.1,
        max_tokens: 2048,
        messages: [
          {
            role: 'system',
            content:
              'Ты профессиональный переводчик EN→RU для игровой вики. Все пользовательские тексты переводи на русский. Сохраняй id. Только JSON.',
          },
          { role: 'user', content: userContent },
        ],
      }),
    },
    cfg.timeoutMs,
  );

  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`LM Studio ${res.status}: ${t.slice(0, 150)}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  const parsed = parseJsonFromResponse(raw);
  const items = parsed.items || parsed.data || [];
  return items.filter(x => x?.id && Object.keys(x).length > 1);
}

function countTranslatedFields(section, payload) {
  let n = 0;
  const check = v => { if (hasCyrillic(v)) n += 1; };

  if (payload.riddles) {
    for (const m of payload.riddles.masters || []) check(m.nameRu);
    for (const c of payload.riddles.clues || []) check(c.clueRu);
  }
  if (payload.innerpath?.items) {
    for (const i of payload.innerpath.items) {
      check(i.nameRu);
      check(i.effectRu);
    }
  }
  if (payload.sectionOverrides) {
    for (const list of Object.values(payload.sectionOverrides)) {
      for (const i of list || []) check(i.name);
    }
  }
  return n;
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
    if (e.name === 'AbortError') throw new Error(`Таймаут ${Math.round(timeoutMs / 1000)}с`);
    throw new Error('LM Studio не запущен');
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
  if (obj) return JSON.parse(obj[0]);
  throw new Error('Модель вернула не JSON');
}

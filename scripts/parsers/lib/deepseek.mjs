const API_BASE = 'https://api.deepseek.com';

export function isDeepSeekConfigured() {
  return Boolean(process.env.DEEPSEEK_API_KEY?.trim());
}

export async function getDeepSeekStatus() {
  const configured = isDeepSeekConfigured();
  if (!configured) {
    return {
      configured: false,
      active: false,
      message: 'DEEPSEEK_API_KEY не задан на сервере',
    };
  }

  try {
    const res = await fetch(`${API_BASE}/models`, {
      headers: { Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}` },
    });
    return {
      configured: true,
      active: res.ok,
      message: res.ok ? 'DeepSeek подключён' : `API ответил: HTTP ${res.status}`,
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    };
  } catch (e) {
    return {
      configured: true,
      active: false,
      message: e.message || 'Ошибка соединения с DeepSeek',
      model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    };
  }
}

const SECTION_HINTS = {
  weapons: 'оружие Where Winds Meet — поля name (рус), description (кратко)',
  riddles: 'загадки — clueRu, answersRu',
  innerpath: 'внутренний путь — nameRu, effectRu, howToGetRu',
  bosses: 'боссы — name, strategy (массив кратких советов на русском)',
  mystic: 'мистические навыки — nameRu, effectRu',
  cooking: 'рецепты/профессии — nameRu, effectRu',
  'npcs-locations': 'NPC — locationDetailRu (краткий перевод локации)',
};

/**
 * Обогащает данные парсера через DeepSeek (перевод + краткие описания).
 * @param {function} onProgress - ({ phase, done, total, message })
 */
export async function enrichPayloadWithDeepSeek(section, payload, onProgress) {
  if (!isDeepSeekConfigured() || !payload) {
    return { payload, ai: { used: false, reason: 'no_key_or_payload' } };
  }

  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const maxItems = Number(process.env.DEEPSEEK_ENRICH_LIMIT || 25);
  const items = extractEnrichableItems(section, payload).slice(0, maxItems);

  if (!items.length) {
    return { payload, ai: { used: false, reason: 'nothing_to_enrich' } };
  }

  onProgress?.({ phase: 'ai', done: 0, total: items.length, message: 'Запрос к DeepSeek…' });

  const hint = SECTION_HINTS[section] || section;
  const userContent = `Раздел: ${section}\nЗадача: ${hint}\nВерни JSON: { "items": [ ...обновлённые объекты с теми же id ] }\nДанные:\n${JSON.stringify(items)}`;

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Ты редактор русскоязычной вики Where Winds Meet. Переводи и дополняй только запрошенные поля. Сохраняй id. Только валидный JSON.',
        },
        { role: 'user', content: userContent },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`DeepSeek HTTP ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || '{}';
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('DeepSeek вернул невалидный JSON');
  }

  const enriched = parsed.items || parsed.data || [];
  const merged = mergeEnrichedItems(section, payload, enriched);

  onProgress?.({
    phase: 'ai',
    done: enriched.length,
    total: items.length,
    message: `DeepSeek обработал ${enriched.length} записей`,
  });

  return {
    payload: merged,
    ai: {
      used: true,
      enriched: enriched.length,
      model,
      message: `Обогащено ${enriched.length} из ${items.length}`,
    },
  };
}

function extractEnrichableItems(section, payload) {
  if (payload.riddles) {
    return [
      ...(payload.riddles.masters || []).slice(0, 15),
      ...(payload.riddles.clues || []).slice(0, 10),
    ];
  }
  if (payload.innerpath?.items) return payload.innerpath.items;
  if (payload.npcLocations?.items) return payload.npcLocations.items.slice(0, 25);
  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    return payload.sectionOverrides[key] || [];
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

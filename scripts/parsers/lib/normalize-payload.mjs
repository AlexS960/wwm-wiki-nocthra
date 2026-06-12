/** Приводит данные парсера к полям карточек / модалок редактирования на сайте */

function splitList(s) {
  if (!s) return [];
  if (Array.isArray(s)) return s;
  return String(s)
    .split(/[,;\n]/)
    .map(x => x.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

const BOSS_TYPE_MAP = {
  campaign: 'campaign',
  world: 'world',
  quest: 'quest',
  challenge: 'challenge',
  мировой: 'world',
  подземелье: 'campaign',
};

const MYSTIC_TYPE_MAP = {
  attack: 'attack',
  defense: 'defense',
  support: 'support',
  movement: 'movement',
  атака: 'attack',
  защита: 'defense',
  поддержка: 'support',
  контроль: 'support',
};

function mapBossType(raw) {
  const k = String(raw || 'world').toLowerCase();
  if (k.includes('world')) return 'world';
  if (k.includes('campaign') || k.includes('story')) return 'campaign';
  if (k.includes('quest')) return 'quest';
  if (k.includes('challenge')) return 'challenge';
  return BOSS_TYPE_MAP[k] || 'world';
}

function mapMysticType(raw) {
  const k = String(raw || '').toLowerCase();
  for (const [key, val] of Object.entries(MYSTIC_TYPE_MAP)) {
    if (k.includes(key)) return val;
  }
  return 'attack';
}

function normInnerWay(item) {
  return {
    ...item,
    nameRu: item.nameRu || item.nameEn || '',
    effectRu: item.effectRu || item.effect || '',
    howToGetRu: item.howToGetRu || item.howToGet || '',
  };
}

function normWeapon(item) {
  return {
    ...item,
    name: item.name || item.nameEn || item.nameRu || '',
    description: item.description || item.summary || '',
    howToGet: item.howToGet || '',
    sect: item.sect || '',
    pair: item.pair || '',
    icon: item.icon || '⚔️',
  };
}

function normBoss(item) {
  const nameEn = item.nameEn || item.name || '';
  return {
    ...item,
    id: item.id,
    name: item.name || nameEn,
    nameEn,
    icon: item.icon || '👹',
    type: mapBossType(item.type),
    region: item.region || '',
    location: item.location || '',
    level: item.level || '',
    difficulty: item.difficulty || item.level || '',
    strategy: Array.isArray(item.strategy) ? item.strategy : splitList(item.strategy),
    rewards: Array.isArray(item.rewards) ? item.rewards : splitList(item.rewards),
    tips: Array.isArray(item.tips) ? item.tips : splitList(item.tips),
  };
}

function normMystic(item) {
  const nameEn = item.nameEn || item.name || '';
  const effect = item.effect || item.description || '';
  return {
    ...item,
    id: item.id,
    name: item.name || nameEn,
    nameEn,
    icon: item.icon || '✨',
    element: item.element || '',
    type: mapMysticType(item.type),
    description: item.description || effect,
    effect,
    cooldown: item.cooldown || '',
    howToGet: item.howToGet || '',
  };
}

function normRecipe(item) {
  const nameEn = item.nameEn || item.name || '';
  return {
    ...item,
    id: item.id,
    name: item.name || nameEn,
    nameEn,
    icon: item.icon || '🍳',
    level: item.level || '',
    effect: item.effect || '',
    stamina: item.stamina || '',
    ingredients: Array.isArray(item.ingredients) ? item.ingredients : splitList(item.ingredients),
    howToUnlock: item.howToUnlock || item.howToGet || '',
    category: item.category || 'Рецепт',
  };
}

export function normalizePayloadForUi(section, payload) {
  if (!payload) return payload;

  if (payload.riddles) {
    return {
      ...payload,
      riddles: {
        ...payload.riddles,
        clues: (payload.riddles.clues || []).map(c => ({
          ...c,
          primaryAnswer: c.primaryAnswer || c.answers?.[0] || '',
        })),
        masters: (payload.riddles.masters || []).map(m => ({
          ...m,
          nameRu: m.nameRu || m.nameEn || '',
        })),
      },
    };
  }

  if (payload.innerpath?.items) {
    return {
      ...payload,
      innerpath: {
        ...payload.innerpath,
        items: payload.innerpath.items.map(normInnerWay),
      },
    };
  }

  if (payload.npcLocations?.items) {
    return {
      ...payload,
      npcLocations: {
        ...payload.npcLocations,
        items: payload.npcLocations.items.map(n => ({
          ...n,
          locationDetailRu: n.locationDetailRu || n.locationDetail || '',
        })),
      },
    };
  }

  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    const list = payload.sectionOverrides[key] || [];
    const normalizers = {
      weapons: normWeapon,
      bosses: normBoss,
      mystic: normMystic,
      cooking: normRecipe,
      innerpath: normInnerWay,
    };
    const norm = normalizers[key] || (x => x);
    return {
      ...payload,
      sectionOverrides: { [key]: list.map(norm) },
    };
  }

  return payload;
}

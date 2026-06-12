/** Словари и rule-based перевод до вызова LM Studio */

export const WEAPON_NAME_RU = {
  'Nameless Sword': 'Безымянный меч',
  'Strategic Sword': 'Стратегический меч',
  'Nameless Spear': 'Безымянное копьё',
  'Heavenquaker Spear': 'Копьё небесного грома',
  'Stormbreaker Spear': 'Копьё разрушителя бурь',
  'Infernal Twinblades': 'Инфернальные клинки',
  'Thundercry Blade': 'Клинок грома',
  'Phalanxbane Blade': 'Клинок фаланги',
  'Snowparting Blade': 'Клинок разделения снега',
  'Mortal Rope Dart': 'Смертельный дротик',
  'Unfettered Rope Dart': 'Свободный дротик',
  'Vernal Umbrella': 'Весенний зонт',
  'Soulshade Umbrella': 'Зонт тени души',
  'Everspring Umbrella': 'Вечновесенний зонт',
  'Panacea Fan': 'Веер панацеи',
  'Inkwell Fan': 'Чернильный веер',
};

export const WEAPON_TYPE_RU = {
  Swords: 'Меч',
  'Dual Blades': 'Парные клинки',
  Spears: 'Копьё',
  'Mo Blades': 'Мо-клинок',
  'Rope Darts': 'Верёвочный дротик',
  Umbrellas: 'Зонт',
  Fans: 'Веер',
};

export const RIDDLE_MASTER_RU = {
  'Wang Xiaosan': 'Ван Сяосань',
  'Chan Yi': 'Чань И',
  'Sha Er': 'Ша Эр',
  Qingshan: 'Циншань',
  'Ruan Shuiyan': 'Жуань Шуйянь',
  'Tao Xiaoxiao': 'Тао Сяосяо',
  Yoyo: 'Йойо',
  'Zhang Jiu': 'Чжан Цзю',
  Kutuluk: 'Кутулук',
  'Zhang Yu': 'Чжан Юй',
  'Shi Lei': 'Ши Лэй',
  'Li Rouzhu': 'Ли Жоучжу',
  'Peng Shizhi': 'Пэн Шичи',
  'Liang Rongfu': 'Лян Жунфу',
  'Tian Danui': 'Тянь Дануй',
  'Tang Xiaofei': 'Тан Сяофэй',
  'Tao Qian': 'Тао Цянь',
  'Wang Li': 'Ван Ли',
};

export const INNER_PATH_RU = {
  'Bellstrike - Splendor': 'Удар колокола - Великолепие',
  'Bellstrike - Umbra': 'Удар колокола - Умбра',
  'Stonesplit - Might': 'Рассечение камня - Мощь',
  'Stonesplit - Strength': 'Рассечение камня - Сила',
  'Silkbind - Jade': 'Шелковое связывание - Нефрит',
  'Silkbind - Deluge': 'Шелковое связывание - Потоп',
  'Bamboocut - Wind': 'Рассечение бамбука - Ветер',
  'Bamboocut - Dust': 'Рассечение бамбука - Пыль',
};

export function hasCyrillic(text) {
  return /[\u0400-\u04FF]/.test(String(text || ''));
}

export function applyRuleBasedTranslation(payload) {
  if (!payload) return payload;

  if (payload.riddles) {
    return {
      ...payload,
      riddles: {
        ...payload.riddles,
        masters: (payload.riddles.masters || []).map(m => ({
          ...m,
          nameRu: m.nameRu && hasCyrillic(m.nameRu) ? m.nameRu : (RIDDLE_MASTER_RU[m.nameEn] || m.nameRu || ''),
        })),
        clues: payload.riddles.clues || [],
      },
    };
  }

  if (payload.innerpath?.items) {
    return {
      ...payload,
      innerpath: {
        ...payload.innerpath,
        items: payload.innerpath.items.map(item => ({
          ...item,
          pathLabelRu: INNER_PATH_RU[item.pathEn] || item.pathLabelRu || '',
        })),
      },
    };
  }

  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    const list = payload.sectionOverrides[key] || [];
    if (key === 'weapons') {
      return {
        ...payload,
        sectionOverrides: {
          weapons: list.map(w => ({
            ...w,
            name: hasCyrillic(w.name) ? w.name : (WEAPON_NAME_RU[w.nameEn] || w.name || w.nameEn),
            type: WEAPON_TYPE_RU[w.type] || (hasCyrillic(w.type) ? w.type : w.type),
          })),
        },
      };
    }
  }

  return payload;
}

/** Поля, которые LM Studio должен перевести (только без кириллицы) */
export function collectItemsForAi(section, payload) {
  const out = [];

  if (payload.riddles) {
    for (const m of payload.riddles.masters || []) {
      if (!hasCyrillic(m.nameRu) && m.nameEn) {
        out.push({ kind: 'master', id: m.id, nameEn: m.nameEn, locationDetail: m.locationDetail });
      }
    }
    for (const c of payload.riddles.clues || []) {
      if (!hasCyrillic(c.clueRu) && c.clueEn) {
        out.push({ kind: 'clue', id: c.id, clueEn: c.clueEn, answers: c.answers });
      }
    }
    return out;
  }

  if (payload.innerpath?.items) {
    for (const item of payload.innerpath.items) {
      if (!hasCyrillic(item.nameRu) || !hasCyrillic(item.effectRu) || !hasCyrillic(item.howToGetRu)) {
        out.push({
          id: item.id,
          nameEn: item.nameEn,
          effect: item.effect,
          howToGet: item.howToGet,
        });
      }
    }
    return out;
  }

  if (payload.npcLocations?.items) {
    for (const n of payload.npcLocations.items) {
      if (!hasCyrillic(n.locationDetailRu) && n.locationDetail) {
        out.push({ id: n.id, nameEn: n.nameEn, locationDetail: n.locationDetail });
      }
    }
    return out;
  }

  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    for (const item of payload.sectionOverrides[key] || []) {
      if (key === 'weapons') {
        if (!hasCyrillic(item.name) && item.nameEn) {
          out.push({ id: item.id, nameEn: item.nameEn, type: item.type, description: item.description || '' });
        }
      } else if (key === 'bosses' || key === 'mystic' || key === 'cooking') {
        if (!hasCyrillic(item.name) && (item.nameEn || item.name)) {
          out.push({
            id: item.id,
            nameEn: item.nameEn || item.name,
            effect: item.effect || item.description || '',
            howToGet: item.howToGet || item.howToUnlock || '',
          });
        }
      }
    }
  }

  return out;
}

export function mergeAiTranslations(section, payload, translated) {
  if (!translated?.length) return payload;
  const map = new Map(translated.filter(x => x.id).map(x => [x.id, x]));

  const merge = list => list.map(item => {
    const t = map.get(item.id);
    if (!t) return item;
    return { ...item, ...t };
  });

  if (payload.riddles) {
    return {
      ...payload,
      riddles: {
        ...payload.riddles,
        masters: merge(payload.riddles.masters || []).map(m => ({
          ...m,
          nameRu: hasCyrillic(m.nameRu) ? m.nameRu : (RIDDLE_MASTER_RU[m.nameEn] || ''),
        })),
        clues: merge(payload.riddles.clues || []).map(c => ({
          ...c,
          clueRu: hasCyrillic(c.clueRu) ? c.clueRu : '',
        })),
      },
    };
  }

  if (payload.innerpath) {
    return {
      ...payload,
      innerpath: {
        ...payload.innerpath,
        items: merge(payload.innerpath.items || []).map(item => ({
          ...item,
          nameRu: hasCyrillic(item.nameRu) ? item.nameRu : '',
          effectRu: hasCyrillic(item.effectRu) ? item.effectRu : '',
          howToGetRu: hasCyrillic(item.howToGetRu) ? item.howToGetRu : '',
        })),
      },
    };
  }

  if (payload.npcLocations) {
    return {
      ...payload,
      npcLocations: {
        ...payload.npcLocations,
        items: merge(payload.npcLocations.items || []).map(n => ({
          ...n,
          locationDetailRu: hasCyrillic(n.locationDetailRu) ? n.locationDetailRu : '',
        })),
      },
    };
  }

  if (payload.sectionOverrides) {
    const key = Object.keys(payload.sectionOverrides)[0];
    return {
      ...payload,
      sectionOverrides: {
        [key]: merge(payload.sectionOverrides[key] || []).map(item => {
          const name = hasCyrillic(item.name) ? item.name : (WEAPON_NAME_RU[item.nameEn] || item.name || item.nameEn);
          return {
            ...item,
            name,
            nameRu: item.nameRu || name,
            effectRu: item.effectRu || item.effect,
            description: hasCyrillic(item.description) ? item.description : (item.descriptionRu || item.description || ''),
          };
        }),
      },
    };
  }

  return payload;
}

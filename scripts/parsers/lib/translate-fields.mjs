/** Словари и rule-based перевод полей парсеров */

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

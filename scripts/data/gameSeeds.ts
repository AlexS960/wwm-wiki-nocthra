export interface Weapon {
  id: string; name: string; nameEn: string; type: string; role: string;
  martialArt: string; pair: string; sect: string; howToGet: string; description: string; icon: string;
}

export const weapons: Weapon[] = [
  { id: 'nameless-sword', name: 'Безымянный Меч', nameEn: 'Nameless Sword', type: 'Меч', role: 'Ближний ДПС', martialArt: 'Bellstrike — Splendor', pair: 'Безымянное Копьё', sect: 'Нет (начальное)', howToGet: 'Доступен по умолчанию', description: 'Стартовый меч, сочетающий мобильность и мощные заряженные атаки.', icon: '⚔️' },
  { id: 'nameless-spear', name: 'Безымянное Копьё', nameEn: 'Nameless Spear', type: 'Копьё', role: 'Ближний ДПС', martialArt: 'Bellstrike — Splendor', pair: 'Безымянный Меч', sect: 'Нет (начальное)', howToGet: 'Доступно по умолчанию', description: 'Стартовое копьё с дальнобойными заряженными атаками.', icon: '🔱' },
  { id: 'strategic-sword', name: 'Стратегический Меч', nameEn: 'Strategic Sword', type: 'Меч', role: 'Ближний ДПС (DoT)', martialArt: 'Bellstrike — Umbra', pair: 'Копьё Небесного Грома', sect: 'Одинокое Облако', howToGet: 'Кража навыка в святилище', description: 'DPS-вариант с фокусом на урон по времени (DoT).', icon: '🗡️' },
  { id: 'heavenquaker-spear', name: 'Копьё Небесного Грома', nameEn: 'Heavenquaker Spear', type: 'Копьё', role: 'Ближний ДПС', martialArt: 'Bellstrike — Umbra', pair: 'Стратегический Меч', sect: 'Бушующие Приливы', howToGet: 'Кража навыка на Ранчо Дикой Гривы', description: 'Дальнобойное копьё с эффективной расчисткой волн.', icon: '⚡' },
  { id: 'infernal-twinblades', name: 'Инфернальные Клинки', nameEn: 'Infernal Twinblades', type: 'Парные Клинки', role: 'Ближний ДПС', martialArt: 'Bamboocut — Wind', pair: 'Смертельный Верёвочный Дротик', sect: 'Полуночные Клинки', howToGet: 'Кража навыка у Звёздного Источника', description: 'Экстремальная мобильность и скорость.', icon: '🔪' },
  { id: 'mortal-rope-dart', name: 'Смертельный Дротик', nameEn: 'Mortal Rope Dart', type: 'Верёвочный Дротик', role: 'Ближний ДПС', martialArt: 'Bamboocut — Wind', pair: 'Инфернальные Клинки', sect: 'Девять Смертных Путей', howToGet: 'Вступление в секту', description: 'Уникальное дальнобойное ближнее оружие.', icon: '🪢' },
  { id: 'stormbreaker-spear', name: 'Разрушитель Бурь', nameEn: 'Stormbreaker Spear', type: 'Копьё', role: 'Танк', martialArt: 'Stonesplit — Might', pair: 'Клинок Грома', sect: 'Бушующие Приливы', howToGet: 'Сюжет', description: 'Копьё для командной поддержки.', icon: '🛡️' },
  { id: 'thundercry-blade', name: 'Клинок Грома', nameEn: 'Thundercry Blade', type: 'Мо-клинок', role: 'Танк', martialArt: 'Stonesplit — Might', pair: 'Копьё Разрушителя Бурь', sect: 'Колодец Небес', howToGet: 'Грейстаун', description: 'Чистая выживаемость и щиты.', icon: '🔨' },
  { id: 'panacea-fan', name: 'Веер Панацеи', nameEn: 'Panacea Fan', type: 'Веер', role: 'Целитель', martialArt: 'Silkbind — Deluge', pair: 'Зонт Тени Души', sect: 'Серебряная Игла', howToGet: 'Северная Бамбуковая Роща', description: 'AoE-исцеление и очищение.', icon: '🌸' },
  { id: 'soulshade-umbrella', name: 'Зонт Тени Души', nameEn: 'Soulshade Umbrella', type: 'Зонт', role: 'Целитель', martialArt: 'Silkbind — Deluge', pair: 'Веер Панацеи', sect: 'Пустотная Долина', howToGet: 'Туманный Лес', description: 'Зонт поддержки и защиты.', icon: '☂️' },
  { id: 'vernal-umbrella', name: 'Весенний Зонт', nameEn: 'Vernal Umbrella', type: 'Зонт', role: 'Дальний ДПС', martialArt: 'Silkbind — Jade', pair: 'Чернильный Веер', sect: 'Бархатная Тень', howToGet: 'Башня Времени', description: 'Зонт дальнего боя.', icon: '🌂' },
  { id: 'inkwell-fan', name: 'Чернильный Веер', nameEn: 'Inkwell Fan', type: 'Веер', role: 'Дальний ДПС', martialArt: 'Silkbind — Jade', pair: 'Весенний Зонт', sect: 'Серебряная Игла', howToGet: 'Цветочный Простор', description: 'Дальнобойный веер.', icon: '🪭' },
];

export interface BuildPath {
  id: string; name: string; nameEn: string; role: string; weapons: string[]; description: string;
  strengths: string[]; weaknesses: string[]; difficulty: string; icon: string; color: string;
}

export const buildPaths: BuildPath[] = [
  { id: 'bellstrike-splendor', name: 'Удар колокола — Великолепие', nameEn: 'Bellstrike — Splendor', role: 'Ближний ДПС', weapons: ['Безымянный Меч', 'Безымянное Копьё'], description: 'Высокая мобильность и заряженные атаки. Лучший выбор для новичков.', strengths: ['Высокий урон', 'Мобильность'], weaknesses: ['Средний AoE'], difficulty: 'Низкая', icon: '⚔️', color: 'from-amber-500/20 to-orange-600/20' },
  { id: 'bellstrike-umbra', name: 'Удар колокола — Умбра', nameEn: 'Bellstrike — Umbra', role: 'Ближний ДПС (DoT)', weapons: ['Стратегический Меч', 'Копьё Небесного Грома'], description: 'Урон от эффектов кровотечения.', strengths: ['Стабильный урон'], weaknesses: ['Постепенный урон'], difficulty: 'Средняя', icon: '🩸', color: 'from-red-500/20 to-rose-600/20' },
  { id: 'bamboocut-wind', name: 'Рассечение бамбука — Ветер', nameEn: 'Bamboocut — Wind', role: 'Ближний ДПС (Скорость)', weapons: ['Инфернальные Парные Клинки', 'Смертельный Верёвочный Дротик'], description: 'Скоростные атаки и мобильность.', strengths: ['Скорость атаки'], weaknesses: ['Низкая выживаемость'], difficulty: 'Высокая', icon: '💨', color: 'from-cyan-500/20 to-teal-600/20' },
  { id: 'stonesplit-might', name: 'Рассечение камня — Мощь', nameEn: 'Stonesplit — Might', role: 'Танк', weapons: ['Копьё Разрушителя Бурь', 'Клинок Грома'], description: 'Ориентирован на выживаемость и щиты.', strengths: ['Массивные щиты'], weaknesses: ['Низкий урон'], difficulty: 'Низкая', icon: '🛡️', color: 'from-stone-500/20 to-zinc-600/20' },
  { id: 'silkbind-deluge', name: 'Шелковое связывание — Потоп', nameEn: 'Silkbind — Deluge', role: 'Целитель / Саппорт', weapons: ['Веер Панацеи', 'Зонт Тени Души'], description: 'Чистая поддержка и исцеление.', strengths: ['AoE-исцеление'], weaknesses: ['Нет урона'], difficulty: 'Средняя', icon: '💚', color: 'from-emerald-500/20 to-green-600/20' },
  { id: 'silkbind-jade', name: 'Шелковое связывание — Нефрит', nameEn: 'Silkbind — Jade', role: 'Дальний ДПС', weapons: ['Чернильный Веер', 'Весенний Зонт'], description: 'Фокус на дальних атаках.', strengths: ['Дистанция'], weaknesses: ['Ближний бой'], difficulty: 'Высокая', icon: '🎯', color: 'from-purple-500/20 to-violet-600/20' },
];

export interface Sect { id: string; name: string; nameEn: string; theme: string; weapon: string; rules: string[]; benefits: string[]; howToJoin: string; description: string; icon: string; }
export const sects: Sect[] = [
  { id: 'well-of-heaven', name: 'Колодец Небес', nameEn: 'Well of Heaven', theme: 'Справедливость', weapon: 'Клинок Грома', rules: ['Не вредить своим'], benefits: ['Фокус на ближнем бою'], howToJoin: 'Поговорите с Сань Цяньэр', description: 'Секта праведности и верности.', icon: '⚖️' },
  { id: 'silver-needle', name: 'Серебряная Игла', nameEn: 'Silver Needle', theme: 'Лекари', weapon: 'Веер Панацеи', rules: ['Плата за лечение'], benefits: ['Лучшие хилеры'], howToJoin: 'Квесты целительства', description: 'Группа воинов-врачевателей.', icon: '💉' },
  { id: 'midnight-blades', name: 'Полуночные Клинки', nameEn: 'Midnight Blades', theme: 'Убийцы', weapon: 'Инфернальные Клинки', rules: ['Убивать для Кармы'], benefits: ['Лучшие для PvP'], howToJoin: 'Меню Сект (PvP)', description: 'Секта ассасинов.', icon: '🗡️' },
  { id: 'nine-mortal-ways', name: 'Девять Смертных Путей', nameEn: 'Nine Mortal Ways', theme: 'Трикстеры', weapon: 'Верёвочный Дротик', rules: ['Очки Веселья'], benefits: ['Стелс и маскировка'], howToJoin: 'Квест в Кайфэне', description: 'Мастера обмана.', icon: '🎭' },
  { id: 'raging-tides', name: 'Бушующие Приливы', nameEn: 'Raging Tides', theme: 'Воины', weapon: 'Копьё Грома', rules: ['Постоянный бой'], benefits: ['Копьевые билды'], howToJoin: 'Мини-игра борьбы', description: 'Военная дисциплина.', icon: '🌊' },
  { id: 'hollow-vale', name: 'Пустотная Долина', nameEn: 'Hollow Vale', theme: 'Баланс', weapon: 'Зонты', rules: ['Яд и исцеление'], benefits: ['Двойная механика'], howToJoin: 'Меню Сект', description: 'Секта Инь-Ян.', icon: '☯️' },
  { id: 'velvet-shade', name: 'Бархатная Тень', nameEn: 'Velvet Shade', theme: 'Социальное', weapon: 'Зонты', rules: ['Очарование'], benefits: ['Социальный геймплей'], howToJoin: 'Кайфэн', description: 'Романтика и дипломатия.', icon: '🌺' },
  { id: 'lone-cloud', name: 'Одинокое Облако', nameEn: 'Lone Cloud', theme: 'Стратегия', weapon: 'Стратегический Меч', rules: ['Дисциплина'], benefits: ['Мастерство меча'], howToJoin: 'Меню Сект', description: 'Сложные техники меча.', icon: '☁️' },
];

export interface MapRegion { id: string; name: string; nameEn: string; subregions: string[]; description: string; level: string; icon: string; x: number; y: number; }
export const mapRegions: MapRegion[] = [
  { id: 'qinghe', name: 'Цинхэ', nameEn: 'Qinghe', subregions: ['Дикие Просторы', 'Лунная Гора'], description: 'Стартовый регион.', level: '1-20', icon: '🌿', x: 25, y: 35 },
  { id: 'kaifeng', name: 'Кайфэн', nameEn: 'Kaifeng', subregions: ['Город Кайфэн', 'Нефритовый Двор'], description: 'Городской регион.', level: '15-35', icon: '🏯', x: 55, y: 30 },
  { id: 'hexi-jade', name: 'Нефритовые Врата', nameEn: 'Jade Gate Pass', subregions: ['Врата'], description: 'Западный регион.', level: '30-45', icon: '🏜️', x: 15, y: 55 },
  { id: 'hexi-liangzhou', name: 'Лянчжоу', nameEn: 'Liangzhou Town', subregions: ['Перевал'], description: 'Торговый город.', level: '35-50', icon: '⛰️', x: 30, y: 65 },
  { id: 'hexi-qinchuan', name: 'Циньчуань', nameEn: 'Qinchuan Path', subregions: ['Луг'], description: 'Новейший регион.', level: '45-60', icon: '🗻', x: 70, y: 60 },
];

export interface LifeSkill { name: string; description: string; icon: string; }
export const lifeSkills: LifeSkill[] = [
  { name: 'Ремесло', description: 'Создавайте снаряжение', icon: '🔨' },
  { name: 'Архитектура', description: 'Стройте здания', icon: '🏗️' },
  { name: 'Народные игры', description: 'Участвуйте в играх', icon: '🎲' },
  { name: 'Представления', description: 'Музыка и танцы', icon: '🎵' },
  { name: 'Медицина', description: 'Лечите раненых', icon: '💊' },
  { name: 'Кулинария', description: 'Готовьте блюда', icon: '🍜' },
  { name: 'Рыбалка', description: 'Ловите рыбу', icon: '🎣' },
  { name: 'Садоводство', description: 'Выращивайте растения', icon: '🌱' },
  { name: 'Каллиграфия', description: 'Искусство письма', icon: '✒️' },
  { name: 'Живопись', description: 'Рисуйте картины', icon: '🎨' },
  { name: 'Торговля', description: 'Торгуйте товарами', icon: '💰' },
];

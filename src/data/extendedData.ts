// ======================== BOSSES DATA ========================
export interface Boss {
  id: string;
  name: string;
  nameEn: string;
  type: 'campaign' | 'world' | 'challenge' | 'dungeon';
  region: string;
  location: string;
  level: string;
  difficulty: string;
  strategy: string[];
  rewards: string[];
  tips: string[];
  icon: string;
}

export const bosses: Boss[] = [
  // Campaign Bosses
  {
    id: 'dalang',
    name: 'Даланг',
    nameEn: 'Dalang',
    type: 'campaign',
    region: 'Цинхэ',
    location: 'Основной сюжет',
    level: '10-15',
    difficulty: 'Средняя',
    strategy: [
      'Фокусируйтесь на парировании атак лошади (красное свечение)',
      'Парирование спешивает Даланга — используйте момент для комбо',
      'Игнорируйте лучника в первой фазе',
      'Атакуйте босса, пока он на земле'
    ],
    rewards: ['Опыт персонажа', 'Монеты', 'Экипировка', 'Прогресс сюжета'],
    tips: ['Освойте тайминг парирования красных атак', 'Не торопитесь — изучите паттерн'],
    icon: '🐴'
  },
  {
    id: 'qianye',
    name: 'Цяньё',
    nameEn: 'Qianye',
    type: 'campaign',
    region: 'Цинхэ',
    location: 'Основной сюжет',
    level: '20-25',
    difficulty: 'Высокая',
    strategy: [
      'Парируйте все 5 ударов Brutal Combo для оглушения',
      'Во второй фазе используйте Celestial Seize для обезоруживания',
      'Когда зачаровывает оружие — немедленно обезоружьте',
      'Удары зачарованным оружием могут убить с одного удара'
    ],
    rewards: ['Экипировка', 'Опыт', 'Монеты', 'Прогресс сюжета'],
    tips: ['Heavenly Snatch критически важен', 'Следите за свечением оружия'],
    icon: '⚔️'
  },
  {
    id: 'void-king',
    name: 'Пустотный Король',
    nameEn: 'The Void King',
    type: 'campaign',
    region: 'Цинхэ',
    location: 'Основной сюжет',
    level: '35-40',
    difficulty: 'Очень высокая',
    strategy: [
      'Медленные заряженные красные атаки — обязательно парируйте',
      'Perfect Parry накапливает Qi Stagger',
      'Дождитесь оглушения перед нанесением максимального урона',
      'Используйте Execute перед окончанием оглушения'
    ],
    rewards: ['Редкая экипировка', 'Inner Way Tome', 'Большой опыт'],
    tips: ['Терпение — ключ к победе', 'Не жадничайте с атаками'],
    icon: '👑'
  },
  {
    id: 'tian-ying',
    name: 'Тянь Ин',
    nameEn: 'Tian Ying',
    type: 'campaign',
    region: 'Цинхэ',
    location: 'Основной сюжет (финал)',
    level: '40-45',
    difficulty: 'Очень высокая',
    strategy: [
      'Фаза 1: Изучите тайминг 4 ударов ногами',
      'Фазы 2-3: Парируйте основного босса для уничтожения клонов',
      'Избегайте blitz-атак — их нельзя парировать',
      'Победа над клонами через парирование наносит массивный урон'
    ],
    rewards: ['Free Morph Mystic Art', 'Редкое снаряжение', 'Сапоги (Greaves)'],
    tips: ['Сапоги выпадают только с Тянь Ин', 'Практикуйте в режиме испытаний'],
    icon: '🥷'
  },
  // World Bosses
  {
    id: 'puppeteer-sheng-wu',
    name: 'Кукловод Шэн У (Увертюра)',
    nameEn: 'Puppeteer Sheng Wu (Overture)',
    type: 'world',
    region: 'Цинхэ',
    location: 'Дикие Просторы, к югу от Wayfarer',
    level: '35',
    difficulty: 'Средняя-Высокая',
    strategy: [
      'Используйте AoE навыки (Lion\'s Roar) для уничтожения марионеток',
      'Босс неуязвим пока активны марионетки',
      'После уничтожения марионеток — короткое окно уязвимости',
      'Наносите максимум урона в окне уязвимости'
    ],
    rewards: ['Exquisite Scenery Inner Way Tome', 'Medicinal Tales x3', 'Shadow Puppet Doll', 'Echo Jade x20', '8000 EXP'],
    tips: ['Подготовьте AoE-билд', 'Марионетки появляются волнами'],
    icon: '🎭'
  },
  {
    id: 'snake-doctor',
    name: 'Змеиный Доктор',
    nameEn: 'Snake Doctor',
    type: 'world',
    region: 'Цинхэ',
    location: 'Лунная Гора, пещера у Окружающего Озера',
    level: '35',
    difficulty: 'Высокая',
    strategy: [
      'Экипируйте Panacea Fan и возьмите антидоты',
      'Атакуйте в ближнем бою — не давайте спамить дальние атаки',
      'Уклоняйтесь от золотых змей вместо парирования',
      'Яд накапливается — следите за здоровьем'
    ],
    rewards: ['Star Reacher Inner Way Tome', 'Bone Shedding Face Ornament', 'Echo Jade x20', '8000 EXP'],
    tips: ['Нужен Snake King Bone для безопасного входа', 'Поговорите с Sun Yutang у входа в пещеру'],
    icon: '🐍'
  },
  {
    id: 'sleeping-daoist',
    name: 'Спящий Даосист',
    nameEn: 'Sleeping Daoist',
    type: 'world',
    region: 'Цинхэ',
    location: 'Горы Джейдбрук, между waypoints',
    level: '35',
    difficulty: 'Средняя',
    strategy: [
      'Прерывайте его медитацию тяжёлыми ударами',
      'Когда входит в транс — используйте оглушающий Mystic Art',
      'Избегайте Donkey Stampede — уклоняйтесь',
      'В кооперативе: если превращены в осла — ловите падающих союзников'
    ],
    rewards: ['Esoteric Revival Inner Way Tome', 'Medicinal Tales x3', 'Echo Jade x20', '8000 EXP'],
    tips: ['Можно получить талант за избежание урона от ослов', 'Комичный, но опасный босс'],
    icon: '🧘'
  },
  {
    id: 'twin-lions',
    name: 'Парные Львы',
    nameEn: 'Twin Lions',
    type: 'world',
    region: 'Кайфэн',
    location: 'Грейстаун, к югу',
    level: '40',
    difficulty: 'Лёгкая-Средняя',
    strategy: [
      'Используйте AoE-навыки для одновременного урона обеим головам',
      'Следите за Golden Ball — хватайте Heavenly Snatch',
      'Отражайте "Clouds Above" и "Blooming Ground"',
      'Позиционируйтесь так, чтобы AoE-атаки не пересекались'
    ],
    rewards: ['Internal Art Note Chest x5', 'Medicinal Tales x3', 'Echo Jade x20', '8000 EXP'],
    tips: ['Хороший босс для практики AoE-билдов', 'Два противника требуют контроля камеры'],
    icon: '🦁'
  },
  {
    id: 'ghost-master',
    name: 'Мастер Призраков',
    nameEn: 'Ghost Master',
    type: 'world',
    region: 'Кайфэн',
    location: 'Туманный Лес (после квеста The Ephemeral Blight)',
    level: '50',
    difficulty: 'Высокая',
    strategy: [
      'Фаза 1: Парируйте комбо зонтиком — две атаки, затем прыжок',
      'Фаза 2: Быстро убивайте духов — они создают зоны Possession',
      'Spider Lilies взрываются — оставайтесь на месте и парируйте волны',
      'AoE-оружие отлично подходит против духов'
    ],
    rewards: ['Internal Art Note Chest x5', 'Echo Jade x20', 'Kaifeng Exploration x50', '8000 EXP'],
    tips: ['Требуется очистка тумана (квест)', 'Изучите паттерн Possession заранее'],
    icon: '👻'
  },
  {
    id: 'wolf-maiden',
    name: 'Волчья Дева',
    nameEn: 'Wolf Maiden',
    type: 'world',
    region: 'Кайфэн',
    location: 'Хребет Отчаяния (появляется ночью)',
    level: '50',
    difficulty: 'Лёгкая-Средняя',
    strategy: [
      'Один из самых быстрых боссов в игре',
      'Освойте dash-parry или perfect dodge',
      'Атакуйте сразу после успешного парирования',
      'Короткие комбо — отступайте перед следующим dash'
    ],
    rewards: ['Internal Art Note Chest x5', 'Medicinal Tales x3', 'Echo Jade x20', '8000 EXP'],
    tips: ['Появляется только ночью', 'Поговорите с Yang Xin для начала боя'],
    icon: '🐺'
  },
];

// ======================== INNER WAYS DATA ========================
export interface InnerWay {
  id: string;
  name: string;
  nameEn: string;
  tier: 'SS' | 'S' | 'A' | 'B';
  type: 'universal' | 'weapon-specific';
  effect: string;
  howToGet: string;
  bestFor: string[];
  icon: string;
}

export const innerWays: InnerWay[] = [
  {
    id: 'morale-chant',
    name: 'Боевой Гимн',
    nameEn: 'Morale Chant',
    tier: 'SS',
    type: 'universal',
    effect: '80% шанс каждые 2 сек получить Yi River при атаке/исцелении. Увеличивает физ. урон и исцеление на 1% за стак (до 5 стаков).',
    howToGet: 'Купить у Tang Bao в Blissful Retreat за 500 Echo Jade за страницу (нужно 10 страниц)',
    bestFor: ['Все билды', 'DPS', 'Танки', 'Хилеры'],
    icon: '🎵'
  },
  {
    id: 'envigorated-warrior',
    name: 'Воодушевлённый Воин',
    nameEn: 'Envigorated Warrior',
    tier: 'SS',
    type: 'universal',
    effect: '+5% к урону и исцелению. Отменяется на 5 сек при получении урона. При попадании +5% получаемого урона.',
    howToGet: 'Случайный дроп из World Bosses и событий',
    bestFor: ['Быстрые DPS', 'Уклоняющиеся билды', 'Парные Клинки', 'Мечи'],
    icon: '⚡'
  },
  {
    id: 'fivefold-bleed',
    name: 'Пятикратное Кровотечение',
    nameEn: 'Fivefold Bleed',
    tier: 'SS',
    type: 'universal',
    effect: '10% шанс наложить Weeping Blood на 5 сек (до 5 стаков). На 5 стаках — взрыв пронизывающего урона.',
    howToGet: 'Награда за Мировых Боссов',
    bestFor: ['Быстрое оружие', 'Парные Клинки', 'Мечи', 'Копья'],
    icon: '🩸'
  },
  {
    id: 'echoes-of-oblivion',
    name: 'Эхо Забвения',
    nameEn: 'Echoes of Oblivion',
    tier: 'SS',
    type: 'weapon-specific',
    effect: 'Накладывает Sin и Karma через атаки. Игнорирует 10% физ. защиты и 10% сопротивления Bamboocut.',
    howToGet: 'Связано с путём Bamboocut — Wind',
    bestFor: ['Infernal Twinblades', 'Mortal Rope Dart'],
    icon: '👁️'
  },
  {
    id: 'bitter-seasons',
    name: 'Горькие Сезоны',
    nameEn: 'Bitter Seasons',
    tier: 'S',
    type: 'universal',
    effect: '10% шанс отравить цель на 5 сек. Яд снижает физ. защиту на 0.6% за стак (до 5 стаков).',
    howToGet: 'Награда за исследование',
    bestFor: ['Физические DPS', 'Групповой контент', 'Все оружие'],
    icon: '☠️'
  },
  {
    id: 'breaking-point',
    name: 'Точка Разлома',
    nameEn: 'Breaking Point',
    tier: 'S',
    type: 'universal',
    effect: 'При крите по истощённому врагу: +5% крит. урона и +10 физ. пробития за стак (до 3 стаков).',
    howToGet: 'Победа над Yi Dao (мировой босс)',
    bestFor: ['Крит-билды', 'Высокий DPS', 'Perfect Parry мастера'],
    icon: '💥'
  },
  {
    id: 'evasive-charges',
    name: 'Уклончивые Заряды',
    nameEn: 'Evasive Charges',
    tier: 'S',
    type: 'universal',
    effect: '50% шанс восстановить 100% выносливости после идеального уклонения.',
    howToGet: 'Награда за исследование',
    bestFor: ['PvP', 'Уклоняющиеся билды', 'Агрессивные стили'],
    icon: '💨'
  },
  {
    id: 'royal-remedy',
    name: 'Королевское Средство',
    nameEn: 'Royal Remedy',
    tier: 'S',
    type: 'weapon-specific',
    effect: '+10% исцеления клона Panacea Fan. +1 Dewdrop при получении исцеления по времени.',
    howToGet: 'Связано с путём Silkbind — Deluge',
    bestFor: ['Хилеры', 'Panacea Fan', 'Soulshade Umbrella'],
    icon: '💚'
  },
];

// ======================== MYSTIC ARTS DATA ========================
export interface MysticArt {
  id: string;
  name: string;
  nameEn: string;
  combatEffect: string;
  utilityEffect: string;
  howToUnlock: string;
  priority: 'Must-Have' | 'Recommended' | 'Optional';
  icon: string;
}

export const mysticArts: MysticArt[] = [
  {
    id: 'tai-chi',
    name: 'Тай Чи',
    nameEn: 'Tai Chi',
    combatEffect: 'Хватает и швыряет врагов, нанося урон и оглушая. Эффективен против щитоносцев.',
    utilityEffect: 'Разрушает скрытые стены, собирает листья, заставляет рыбу выпрыгивать из воды.',
    howToUnlock: 'Изучить у Медведя в начале игры (квест "A Bear of a Time")',
    priority: 'Must-Have',
    icon: '☯️'
  },
  {
    id: 'lions-roar',
    name: 'Львиный Рык',
    nameEn: "Lion's Roar",
    combatEffect: 'Ударяет гигантский колокол, затем оглушающий рёв с 14 ударами AoE. +15% снижения урона и стойкость.',
    utilityEffect: 'Нет',
    howToUnlock: 'Ударить 4 медных колокола в Цинхэ (у Святыни Генерала и в других локациях)',
    priority: 'Must-Have',
    icon: '🦁'
  },
  {
    id: 'cloud-steps',
    name: 'Облачные Шаги',
    nameEn: 'Cloud Steps',
    combatEffect: 'Прыжок на голову врага с уроном. Эффективен против кавалерии и нестабильного равновесия.',
    utilityEffect: 'Высокий прыжок для достижения отмеченных точек, преодоление больших расстояний.',
    howToUnlock: 'Пройти подземелье Tiger Fort под Святыней Генерала',
    priority: 'Must-Have',
    icon: '☁️'
  },
  {
    id: 'meridian-touch',
    name: 'Прикосновение Меридиана',
    nameEn: 'Meridian Touch',
    combatEffect: 'Обездвиживает врагов, ломает жизненные точки. Неэффективен против мощных врагов.',
    utilityEffect: 'Обездвиживает мастеров боевых искусств, лечит зудящих крестьян для побочных квестов.',
    howToUnlock: 'Изучить у Yan Qiren возле Stonewash Strand в Цинхэ',
    priority: 'Must-Have',
    icon: '👆'
  },
  {
    id: 'celestial-seize',
    name: 'Небесный Захват',
    nameEn: 'Celestial Seize',
    combatEffect: 'Обезоруживает врага и контратакует его оружием. Урон зависит от веса оружия.',
    utilityEffect: 'Притягивает дальние объекты, ворует из сундуков/рюкзаков, карманные кражи.',
    howToUnlock: 'Квест "Foul Play" в Heaven\'s Pier',
    priority: 'Must-Have',
    icon: '🖐️'
  },
  {
    id: 'touch-of-death',
    name: 'Смертельное Касание',
    nameEn: 'Touch of Death',
    combatEffect: 'Пассивная стелс-атака по неосведомлённым врагам.',
    utilityEffect: 'Работает с воздуха при двойном прыжке над врагом.',
    howToUnlock: 'Квест "Echoes of Old Battles" на Battlecrest Slope',
    priority: 'Recommended',
    icon: '💀'
  },
  {
    id: 'leaping-toad',
    name: 'Прыгающая Жаба',
    nameEn: 'Leaping Toad',
    combatEffect: 'Прыжок вперёд с AoE-ударом и "кваканьем".',
    utilityEffect: 'Нет',
    howToUnlock: 'Украсть навык у прыгающей жабы в Святыне Генерала',
    priority: 'Recommended',
    icon: '🐸'
  },
  {
    id: 'heavenly-snatch',
    name: 'Небесный Хват',
    nameEn: 'Heavenly Snatch',
    combatEffect: 'Воровство и дальний захват предметов.',
    utilityEffect: 'Карманные кражи, сбор дальних ресурсов.',
    howToUnlock: 'Изучить у Qiu Yuehai возле конкурса выпивки в Heaven\'s Pier',
    priority: 'Recommended',
    icon: '✋'
  },
  {
    id: 'dragon-breath',
    name: 'Дыхание Дракона',
    nameEn: "Dragon's Breath",
    combatEffect: 'Состояние опьянения, выдыхание Огненной Ци дугой перед собой.',
    utilityEffect: 'Нет',
    howToUnlock: 'Квест от Kongkong и Luo Jiu в Beast Reverie, Кайфэн (нужен Celestial Seize)',
    priority: 'Optional',
    icon: '🐉'
  },
  {
    id: 'wind-sense',
    name: 'Чувство Ветра',
    nameEn: 'Wind Sense',
    combatEffect: 'Нет',
    utilityEffect: 'Подсвечивает полезные предметы, как Eagle Vision. Показывает направление для головоломок.',
    howToUnlock: 'Покупается в Talent Track',
    priority: 'Must-Have',
    icon: '👁️'
  },
];

// ======================== COOKING RECIPES DATA ========================
export interface Recipe {
  id: string;
  name: string;
  nameEn: string;
  level: number;
  effect: string;
  stamina: number;
  ingredients: string[];
  howToUnlock: string;
  category: 'healing' | 'buff';
  icon: string;
}

export const recipes: Recipe[] = [
  // Healing Recipes
  {
    id: 'divine-stuffed-fish',
    name: 'Божественная Фаршированная Рыба',
    nameEn: 'Divine Stuffed Fish',
    level: 1,
    effect: 'Восстанавливает 4,500 HP за 3 секунды',
    stamina: 2,
    ingredients: ['Речная Рыба x1', 'Травы x2', 'Дикие Фрукты x1'],
    howToUnlock: 'Доступно с 1 уровня',
    category: 'healing',
    icon: '🐟'
  },
  {
    id: 'hotpot',
    name: 'Хотпот',
    nameEn: 'Hotpot',
    level: 1,
    effect: 'Восстанавливает 4,500 HP за 3 секунды',
    stamina: 2,
    ingredients: ['Травы x2', 'Мясные Обрезки x2'],
    howToUnlock: 'Квест "Culinary: The Flavor of Sunset Glow"',
    category: 'healing',
    icon: '🍲'
  },
  {
    id: 'savory-roast',
    name: 'Пряное Жаркое',
    nameEn: 'Savory Roast',
    level: 20,
    effect: 'Восстанавливает 9,000 HP за 3 секунды',
    stamina: 3,
    ingredients: ['Травы x2', 'Отборное Мясо x3'],
    howToUnlock: 'Квест "Culinary: The Flavor of Sunset Glow"',
    category: 'healing',
    icon: '🥩'
  },
  {
    id: 'meat-stuffed-mushrooms',
    name: 'Грибы с Мясной Начинкой',
    nameEn: 'Meat-Stuffed Mushrooms',
    level: 41,
    effect: 'Восстанавливает 22,500 HP за 3 секунды',
    stamina: 4,
    ingredients: ['Грибы x3', 'Мясные Обрезки x3'],
    howToUnlock: 'Разблокируется на 41 уровне',
    category: 'healing',
    icon: '🍄'
  },
  {
    id: 'egg-custard-soup',
    name: 'Заварной Суп из Яиц',
    nameEn: 'Egg Custard Soup',
    level: 45,
    effect: 'Восстанавливает 39,000 HP за 3 секунды',
    stamina: 5,
    ingredients: ['Дикие Фрукты x3', 'Яйца x2'],
    howToUnlock: 'Получить The Thirteen Chambers в Recipe: Egg Custard Soup',
    category: 'healing',
    icon: '🍮'
  },
  // Buff Recipes
  {
    id: 'carp-fried-noodles',
    name: 'Карп с Жареной Лапшой',
    nameEn: 'Carp with Fried Noodles',
    level: 20,
    effect: '+1,100 к макс. HP на 30 минут',
    stamina: 8,
    ingredients: ['Золотой Карп x1', 'Beauty\'s Garment x2', 'Грибы x2'],
    howToUnlock: 'Разблокируется на 20 уровне',
    category: 'buff',
    icon: '🍜'
  },
  {
    id: 'rotisserie-venison',
    name: 'Оленина на Вертеле',
    nameEn: 'Rotisserie Venison',
    level: 20,
    effect: '+10-20 к физической атаке на 30 минут',
    stamina: 8,
    ingredients: ['Атрактилодес x2', 'Мясо Большого Оленя x1', 'Яйца x2'],
    howToUnlock: 'Разблокируется на 20 уровне',
    category: 'buff',
    icon: '🦌'
  },
  {
    id: 'crispy-pheasant',
    name: 'Хрустящий Фазан',
    nameEn: 'Crispy Pheasant',
    level: 41,
    effect: '+20-40 к физической атаке на 30 минут',
    stamina: 8,
    ingredients: ['Мясо Ядовитой Болотной Лягушки x2', 'Грибы x2', 'Злой Цветок x1'],
    howToUnlock: 'Разблокируется на 41 уровне',
    category: 'buff',
    icon: '🐔'
  },
  {
    id: 'pufferfish-soup',
    name: 'Суп из Фугу',
    nameEn: 'Pufferfish Soup',
    level: 61,
    effect: '+5,600 к макс. HP на 30 минут',
    stamina: 8,
    ingredients: ['Jade Tower Peony x2', 'Фугу x1', 'Дикие Фрукты x2'],
    howToUnlock: 'Разблокируется на 61 уровне',
    category: 'buff',
    icon: '🐡'
  },
];

// ======================== REDEEM CODES DATA ========================
export interface RedeemCode {
  code: string;
  rewards: string;
  status: 'active' | 'expired' | 'unknown';
  addedDate: string;
}

export const redeemCodes: RedeemCode[] = [
  { code: 'LIANGZHOU0402', rewards: 'Echo Jade x50', status: 'active', addedDate: '2026-04' },
  { code: 'MEETINHEXI', rewards: 'Echo Jade x50, Coin x20000, Inner Way Note: Chest x2, Oscillating Jade x2', status: 'active', addedDate: '2026-03' },
  { code: 'HEXI0306', rewards: 'Echo Jade x100, Resonating Melody x1, Zhou Coins x20000', status: 'active', addedDate: '2026-03' },
  { code: 'GOOSENEWS', rewards: 'Echo Jade x40, Inner Way Chest x1', status: 'active', addedDate: '2026-01' },
  { code: 'DEVLOG2601', rewards: 'Echo Jade x40, Coin x20000', status: 'active', addedDate: '2026-01' },
  { code: 'tf33hxjmjc', rewards: 'Echo Jade x10, Coin x2000, Inner Way Note: Chest x1, Oscillating Jade x1', status: 'active', addedDate: '2025-12' },
  { code: 'WWMDEVTALK', rewards: 'Echo Jade x40, Coin x20000', status: 'active', addedDate: '2025-12' },
  { code: 'WWM251115', rewards: 'Echo Jade x100, Resonating Melody x1', status: 'unknown', addedDate: '2025-11' },
  { code: 'WWMGLyoutube', rewards: 'Echo Jade x100, Resonating Melody x1', status: 'unknown', addedDate: '2025-11' },
  { code: 'WWMGO1114', rewards: 'Echo Jade x100, Resonating Melody x1', status: 'unknown', addedDate: '2025-11' },
];

// ======================== BEGINNER TIPS DATA ========================
export interface BeginnerTip {
  id: string;
  category: string;
  title: string;
  content: string;
  importance: 'critical' | 'important' | 'useful';
  icon: string;
}

export const beginnerTips: BeginnerTip[] = [
  {
    id: 'morale-chant-buy',
    category: 'Прогрессия',
    title: 'Купите Morale Chant за 5000 Jade',
    content: 'Сохраните 5000 Echo Jade и купите Inner Way "Morale Chant" у Tang Bao в Blissful Retreat. Это универсальный и мощный пассивный навык.',
    importance: 'critical',
    icon: '💎'
  },
  {
    id: 'upgrade-healing-pot',
    category: 'Выживание',
    title: 'Улучшите целебное зелье',
    content: 'Посетите клинику Evercare для улучшения вашего целебного зелья. Израсходованные зелья нужно крафтить заново!',
    importance: 'critical',
    icon: '🧪'
  },
  {
    id: 'puzzle-mystic-skills',
    category: 'Бой',
    title: '4 Puzzle Mystic навыка критически важны',
    content: 'Эти навыки не только для головоломок — они работают на некоторых боссах (появляется подсказка F) для отмены атак и оглушения.',
    importance: 'critical',
    icon: '🧩'
  },
  {
    id: 'gear-slots-upgrade',
    category: 'Экипировка',
    title: 'Улучшайте слоты, не предметы',
    content: 'В WWM вы улучшаете слоты экипировки, а не сами предметы. Улучшения сохраняются для любой экипировки в этом слоте!',
    importance: 'critical',
    icon: '⬆️'
  },
  {
    id: 'boss-healing-debuff',
    category: 'Боссы',
    title: 'Дебафф исцеления при первой попытке',
    content: 'При первой попытке убить босса у вас дебафф исцеления. Не надейтесь на исцеляющие боевые искусства для сыра.',
    importance: 'important',
    icon: '💔'
  },
  {
    id: 'parry-vs-block',
    category: 'Бой',
    title: 'Парирование vs Блок',
    content: 'Отдельные кнопки: если промахнулись с парированием при блоке, всё равно получите сниженный урон.',
    importance: 'important',
    icon: '🛡️'
  },
  {
    id: 'wind-sense-crouch',
    category: 'Исследование',
    title: 'Wind Sense: приседание быстрее',
    content: 'Контринтуитивно, но передвижение в присяде быстрее, чем стоя! Wind Sense также показывает направление для головоломок.',
    importance: 'useful',
    icon: '🦆'
  },
  {
    id: 'dont-fight-goose',
    category: 'Совет',
    title: 'Не сражайтесь с гусём, гладьте кота',
    content: 'Серьёзно! Гуси в городах опасны. А поглаживание кота повышает Elegance для пассивки показа сундуков на миникарте.',
    importance: 'useful',
    icon: '🐱'
  },
  {
    id: 'keep-old-gear-41',
    category: 'Экипировка',
    title: 'Сохраняйте экипировку 41+ уровня',
    content: 'Старая экипировка 41+ уровня используется для тюнинга. Не выбрасывайте!',
    importance: 'important',
    icon: '📦'
  },
  {
    id: 'musical-instruments',
    category: 'Социальное',
    title: 'Музыкальные инструменты — не только внешний вид',
    content: 'Экипировка инструмента разблокирует эмоцию (F2 → Talent). Нажмите T для свободного режима и играйте любые мелодии!',
    importance: 'useful',
    icon: '🎸'
  },
  {
    id: 'weekly-vendors',
    category: 'Ресурсы',
    title: 'Еженедельные вендоры обновляются в воскресенье',
    content: 'Покупайте все материалы (руда, шкуры, кристаллы) у вендоров в Цинхэ и Кайфэн каждую неделю!',
    importance: 'important',
    icon: '🛒'
  },
  {
    id: 'hotkeys-f2-f8',
    category: 'Управление',
    title: 'Полезные горячие клавиши',
    content: 'F2: эмоции, F4: режим строительства, F5: фокус на лице, F6: режим погружения (скрыть UI), F7: стоп-камера, F8: обычная камера.',
    importance: 'useful',
    icon: '⌨️'
  },
];

// ======================== PVP DATA ========================
export interface PvPMode {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  unlockLevel: number;
  description: string;
  rules: string[];
  tips: string[];
  icon: string;
}

export const pvpModes: PvPMode[] = [
  {
    id: 'arena-1v1',
    name: 'Арена 1v1',
    nameEn: '1v1 Arena',
    type: 'Дуэль',
    unlockLevel: 22,
    description: 'Классические дуэли один на один в компактной арене. Работает как файтинг — тайминг, парирование и комбо решают.',
    rules: [
      'Матч длится до 5 минут',
      'При истечении времени — побеждает нанёсший больше урона',
      'Исцеление снижено на 90%',
      'HP-щиты получают двойной урон',
      'Парирование тратит выносливость',
      'Execute восстанавливает выносливость'
    ],
    tips: [
      'Практикуйте тайминг парирования — это определяет победу',
      'Evasive Charges обязателен для PvP',
      'Изучите билды каждого оружия',
      'Баитинг Serene Breeze — ключевой навык',
      'Cloud Step отменяет super armor'
    ],
    icon: '⚔️'
  },
  {
    id: 'perception-forest',
    name: 'Лес Восприятия',
    nameEn: 'Perception Forest',
    type: 'Battle Royale',
    unlockLevel: 22,
    description: 'Режим Battle Royale до 5 игроков. Начинаете без снаряжения — лутайте оружие из сундуков. Зона сужается.',
    rules: [
      'Стартуете без экипировки',
      'Оружие и предметы — из сундуков',
      'Зона постепенно сужается',
      'Последний выживший или лучший счёт побеждает'
    ],
    tips: [
      'Быстро найдите первое оружие',
      'Следите за сужением зоны',
      'Используйте ландшафт для укрытия',
      'Не вступайте в бой без снаряжения'
    ],
    icon: '🌲'
  },
  {
    id: 'spar',
    name: 'Спарринг',
    nameEn: 'Spar',
    type: 'Открытый мир',
    unlockLevel: 22,
    description: 'Свободные дуэли в открытом мире. Вызовите любого игрока через опцию "Spar" — он должен принять.',
    rules: [
      'Оппонент должен принять вызов',
      'Бой начинается после подтверждения',
      'Используется ваша текущая экипировка'
    ],
    tips: [
      'Отличный способ практиковаться с друзьями',
      'Тестируйте билды без риска',
      'Учитесь читать паттерны игроков'
    ],
    icon: '🤝'
  },
];

// ======================== GEAR SETS DATA ========================
export interface GearSet {
  id: string;
  name: string;
  nameEn: string;
  pieces: number;
  twoSetBonus: string;
  fourSetBonus: string;
  bestFor: string[];
  source: string;
  icon: string;
}

export const gearSets: GearSet[] = [
  {
    id: 'bamboocut-bleed',
    name: 'Бамбуковый Разрез',
    nameEn: 'Bamboocut Set',
    pieces: 4,
    twoSetBonus: '+10% урона Bamboocut',
    fourSetBonus: 'Критические удары накладывают дополнительное кровотечение',
    bestFor: ['Infernal Twinblades', 'Mortal Rope Dart', 'Bamboocut — Wind'],
    source: 'World Bosses, Campaign Challenges',
    icon: '🎋'
  },
  {
    id: 'bellstrike-burst',
    name: 'Удар Колокола',
    nameEn: 'Bellstrike Set',
    pieces: 4,
    twoSetBonus: '+10% урона Bellstrike',
    fourSetBonus: 'Заряженные атаки наносят +25% урона',
    bestFor: ['Nameless Sword', 'Nameless Spear', 'Strategic Sword', 'Bellstrike builds'],
    source: 'Campaign Challenges',
    icon: '🔔'
  },
  {
    id: 'stonesplit-tank',
    name: 'Каменный Раскол',
    nameEn: 'Stonesplit Set',
    pieces: 4,
    twoSetBonus: '+15% HP щитов',
    fourSetBonus: 'При блоке: +20% снижения урона на 5 сек',
    bestFor: ['Stormbreaker Spear', 'Thundercry Blade', 'Танки'],
    source: 'Dungeon Bosses',
    icon: '🪨'
  },
  {
    id: 'silkbind-healer',
    name: 'Шёлковая Связь',
    nameEn: 'Silkbind Set',
    pieces: 4,
    twoSetBonus: '+15% эффективности исцеления',
    fourSetBonus: 'AoE-исцеление создаёт защитный барьер',
    bestFor: ['Panacea Fan', 'Soulshade Umbrella', 'Хилеры'],
    source: 'Weekly Dungeon',
    icon: '🎀'
  },
];

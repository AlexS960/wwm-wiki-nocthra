export interface Boss {
  id: string; name: string; nameEn: string;
  type: 'campaign' | 'world' | 'challenge' | 'dungeon';
  region: string; location: string; level: string; difficulty: string;
  strategy: string[]; rewards: string[]; tips: string[]; icon: string;
}
export const bosses: Boss[] = [
  { id: 'dalang', name: 'Даланг', nameEn: 'Dalang', type: 'campaign', region: 'Цинхэ', location: 'Основной сюжет', level: '10-15', difficulty: 'Средняя', strategy: ['Фокусируйтесь на парировании атак лошади', 'Парирование спешивает Даланга', 'Игнорируйте лучника в первой фазе', 'Атакуйте босса, пока он на земле'], rewards: ['Опыт персонажа', 'Монеты', 'Экипировка', 'Прогресс сюжета'], tips: ['Освойте тайминг парирования красных атак', 'Не торопитесь — изучите паттерн'], icon: '🐴' },
  { id: 'qianye', name: 'Цяньё', nameEn: 'Qianye', type: 'campaign', region: 'Цинхэ', location: 'Основной сюжет', level: '20-25', difficulty: 'Высокая', strategy: ['Парируйте все 5 ударов Brutal Combo для оглушения', 'Во второй фазе используйте Celestial Seize', 'Когда зачаровывает оружие — немедленно обезоружьте'], rewards: ['Экипировка', 'Опыт', 'Монеты', 'Прогресс сюжета'], tips: ['Heavenly Snatch критически важен', 'Следите за свечением оружия'], icon: '⚔️' },
  { id: 'void-king', name: 'Пустотный Король', nameEn: 'The Void King', type: 'campaign', region: 'Цинхэ', location: 'Основной сюжет', level: '35-40', difficulty: 'Очень высокая', strategy: ['Медленные заряженные красные атаки — обязательно парируйте', 'Perfect Parry накапливает Qi Stagger', 'Дождитесь оглушения перед нанесением максимального урона'], rewards: ['Редкая экипировка', 'Inner Way Tome', 'Большой опыт'], tips: ['Терпение — ключ к победе', 'Не жадничайте с атаками'], icon: '👑' },
  { id: 'tian-ying', name: 'Тянь Ин', nameEn: 'Tian Ying', type: 'campaign', region: 'Цинхэ', location: 'Основной сюжет (финал)', level: '40-45', difficulty: 'Очень высокая', strategy: ['Фаза 1: Изучите тайминг 4 ударов ногами', 'Фазы 2-3: Парируйте основного босса для уничтожения клонов', 'Избегайте blitz-атак'], rewards: ['Free Morph Mystic Art', 'Редкое снаряжение', 'Сапоги (Greaves)'], tips: ['Сапоги выпадают только с Тянь Ин', 'Практикуйте в режиме испытаний'], icon: '🥷' },
  { id: 'puppeteer-sheng-wu', name: 'Кукловод Шэн У', nameEn: 'Puppeteer Sheng Wu', type: 'world', region: 'Цинхэ', location: 'Дикие Просторы', level: '35', difficulty: 'Средняя-Высокая', strategy: ['Используйте AoE навыки для уничтожения марионеток', 'Босс неуязвим пока активны марионетки', 'Наносите максимум урона в окне уязвимости'], rewards: ['Inner Way Tome', 'Medicinal Tales x3', 'Echo Jade x20', '8000 EXP'], tips: ['Подготовьте AoE-билд', 'Марионетки появляются волнами'], icon: '🎭' },
  { id: 'snake-doctor', name: 'Змеиный Доктор', nameEn: 'Snake Doctor', type: 'world', region: 'Цинхэ', location: 'Лунная Гора', level: '35', difficulty: 'Высокая', strategy: ['Экипируйте Panacea Fan и возьмите антидоты', 'Атакуйте в ближнем бою', 'Уклоняйтесь от золотых змей вместо парирования'], rewards: ['Inner Way Tome', 'Face Ornament', 'Echo Jade x20', '8000 EXP'], tips: ['Нужен Snake King Bone для безопасного входа', 'Поговорите с Sun Yutang'], icon: '🐍' },
  { id: 'sleeping-daoist', name: 'Спящий Даосист', nameEn: 'Sleeping Daoist', type: 'world', region: 'Цинхэ', location: 'Горы Джейдбрук', level: '35', difficulty: 'Средняя', strategy: ['Прерывайте его медитацию тяжёлыми ударами', 'Когда входит в транс — используйте оглушающий Mystic Art', 'Избегайте Donkey Stampede'], rewards: ['Inner Way Tome', 'Medicinal Tales x3', 'Echo Jade x20', '8000 EXP'], tips: ['Можно получить талант за избежание урона от ослов', 'Комичный, но опасный босс'], icon: '🧘' },
  { id: 'twin-lions', name: 'Парные Львы', nameEn: 'Twin Lions', type: 'world', region: 'Кайфэн', location: 'Грейстаун', level: '40', difficulty: 'Лёгкая-Средняя', strategy: ['Используйте AoE-навыки для одновременного урона', 'Следите за Golden Ball', 'Позиционируйтесь так, чтобы AoE-атаки не пересекались'], rewards: ['Internal Art Note Chest x5', 'Echo Jade x20', '8000 EXP'], tips: ['Хороший босс для практики AoE-билдов', 'Два противника требуют контроля камеры'], icon: '🦁' },
  { id: 'ghost-master', name: 'Мастер Призраков', nameEn: 'Ghost Master', type: 'world', region: 'Кайфэн', location: 'Туманный Лес', level: '50', difficulty: 'Высокая', strategy: ['Фаза 1: Парируйте комбо зонтиком', 'Фаза 2: Быстро убивайте духов', 'Spider Lilies взрываются — парируйте волны'], rewards: ['Internal Art Note Chest x5', 'Echo Jade x20', '8000 EXP'], tips: ['Требуется очистка тумана (квест)', 'Изучите паттерн Possession заранее'], icon: '👻' },
  { id: 'wolf-maiden', name: 'Волчья Дева', nameEn: 'Wolf Maiden', type: 'world', region: 'Кайфэн', location: 'Хребет Отчаяния', level: '50', difficulty: 'Лёгкая-Средняя', strategy: ['Один из самых быстрых боссов', 'Освойте dash-parry или perfect dodge', 'Атакуйте сразу после успешного парирования'], rewards: ['Internal Art Note Chest x5', 'Echo Jade x20', '8000 EXP'], tips: ['Появляется только ночью', 'Поговорите с Yang Xin для начала боя'], icon: '🐺' },
];

export interface InnerWay {
  id: string; name: string; nameEn: string; tier: 'SS' | 'S' | 'A' | 'B';
  type: 'universal' | 'weapon-specific'; effect: string; howToGet: string; bestFor: string[]; icon: string;
}
export const innerWays: InnerWay[] = [
  { id: 'morale-chant', name: 'Боевой Гимн', nameEn: 'Morale Chant', tier: 'SS', type: 'universal', effect: '80% шанс каждые 2 сек получить Yi River при атаке/исцелении.', howToGet: 'Купить у Tang Bao за 500 Echo Jade', bestFor: ['Все билды', 'DPS', 'Танки', 'Хилеры'], icon: '🎵' },
  { id: 'envigorated-warrior', name: 'Воодушевлённый Воин', nameEn: 'Envigorated Warrior', tier: 'SS', type: 'universal', effect: '+5% к урону и исцелению. Отменяется на 5 сек при получении урона.', howToGet: 'Случайный дроп из World Bosses', bestFor: ['Быстрые DPS', 'Парные Клинки', 'Мечи'], icon: '⚡' },
  { id: 'fivefold-bleed', name: 'Пятикратное Кровотечение', nameEn: 'Fivefold Bleed', tier: 'SS', type: 'universal', effect: '10% шанс наложить Weeping Blood на 5 сек (до 5 стаков).', howToGet: 'Награда за Мировых Боссов', bestFor: ['Быстрое оружие', 'Парные Клинки', 'Копья'], icon: '🩸' },
  { id: 'bitter-seasons', name: 'Горькие Сезоны', nameEn: 'Bitter Seasons', tier: 'S', type: 'universal', effect: '10% шанс отравить цель на 5 сек.', howToGet: 'Награда за исследование', bestFor: ['Физические DPS', 'Групповой контент'], icon: '☠️' },
  { id: 'breaking-point', name: 'Точка Разлома', nameEn: 'Breaking Point', tier: 'S', type: 'universal', effect: 'При крите по истощённому врагу: +5% крит. урона.', howToGet: 'Победа над Yi Dao (мировой босс)', bestFor: ['Крит-билды', 'Высокий DPS'], icon: '💥' },
];

export interface MysticArt {
  id: string; name: string; nameEn: string; combatEffect: string; utilityEffect: string;
  howToUnlock: string; priority: 'Must-Have' | 'Recommended' | 'Optional'; icon: string;
}
export const mysticArts: MysticArt[] = [
  { id: 'tai-chi', name: 'Тай Чи', nameEn: 'Tai Chi', combatEffect: 'Хватает и швыряет врагов, нанося урон и оглушая.', utilityEffect: 'Разрушает скрытые стены, собирает листья.', howToUnlock: 'Изучить у Медведя в начале игры', priority: 'Must-Have', icon: '☯️' },
  { id: 'lions-roar', name: 'Львиный Рык', nameEn: "Lion's Roar", combatEffect: 'Оглушающий рёв с 14 ударами AoE. +15% снижения урона.', utilityEffect: 'Нет', howToUnlock: 'Ударить 4 медных колокола в Цинхэ', priority: 'Must-Have', icon: '🦁' },
  { id: 'cloud-steps', name: 'Облачные Шаги', nameEn: 'Cloud Steps', combatEffect: 'Прыжок на голову врага с уроном.', utilityEffect: 'Высокий прыжок для достижения отмеченных точек.', howToUnlock: 'Пройти подземелье Tiger Fort', priority: 'Must-Have', icon: '☁️' },
  { id: 'celestial-seize', name: 'Небесный Захват', nameEn: 'Celestial Seize', combatEffect: 'Обезоруживает врага и контратакует его оружием.', utilityEffect: 'Притягивает дальние объекты, ворует из сундуков.', howToUnlock: 'Квест "Foul Play" в Heaven\'s Pier', priority: 'Must-Have', icon: '🖐️' },
  { id: 'wind-sense', name: 'Чувство Ветра', nameEn: 'Wind Sense', combatEffect: 'Нет', utilityEffect: 'Подсвечивает полезные предметы, как Eagle Vision.', howToUnlock: 'Покупается в Talent Track', priority: 'Must-Have', icon: '👁️' },
];

export interface Recipe {
  id: string; name: string; nameEn: string; level: number; effect: string; stamina: number;
  ingredients: string[]; howToUnlock: string; category: 'healing' | 'buff'; icon: string;
}
export const recipes: Recipe[] = [
  { id: 'divine-stuffed-fish', name: 'Божественная Фаршированная Рыба', nameEn: 'Divine Stuffed Fish', level: 1, effect: 'Восстанавливает 4,500 HP за 3 секунды', stamina: 2, ingredients: ['Речная Рыба x1', 'Травы x2', 'Дикие Фрукты x1'], howToUnlock: 'Доступно с 1 уровня', category: 'healing', icon: '🐟' },
  { id: 'hotpot', name: 'Хотпот', nameEn: 'Hotpot', level: 1, effect: 'Восстанавливает 4,500 HP за 3 секунды', stamina: 2, ingredients: ['Травы x2', 'Мясные Обрезки x2'], howToUnlock: 'Квест "Culinary: The Flavor of Sunset Glow"', category: 'healing', icon: '🍲' },
  { id: 'savory-roast', name: 'Пряное Жаркое', nameEn: 'Savory Roast', level: 20, effect: 'Восстанавливает 9,000 HP за 3 секунды', stamina: 3, ingredients: ['Травы x2', 'Отборное Мясо x3'], howToUnlock: 'Квест кулинарии', category: 'healing', icon: '🥩' },
  { id: 'egg-custard-soup', name: 'Заварной Суп из Яиц', nameEn: 'Egg Custard Soup', level: 45, effect: 'Восстанавливает 39,000 HP за 3 секунды', stamina: 5, ingredients: ['Дикие Фрукты x3', 'Яйца x2'], howToUnlock: 'Получить The Thirteen Chambers', category: 'healing', icon: '🍮' },
  { id: 'carp-fried-noodles', name: 'Карп с Жареной Лапшой', nameEn: 'Carp with Fried Noodles', level: 20, effect: '+1,100 к макс. HP на 30 минут', stamina: 8, ingredients: ['Золотой Карп x1', 'Грибы x2'], howToUnlock: 'Разблокируется на 20 уровне', category: 'buff', icon: '🍜' },
  { id: 'rotisserie-venison', name: 'Оленина на Вертеле', nameEn: 'Rotisserie Venison', level: 20, effect: '+10-20 к физической атаке на 30 минут', stamina: 8, ingredients: ['Мясо Большого Оленя x1', 'Яйца x2'], howToUnlock: 'Разблокируется на 20 уровне', category: 'buff', icon: '🦌' },
];

export interface RedeemCode { code: string; rewards: string; status: 'active' | 'expired' | 'unknown'; addedDate: string; }
export const redeemCodes: RedeemCode[] = [
  { code: 'LIANGZHOU0402', rewards: 'Echo Jade x50', status: 'active', addedDate: '2026-04' },
  { code: 'MEETINHEXI', rewards: 'Echo Jade x50, Coin x20000', status: 'active', addedDate: '2026-03' },
  { code: 'GOOSENEWS', rewards: 'Echo Jade x40, Inner Way Chest x1', status: 'active', addedDate: '2026-01' },
  { code: 'WWMDEVTALK', rewards: 'Echo Jade x40, Coin x20000', status: 'active', addedDate: '2025-12' },
];

export interface BeginnerTip {
  id: string; category: string; title: string; content: string;
  importance: 'critical' | 'important' | 'useful'; icon: string;
}
export const beginnerTips: BeginnerTip[] = [
  { id: 'morale-chant-buy', category: 'Прогрессия', title: 'Купите Morale Chant за 5000 Jade', content: 'Сохраните 5000 Echo Jade и купите Inner Way "Morale Chant" у Tang Bao.', importance: 'critical', icon: '💎' },
  { id: 'upgrade-healing-pot', category: 'Выживание', title: 'Улучшите целебное зелье', content: 'Посетите клинику Evercare для улучшения вашего целебного зелья.', importance: 'critical', icon: '🧪' },
  { id: 'puzzle-mystic-skills', category: 'Бой', title: '4 Puzzle Mystic навыка критически важны', content: 'Они работают на некоторых боссах для отмены атак и оглушения.', importance: 'critical', icon: '🧩' },
  { id: 'gear-slots-upgrade', category: 'Экипировка', title: 'Улучшайте слоты, не предметы', content: 'Улучшения сохраняются для любой экипировки в этом слоте!', importance: 'critical', icon: '⬆️' },
  { id: 'dont-fight-goose', category: 'Совет', title: 'Не сражайтесь с гусём, гладьте кота', content: 'Гуси в городах опасны. Поглаживание кота повышает Elegance.', importance: 'useful', icon: '🐱' },
];

export interface PvPMode {
  id: string; name: string; nameEn: string; type: string; unlockLevel: number;
  description: string; rules: string[]; tips: string[]; icon: string;
}
export const pvpModes: PvPMode[] = [
  { id: 'arena-1v1', name: 'Арена 1v1', nameEn: '1v1 Arena', type: 'Дуэль', unlockLevel: 22, description: 'Классические дуэли один на один.', rules: ['Матч до 5 минут', 'Исцеление снижено на 90%'], tips: ['Практикуйте тайминг парирования', 'Evasive Charges обязателен'], icon: '⚔️' },
  { id: 'perception-forest', name: 'Лес Восприятия', nameEn: 'Perception Forest', type: 'Battle Royale', unlockLevel: 22, description: 'Режим Battle Royale до 5 игроков.', rules: ['Стартуете без экипировки', 'Зона сужается'], tips: ['Быстро найдите первое оружие', 'Следите за сужением зоны'], icon: '🌲' },
];

export interface GearSet {
  id: string; name: string; nameEn: string; pieces: number;
  twoSetBonus: string; fourSetBonus: string; bestFor: string[]; source: string; icon: string;
}
export const gearSets: GearSet[] = [
  { id: 'bamboocut-bleed', name: 'Бамбуковый Разрез', nameEn: 'Bamboocut Set', pieces: 4, twoSetBonus: '+10% урона Bamboocut', fourSetBonus: 'Критические удары накладывают дополнительное кровотечение', bestFor: ['Infernal Twinblades'], source: 'World Bosses', icon: '🎋' },
  { id: 'bellstrike-burst', name: 'Удар Колокола', nameEn: 'Bellstrike Set', pieces: 4, twoSetBonus: '+10% урона Bellstrike', fourSetBonus: 'Заряженные атаки наносят +25% урона', bestFor: ['Nameless Sword'], source: 'Campaign Challenges', icon: '🔔' },
  { id: 'stonesplit-tank', name: 'Каменный Раскол', nameEn: 'Stonesplit Set', pieces: 4, twoSetBonus: '+15% HP щитов', fourSetBonus: 'При блоке: +20% снижения урона', bestFor: ['Stormbreaker Spear'], source: 'Dungeon Bosses', icon: '🪨' },
];

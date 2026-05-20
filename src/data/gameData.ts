export interface Weapon {
  id: string; name: string; nameEn: string; type: string; role: string;
  martialArt: string; pair: string; sect: string; howToGet: string; description: string; icon: string;
}
export const weapons: Weapon[] = [
  { id: 'nameless-sword', name: 'Безымянный Меч', nameEn: 'Nameless Sword', type: 'Меч', role: 'Ближний ДПС', martialArt: 'Bellstrike — Splendor', pair: 'Безымянное Копьё', sect: 'Нет (начальное)', howToGet: 'Доступен по умолчанию с начала игры', description: 'Стартовый меч, сочетающий мобильность и мощные заряженные атаки.', icon: '⚔️' },
  { id: 'nameless-spear', name: 'Безымянное Копьё', nameEn: 'Nameless Spear', type: 'Копьё', role: 'Ближний ДПС', martialArt: 'Bellstrike — Splendor', pair: 'Безымянный Меч', sect: 'Нет (начальное)', howToGet: 'Доступно по умолчанию с начала игры', description: 'Стартовое копьё с дальнобойными заряженными атаками.', icon: '🔱' },
  { id: 'strategic-sword', name: 'Стратегический Меч', nameEn: 'Strategic Sword', type: 'Меч', role: 'Ближний ДПС (DoT)', martialArt: 'Bellstrike — Umbra', pair: 'Копьё Небесного Грома', sect: 'Одинокое Облако (Lone Cloud)', howToGet: 'Кража навыка в святилище между Дворцом Анналов и Опоясывающим Озером — Цинхэ', description: 'DPS-вариант с фокусом на урон по времени (DoT).', icon: '🗡️' },
  { id: 'heavenquaker-spear', name: 'Копьё Небесного Грома', nameEn: 'Heavenquaker Spear', type: 'Копьё', role: 'Ближний ДПС', martialArt: 'Bellstrike — Umbra', pair: 'Стратегический Меч', sect: 'Бушующие Приливы (Raging Tides)', howToGet: 'Кража навыка на Ранчо Дикой Гривы — Цинхэ', description: 'Дальнобойное копьё с эффективной расчисткой волн противников.', icon: '⚡' },
  { id: 'infernal-twinblades', name: 'Инфернальные Парные Клинки', nameEn: 'Infernal Twinblades', type: 'Парные Клинки', role: 'Ближний ДПС', martialArt: 'Bamboocut — Wind', pair: 'Смертельный Верёвочный Дротик', sect: 'Полуночные Клинки (Midnight Blades)', howToGet: 'Кража навыка в святилище Полуночной Милости у Звёздного Источника — Цинхэ', description: 'Экстремальная мобильность и самая высокая скорость атаки в игре.', icon: '🔪' },
  { id: 'mortal-rope-dart', name: 'Смертельный Верёвочный Дротик', nameEn: 'Mortal Rope Dart', type: 'Верёвочный Дротик', role: 'Ближний ДПС', martialArt: 'Bamboocut — Wind', pair: 'Инфернальные Парные Клинки', sect: 'Девять Смертных Путей (Nine Mortal Ways)', howToGet: 'Вступление в секту Девяти Смертных Путей', description: 'Уникальное дальнобойное ближнее оружие с притягиванием врагов.', icon: '🪢' },
  { id: 'stormbreaker-spear', name: 'Копьё Разрушителя Бурь', nameEn: 'Stormbreaker Spear', type: 'Копьё', role: 'Танк', martialArt: 'Stonesplit — Might', pair: 'Клинок Грома', sect: 'Бушующие Приливы (Raging Tides)', howToGet: 'Получается по внутриигровой почте после нескольких миссий основного сюжета', description: 'Копьё, превосходное в командной поддержке.', icon: '🛡️' },
  { id: 'thundercry-blade', name: 'Клинок Грома', nameEn: 'Thundercry Blade (Mo Blade)', type: 'Мо-клинок', role: 'Танк', martialArt: 'Stonesplit — Might', pair: 'Копьё Разрушителя Бурь', sect: 'Колодец Небес (Well of Heaven)', howToGet: 'Кража навыка в Грейстауне (восток) — Кайфэн', description: 'Чистая выживаемость. Даёт массивный мгновенный щит.', icon: '🔨' },
  { id: 'panacea-fan', name: 'Веер Панацеи', nameEn: 'Panacea Fan', type: 'Веер', role: 'Целитель', martialArt: 'Silkbind — Deluge', pair: 'Зонт Тени Души', sect: 'Серебряная Игла (Silver Needle)', howToGet: 'Вступление в секту Серебряной Иглы', description: 'Критически важное AoE-исцеление и очищение от дебаффов.', icon: '🌸' },
  { id: 'soulshade-umbrella', name: 'Зонт Тени Души', nameEn: 'Soulshade Umbrella', type: 'Зонт', role: 'Целитель', martialArt: 'Silkbind — Deluge', pair: 'Веер Панацеи', sect: 'Пустотная Долина (Hollow Vale)', howToGet: 'Кража навыка на Почтовой Станции в Туманном Лесу — Кайфэн', description: 'Зонт поддержки с исцелением и защитными способностями.', icon: '☂️' },
  { id: 'vernal-umbrella', name: 'Весенний Зонт', nameEn: 'Vernal Umbrella', type: 'Зонт', role: 'Дальний ДПС', martialArt: 'Silkbind — Jade', pair: 'Чернильный Веер', sect: 'Бархатная Тень (Velvet Shade)', howToGet: 'Кража навыка в Башне Времени', description: 'Зонт дальнего боя с контролем толпы.', icon: '🌂' },
  { id: 'inkwell-fan', name: 'Чернильный Веер', nameEn: 'Inkwell Fan', type: 'Веер', role: 'Дальний ДПС', martialArt: 'Silkbind — Jade', pair: 'Весенний Зонт', sect: 'Серебряная Игла (Silver Needle)', howToGet: 'Кража навыка в святилище Чернильного Веера в Цветочном Просторе — Цинхэ', description: 'Дальнобойный веер с высоким потолком мастерства.', icon: '🪭' },
];

export interface BuildPath {
  id: string; name: string; nameEn: string; role: string; weapons: string[];
  description: string; strengths: string[]; weaknesses: string[];
  difficulty: 'Низкая' | 'Средняя' | 'Высокая'; icon: string; color: string;
}
export const buildPaths: BuildPath[] = [
  { id: 'bellstrike-splendor', name: 'Bellstrike — Splendor', nameEn: 'Bellstrike — Splendor', role: 'Ближний ДПС', weapons: ['Безымянный Меч', 'Безымянное Копьё'], description: 'Высокая мобильность и заряженные атаки. Лучший выбор для новичков.', strengths: ['Высокий урон по одной цели', 'Отличная мобильность', 'Дружелюбный для новичков'], weaknesses: ['Средний AoE-урон', 'Зависимость от зарядки навыков'], difficulty: 'Низкая', icon: '⚔️', color: 'from-amber-500/20 to-orange-600/20' },
  { id: 'bellstrike-umbra', name: 'Bellstrike — Umbra', nameEn: 'Bellstrike — Umbra', role: 'Ближний ДПС (DoT)', weapons: ['Стратегический Меч', 'Копьё Небесного Грома'], description: 'Урон от эффектов кровотечения (DoT).', strengths: ['Стабильный урон через кровотечение', 'Не зависит от зарядки'], weaknesses: ['Урон разворачивается постепенно'], difficulty: 'Средняя', icon: '🩸', color: 'from-red-500/20 to-rose-600/20' },
  { id: 'bamboocut-wind', name: 'Bamboocut — Wind', nameEn: 'Bamboocut — Wind', role: 'Ближний ДПС (Скорость)', weapons: ['Инфернальные Парные Клинки', 'Смертельный Верёвочный Дротик'], description: 'Скоростные последовательные атаки.', strengths: ['Самая высокая скорость атаки', 'Экстремальная мобильность', 'Иммунитет к стаггеру'], weaknesses: ['Низкая выживаемость', 'Высокие требования к навыку'], difficulty: 'Высокая', icon: '💨', color: 'from-cyan-500/20 to-teal-600/20' },
  { id: 'stonesplit-might', name: 'Stonesplit — Might', nameEn: 'Stonesplit — Might', role: 'Танк', weapons: ['Копьё Разрушителя Бурь', 'Клинок Грома'], description: 'Ориентирован на выживаемость. Щиты и сопротивление контролю.', strengths: ['Массивные щиты', 'Высокая живучесть', 'Хороший AoE-урон'], weaknesses: ['Низкий урон по одной цели', 'Медленные атаки'], difficulty: 'Низкая', icon: '🛡️', color: 'from-stone-500/20 to-zinc-600/20' },
  { id: 'silkbind-deluge', name: 'Silkbind — Deluge', nameEn: 'Silkbind — Deluge', role: 'Целитель / Саппорт', weapons: ['Веер Панацеи', 'Зонт Тени Души'], description: 'Чистый путь поддержки. Незаменим в рейдах и PvP.', strengths: ['Мощное AoE-исцеление', 'Воскрешение союзников', 'Незаменим в группе'], weaknesses: ['Очень низкий урон', 'Зависимость от команды'], difficulty: 'Средняя', icon: '💚', color: 'from-emerald-500/20 to-green-600/20' },
  { id: 'silkbind-jade', name: 'Silkbind — Jade', nameEn: 'Silkbind — Jade', role: 'Дальний ДПС', weapons: ['Чернильный Веер', 'Весенний Зонт'], description: 'Фокус на дальних атаках и воздушных навыках.', strengths: ['Дальнобойные атаки', 'Контроль толпы', 'Летающая турель'], weaknesses: ['Сложное управление', 'Уязвим в ближнем бою'], difficulty: 'Высокая', icon: '🎯', color: 'from-purple-500/20 to-violet-600/20' },
];

export interface Sect {
  id: string; name: string; nameEn: string; theme: string; weapon: string;
  rules: string[]; benefits: string[]; howToJoin: string; description: string; icon: string;
}
export const sects: Sect[] = [
  { id: 'well-of-heaven', name: 'Колодец Небес', nameEn: 'Well of Heaven', theme: 'Справедливость, братство', weapon: 'Клинок Грома', rules: ['Не вредить другим членам секты', 'Еженедельные Рыцарские Деяния'], benefits: ['Сильный фокус на ближнем бою', 'Отлично для кооператива', 'Играйте как праведный герой'], howToJoin: 'Поговорите с Сань Цяньэр в Деревне Осеннего Урожая (Цинхэ)', description: 'Секта, построенная на праведности и верности.', icon: '⚖️' },
  { id: 'silver-needle', name: 'Серебряная Игла', nameEn: 'Silver Needle', theme: 'Целители и лекари', weapon: 'Веер Панацеи / Чернильный Веер', rules: ['За исцеление нужна плата', 'Еженедельно минимум 15 лайков'], benefits: ['Идеально для саппортов', 'Социальное взаимодействие'], howToJoin: 'Следуйте подсказке в меню Сект', description: 'Группа воинов, посвятивших себя искусству исцеления.', icon: '💉' },
  { id: 'midnight-blades', name: 'Полуночные Клинки', nameEn: 'Midnight Blades', theme: 'Убийцы, PvP', weapon: 'Инфернальные Парные Клинки', rules: ['Побеждайте других игроков для получения Кармы', 'Поражение отнимает Карму'], benefits: ['Лучший выбор для PvP', 'Высокий риск — высокая награда'], howToJoin: 'Следуйте подсказке из меню Сект', description: 'Секта ассасинов и убийц для агрессивных игроков.', icon: '🗡️' },
  { id: 'nine-mortal-ways', name: 'Девять Смертных Путей', nameEn: 'Nine Mortal Ways', theme: 'Трикстеры, маскировка, стелс', weapon: 'Смертельный Верёвочный Дротик', rules: ['Зарабатывайте Очки Веселья обманывая игроков', 'Используйте Тысячу Лиц'], benefits: ['Превосходно для ролевиков', 'Стелс и социальный обман'], howToJoin: 'Маскировка под студента (квест в Кайфэне)', description: 'Секта трикстеров и мастеров маскировки.', icon: '🎭' },
  { id: 'raging-tides', name: 'Бушующие Приливы', nameEn: 'Raging Tides', theme: 'Воины, военная дисциплина', weapon: 'Копьё Небесного Грома / Разрушителя Бурь', rules: ['Регулярно сражаться для поддержания эффективности'], benefits: ['Постоянный бой', 'Копьевые билды'], howToJoin: 'Сыграть в мини-игру борьбы (вкладка Досуг)', description: 'Секта воинов с военной дисциплиной.', icon: '🌊' },
  { id: 'hollow-vale', name: 'Пустотная Долина', nameEn: 'Hollow Vale', theme: 'Баланс, яд и исцеление', weapon: 'Зонты (стиль тени души)', rules: ['За каждую исцелённую жизнь использовать яд один раз', 'Запрещено превращать игроков в марионеток'], benefits: ['Баланс исцеления и яда', 'Уникальная двойственная механика'], howToJoin: 'Следуйте подсказке из меню Сект', description: 'Секта Инь-Ян. Жизнь и смерть в гармонии.', icon: '☯️' },
  { id: 'velvet-shade', name: 'Бархатная Тень', nameEn: 'Velvet Shade', theme: 'Социальное взаимодействие, романтика', weapon: 'Зонты (Весенний Зонт)', rules: ['Социальные активности и взаимодействие'], benefits: ['Социальный геймплей', 'Уникальные зонтовые стили'], howToJoin: 'Следуйте подсказке из меню Сект в Кайфэне', description: 'Секта с акцентом на социальное взаимодействие.', icon: '🌺' },
  { id: 'lone-cloud', name: 'Одинокое Облако', nameEn: 'Lone Cloud', theme: 'Дисциплина, стратегия, мастерство меча', weapon: 'Стратегический Меч', rules: ['Благословения старых товарищей', 'Загадка любви — один раз'], benefits: ['Мастерство фехтования', 'Стратегический геймплей'], howToJoin: 'Следуйте подсказке из меню Сект', description: 'Приверженцы сложных техник меча.', icon: '☁️' },
];

export interface MapRegion {
  id: string; name: string; nameEn: string; subregions: string[];
  description: string; level: string; icon: string; x: number; y: number;
}
export const mapRegions: MapRegion[] = [
  { id: 'qinghe', name: 'Цинхэ', nameEn: 'Qinghe', subregions: ['Дикие Просторы', 'Лунная Гора', 'Земли Сундары'], description: 'Стартовый регион с зелёными долинами и горными храмами.', level: '1-20', icon: '🌿', x: 25, y: 35 },
  { id: 'kaifeng', name: 'Кайфэн', nameEn: 'Kaifeng', subregions: ['Город Кайфэн', 'Нефритовый Двор', 'Ревущие Пески'], description: 'Огромный городской регион с величественной столицей.', level: '15-35', icon: '🏯', x: 55, y: 30 },
  { id: 'hexi-jade-gate', name: 'Хэси — Нефритовые Врата', nameEn: 'Hexi — Jade Gate Pass', subregions: ['Нефритовые Врата'], description: 'Пустынный регион на западе.', level: '30-45', icon: '🏜️', x: 15, y: 55 },
  { id: 'hexi-liangzhou', name: 'Хэси — Лянчжоу', nameEn: 'Hexi — Liangzhou Town', subregions: ['Перевал Скакуна', 'Нефритовый Источник', 'Цзюцюань'], description: 'Торговый город на перекрёстке путей.', level: '35-50', icon: '⛰️', x: 30, y: 65 },
  { id: 'hexi-qinchuan', name: 'Хэси — Циньчуань', nameEn: 'Hexi — Qinchuan Path', subregions: ['Старая Дорога Сяо', 'Шелестящий Луг', 'Курган Льва', 'Озеро Затонувшего Города'], description: 'Новейший регион с разнообразными ландшафтами.', level: '45-60', icon: '🗻', x: 70, y: 60 },
];

export interface Guide {
  id: string; title: string; category: string; difficulty: string; readTime: string;
  summary: string; content: string[]; tips: string[]; icon: string;
}
export const guides: Guide[] = [
  { id: 'beginner-start', title: 'Полное руководство для новичков', category: 'Новичкам', difficulty: 'Начальный', readTime: '15 мин', summary: 'Всё, что нужно знать перед началом игры.', content: ['При создании персонажа вам предложат выбрать режим наведения, тип управления и сложность.', 'В игре нет жёстких классов. Ваш боевой стиль определяется оружием.', 'Система Кражи Навыков позволяет изучать техники любой секты без вступления в неё.', 'Исследуйте мир свободно: паркур, Windstride, точки быстрого путешествия.', 'Ваши действия имеют последствия: от преследования до славы героя.'], tips: ['Начните с билда Bellstrike — Splendor', 'Не торопитесь вступать в секту', 'Исследуйте каждый уголок', 'Попробуйте разные профессии'], icon: '📖' },
  { id: 'combat-guide', title: 'Боевая система: полный гайд', category: 'Бой', difficulty: 'Средний', readTime: '20 мин', summary: 'Подробный разбор боевой системы.', content: ['Боевая система сочетает ближний и дальний бой, стелс и боевые искусства.', 'Парирование — ключевой навык. Успешное парирование открывает окно для контратаки.', 'Мистические Искусства — более 40 уникальных техник.', 'Двойная экипировка оружия позволяет переключаться в бою.'], tips: ['Практикуйте парирование', 'Изучите тайминги каждого оружия', 'Комбинируйте два типа оружия'], icon: '⚔️' },
  { id: 'professions-guide', title: 'Гайд по профессиям и ролям', category: 'Профессии', difficulty: 'Начальный', readTime: '12 мин', summary: 'Обзор всех доступных профессий.', content: ['В Where Winds Meet 16 систем профессий.', 'Странствующий Мечник, Целитель, Архитектор, Охотник за Головами, Торговец.'], tips: ['Каждая профессия даёт уникальные ресурсы', 'Рыбалка — отличный способ заработка'], icon: '🎭' },
  { id: 'skill-theft-guide', title: 'Система Кражи Навыков', category: 'Механики', difficulty: 'Средний', readTime: '10 мин', summary: 'Как работает система кражи техник.', content: ['Кража Навыков позволяет изучать техники любой секты без вступления.', 'Найдите мастера в святилище, победите его — техника ваша.'], tips: ['Святилища отмечены на карте', 'Кража навыка не делает вас врагом секты'], icon: '🥷' },
  { id: 'pvp-guide', title: 'PvP: Арены и Открытый Мир', category: 'PvP', difficulty: 'Продвинутый', readTime: '15 мин', summary: 'Руководство по PvP-контенту.', content: ['PvP разнообразен: дуэли, войны гильдий, система правосудия.', 'Секта Полуночных Клинков ориентирована на PvP.'], tips: ['Bamboocut — Wind отлично подходит для PvP', 'Парирование критически важно'], icon: '🏆' },
  { id: 'coop-raid-guide', title: 'Кооператив и Рейды', category: 'Кооператив', difficulty: 'Средний', readTime: '12 мин', summary: 'Как проходить рейды в группе.', content: ['Кооперативный режим до 4 игроков.', 'Оптимальный состав: 1 танк, 1-2 DPS, 1 целитель.'], tips: ['Веер Панацеи незаменим в рейдах', 'Танк должен знать паттерны босса'], icon: '👥' },
];

export interface LifeSkill { name: string; description: string; icon: string; }
export const lifeSkills: LifeSkill[] = [
  { name: 'Ремесло', description: 'Создавайте снаряжение и инструменты', icon: '🔨' },
  { name: 'Архитектура', description: 'Проектируйте и стройте здания', icon: '🏗️' },
  { name: 'Народные игры', description: 'Участвуйте в традиционных играх', icon: '🎲' },
  { name: 'Представления', description: 'Выступайте с музыкой и танцами', icon: '🎵' },
  { name: 'Медицина', description: 'Лечите раненых и готовьте лекарства', icon: '💊' },
  { name: 'Кулинария', description: 'Готовьте блюда с различными баффами', icon: '🍜' },
  { name: 'Рыбалка', description: 'Ловите рыбу в водоёмах мира', icon: '🎣' },
  { name: 'Садоводство', description: 'Выращивайте растения', icon: '🌱' },
  { name: 'Каллиграфия', description: 'Практикуйте искусство письма', icon: '✒️' },
  { name: 'Живопись', description: 'Рисуйте произведения искусства', icon: '🎨' },
  { name: 'Торговля', description: 'Покупайте и продавайте товары', icon: '💰' },
];

export interface FAQ { question: string; answer: string; }
export const faqs: FAQ[] = [
  { question: 'Where Winds Meet — это Free-to-Play?', answer: 'Да, игра полностью бесплатна. Монетизация ограничена косметическими предметами.' },
  { question: 'На каких платформах доступна игра?', answer: 'На PC (Steam) и мобильных устройствах с полным кроссплеем.' },
  { question: 'Нужен ли интернет для одиночного режима?', answer: 'Да, требуется постоянное интернет-соединение.' },
  { question: 'Можно ли менять Build Path (класс)?', answer: 'Да! Вы не привязаны к одному пути, можно экспериментировать.' },
  { question: 'Сколько сект в игре?', answer: 'Всего 12 сект, из которых 9 можно присоединиться.' },
  { question: 'Что такое Кража Навыков?', answer: 'Механика, позволяющая изучать техники любой секты без вступления в неё.' },
  { question: 'Какой движок использует игра?', answer: 'Проприетарный Messiah Engine от Everstone Studio.' },
  { question: 'Какой исторический период в игре?', answer: 'X век н.э. в Китае, период Пяти Династий и Десяти Королевств.' },
];

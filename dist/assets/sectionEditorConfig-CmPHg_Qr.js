const e={weapons:{titleNew:"Новая запись — Оружие",titleEdit:"Редактировать — Оружие",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"Тип, стиль боя, особенности…",titlePlaceholder:"Название оружия или билда",contentPlaceholder:`## Характеристики

- Урон
- Особенности`,categories:["Меч","Копьё","Двойные клинки","Веер","Лук","Прочее"],icons:["⚔️","🗡️","🏹","🛡️","💫","🔥","⚡","🌙"]},builds:{titleNew:"Новый билд",titleEdit:"Редактировать билд",publishLabel:"Опубликовать билд",summaryLabel:"Краткое описание",summaryPlaceholder:"Стиль, сложность, для кого…",titlePlaceholder:"Название билда",contentPlaceholder:`## Сборка

- Навыки
- Снаряжение`,categories:["PvE","PvP","Соло","Кооп","Универсальный","Прочее"],icons:["🛤️","⚔️","🛡️","💎","🔥","⚡","🎯","✨"]},sects:{titleNew:"Новая запись — Секты",titleEdit:"Редактировать — Секты",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"Философия секты, роль…",titlePlaceholder:"Название секты или механики",contentPlaceholder:`## Описание

- Особенности`,categories:["Секта","Механика","Лор","Прочее"],icons:["🏛️","☯️","🌸","🔥","💧","🌿","⚡","🌙"]},bosses:{titleNew:"Новый босс / механика",titleEdit:"Редактировать",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"Сложность, локация…",titlePlaceholder:"Имя босса",contentPlaceholder:`## Тактика

- Фаза 1
- Фаза 2`,categories:["Мировой","Подземелье","Рейд","Механика","Прочее"],icons:["👹","💀","🔥","⚡","🛡️","💎","🌙","⭐"]},mystic:{titleNew:"Новый мистический арт",titleEdit:"Редактировать арт",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"Эффект, синергии…",titlePlaceholder:"Название арта",contentPlaceholder:`## Эффект

- Описание`,categories:["Атака","Защита","Контроль","Поддержка","Прочее"],icons:["✨","🔮","💫","🌙","🔥","💧","⚡","☯️"]},cooking:{titleNew:"Новый рецепт / совет",titleEdit:"Редактировать",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"Ингредиенты, бонус…",titlePlaceholder:"Название блюда",contentPlaceholder:`## Рецепт

- Ингредиенты`,categories:["Рецепт","Ингредиент","Бафф","Прочее"],icons:["🍳","🥘","🍜","🍵","🌿","🔥","💎","⭐"]},tips:{titleNew:"Новый совет / код",titleEdit:"Редактировать",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"О чём совет…",titlePlaceholder:"Заголовок",contentPlaceholder:`## Совет

- Пункт 1`,categories:["Совет","Код","Фарм","Лайфхак","Прочее"],icons:["💡","🎁","💰","⚡","🔥","📜","⭐","🎯"]},lifeskills:{titleNew:"Новый навык / профессия",titleEdit:"Редактировать",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"Что даёт навык…",titlePlaceholder:"Название",contentPlaceholder:`## Описание

- Детали`,categories:["Ремесло","Сбор","Социальное","Прочее"],icons:["🎨","🪓","⛏️","🎣","🌿","📜","⭐","💎"]},innerpath:{titleNew:"Новая запись — Внутренний путь",titleEdit:"Редактировать — Внутренний путь",publishLabel:"Опубликовать",summaryLabel:"Краткий эффект",summaryPlaceholder:"Что даёт путь или пассивка…",titlePlaceholder:"Название пути / узла",contentPlaceholder:`## Эффект

- Описание

## Как получить

- Шаги`,categories:["Heaven","Conquer","Omnipotent","Harmony","Spirit","Прочее"],icons:["☯️","✨","⚡","🌙","💠","🌀","⭐"]},npcs:{titleNew:"Новая запись — NPC",titleEdit:"Редактировать — NPC",publishLabel:"Опубликовать",summaryLabel:"Краткое описание",summaryPlaceholder:"Регион, локация, советы по AI-чату…",titlePlaceholder:"Имя NPC (англ.)",contentPlaceholder:`## Локация
**Регион:** Цинхэ
**Место:** Небесный причал
**Подзона:** Гора Лунной дымки
**Как найти:** …

## Как подружиться
…

## Диалоги
- **Игрок:** Здравствуйте…
- **NPC:** …`,categories:["Цинхэ","Кайфэн","Хэси","AI-чат","Мини-игра","Прочее"],icons:["👥","🤝","💬","🗺️","🐱","🐀","🔮","🎣","🎭","⭐"]},riddles:{titleNew:"Новая запись — Загадки",titleEdit:"Редактировать — Загадки",publishLabel:"Опубликовать",summaryLabel:"Основной ответ (для подсказки)",summaryPlaceholder:"Например: gecko",titlePlaceholder:"Подсказка NPC (англ.) или имя загадочника",contentPlaceholder:`## Подсказка
absorption

## Ответы
gecko

---
Для загадочника: категория «Загадочник»
## Локация
**Регион:** Кайфэн
**Место:** …
**Подзона:** …
**Как найти:** …
**Интеллект:** 40
**Стоимость:** 20`,categories:["Подсказка","Загадочник","Кайфэн","Цинхэ","Прочее"],icons:["🧩","❓","💡","🗺️","🪙","🧠","⭐"],contentHint:"(## Подсказка / ## Ответы или поля локации для NPC)"},guides:{titleNew:"Новый гайд",titleEdit:"Редактировать гайд",publishLabel:"Опубликовать гайд",summaryLabel:"Краткое описание",summaryPlaceholder:"Описание в 1-2 предложения",titlePlaceholder:"Название гайда",contentPlaceholder:`## Введение

Текст…

## Основная часть

- Пункт 1`,categories:["Новичкам","Бой","Механики","Кооператив","PvP","Профессии","Экипировка","Прочее"],icons:["📖","⚔️","🛡️","🥷","👥","🏆","🎯","🎭","💡","🗺️","🔥","💎","🎮","📜","⚡"],contentHint:"(панель форматирования: заголовки, списки, цвет, выравнивание)"}};export{e as s};

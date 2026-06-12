/**
 * Реестр парсеров разделов вики.
 * game8Url — официальные страницы Game8 (источник по умолчанию).
 */
export const PARSERS = {
  innerpath: {
    label: 'Внутренний путь',
    sectionId: 'innerpath',
    uploadFile: '564726-inner-ways.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/564726',
    outputs: ['src/data/innerWays.json'],
    module: 'parsers/inner-ways.mjs',
  },
  riddles: {
    label: 'Загадки',
    sectionId: 'riddles',
    uploadFile: '566908-0.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/566908',
    outputs: ['src/data/riddles.clues.json', 'src/data/riddleMasters.json'],
    module: 'parsers/riddles.mjs',
  },
  'npcs-locations': {
    label: 'NPC — локации',
    sectionId: 'npcs',
    uploadFile: '565812-0.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/565812',
    outputs: ['src/data/aiNpcs.parsed.json'],
    module: 'parsers/npc-locations.mjs',
  },
  'npcs-dialogues': {
    label: 'NPC — диалоги',
    sectionId: 'npcs',
    uploadFile: '565812-0.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/565812',
    outputs: ['src/data/aiNpcs.dialogues.json'],
    module: 'parsers/npc-dialogues.mjs',
    requiresNetwork: true,
  },
  'npcs-bundle': {
    label: 'NPC — сборка aiNpcs.ts',
    sectionId: 'npcs',
    outputs: ['src/data/aiNpcs.ts'],
    module: 'parsers/npc-bundle.mjs',
    dependsOn: ['npcs-locations', 'npcs-dialogues'],
  },
  weapons: {
    label: 'Оружие',
    sectionId: 'weapons',
    uploadFile: '564704-0.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/564704',
    outputs: ['src/data/parsed/weapons.json'],
    module: 'parsers/weapons.mjs',
  },
  bosses: {
    label: 'Боссы',
    sectionId: 'bosses',
    uploadFile: '563680-bosses.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/563680',
    outputs: ['src/data/parsed/bosses.json'],
    module: 'parsers/bosses.mjs',
  },
  mystic: {
    label: 'Мистические арты',
    sectionId: 'mystic',
    uploadFile: '564723-mystic.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/564723',
    outputs: ['src/data/parsed/mysticArts.json'],
    module: 'parsers/mystic-arts.mjs',
  },
  cooking: {
    label: 'Готовка',
    sectionId: 'cooking',
    uploadFile: 'cooking.md',
    game8Url: 'https://game8.co/games/Where-Winds-Meet/archives/564897',
    outputs: ['src/data/parsed/recipes.json'],
    module: 'parsers/cooking.mjs',
  },
};

export const SYNC_ORDER = [
  'innerpath',
  'riddles',
  'npcs-locations',
  'npcs-dialogues',
  'npcs-bundle',
  'weapons',
  'bosses',
  'mystic',
  'cooking',
];

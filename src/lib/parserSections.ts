/**
 * Статический список парсеров — дублирует scripts/parsers/registry.mjs (SYNC_ORDER + метаданные).
 * Используется, когда sync-api недоступен (статический nginx без /api/sync-content).
 */

export interface SyncSectionInfo {
  id: string;
  label: string;
  defaultUrl?: string;
  requiresNetwork?: boolean;
  note?: string;
}

export const DEFAULT_WIKI_URL = 'https://game8.co/games/Where-Winds-Meet';

/** Порядок совпадает с SYNC_ORDER в scripts/parsers/registry.mjs */
export const PARSER_SECTIONS: SyncSectionInfo[] = [
  {
    id: 'innerpath',
    label: 'Внутренний путь',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564726',
  },
  {
    id: 'riddles',
    label: 'Загадки',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/566908',
  },
  {
    id: 'npcs-locations',
    label: 'NPC — локации',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/565812',
  },
  {
    id: 'npcs-dialogues',
    label: 'NPC — диалоги',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/565812',
    requiresNetwork: true,
  },
  {
    id: 'npcs-bundle',
    label: 'NPC — сборка aiNpcs.ts',
  },
  {
    id: 'weapons',
    label: 'Оружие',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564704',
  },
  {
    id: 'bosses',
    label: 'Боссы',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/563680',
  },
  {
    id: 'mystic',
    label: 'Мистические арты',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564723',
  },
  {
    id: 'cooking',
    label: 'Готовка',
    defaultUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564897',
  },
];

export const PARSER_SECTION_IDS = PARSER_SECTIONS.map(s => s.id);

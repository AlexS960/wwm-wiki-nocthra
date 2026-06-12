import type { ParserSourceConfig } from '../types/site';

/** URL по умолчанию на клиенте (совпадает с scripts/parsers/registry.mjs) */
export const PARSER_DEFAULT_URLS: Record<string, string> = {
  innerpath: 'https://game8.co/games/Where-Winds-Meet/archives/564726',
  riddles: 'https://game8.co/games/Where-Winds-Meet/archives/566908',
  'npcs-locations': 'https://game8.co/games/Where-Winds-Meet/archives/565812',
  'npcs-dialogues': 'https://game8.co/games/Where-Winds-Meet/archives/565812',
  weapons: 'https://game8.co/games/Where-Winds-Meet/archives/564704',
  bosses: 'https://game8.co/games/Where-Winds-Meet/archives/563680',
  mystic: 'https://game8.co/games/Where-Winds-Meet/archives/564723',
  cooking: 'https://game8.co/games/Where-Winds-Meet/archives/564897',
};

export function getParserUrl(
  sectionId: string,
  saved?: Record<string, ParserSourceConfig>,
  apiDefault?: string,
): string {
  const custom = saved?.[sectionId]?.url?.trim();
  if (custom) return custom;
  if (apiDefault?.trim()) return apiDefault.trim();
  return PARSER_DEFAULT_URLS[sectionId] || '';
}

export function buildParserSourcesPatch(
  drafts: Record<string, string>,
): Record<string, ParserSourceConfig> {
  const out: Record<string, ParserSourceConfig> = {};
  const now = new Date().toISOString();
  for (const [id, url] of Object.entries(drafts)) {
    const trimmed = url.trim();
    if (trimmed) out[id] = { url: trimmed, updatedAt: now };
  }
  return out;
}

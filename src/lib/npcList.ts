import type { WikiArticle } from '../types/site';
import type { AiNpc, AiNpcRegion, NpcDialogueLine } from '../data/aiNpcs.meta';
import { loadBuiltinNpcs } from './npcData';

const REGION_MAP: Record<string, AiNpcRegion> = {
  цинхэ: 'qinghe',
  qinghe: 'qinghe',
  кайфэн: 'kaifeng',
  kaifeng: 'kaifeng',
  хэси: 'hexi',
  hexi: 'hexi',
};

function parseDialoguesFromMarkdown(content: string): NpcDialogueLine[] {
  const lines: NpcDialogueLine[] = [];
  const section = content.match(/##\s*Диалоги?([\s\S]*?)(?=##|$)/i);
  if (!section) return lines;
  const body = section[1];
  for (const raw of body.split('\n')) {
    const m = raw.match(/^\s*[-*]\s*\*\*(Игрок|NPC|Система|Player|NPC):\*\*\s*(.+)$/i)
      || raw.match(/^\s*\*\*(Игрок|NPC|Система):\*\*\s*(.+)$/i);
    if (!m) continue;
    const roleKey = m[1].toLowerCase();
    const role: NpcDialogueLine['role'] =
      roleKey.startsWith('игрок') || roleKey === 'player' ? 'player'
        : roleKey.startsWith('систем') ? 'system'
          : 'npc';
    const text = m[2].trim();
    lines.push({ role, textEn: text, textRu: text });
  }
  return lines;
}

function parseRegion(category: string, content: string): AiNpcRegion {
  const key = (category || '').toLowerCase();
  if (REGION_MAP[key]) return REGION_MAP[key];
  const m = content.match(/\*\*Регион:\*\*\s*(\S+)/i);
  if (m && REGION_MAP[m[1].toLowerCase()]) return REGION_MAP[m[1].toLowerCase()];
  return 'qinghe';
}

export function wikiArticleToNpc(article: WikiArticle): AiNpc {
  const content = article.content || '';
  const region = parseRegion(article.fields?.category || '', content);
  const locMatch = content.match(/\*\*Место:\*\*\s*(.+)/i);
  const subMatch = content.match(/\*\*Подзона:\*\*\s*(.+)/i);
  const detailMatch = content.match(/\*\*Как найти:\*\*\s*([\s\S]*?)(?=\n\*\*|\n##|$)/i);
  const befriendMatch = content.match(/##\s*Как подружиться([\s\S]*?)(?=##|$)/i);

  return {
    id: `wiki-${article.id}`,
    wikiId: article.id,
    isCustom: true,
    nameEn: article.fields?.nameEn || article.title,
    nameRu: article.title,
    region,
    regionLabelRu: article.fields?.category || 'Цинхэ',
    locationTitle: locMatch?.[1]?.trim() || article.fields?.summary || '—',
    subregion: subMatch?.[1]?.trim() || '—',
    locationDetail: detailMatch?.[1]?.trim() || article.summary || content.slice(0, 300),
    icon: article.icon || '👤',
    befriendGuide: befriendMatch?.[1]?.trim(),
    dialogues: parseDialoguesFromMarkdown(content),
  };
}

const REGION_RU: Record<string, string> = {
  qinghe: 'Цинхэ',
  kaifeng: 'Кайфэн',
  hexi: 'Хэси',
};

function applyNpcLocationOverrides(
  builtins: AiNpc[],
  overrides: NonNullable<import('../types/site').ParsedContent['npcLocations']>['items'],
): AiNpc[] {
  if (!overrides?.length) return builtins;
  const map = new Map(overrides.map(o => [o.id, o]));
  const seen = new Set<string>();
  const merged = builtins.map(n => {
    const o = map.get(n.id);
    if (!o) return n;
    seen.add(n.id);
    const region = (o.region as AiNpcRegion) || n.region;
    return {
      ...n,
      nameEn: o.nameEn || n.nameEn,
      region,
      regionLabelRu: REGION_RU[region] || n.regionLabelRu,
      locationTitle: o.locationTitle || n.locationTitle,
      subregion: o.subregion || n.subregion,
      locationDetail: o.locationDetail || n.locationDetail,
    };
  });
  for (const o of overrides) {
    if (seen.has(o.id)) continue;
    const region = (o.region as AiNpcRegion) || 'qinghe';
    merged.push({
      id: o.id,
      nameEn: o.nameEn,
      nameRu: o.nameEn,
      region,
      regionLabelRu: REGION_RU[region] || o.regionLabel || region,
      locationTitle: o.locationTitle,
      subregion: o.subregion,
      locationDetail: o.locationDetail,
      icon: '👤',
      dialogues: [],
    });
  }
  return merged;
}

export async function mergeNpcList(
  wikiArticles: WikiArticle[],
  parsedLocations?: import('../types/site').ParsedContent['npcLocations'],
): Promise<AiNpc[]> {
  const builtinNpcs = await loadBuiltinNpcs();
  const withLocations = applyNpcLocationOverrides(builtinNpcs, parsedLocations?.items || []);
  const wikiNpcs = wikiArticles
    .filter(a => a.section === 'npcs')
    .map(wikiArticleToNpc);
  const wikiIds = new Set(wikiNpcs.map(n => n.wikiId));
  const builtins = withLocations.filter(n => !n.wikiId);
  return [...builtins, ...wikiNpcs].sort((a, b) =>
    a.nameRu.localeCompare(b.nameRu, 'ru'),
  );
}

export { loadBuiltinNpcs as getBuiltinNpcs };

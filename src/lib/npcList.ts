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

export async function mergeNpcList(wikiArticles: WikiArticle[]): Promise<AiNpc[]> {
  const builtinNpcs = await loadBuiltinNpcs();
  const wikiNpcs = wikiArticles
    .filter(a => a.section === 'npcs')
    .map(wikiArticleToNpc);
  const wikiIds = new Set(wikiNpcs.map(n => n.wikiId));
  const builtins = builtinNpcs.filter(n => !n.wikiId);
  return [...builtins, ...wikiNpcs].sort((a, b) =>
    a.nameRu.localeCompare(b.nameRu, 'ru'),
  );
}

export { loadBuiltinNpcs as getBuiltinNpcs };

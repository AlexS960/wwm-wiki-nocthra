import type { WikiArticle } from '../context/AuthContext';
import type { RiddleClue, RiddleMaster, RiddleRegion } from '../data/riddles';
import { riddleClues as builtinClues, riddleMasters as builtinMasters } from '../data/riddles';

const REGION_MAP: Record<string, RiddleRegion> = {
  цинхэ: 'qinghe',
  qinghe: 'qinghe',
  кайфэн: 'kaifeng',
  kaifeng: 'kaifeng',
  хэси: 'hexi',
  hexi: 'hexi',
};

function parseAnswers(content: string): string[] {
  const block = content.match(/##\s*Ответы?([\s\S]*?)(?=##|$)/i);
  const raw = block?.[1]?.trim() || content;
  return raw
    .split(/[,\n]/)
    .map(s => s.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function parseClueText(content: string, title: string): string {
  const m = content.match(/##\s*Подсказка\s*\n+([\s\S]*?)(?=\n##|$)/i);
  return (m?.[1]?.trim() || title).trim();
}

export function wikiArticleToRiddleClue(article: WikiArticle): RiddleClue {
  const content = article.content || '';
  const clueEn = parseClueText(content, article.title);
  const answers = parseAnswers(content);
  const primary = answers[0] || article.fields?.summary || '';
  return {
    id: `wiki-clue-${article.id}`,
    wikiId: article.id,
    isCustom: true,
    clueEn,
    answers: answers.length ? answers : primary ? [primary] : [],
    primaryAnswer: primary,
  };
}

export function wikiArticleToRiddleMaster(article: WikiArticle): RiddleMaster {
  const content = article.content || '';
  const regionKey = (article.fields?.category || '').toLowerCase();
  const region = REGION_MAP[regionKey] || 'kaifeng';
  const locMatch = content.match(/\*\*Место:\*\*\s*(.+)/i);
  const subMatch = content.match(/\*\*Подзона:\*\*\s*(.+)/i);
  const detailMatch = content.match(/\*\*Как найти:\*\*\s*([\s\S]*?)(?=\n\*\*|\n##|$)/i);
  const intMatch = content.match(/\*\*Интеллект:\*\*\s*(\d+)/i);
  const costMatch = content.match(/\*\*Стоимость:\*\*\s*(\d+)/i);

  return {
    id: `wiki-master-${article.id}`,
    wikiId: article.id,
    isCustom: true,
    nameEn: article.fields?.nameEn || article.title,
    nameRu: article.title,
    region,
    regionLabelRu: article.fields?.category || 'Кайфэн',
    locationTitle: locMatch?.[1]?.trim() || '—',
    subregion: subMatch?.[1]?.trim() || '—',
    locationDetail: detailMatch?.[1]?.trim() || article.summary || '',
    intelligence: intMatch ? Number(intMatch[1]) : 40,
    commerceCost: costMatch ? Number(costMatch[1]) : 20,
    icon: article.icon || '🧩',
  };
}

export function isWikiMasterArticle(article: WikiArticle): boolean {
  const cat = (article.fields?.category || '').toLowerCase();
  return cat.includes('загадочник') || /^##\s*загадочник/mi.test(article.content || '');
}

export function mergeRiddleMasters(
  wikiArticles: WikiArticle[],
  hiddenIds: string[] = [],
  parsedMasters?: RiddleMaster[],
): RiddleMaster[] {
  const hidden = new Set(hiddenIds);
  const baseMasters = parsedMasters?.length ? parsedMasters : builtinMasters;
  const custom = wikiArticles
    .filter(a => a.section === 'riddles' && isWikiMasterArticle(a))
    .map(wikiArticleToRiddleMaster);
  const wikiIds = new Set(custom.map(m => m.wikiId));
  const builtins = baseMasters.filter(m => !wikiIds.has(m.wikiId) && !hidden.has(m.id));
  return [...builtins, ...custom].sort((a, b) => a.nameRu.localeCompare(b.nameRu, 'ru'));
}

export function mergeRiddleClues(
  wikiArticles: WikiArticle[],
  hiddenIds: string[] = [],
  parsedClues?: RiddleClue[],
): RiddleClue[] {
  const hidden = new Set(hiddenIds);
  const baseClues = parsedClues?.length ? parsedClues : builtinClues;
  const custom = wikiArticles
    .filter(a => a.section === 'riddles' && !isWikiMasterArticle(a))
    .map(wikiArticleToRiddleClue);
  const wikiIds = new Set(custom.map(c => c.wikiId));
  const builtins = baseClues.filter(c => !wikiIds.has(c.wikiId) && !hidden.has(c.id));
  return [...builtins, ...custom].sort((a, b) => a.clueEn.localeCompare(b.clueEn, 'en'));
}

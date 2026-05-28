import type { WikiArticle } from '../context/AuthContext';
import type { SectionEditorValues } from '../components/ui/SectionEditorModal';
import type { RiddleClue, RiddleMaster } from '../data/riddles';
import { isWikiMasterArticle } from './riddleList';

export function clueToEditorValues(clue: RiddleClue): Partial<SectionEditorValues> {
  return {
    title: clue.clueEn,
    summary: clue.primaryAnswer,
    category: 'Подсказка',
    icon: '❓',
    content: `## Подсказка\n${clue.clueEn}\n\n## Ответы\n${clue.answers.join('\n')}`,
    images: [],
  };
}

export function masterToEditorValues(master: RiddleMaster): Partial<SectionEditorValues> {
  return {
    title: master.nameRu,
    summary: master.nameEn,
    category: 'Загадочник',
    icon: master.icon || '🧩',
    content: [
      '## Локация',
      `**Регион:** ${master.regionLabelRu}`,
      `**Место:** ${master.locationTitle}`,
      `**Подзона:** ${master.subregion}`,
      master.locationDetail ? `**Как найти:** ${master.locationDetail}` : '',
      `**Интеллект:** ${master.intelligence}`,
      `**Стоимость:** ${master.commerceCost}`,
    ].filter(Boolean).join('\n'),
    images: [],
  };
}

export function findWikiArticle(wikiArticles: WikiArticle[], wikiId?: string): WikiArticle | undefined {
  if (!wikiId) return undefined;
  return wikiArticles.find(a => a.id === wikiId);
}

export function articleToEditorValues(article: WikiArticle): Partial<SectionEditorValues> {
  const isMaster = isWikiMasterArticle(article);
  return {
    title: article.title,
    summary: article.fields?.summary || '',
    category: article.fields?.category || (isMaster ? 'Загадочник' : 'Подсказка'),
    icon: article.icon,
    content: article.content,
    images: article.images || [],
  };
}

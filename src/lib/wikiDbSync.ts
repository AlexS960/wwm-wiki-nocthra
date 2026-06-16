import type { WikiArticle } from '../types/site';
import { normalizeWikiArticle } from './wikiNormalize';

/** Подготовка статьи для записи в Supabase (без английских полей). */
export function articleForDbStorage(article: WikiArticle): WikiArticle {
  const fields = { ...article.fields };
  delete fields.nameEn;
  delete fields.name_en;
  const source = fields.source === 'custom' ? 'custom' : (fields.source || 'seed');
  return normalizeWikiArticle({
    ...article,
    fields: { ...fields, source },
  });
}

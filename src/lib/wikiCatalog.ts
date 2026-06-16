import type { WikiArticle } from '../types/site';
import { normalizeWikiArticles } from './wikiNormalize';

/** Каталог вики только из Supabase — без сидов в коде. */
export function buildWikiCatalog(existing: WikiArticle[] = []): WikiArticle[] {
  return normalizeWikiArticles(existing);
}

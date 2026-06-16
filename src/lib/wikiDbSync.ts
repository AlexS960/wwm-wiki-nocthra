import type { WikiArticle } from '../types/site';
import { normalizeWikiArticle } from './wikiNormalize';

/** Версия дефолтного контента — при увеличении все не-кастомные статьи перезаписываются в БД. */
export const WIKI_SEED_REVISION = 3;

const REVISION_KEY = 'wiki_seed_revision';

export function articleForDbStorage(article: WikiArticle): WikiArticle {
  const fields = { ...article.fields };
  delete fields.nameEn;
  const source = fields.source === 'custom' ? 'custom' : (fields.source || 'seed');
  return normalizeWikiArticle({
    ...article,
    fields: { ...fields, source },
  });
}

export function needsWikiSeedResync(): boolean {
  try {
    return localStorage.getItem(REVISION_KEY) !== String(WIKI_SEED_REVISION);
  } catch {
    return true;
  }
}

export function markWikiSeedSynced(): void {
  try {
    localStorage.setItem(REVISION_KEY, String(WIKI_SEED_REVISION));
  } catch {
    /* ignore */
  }
}

export function seedDiffersFromDb(seed: WikiArticle, db: WikiArticle): boolean {
  const s = articleForDbStorage(seed);
  const d = articleForDbStorage(db);
  return (
    s.title !== d.title ||
    s.content !== d.content ||
    s.icon !== d.icon ||
    JSON.stringify(s.fields) !== JSON.stringify(d.fields)
  );
}

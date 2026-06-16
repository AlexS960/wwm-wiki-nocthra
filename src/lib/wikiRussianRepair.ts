import type { WikiArticle } from '../types/site';

const CYRILLIC = /[а-яёА-ЯЁ]/;
const LATIN = /[a-zA-Z]/;

export function hasCyrillic(text: string): boolean {
  return CYRILLIC.test(text);
}

/** Текст выглядит как английский (латиница есть, кириллицы нет). */
export function isLatinDominant(text: string): boolean {
  const t = text.trim();
  if (!t || hasCyrillic(t)) return false;
  return LATIN.test(t);
}

function pickRussian(dbValue: string, seedValue: string): string {
  const db = dbValue.trim();
  const seed = seedValue.trim();
  if (!seed) return db;
  if (!db) return seed;
  if (hasCyrillic(db) && !hasCyrillic(seed)) return db;
  if (!hasCyrillic(db) && hasCyrillic(seed)) return seed;
  if (isLatinDominant(db) && hasCyrillic(seed)) return seed;
  return db;
}

function articleNeedsRepair(db: WikiArticle, seed: WikiArticle): boolean {
  if (db.fields?.source === 'custom') return false;
  const titleFixed = pickRussian(db.title, seed.title);
  const contentFixed = pickRussian(db.content, seed.content);
  const summaryFixed = pickRussian(db.fields?.summary ?? '', seed.fields?.summary ?? '');
  return (
    titleFixed !== db.title.trim() ||
    contentFixed !== db.content.trim() ||
    summaryFixed !== (db.fields?.summary ?? '').trim()
  );
}

/** Восстанавливает русский контент из сида, не трогая кастомные статьи. */
export function repairWikiArticleFromSeed(db: WikiArticle, seed: WikiArticle): WikiArticle {
  if (db.fields?.source === 'custom') return db;

  const title = pickRussian(db.title, seed.title);
  const content = pickRussian(db.content, seed.content);
  const summary = pickRussian(db.fields?.summary ?? '', seed.fields?.summary ?? '');

  const fields = { ...db.fields };
  if (summary) fields.summary = summary;
  // nameEn храним только в сидах — в БД не дублируем английские подписи
  delete fields.nameEn;

  return {
    ...db,
    title,
    content,
    fields: {
      ...fields,
      source: db.fields?.source || seed.fields?.source || 'seed',
    },
  };
}

export function repairWikiCatalog(
  existing: WikiArticle[],
  seeds: WikiArticle[],
): { articles: WikiArticle[]; repaired: WikiArticle[] } {
  const seedById = new Map(seeds.map(s => [s.id, s]));
  const repaired: WikiArticle[] = [];

  const articles = existing.map(article => {
    const seed = seedById.get(article.id);
    if (!seed || !articleNeedsRepair(article, seed)) return article;
    const fixed = repairWikiArticleFromSeed(article, seed);
    repaired.push(fixed);
    return fixed;
  });

  return { articles, repaired };
}

/** Статьи в БД, которые нужно перезаписать русской версией из сидов. */
export function collectWikiDbRepairs(
  dbArticles: WikiArticle[],
  seeds: WikiArticle[],
): WikiArticle[] {
  const seedById = new Map(seeds.map(s => [s.id, s]));
  const repairs: WikiArticle[] = [];

  for (const article of dbArticles) {
    if (article.fields?.source === 'custom') continue;
    const seed = seedById.get(article.id);
    if (!seed) continue;
    const fixed = repairWikiArticleFromSeed(article, seed);
    const hadNameEn = Boolean(article.fields?.nameEn?.trim());
    if (
      fixed.title !== article.title.trim() ||
      fixed.content !== article.content.trim() ||
      (fixed.fields?.summary ?? '') !== (article.fields?.summary ?? '').trim() ||
      hadNameEn
    ) {
      repairs.push(fixed);
    }
  }

  return repairs;
}

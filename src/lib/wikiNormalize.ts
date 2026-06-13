import type { WikiArticle } from '../types/site';
import { asText } from './asText';
import { sanitizeImageList } from './siteImages';

export { asText, trimText } from './asText';

/** @deprecated use asText */
export const asWikiText = asText;

/** JSONB из Supabase может содержать числа/объекты — приводим к Record<string, string>. */
export function normalizeWikiFields(fields: unknown): Record<string, string> {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields as Record<string, unknown>)) {
    const text = asText(value);
    if (text) out[key] = text;
  }
  return out;
}

export function normalizeWikiArticle<T extends WikiArticle>(article: T): T {
  return {
    ...article,
    id: asText(article.id) || String(article.id ?? ''),
    section: asText(article.section),
    title: asText(article.title) || 'Без названия',
    content: asText(article.content),
    icon: asText(article.icon),
    authorName: asText(article.authorName),
    updatedAt: asText(article.updatedAt) || String(article.updatedAt ?? ''),
    fields: normalizeWikiFields(article.fields),
    images: sanitizeImageList(article.images),
  };
}

export function normalizeWikiArticles<T extends WikiArticle>(items: T[]): T[] {
  return items.map(normalizeWikiArticle);
}

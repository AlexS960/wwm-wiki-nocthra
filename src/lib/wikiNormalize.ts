import type { WikiArticle } from '../types/site';
import { sanitizeImageList } from './siteImages';

/** Безопасное приведение к строке для текстовых полей вики. */
export function asWikiText(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return '';
}

/** JSONB из Supabase может содержать числа/объекты — приводим к Record<string, string>. */
export function normalizeWikiFields(fields: unknown): Record<string, string> {
  if (!fields || typeof fields !== 'object' || Array.isArray(fields)) return {};
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields as Record<string, unknown>)) {
    const text = asWikiText(value);
    if (text) out[key] = text;
  }
  return out;
}

export function normalizeWikiArticle<T extends WikiArticle>(article: T): T {
  return {
    ...article,
    id: asWikiText(article.id) || article.id,
    section: asWikiText(article.section),
    title: asWikiText(article.title) || 'Без названия',
    content: asWikiText(article.content),
    icon: asWikiText(article.icon),
    authorName: asWikiText(article.authorName),
    updatedAt: asWikiText(article.updatedAt) || article.updatedAt,
    fields: normalizeWikiFields(article.fields),
    images: sanitizeImageList(article.images),
  };
}

export function normalizeWikiArticles<T extends WikiArticle>(items: T[]): T[] {
  return items.map(normalizeWikiArticle);
}

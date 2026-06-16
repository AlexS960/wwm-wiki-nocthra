import type { WikiArticle } from '../types/site';
import { convertOverrideSection, getAllSeedArticles } from './sectionSeeds';
import { articleForDbStorage, needsWikiSeedResync, seedDiffersFromDb } from './wikiDbSync';
import { contentStoreUpsertWiki, contentStoreUsesNormalized } from './contentStore';

const UPSERT_BATCH = 8;

async function upsertWikiBatch(articles: WikiArticle[]): Promise<void> {
  for (let i = 0; i < articles.length; i += UPSERT_BATCH) {
    const batch = articles.slice(i, i + UPSERT_BATCH);
    await Promise.all(batch.map(a => contentStoreUpsertWiki(a)));
  }
}

export interface SeedResult {
  inserted: number;
  updated: number;
  articles: WikiArticle[];
  migratedSections: string[];
}

/**
 * Синхронизирует дефолтные статьи в Supabase (wiki_articles).
 * Кастомные статьи (fields.source === 'custom') не перезаписываются.
 */
export async function seedWikiSections(
  existing: WikiArticle[],
  sectionOverrides: Record<string, unknown> | undefined,
  persistLegacy: (articles: WikiArticle[]) => Promise<void>,
): Promise<SeedResult> {
  const byId = new Map(existing.map(a => [a.id, a]));
  const toPersist: WikiArticle[] = [];
  const migratedSections: string[] = [];
  const forceAll = needsWikiSeedResync();

  if (sectionOverrides) {
    for (const [sectionKey, raw] of Object.entries(sectionOverrides)) {
      if (!Array.isArray(raw) || raw.length === 0) continue;
      migratedSections.push(sectionKey);
      for (const article of convertOverrideSection(sectionKey, raw)) {
        const prev = byId.get(article.id);
        const src = prev?.fields?.source;
        if (prev && src !== 'override' && src !== undefined) continue;
        const normalized = articleForDbStorage(article);
        byId.set(article.id, normalized);
        toPersist.push(normalized);
      }
    }
  }

  let inserted = 0;
  let updated = 0;

  for (const seed of getAllSeedArticles()) {
    const prev = byId.get(seed.id);
    if (prev?.fields?.source === 'custom') continue;

    if (!prev) {
      byId.set(seed.id, seed);
      toPersist.push(seed);
      inserted++;
      continue;
    }

    if (forceAll || seedDiffersFromDb(seed, prev)) {
      byId.set(seed.id, seed);
      toPersist.push(seed);
      updated++;
    }
  }

  const usesNormalized = await contentStoreUsesNormalized('wiki');

  if (usesNormalized && toPersist.length > 0) {
    await upsertWikiBatch(toPersist);
  }

  const articles = [...byId.values()];

  if (!usesNormalized) {
    await persistLegacy(articles);
  }

  return { inserted, updated, articles, migratedSections };
}

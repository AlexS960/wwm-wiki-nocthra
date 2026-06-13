import type { WikiArticle } from '../types/site';
import { convertOverrideSection, getAllSeedArticles } from './sectionSeeds';
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

export async function seedWikiSections(
  existing: WikiArticle[],
  sectionOverrides: Record<string, unknown> | undefined,
  persistLegacy: (articles: WikiArticle[]) => Promise<void>,
): Promise<SeedResult> {
  const byId = new Map(existing.map(a => [a.id, a]));
  const toUpsert: WikiArticle[] = [];
  const migratedSections: string[] = [];

  if (sectionOverrides) {
    for (const [sectionKey, raw] of Object.entries(sectionOverrides)) {
      if (!Array.isArray(raw) || raw.length === 0) continue;
      migratedSections.push(sectionKey);
      for (const article of convertOverrideSection(sectionKey, raw)) {
        const existing = byId.get(article.id);
        const src = existing?.fields?.source;
        if (existing && src !== 'override' && src !== undefined) continue;
        toUpsert.push(article);
      }
    }
  }

  const pendingIds = new Set(toUpsert.map(a => a.id));
  for (const seed of getAllSeedArticles()) {
    if (!byId.has(seed.id) && !pendingIds.has(seed.id)) {
      toUpsert.push(seed);
    }
  }

  if (toUpsert.length === 0) {
    return { inserted: 0, updated: 0, articles: existing, migratedSections };
  }

  const usesNormalized = await contentStoreUsesNormalized('wiki');
  let inserted = 0;
  let updated = 0;
  const toPersist: WikiArticle[] = [];

  for (const article of toUpsert) {
    const existing = byId.get(article.id);
    if (existing?.fields?.source === 'custom') continue;
    if (existing && existing.fields?.source !== 'override' && article.fields?.source !== 'seed') continue;

    const hadExisting = byId.has(article.id);
    byId.set(article.id, article);
    if (usesNormalized) toPersist.push(article);
    if (hadExisting) updated++;
    else inserted++;
  }

  if (usesNormalized && toPersist.length > 0) {
    await upsertWikiBatch(toPersist);
  }

  const articles = [...byId.values()];

  if (!usesNormalized) {
    await persistLegacy(articles);
  }

  return { inserted, updated, articles, migratedSections };
}

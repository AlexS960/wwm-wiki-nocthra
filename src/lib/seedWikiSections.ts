import type { WikiArticle } from '../types/site';
import { convertOverrideSection, getAllSeedArticles } from './sectionSeeds';
import { contentStoreUpsertWiki, contentStoreUsesNormalized } from './contentStore';

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
      const converted = convertOverrideSection(sectionKey, raw);
      if (converted.length > 0) {
        toUpsert.push(...converted);
        migratedSections.push(sectionKey);
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

  for (const article of toUpsert) {
    const exists = byId.has(article.id);
    const isOverride = article.fields?.source === 'override';
    if (exists && !isOverride) continue;

    if (usesNormalized) {
      const ok = await contentStoreUpsertWiki(article);
      if (!ok) continue;
    }

    byId.set(article.id, article);
    if (exists) updated++;
    else inserted++;
  }

  const articles = [...byId.values()];

  if (!usesNormalized) {
    await persistLegacy(articles);
  }

  return { inserted, updated, articles, migratedSections };
}

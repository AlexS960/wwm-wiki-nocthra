import { useAuth } from '../context/AuthContext';
import { useSectionCategories } from './useSectionCategories';
import { buildWikiCatalog } from '../lib/sectionSeeds';
import { asWikiText } from '../lib/wikiNormalize';
import { useMemo } from 'react';

/** Статьи раздела из Supabase (после сидирования — единственный источник данных). */
export function useSectionWikiArticles(sectionId: string) {
  const { wikiArticles } = useAuth();
  const { matchesFilter, getLabel, normalizeId } = useSectionCategories(sectionId);

  const articles = useMemo(() => {
    const catalog = wikiArticles.length > 0 ? wikiArticles : buildWikiCatalog([]);
    return catalog.filter(a => a.section === sectionId);
  }, [wikiArticles, sectionId]);

  const filterItems = useMemo(
    () => articles.map(a => ({ categoryId: asWikiText(a.fields?.category) })),
    [articles],
  );

  return { articles, filterItems, matchesFilter, getLabel, normalizeId };
}

import { useAuth } from '../context/AuthContext';
import { useSectionCategories } from './useSectionCategories';
import { useMemo } from 'react';

/** Статьи раздела из Supabase (после сидирования — единственный источник данных). */
export function useSectionWikiArticles(sectionId: string) {
  const { wikiArticles } = useAuth();
  const { matchesFilter, getLabel, normalizeId } = useSectionCategories(sectionId);

  const articles = useMemo(
    () => wikiArticles.filter(a => a.section === sectionId),
    [wikiArticles, sectionId],
  );

  const filterItems = useMemo(
    () => articles.map(a => ({ categoryId: a.fields?.category || '' })),
    [articles],
  );

  return { articles, filterItems, matchesFilter, getLabel, normalizeId };
}

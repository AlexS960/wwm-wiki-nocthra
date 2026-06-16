import { useAuthState } from '../context/AuthContext';
import { useSectionCategoriesScoped } from '../context/SectionCategoriesContext';
import { asText } from '../lib/asText';
import { useMemo } from 'react';

/** Статьи раздела из Supabase (после сидирования — единственный источник данных). */
export function useSectionWikiArticles(sectionId: string) {
  const { wikiArticles } = useAuthState();
  const { matchesFilter, getLabel, normalizeId } = useSectionCategoriesScoped(sectionId);

  const articles = useMemo(() => {
    return wikiArticles.filter(a => a.section === sectionId);
  }, [wikiArticles, sectionId]);

  const filterItems = useMemo(
    () => articles.map(a => ({ categoryId: asText(a.fields?.category) })),
    [articles],
  );

  return { articles, filterItems, matchesFilter, getLabel, normalizeId };
}

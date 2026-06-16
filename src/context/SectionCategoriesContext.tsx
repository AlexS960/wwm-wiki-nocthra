import { createContext, useContext, type ReactNode } from 'react';
import { useSectionCategories } from '../hooks/useSectionCategories';

export type SectionCategoriesApi = ReturnType<typeof useSectionCategories>;

const SectionCategoriesContext = createContext<SectionCategoriesApi | null>(null);

/** Один вызов useSectionCategories на страницу секции (фильтр + карточки). */
export function SectionCategoriesScope({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: ReactNode;
}) {
  const api = useSectionCategories(sectionKey);
  return (
    <SectionCategoriesContext.Provider value={api}>
      {children}
    </SectionCategoriesContext.Provider>
  );
}

export function useSectionCategoriesScoped(sectionKey: string): SectionCategoriesApi {
  const scoped = useContext(SectionCategoriesContext);
  const fallback = useSectionCategories(sectionKey);
  return scoped ?? fallback;
}

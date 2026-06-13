import { createContext, useCallback, useContext, type ReactNode } from 'react';
import { parseWikiCardLink, scrollToWikiCard } from '../lib/wikiLinks';

type NavigateFn = (section: string, payload?: { wikiId?: string }) => void;

interface WikiNavigationContextValue {
  navigateToCard: (sectionId: string, articleId: string) => void;
  navigateByHref: (href: string) => boolean;
}

const WikiNavigationContext = createContext<WikiNavigationContextValue | null>(null);

export function WikiNavigationProvider({
  children,
  onNavigate,
  getCurrentSection,
}: {
  children: ReactNode;
  onNavigate: NavigateFn;
  getCurrentSection: () => string | null;
}) {
  const navigateToCard = useCallback((sectionId: string, articleId: string) => {
    const current = getCurrentSection();
    if (current === sectionId) {
      if (scrollToWikiCard(articleId)) return;
    }
    onNavigate(sectionId, { wikiId: articleId });
  }, [getCurrentSection, onNavigate]);

  const navigateByHref = useCallback((href: string) => {
    const parsed = parseWikiCardLink(href);
    if (!parsed) return false;
    if (!parsed.sectionId) {
      return scrollToWikiCard(parsed.articleId);
    }
    navigateToCard(parsed.sectionId, parsed.articleId);
    return true;
  }, [navigateToCard]);

  return (
    <WikiNavigationContext.Provider value={{ navigateToCard, navigateByHref }}>
      {children}
    </WikiNavigationContext.Provider>
  );
}

export function useWikiNavigation() {
  return useContext(WikiNavigationContext);
}

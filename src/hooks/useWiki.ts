import { useAuth } from '../context/AuthContext';

export function useWiki() {
  const {
    wikiArticles,
    wikiLoaded,
    ensureWikiLoaded,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
  } = useAuth();
  return {
    wikiArticles,
    wikiLoaded,
    ensureWikiLoaded,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
  };
}

import { useAuth } from '../context/AuthContext';

export function useSiteNews() {
  const {
    siteNews,
    addSiteNews,
    updateSiteNews,
    deleteSiteNews,
    toggleSiteNewsLike,
  } = useAuth();
  return { siteNews, addSiteNews, updateSiteNews, deleteSiteNews, toggleSiteNewsLike };
}

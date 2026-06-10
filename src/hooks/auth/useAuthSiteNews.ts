import { useCallback, useRef, useState } from 'react';
import type { SiteNewsItem, User } from '../../types/site';
import {
  contentStoreLoadSiteNews,
  contentStoreUsesNormalized,
  contentStoreAddSiteNews,
  contentStoreUpdateSiteNews,
  contentStoreDeleteSiteNews,
  contentStoreUpdateSiteNewsLikes,
} from '../../lib/contentStore';
import { sanitizeSiteNews } from '../../lib/siteImages';
import { asArray } from '../../context/authContextTypes';
import type { MutableRefObject } from 'react';
import type { NormalizedDomains } from './types';

type Deps = {
  user: User | null;
  persist: (key: string, data: unknown) => Promise<string | null>;
  setDbSaveError: (msg: string | null) => void;
  normalizedRef: MutableRefObject<NormalizedDomains>;
};

export function useAuthSiteNews({ user, persist, setDbSaveError, normalizedRef }: Deps) {
  const [siteNews, setSiteNews] = useState<SiteNewsItem[]>([]);
  const siteNewsRef = useRef(siteNews);
  siteNewsRef.current = siteNews;

  const loadSiteNews = useCallback(async () => {
    const news = await contentStoreLoadSiteNews();
    normalizedRef.current.news = await contentStoreUsesNormalized('news');
    setSiteNews(sanitizeSiteNews(asArray<SiteNewsItem>(news)));
  }, [normalizedRef]);

  const addSiteNews = useCallback((n: Omit<SiteNewsItem, 'id' | 'authorName' | 'createdAt' | 'updatedAt'>) => {
    const item: SiteNewsItem = {
      ...n,
      id: 'sn' + Date.now(),
      authorName: user?.name || 'Редактор',
      likes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSiteNews(prev => [item, ...prev]);
    void (async () => {
      if (await contentStoreUsesNormalized('news')) {
        const ok = await contentStoreAddSiteNews(item);
        if (!ok) setDbSaveError('Не удалось сохранить новость');
      } else {
        await persist('site_news', [item, ...siteNewsRef.current]);
      }
    })();
  }, [user?.name, persist, setDbSaveError]);

  const updateSiteNews = useCallback((id: string, u: Partial<SiteNewsItem>) => {
    const next = siteNewsRef.current.map(x =>
      x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x,
    );
    setSiteNews(next);
    void (async () => {
      const updated = next.find(x => x.id === id);
      if (await contentStoreUsesNormalized('news') && updated) {
        const ok = await contentStoreUpdateSiteNews(id, updated);
        if (!ok) setDbSaveError('Не удалось обновить новость');
      } else {
        await persist('site_news', next);
      }
    })();
  }, [persist, setDbSaveError]);

  const deleteSiteNews = useCallback((id: string) => {
    const prev = siteNewsRef.current;
    const next = prev.filter(x => x.id !== id);
    setSiteNews(next);
    void (async () => {
      if (await contentStoreUsesNormalized('news')) {
        const ok = await contentStoreDeleteSiteNews(id);
        if (!ok) {
          setSiteNews(prev);
          setDbSaveError('Не удалось удалить новость');
        }
      } else {
        await persist('site_news', next);
      }
    })();
  }, [persist, setDbSaveError]);

  const toggleSiteNewsLike = useCallback(async (newsId: string, userId: string) => {
    const prev = siteNewsRef.current;
    const next = prev.map(n => {
      if (n.id !== newsId) return n;
      const likes = n.likes || [];
      const has = likes.includes(userId);
      return { ...n, likes: has ? likes.filter(uid => uid !== userId) : [...likes, userId] };
    });
    setSiteNews(next);
    const item = next.find(n => n.id === newsId);
    if (await contentStoreUsesNormalized('news') && item) {
      const ok = await contentStoreUpdateSiteNewsLikes(newsId, item.likes || []);
      if (!ok) {
        setSiteNews(prev);
        return 'Не удалось обновить лайк';
      }
      return null;
    }
    const err = await persist('site_news', next);
    if (err) {
      setSiteNews(prev);
      return err;
    }
    return null;
  }, [persist]);

  return {
    siteNews,
    setSiteNews,
    siteNewsRef,
    loadSiteNews,
    addSiteNews,
    updateSiteNews,
    deleteSiteNews,
    toggleSiteNewsLike,
  };
}

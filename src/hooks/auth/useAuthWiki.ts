import { useCallback, useEffect, useRef, useState } from 'react';
import type { User, WikiArticle } from '../../types/site';
import {
  contentStoreLoadWiki,
  contentStoreUsesNormalized,
  contentStoreAddWiki,
  contentStoreUpdateWiki,
  contentStoreDeleteWiki,
} from '../../lib/contentStore';
import { buildWikiCatalog } from '../../lib/wikiCatalog';
import { sanitizeWiki } from '../../lib/siteImages';
import { logger } from '../../lib/logger';
import type { MutableRefObject } from 'react';
import type { NormalizedDomains } from './types';

const DB_TIMEOUT_MS = 8_000;

function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>(resolve => setTimeout(() => resolve(fallback), ms)),
  ]);
}

type Deps = {
  user: User | null;
  persist: (key: string, data: unknown) => Promise<string | null>;
  setDbSaveError: (msg: string | null) => void;
  normalizedRef: MutableRefObject<NormalizedDomains>;
};

export function useAuthWiki({
  user,
  persist,
  setDbSaveError,
  normalizedRef,
}: Deps) {
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>([]);
  const [wikiLoaded, setWikiLoaded] = useState(false);
  const wikiRef = useRef(wikiArticles);
  wikiRef.current = wikiArticles;
  const syncStartedRef = useRef(false);

  const syncWikiFromDb = useCallback(async () => {
    let dbArticles: WikiArticle[] = [];
    try {
      normalizedRef.current.wiki = await withTimeout(
        contentStoreUsesNormalized('wiki'),
        DB_TIMEOUT_MS,
        false,
      );
      if (normalizedRef.current.wiki) {
        dbArticles = sanitizeWiki(await withTimeout(
          contentStoreLoadWiki(),
          DB_TIMEOUT_MS,
          [],
        ));
      }
    } catch (err) {
      logger.warn('Wiki DB sync skipped', 'wiki', String(err));
      normalizedRef.current.wiki = false;
    }

    setWikiArticles(sanitizeWiki(buildWikiCatalog(dbArticles)));
    setWikiLoaded(true);
  }, [normalizedRef]);

  const ensureWikiLoaded = useCallback(() => {
    if (syncStartedRef.current) return;
    syncStartedRef.current = true;
    void syncWikiFromDb();
  }, [syncWikiFromDb]);

  useEffect(() => {
    ensureWikiLoaded();
  }, [ensureWikiLoaded]);

  const addWikiArticle = useCallback((a: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => {
    const article = {
      ...a,
      id: 'w' + Date.now(),
      authorName: user?.name || '',
      updatedAt: new Date().toLocaleDateString('ru-RU'),
      fields: { ...a.fields, source: a.fields?.source || 'custom' },
    } as WikiArticle;
    setWikiArticles(prev => {
      const next = [...prev, article];
      void (async () => {
        if (await contentStoreUsesNormalized('wiki')) {
          const ok = await contentStoreAddWiki(article);
          if (!ok) setDbSaveError('Не удалось сохранить статью вики');
        } else {
          await persist('wiki', next);
        }
      })();
      return next;
    });
  }, [user?.name, persist, setDbSaveError]);

  const updateWikiArticle = useCallback((id: string, u: Partial<WikiArticle>) => {
    const next = wikiRef.current.map(x => {
      if (x.id !== id) return x;
      const mergedFields = {
        ...x.fields,
        ...(u.fields || {}),
        source: 'custom' as const,
      };
      return {
        ...x,
        ...u,
        fields: mergedFields,
        updatedAt: new Date().toISOString(),
      };
    });
    setWikiArticles(next);
    void (async () => {
      const updated = next.find(x => x.id === id);
      if (await contentStoreUsesNormalized('wiki') && updated) {
        const ok = await contentStoreUpdateWiki(id, updated);
        if (!ok) setDbSaveError('Не удалось обновить статью вики');
      } else {
        await persist('wiki', next);
      }
    })();
  }, [persist, setDbSaveError]);

  const deleteWikiArticle = useCallback((id: string) => {
    const prev = wikiRef.current;
    const next = prev.filter(x => x.id !== id);
    setWikiArticles(next);
    void (async () => {
      if (await contentStoreUsesNormalized('wiki')) {
        const ok = await contentStoreDeleteWiki(id);
        if (!ok) {
          setWikiArticles(prev);
          setDbSaveError('Не удалось удалить статью вики');
        }
      } else {
        await persist('wiki', next);
      }
    })();
  }, [persist, setDbSaveError]);

  return {
    wikiArticles,
    setWikiArticles,
    wikiLoaded,
    setWikiLoaded,
    ensureWikiLoaded,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
  };
}

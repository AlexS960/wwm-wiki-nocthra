import { useCallback, useEffect, useRef, useState } from 'react';
import type { User, WikiArticle } from '../../types/site';
import {
  contentStoreLoadWiki,
  contentStoreUsesNormalized,
  contentStoreAddWiki,
  contentStoreUpsertWiki,
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
  const wikiSavePendingRef = useRef(0);

  const isWikiSavePending = useCallback(() => wikiSavePendingRef.current > 0, []);

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

  const saveWikiArticle = useCallback(async (
    article: WikiArticle,
    fallbackList?: WikiArticle[],
  ): Promise<string | null> => {
    const usesNorm = normalizedRef.current.wiki ?? await contentStoreUsesNormalized('wiki');
    normalizedRef.current.wiki = usesNorm;
    if (usesNorm) {
      const ok = await contentStoreUpsertWiki(article);
      if (!ok) return 'Не удалось сохранить статью вики в базе';
      return null;
    }
    if (!fallbackList) return 'Не удалось определить список статей для сохранения';
    return persist('wiki', fallbackList);
  }, [persist, normalizedRef]);

  const addWikiArticle = useCallback(async (a: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => {
    const article = {
      ...a,
      id: 'w' + Date.now(),
      authorName: user?.name || '',
      updatedAt: new Date().toISOString(),
      fields: { ...a.fields, source: a.fields?.source || 'custom' },
    } as WikiArticle;

    const next = [...wikiRef.current, article];
    wikiSavePendingRef.current += 1;
    setWikiArticles(next);
    try {
      const err = await saveWikiArticle(article, next);
      if (err) {
        setWikiArticles(wikiRef.current.filter(x => x.id !== article.id));
        setDbSaveError(err);
        return err;
      }
      setDbSaveError(null);
      return null;
    } finally {
      wikiSavePendingRef.current -= 1;
    }
  }, [user?.name, saveWikiArticle, setDbSaveError]);

  const updateWikiArticle = useCallback(async (id: string, u: Partial<WikiArticle>): Promise<string | null> => {
    const prev = wikiRef.current;
    const existing = prev.find(x => x.id === id);
    if (!existing) {
      const msg = 'Запись не найдена. Обновите страницу и попробуйте снова.';
      setDbSaveError(msg);
      return msg;
    }

    const mergedFields = {
      ...existing.fields,
      ...(u.fields || {}),
      source: 'custom' as const,
    };
    const updated: WikiArticle = {
      ...existing,
      ...u,
      fields: mergedFields,
      updatedAt: new Date().toISOString(),
    };
    const next = prev.map(x => (x.id === id ? updated : x));

    wikiSavePendingRef.current += 1;
    setWikiArticles(next);
    try {
      const err = await saveWikiArticle(updated, next);
      if (err) {
        setWikiArticles(prev);
        setDbSaveError(err);
        return err;
      }
      setDbSaveError(null);
      return null;
    } finally {
      wikiSavePendingRef.current -= 1;
    }
  }, [saveWikiArticle, setDbSaveError]);

  const deleteWikiArticle = useCallback(async (id: string): Promise<string | null> => {
    const prev = wikiRef.current;
    const next = prev.filter(x => x.id !== id);
    wikiSavePendingRef.current += 1;
    setWikiArticles(next);
    try {
      const usesNorm = normalizedRef.current.wiki ?? await contentStoreUsesNormalized('wiki');
      if (usesNorm) {
        const ok = await contentStoreDeleteWiki(id);
        if (!ok) {
          setWikiArticles(prev);
          const msg = 'Не удалось удалить статью вики';
          setDbSaveError(msg);
          return msg;
        }
      } else {
        const err = await persist('wiki', next);
        if (err) {
          setWikiArticles(prev);
          setDbSaveError(err);
          return err;
        }
      }
      setDbSaveError(null);
      return null;
    } finally {
      wikiSavePendingRef.current -= 1;
    }
  }, [persist, normalizedRef, setDbSaveError]);

  return {
    wikiArticles,
    setWikiArticles,
    wikiLoaded,
    setWikiLoaded,
    ensureWikiLoaded,
    isWikiSavePending,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
  };
}

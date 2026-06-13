import { useCallback, useRef, useState } from 'react';
import type { User, WikiArticle } from '../../types/site';
import {
  contentStoreLoadWiki,
  contentStoreUsesNormalized,
  contentStoreAddWiki,
  contentStoreUpdateWiki,
  contentStoreDeleteWiki,
} from '../../lib/contentStore';
import { buildWikiCatalog } from '../../lib/sectionSeeds';
import { seedWikiSections } from '../../lib/seedWikiSections';
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
  getSectionOverrides: () => Record<string, unknown> | undefined;
  onOverridesMigrated: (sections: string[]) => void;
};

export function useAuthWiki({
  user,
  persist,
  setDbSaveError,
  normalizedRef,
  getSectionOverrides,
  onOverridesMigrated,
}: Deps) {
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>(() =>
    sanitizeWiki(buildWikiCatalog([])),
  );
  const [wikiLoaded] = useState(true);
  const wikiRef = useRef(wikiArticles);
  wikiRef.current = wikiArticles;
  const seededRef = useRef(false);
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

    const overrides = getSectionOverrides();
    setWikiArticles(sanitizeWiki(buildWikiCatalog(dbArticles, overrides)));

    if (!seededRef.current) {
      seededRef.current = true;
      try {
        const seedResult = await seedWikiSections(
          dbArticles,
          overrides,
          async all => { await persist('wiki', all); },
        );
        if (seedResult.migratedSections.length > 0) {
          onOverridesMigrated(seedResult.migratedSections);
        }
        setWikiArticles(sanitizeWiki(buildWikiCatalog(seedResult.articles, overrides)));
      } catch (err) {
        logger.warn('Background wiki seed failed', 'wiki', String(err));
      }
    }
  }, [getSectionOverrides, onOverridesMigrated, persist, normalizedRef]);

  const ensureWikiLoaded = useCallback(() => {
    const overrides = getSectionOverrides();
    setWikiArticles(sanitizeWiki(buildWikiCatalog([], overrides)));

    if (syncStartedRef.current) return;
    syncStartedRef.current = true;
    void syncWikiFromDb();
  }, [getSectionOverrides, syncWikiFromDb]);

  const addWikiArticle = useCallback((a: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => {
    const article = {
      ...a,
      id: 'w' + Date.now(),
      authorName: user?.name || '',
      updatedAt: new Date().toLocaleDateString('ru-RU'),
      fields: { ...a.fields, source: a.fields?.source || 'custom' },
    } as WikiArticle;
    setWikiArticles(prev => [...prev, article]);
    void (async () => {
      if (await contentStoreUsesNormalized('wiki')) {
        const ok = await contentStoreAddWiki(article);
        if (!ok) setDbSaveError('Не удалось сохранить статью вики');
      } else {
        await persist('wiki', [...wikiRef.current, article]);
      }
    })();
  }, [user?.name, persist, setDbSaveError]);

  const updateWikiArticle = useCallback((id: string, u: Partial<WikiArticle>) => {
    const next = wikiRef.current.map(x =>
      x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x,
    );
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
    setWikiLoaded: () => {},
    ensureWikiLoaded,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
  };
}

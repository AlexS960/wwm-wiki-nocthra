import { useCallback, useRef, useState } from 'react';
import type { User, WikiArticle } from '../../types/site';
import {
  contentStoreLoadWiki,
  contentStoreUsesNormalized,
  contentStoreAddWiki,
  contentStoreUpdateWiki,
  contentStoreDeleteWiki,
} from '../../lib/contentStore';
import { mergeWikiWithSeeds } from '../../lib/sectionSeeds';
import { seedWikiSections } from '../../lib/seedWikiSections';
import { sanitizeWiki } from '../../lib/siteImages';
import type { MutableRefObject } from 'react';
import type { NormalizedDomains } from './types';

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
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>([]);
  const [wikiLoaded, setWikiLoaded] = useState(false);
  const wikiLoadRef = useRef<Promise<void> | null>(null);
  const wikiRef = useRef(wikiArticles);
  wikiRef.current = wikiArticles;
  const seededRef = useRef(false);

  const ensureWikiLoaded = useCallback(async () => {
    if (wikiLoaded) return;
    if (!wikiLoadRef.current) {
      wikiLoadRef.current = (async () => {
        normalizedRef.current.wiki = await contentStoreUsesNormalized('wiki');
        let articles = sanitizeWiki(await contentStoreLoadWiki());

        if (!seededRef.current) {
          const seedResult = await seedWikiSections(
            articles,
            getSectionOverrides(),
            async all => { await persist('wiki', all); },
          );
          articles = sanitizeWiki(mergeWikiWithSeeds(seedResult.articles));
          seededRef.current = true;
          if (seedResult.migratedSections.length > 0) {
            onOverridesMigrated(seedResult.migratedSections);
          }
        } else {
          articles = sanitizeWiki(mergeWikiWithSeeds(articles));
        }

        setWikiArticles(articles);
        setWikiLoaded(true);
      })();
    }
    await wikiLoadRef.current;
  }, [wikiLoaded, normalizedRef, getSectionOverrides, onOverridesMigrated, persist]);

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
    setWikiLoaded,
    ensureWikiLoaded,
    addWikiArticle,
    updateWikiArticle,
    deleteWikiArticle,
  };
}

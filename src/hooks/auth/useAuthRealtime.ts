import { useEffect, useRef } from 'react';
import {
  subscribeSiteData,
  subscribeAccounts,
  subscribeUserProgress,
  subscribeGuides,
  subscribeChatMessages,
  subscribeWikiArticles,
  subscribeGuideComments,
  subscribeSiteNews,
  subscribeSupportTickets,
  subscribeGuideVersions,
} from '../../lib/realtime';
import { subscribePmMessages } from '../../lib/pmRealtime';
import {
  contentStoreLoadGuides,
  contentStoreLoadWiki,
  contentStoreLoadChat,
  contentStoreLoadGuideComments,
  contentStoreLoadSiteNews,
  contentStoreLoadSupportTickets,
  contentStoreLoadGuideVersions,
} from '../../lib/contentStore';
import { sanitizeGuides, sanitizeGuideVersions, sanitizeSiteNews, sanitizeWiki } from '../../lib/siteImages';
import type { UserProgress } from '../../types/site';

type Deps = {
  isLoading: boolean;
  userId?: string;
  applySiteDataKey: (key: string, value: unknown) => void;
  detectNormalizedDomains: () => Promise<unknown>;
  refreshAccounts: () => Promise<void>;
  schedulePmRefresh: () => void;
  setGuides: (g: ReturnType<typeof sanitizeGuides>) => void;
  setWikiArticles: (w: ReturnType<typeof sanitizeWiki>) => void;
  setChatState: (s: Awaited<ReturnType<typeof contentStoreLoadChat>>) => void;
  setGuideComments: (c: Awaited<ReturnType<typeof contentStoreLoadGuideComments>>) => void;
  setSiteNews: (n: ReturnType<typeof sanitizeSiteNews>) => void;
  setSupportTickets: (t: Awaited<ReturnType<typeof contentStoreLoadSupportTickets>>) => void;
  setGuideVersions: (v: ReturnType<typeof sanitizeGuideVersions>) => void;
  setProgress: (p: UserProgress) => void;
};

export function useAuthRealtime(deps: Deps) {
  const depsRef = useRef(deps);
  depsRef.current = deps;

  useEffect(() => {
    if (deps.isLoading) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    void (async () => {
      const d = depsRef.current;
      const domains = await d.detectNormalizedDomains() as {
        guides: boolean;
        wiki: boolean;
        chat: boolean;
        comments: boolean;
        news: boolean;
        support: boolean;
        versions: boolean;
      };
      if (cancelled) return;

      cleanups.push(subscribeSiteData((key, value) => depsRef.current.applySiteDataKey(key, value)));
      cleanups.push(subscribeAccounts(() => { void depsRef.current.refreshAccounts(); }));
      if (d.userId) cleanups.push(subscribePmMessages(() => depsRef.current.schedulePmRefresh()));

      if (domains.guides) {
        cleanups.push(subscribeGuides(() => {
          void contentStoreLoadGuides().then(g => depsRef.current.setGuides(sanitizeGuides(g)));
        }));
      }
      if (domains.wiki) {
        cleanups.push(subscribeWikiArticles(() => {
          void contentStoreLoadWiki().then(w => depsRef.current.setWikiArticles(sanitizeWiki(w)));
        }));
      }
      if (domains.chat) {
        cleanups.push(subscribeChatMessages(() => {
          void contentStoreLoadChat().then(s => depsRef.current.setChatState(s));
        }));
      }
      if (domains.comments) {
        cleanups.push(subscribeGuideComments(() => {
          void contentStoreLoadGuideComments().then(c => depsRef.current.setGuideComments(c));
        }));
      }
      if (domains.news) {
        cleanups.push(subscribeSiteNews(() => {
          void contentStoreLoadSiteNews().then(n => depsRef.current.setSiteNews(sanitizeSiteNews(n)));
        }));
      }
      if (domains.support) {
        cleanups.push(subscribeSupportTickets(() => {
          void contentStoreLoadSupportTickets().then(t => depsRef.current.setSupportTickets(t));
        }));
      }
      if (domains.versions) {
        cleanups.push(subscribeGuideVersions(() => {
          void contentStoreLoadGuideVersions().then(v => depsRef.current.setGuideVersions(sanitizeGuideVersions(v)));
        }));
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach(fn => fn());
    };
  }, [deps.isLoading, deps.userId]);

  useEffect(() => {
    if (!deps.userId) return;
    return subscribeUserProgress(deps.userId, (data) => {
      if (data) depsRef.current.setProgress(data as UserProgress);
    });
  }, [deps.userId]);
}

import { useEffect } from 'react';
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
import type { NormalizedDomains } from './types';

type Deps = {
  isLoading: boolean;
  userId?: string;
  applySiteDataKey: (key: string, value: unknown) => void;
  detectNormalizedDomains: () => Promise<NormalizedDomains>;
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
  const {
    isLoading,
    userId,
    applySiteDataKey,
    detectNormalizedDomains,
    refreshAccounts,
    schedulePmRefresh,
    setGuides,
    setWikiArticles,
    setChatState,
    setGuideComments,
    setSiteNews,
    setSupportTickets,
    setGuideVersions,
    setProgress,
  } = deps;

  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    void (async () => {
      const domains = await detectNormalizedDomains();
      if (cancelled) return;

      cleanups.push(subscribeSiteData(applySiteDataKey));
      cleanups.push(subscribeAccounts(refreshAccounts));
      if (userId) cleanups.push(subscribePmMessages(schedulePmRefresh));

      if (domains.guides) {
        cleanups.push(subscribeGuides(() => {
          void contentStoreLoadGuides().then(g => setGuides(sanitizeGuides(g)));
        }));
      }
      if (domains.wiki) {
        cleanups.push(subscribeWikiArticles(() => {
          void contentStoreLoadWiki().then(w => setWikiArticles(sanitizeWiki(w)));
        }));
      }
      if (domains.chat) {
        cleanups.push(subscribeChatMessages(() => {
          void contentStoreLoadChat().then(setChatState);
        }));
      }
      if (domains.comments) {
        cleanups.push(subscribeGuideComments(() => {
          void contentStoreLoadGuideComments().then(setGuideComments);
        }));
      }
      if (domains.news) {
        cleanups.push(subscribeSiteNews(() => {
          void contentStoreLoadSiteNews().then(n => setSiteNews(sanitizeSiteNews(n)));
        }));
      }
      if (domains.support) {
        cleanups.push(subscribeSupportTickets(() => {
          void contentStoreLoadSupportTickets().then(setSupportTickets);
        }));
      }
      if (domains.versions) {
        cleanups.push(subscribeGuideVersions(() => {
          void contentStoreLoadGuideVersions().then(v => setGuideVersions(sanitizeGuideVersions(v)));
        }));
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach(fn => fn());
    };
  }, [
    isLoading,
    userId,
    applySiteDataKey,
    detectNormalizedDomains,
    refreshAccounts,
    schedulePmRefresh,
    setGuides,
    setWikiArticles,
    setChatState,
    setGuideComments,
    setSiteNews,
    setSupportTickets,
    setGuideVersions,
  ]);

  useEffect(() => {
    if (!userId) return;
    return subscribeUserProgress(userId, (data) => {
      if (data) setProgress(data as UserProgress);
    });
  }, [userId, setProgress]);
}

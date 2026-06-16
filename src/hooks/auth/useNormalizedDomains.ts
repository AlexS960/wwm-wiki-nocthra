import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';
import type { GuideArticle, GuideComment, GuideVersion, SiteNewsItem, SiteSettings, SupportTicket, WikiArticle, ChatState } from '../../types/site';
import { contentStoreUsesNormalized } from '../../lib/contentStore';
import { buildWikiCatalog } from '../../lib/wikiCatalog';
import { asArray } from '../../context/authContextTypes';
import { normalizeChatState } from '../../lib/normalizeState';
import { sanitizeGuides, sanitizeGuideVersions, sanitizeGuildAvatar, sanitizeSiteNews, sanitizeWiki } from '../../lib/siteImages';
import type { GuildData } from '../../types/site';
import type { NormalizedDomains } from './types';

type DomainSetters = {
  setGuides: (v: GuideArticle[]) => void;
  setSiteSettings: (v: SiteSettings | ((prev: SiteSettings) => SiteSettings)) => void;
  setChatState: (v: ChatState) => void;
  setWikiArticles: (v: WikiArticle[]) => void;
  setWikiLoaded: (v: boolean) => void;
  setSupportTickets: (v: SupportTicket[]) => void;
  setSupportLoaded: (v: boolean) => void;
  setSiteNews: (v: SiteNewsItem[]) => void;
  setGuideComments: (v: GuideComment[]) => void;
  setGuideVersions: (v: GuideVersion[]) => void;
  setGuideMetaLoaded: (v: boolean) => void;
  setGuild: (v: GuildData) => void;
  setDiscordUrl: (v: string) => void;
  mergeSiteSettings: (s: SiteSettings | null) => SiteSettings;
};

export function useNormalizedDomains(
  normalizedRef: MutableRefObject<NormalizedDomains>,
  setters: DomainSetters,
) {
  const settersRef = useRef(setters);
  useEffect(() => {
    settersRef.current = setters;
  });

  const applySiteDataKey = useCallback((key: string, value: unknown) => {
    const s = settersRef.current;
    const n = normalizedRef.current;
    switch (key) {
      case 'guides':
        if (!n.guides) s.setGuides(sanitizeGuides(asArray<GuideArticle>(value)));
        break;
      case 'site_settings':
        if (value) s.setSiteSettings(s.mergeSiteSettings(value as SiteSettings));
        break;
      case 'chat':
        if (!n.chat) s.setChatState(normalizeChatState(value));
        break;
      case 'wiki':
        if (!n.wiki) {
          const fromSite = sanitizeWiki(asArray<WikiArticle>(value));
          s.setWikiArticles(sanitizeWiki(buildWikiCatalog(fromSite)));
          s.setWikiLoaded(true);
        }
        break;
      case 'guild':
        s.setGuild(sanitizeGuildAvatar(value as GuildData));
        break;
      case 'discord_url':
        s.setDiscordUrl(typeof value === 'string' ? value : String(value));
        break;
      case 'site_news':
        if (!n.news) s.setSiteNews(sanitizeSiteNews(asArray<SiteNewsItem>(value)));
        break;
      case 'support':
        if (!n.support) {
          s.setSupportTickets(asArray<SupportTicket>(value));
          s.setSupportLoaded(true);
        }
        break;
      case 'guide_comments':
        if (!n.comments) {
          s.setGuideComments(asArray<GuideComment>(value));
          s.setGuideMetaLoaded(true);
        }
        break;
      case 'guide_versions':
        if (!n.versions) {
          s.setGuideVersions(sanitizeGuideVersions(asArray<GuideVersion>(value)));
          s.setGuideMetaLoaded(true);
        }
        break;
    }
  }, [normalizedRef]);

  const detectNormalizedDomains = useCallback(async (): Promise<NormalizedDomains> => {
    const domains = await Promise.all([
      contentStoreUsesNormalized('guides'),
      contentStoreUsesNormalized('wiki'),
      contentStoreUsesNormalized('chat'),
      contentStoreUsesNormalized('comments'),
      contentStoreUsesNormalized('news'),
      contentStoreUsesNormalized('support'),
      contentStoreUsesNormalized('versions'),
    ]);
    const result: NormalizedDomains = {
      guides: domains[0],
      wiki: domains[1],
      chat: domains[2],
      comments: domains[3],
      news: domains[4],
      support: domains[5],
      versions: domains[6],
    };
    normalizedRef.current = result;
    return result;
  }, [normalizedRef]);

  return { applySiteDataKey, detectNormalizedDomains };
}

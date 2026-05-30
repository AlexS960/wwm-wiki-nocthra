import { useCallback, type MutableRefObject } from 'react';
import type { GuideArticle, GuideComment, GuideVersion, SiteNewsItem, SiteSettings, SupportTicket, WikiArticle, ChatState } from '../../types/site';
import { contentStoreUsesNormalized } from '../../lib/contentStore';
import { asArray } from '../../context/authContextTypes';
import { sanitizeGuides, sanitizeGuideVersions, sanitizeGuildAvatar, sanitizeSiteNews, sanitizeWiki } from '../../lib/siteImages';
import type { GuildData } from '../../types/site';
import type { NormalizedDomains } from './types';

type DomainSetters = {
  setGuides: (v: GuideArticle[]) => void;
  setSiteSettings: (fn: (s: SiteSettings) => SiteSettings) => void;
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

  const applySiteDataKey = useCallback((key: string, value: unknown) => {
    const n = normalizedRef.current;
    switch (key) {
      case 'guides':
        if (!n.guides) setters.setGuides(sanitizeGuides(asArray<GuideArticle>(value)));
        break;
      case 'site_settings':
        if (value) setters.setSiteSettings(setters.mergeSiteSettings(value as SiteSettings));
        break;
      case 'chat':
        if (!n.chat) setters.setChatState(value as ChatState);
        break;
      case 'wiki':
        if (!n.wiki) {
          setters.setWikiArticles(sanitizeWiki(asArray<WikiArticle>(value)));
          setters.setWikiLoaded(true);
        }
        break;
      case 'guild':
        setters.setGuild(sanitizeGuildAvatar(value as GuildData));
        break;
      case 'discord_url':
        setters.setDiscordUrl(typeof value === 'string' ? value : String(value));
        break;
      case 'site_news':
        if (!n.news) setters.setSiteNews(sanitizeSiteNews(asArray<SiteNewsItem>(value)));
        break;
      case 'support':
        if (!n.support) {
          setters.setSupportTickets(asArray<SupportTicket>(value));
          setters.setSupportLoaded(true);
        }
        break;
      case 'guide_comments':
        if (!n.comments) {
          setters.setGuideComments(asArray<GuideComment>(value));
          setters.setGuideMetaLoaded(true);
        }
        break;
      case 'guide_versions':
        if (!n.versions) {
          setters.setGuideVersions(sanitizeGuideVersions(asArray<GuideVersion>(value)));
          setters.setGuideMetaLoaded(true);
        }
        break;
    }
  }, [setters]);

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
  }, []);

  return { applySiteDataKey, detectNormalizedDomains };
}

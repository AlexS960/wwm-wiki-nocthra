import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { dbUpdateAccount, dbDeleteAccount, dbLoadProgress, dbInit, dbLoadSiteData, dbSaveSiteData, dbListAccounts } from '../lib/db';
import { subscribeSiteData, subscribeAccounts, subscribeUserProgress, subscribeGuides, subscribeChatMessages, subscribeWikiArticles, subscribeGuideComments } from '../lib/realtime';
import { subscribePmMessages } from '../lib/pmRealtime';
import {
  contentStoreLoadGuides,
  contentStoreLoadWiki,
  contentStoreLoadChat,
  contentStoreLoadGuideComments,
  contentStoreUsesNormalized,
  contentStoreAddGuide,
  contentStoreUpdateGuide,
  contentStoreDeleteGuide,
  contentStoreAddWiki,
  contentStoreUpdateWiki,
  contentStoreDeleteWiki,
  contentStoreAddGuideComment,
  contentStoreDeleteGuideComment,
  contentStoreSaveGuideCommentsAll,
  contentStoreSendChatMessage,
  contentStoreDeleteChatMessage,
  contentStoreMuteUser,
  contentStoreUnmuteUser,
  contentStoreSaveChatAll,
} from '../lib/contentStore';
import type {
  GuildData,
  SiteNewsItem,
  UserRole,
  User,
  GuideArticle,
  GuideComment,
  GuideVersion,
  UserProgress,
  RegisteredUser,
  PmSettings,
  RoleConfig,
  ChatMessage,
  ChatState,
  SiteSettings,
  WikiArticle,
  SupportTicket,
} from '../types/site';
import { defaultGuild } from '../types/site';
import {
  asArray,
  MAX_GUIDE_VERSIONS,
  defaultUserProgress,
  defaultSiteSettings,
  type AuthContextValue,
} from './authContextTypes';
import { getDisplayName, formatLastSeen, isOnlineByLastSeen } from '../lib/displayName';
import { useAuthSession } from '../hooks/useAuthSession';
import { useAuthPm } from '../hooks/useAuthPm';
import { trimChatMessages, CHAT_PERSIST_DEBOUNCE_MS } from '../lib/chat';
import {
  sanitizeGuides,
  sanitizeGuideVersions,
  sanitizeGuildAvatar,
  sanitizeSiteDataPayload,
  sanitizeSiteNews,
  sanitizeWiki,
} from '../lib/siteImages';

export type { PrivateMessage } from '../lib/pm';

export type {
  GuildData,
  SiteNewsItem,
  UserRole,
  User,
  GuideArticle,
  GuideComment,
  GuideVersion,
  UserProgress,
  RegisteredUser,
  PmSettings,
  RoleConfig,
  ChatMessage,
  ChatState,
  SiteSettings,
  WikiArticle,
  SupportTicket,
};

export { defaultGuild };

const defP = defaultUserProgress;
const defS = defaultSiteSettings;

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({children}:{children:ReactNode}) {
  const [dbSaveError,setDbSaveError] = useState<string | null>(null);
  const session = useAuthSession({ setDbSaveError });
  const {
    user, progress, setProgress,
    loginWithPassword, register, logout,
    updateProgress, toggleFavoriteWeapon, toggleFavoriteSect, toggleCompletedGuide,
    addNote, deleteNote, setSelectedBuild,
    updateUserPicture, updateUserGameNickname,
  } = session;

  const [guides,setGuides] = useState<GuideArticle[]>([]);
  const [registeredUsers,setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [siteSettings,setSiteSettings] = useState<SiteSettings>(defS);
  const [chatState,setChatState] = useState<ChatState>({messages:[],mutedUsers:[]});
  const [wikiArticles,setWikiArticles] = useState<WikiArticle[]>([]);
  const [supportTickets,setSupportTickets] = useState<SupportTicket[]>([]);
  const [guidesLoaded, setGuidesLoaded] = useState(false);
  const [chatLoaded, setChatLoaded] = useState(false);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const [wikiLoaded, setWikiLoaded] = useState(false);
  const [supportLoaded, setSupportLoaded] = useState(false);
  const [guideMetaLoaded, setGuideMetaLoaded] = useState(false);
  const wikiLoadRef = useRef<Promise<void> | null>(null);
  const supportLoadRef = useRef<Promise<void> | null>(null);
  const guideMetaLoadRef = useRef<Promise<void> | null>(null);
  const chatPersistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guidesLoadRef = useRef<Promise<void> | null>(null);
  const chatLoadRef = useRef<Promise<void> | null>(null);
  const accountsLoadRef = useRef<Promise<void> | null>(null);
  const [guild,setGuild] = useState<GuildData>(defaultGuild);
  const [discordUrl,setDiscordUrl] = useState('https://discord.com/invite/mYqKkN3u4');
  const [siteNews,setSiteNews] = useState<SiteNewsItem[]>([]);
  const [guideComments,setGuideComments] = useState<GuideComment[]>([]);
  const [guideVersions,setGuideVersions] = useState<GuideVersion[]>([]);
  const [isLoading,setIsLoading] = useState(true);

  const pm = useAuthPm({ user, registeredUsers, isLoading, setDbSaveError });
  const {
    privateMessages, pmLoaded, loadPmThread, schedulePmRefresh, unreadPMCount,
    sendPrivateMessage, markPMRead, deletePrivateMessageForMe, deletePrivateMessageForAll,
    deletePmDialogForMe, deletePmDialogForAll,
  } = pm;

  const mapAccounts = useCallback((accs: Awaited<ReturnType<typeof dbListAccounts>>) =>
    accs.map(a => {
      const lastSeenAt = a.last_seen || null;
      return {
        id:a.id, email:'', name:a.username, picture:a.picture||'', gameNickname:a.game_nickname||'',
        role:a.role, joinedAt:a.created_at, lastSeenAt, lastSeen:formatLastSeen(lastSeenAt), isBanned:false,
      };
    }),
  []);

  const mergeSiteSettings = useCallback((s: SiteSettings | null): SiteSettings => {
    if (!s) return defS;
    return {
      ...defS,
      ...s,
      pmSettings: { ...defS.pmSettings, ...(s.pmSettings || {}) },
      riddlesHiddenIds: Array.isArray(s.riddlesHiddenIds) ? s.riddlesHiddenIds : [],
      sectionOverrides: s.sectionOverrides && typeof s.sectionOverrides === 'object' ? s.sectionOverrides : {},
    };
  }, []);

  const applySiteDataKey = useCallback((key: string, value: unknown) => {
    switch (key) {
      case 'guides': if (!normalizedRef.current.guides) setGuides(sanitizeGuides(asArray<GuideArticle>(value))); break;
      case 'site_settings': if (value) setSiteSettings(mergeSiteSettings(value as SiteSettings)); break;
      case 'chat': if (!normalizedRef.current.chat) setChatState(value as ChatState); break;
      case 'wiki': if (!normalizedRef.current.wiki) { setWikiArticles(sanitizeWiki(asArray<WikiArticle>(value))); setWikiLoaded(true); } break;
      case 'support': setSupportTickets(asArray<SupportTicket>(value)); setSupportLoaded(true); break;
      case 'pm': break;
      case 'guild': setGuild(sanitizeGuildAvatar(value as GuildData)); break;
      case 'discord_url': setDiscordUrl(typeof value === 'string' ? value : String(value)); break;
      case 'site_news': setSiteNews(sanitizeSiteNews(asArray<SiteNewsItem>(value))); break;
      case 'guide_comments': if (!normalizedRef.current.comments) { setGuideComments(asArray<GuideComment>(value)); setGuideMetaLoaded(true); } break;
      case 'guide_versions': setGuideVersions(sanitizeGuideVersions(asArray<GuideVersion>(value))); setGuideMetaLoaded(true); break;
    }
  }, [mergeSiteSettings]);

  const dataReady = useRef(false);
  const chatRef = useRef(chatState);
  const supportRef = useRef(supportTickets);
  const guideCommentsRef = useRef(guideComments);
  const siteNewsRef = useRef(siteNews);
  const guidesRef = useRef(guides);
  const wikiRef = useRef(wikiArticles);
  const normalizedRef = useRef({ guides: false, wiki: false, chat: false, comments: false });

  chatRef.current = chatState;
  supportRef.current = supportTickets;
  guideCommentsRef.current = guideComments;
  siteNewsRef.current = siteNews;
  guidesRef.current = guides;
  wikiRef.current = wikiArticles;

  // ====== INIT ======
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await dbInit();
      } catch {
        setDbSaveError('Не удалось подключиться к Supabase. Проверьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY (.env локально или Environment Variables на Vercel + Redeploy).');
        setIsLoading(false);
        return;
      }
      const [s, guildData, discord, news] = await Promise.all([
        dbLoadSiteData('site_settings', null),
        dbLoadSiteData('guild', defaultGuild), dbLoadSiteData('discord_url', 'https://discord.com/invite/mYqKkN3u4'),
        dbLoadSiteData('site_news', []),
      ]);
      if (!active) return;
      setSiteSettings(mergeSiteSettings(s as SiteSettings | null));
      setGuild(sanitizeGuildAvatar(guildData as GuildData));
      setDiscordUrl(discord);
      setSiteNews(sanitizeSiteNews(asArray<SiteNewsItem>(news)));
      if (user) { const p = await dbLoadProgress(user.id); if (p && active) setProgress(p); }
      dataReady.current = true;
      setIsLoading(false);
    })();
    return () => { active = false; };
  }, [mergeSiteSettings, setProgress, user?.id]);

  const ensureGuidesLoaded = useCallback(async () => {
    if (guidesLoaded) return;
    if (!guidesLoadRef.current) {
      guidesLoadRef.current = (async () => {
        normalizedRef.current.guides = await contentStoreUsesNormalized('guides');
        const g = await contentStoreLoadGuides();
        setGuides(sanitizeGuides(g));
        setGuidesLoaded(true);
      })();
    }
    await guidesLoadRef.current;
  }, [guidesLoaded]);

  const ensureChatLoaded = useCallback(async () => {
    if (chatLoaded) return;
    if (!chatLoadRef.current) {
      chatLoadRef.current = (async () => {
        normalizedRef.current.chat = await contentStoreUsesNormalized('chat');
        setChatState(await contentStoreLoadChat());
        setChatLoaded(true);
      })();
    }
    await chatLoadRef.current;
  }, [chatLoaded]);

  const ensureAccountsLoaded = useCallback(async () => {
    if (accountsLoaded) return;
    if (!accountsLoadRef.current) {
      accountsLoadRef.current = (async () => {
        const accs = await dbListAccounts();
        setRegisteredUsers(mapAccounts(accs));
        setAccountsLoaded(true);
      })();
    }
    await accountsLoadRef.current;
  }, [accountsLoaded, mapAccounts]);

  // ====== REALTIME (после первой загрузки) ======
  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    const refreshAccounts = async () => {
      try {
        const accs = await dbListAccounts();
        setRegisteredUsers(mapAccounts(accs));
      } catch {}
    };

    void (async () => {
      const [guidesNorm, wikiNorm, chatNorm, commentsNorm] = await Promise.all([
        contentStoreUsesNormalized('guides'),
        contentStoreUsesNormalized('wiki'),
        contentStoreUsesNormalized('chat'),
        contentStoreUsesNormalized('comments'),
      ]);
      if (cancelled) return;

      normalizedRef.current = { guides: guidesNorm, wiki: wikiNorm, chat: chatNorm, comments: commentsNorm };

      cleanups.push(subscribeSiteData(applySiteDataKey));
      cleanups.push(subscribeAccounts(refreshAccounts));
      if (user) cleanups.push(subscribePmMessages(schedulePmRefresh));
      if (guidesNorm) {
        cleanups.push(subscribeGuides(() => {
          void contentStoreLoadGuides().then(g => setGuides(sanitizeGuides(g)));
        }));
      }
      if (wikiNorm) {
        cleanups.push(subscribeWikiArticles(() => {
          void contentStoreLoadWiki().then(w => setWikiArticles(sanitizeWiki(w)));
        }));
      }
      if (chatNorm) {
        cleanups.push(subscribeChatMessages(() => {
          void contentStoreLoadChat().then(setChatState);
        }));
      }
      if (commentsNorm) {
        cleanups.push(subscribeGuideComments(() => {
          void contentStoreLoadGuideComments().then(setGuideComments);
        }));
      }
    })();

    return () => {
      cancelled = true;
      cleanups.forEach(fn => fn());
    };
  }, [isLoading, applySiteDataKey, mapAccounts, user?.id, schedulePmRefresh]);

  useEffect(() => {
    if (!user) return;
    return subscribeUserProgress(user.id, (data) => {
      if (data) setProgress(data as UserProgress);
    });
  }, [user?.id, setProgress]);

  // Пульс «онлайн» — обновление last_seen в БД
  useEffect(() => {
    if (!user) return;
    const ping = () => {
      const now = new Date().toISOString();
      void dbUpdateAccount(user.id, { last_seen: now });
      setRegisteredUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastSeenAt: now, lastSeen: formatLastSeen(now) } : u));
    };
    ping();
    const iv = setInterval(ping, 120_000);
    const onVis = () => { if (document.visibilityState === 'visible') ping(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', onVis); };
  }, [user?.id]);

  const flushChatPersist = useCallback(() => {
    if (chatPersistTimer.current) {
      clearTimeout(chatPersistTimer.current);
      chatPersistTimer.current = null;
    }
    if (normalizedRef.current.chat) return contentStoreSaveChatAll(chatRef.current);
    const payload = sanitizeSiteDataPayload('chat', chatRef.current);
    return dbSaveSiteData('chat', payload);
  }, []);

  const scheduleChatPersist = useCallback((next: ChatState) => {
    if (normalizedRef.current.chat) return;
    if (chatPersistTimer.current) clearTimeout(chatPersistTimer.current);
    chatPersistTimer.current = setTimeout(() => {
      chatPersistTimer.current = null;
      void dbSaveSiteData('chat', sanitizeSiteDataPayload('chat', next));
    }, CHAT_PERSIST_DEBOUNCE_MS);
  }, []);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden' && chatPersistTimer.current) {
        void flushChatPersist();
      }
    };
    const onUnload = () => {
      if (chatPersistTimer.current) void flushChatPersist();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onUnload);
      if (chatPersistTimer.current) void flushChatPersist();
    };
  }, [flushChatPersist]);

  const ensureWikiLoaded = useCallback(async () => {
    if (wikiLoaded) return;
    if (!wikiLoadRef.current) {
      wikiLoadRef.current = (async () => {
        normalizedRef.current.wiki = await contentStoreUsesNormalized('wiki');
        setWikiArticles(sanitizeWiki(await contentStoreLoadWiki()));
        setWikiLoaded(true);
      })();
    }
    await wikiLoadRef.current;
  }, [wikiLoaded]);

  const ensureSupportLoaded = useCallback(async () => {
    if (supportLoaded) return;
    if (!supportLoadRef.current) {
      supportLoadRef.current = (async () => {
        const t = await dbLoadSiteData('support', []);
        setSupportTickets(asArray<SupportTicket>(t));
        setSupportLoaded(true);
      })();
    }
    await supportLoadRef.current;
  }, [supportLoaded]);

  const ensureGuideMetaLoaded = useCallback(async () => {
    if (guideMetaLoaded) return;
    if (!guideMetaLoadRef.current) {
      guideMetaLoadRef.current = (async () => {
        normalizedRef.current.comments = await contentStoreUsesNormalized('comments');
        const [comments, versions] = await Promise.all([
          contentStoreLoadGuideComments(),
          dbLoadSiteData('guide_versions', []),
        ]);
        setGuideComments(asArray<GuideComment>(comments));
        setGuideVersions(sanitizeGuideVersions(asArray<GuideVersion>(versions)));
        setGuideMetaLoaded(true);
      })();
    }
    await guideMetaLoadRef.current;
  }, [guideMetaLoaded]);

  // ====== FUNCTIONS ======
  const persist = useCallback(async (key: string, data: unknown) => {
    const payload = sanitizeSiteDataPayload(key, data);
    const { error } = await dbSaveSiteData(key, payload);
    if (error) {
      console.error(`Не удалось сохранить «${key}»:`, error);
      setDbSaveError(error);
      return error;
    }
    return null;
  }, []);

  const saveSite = useCallback(<T,>(key: string, updater: (prev: T) => T, setter: (v: T) => void) => {
    setter((prev: T) => {
      const next = updater(prev);
      void persist(key, next);
      return next;
    });
  }, [persist]);


  const getRoleConfig = (r:string) => siteSettings.roles.find(x=>x.id===r) || siteSettings.roles[0];

  const value: AuthContextValue = {
    user,progress,guides,guideComments,guideVersions,registeredUsers,siteSettings,isLoading,wikiArticles,supportTickets,chatState,privateMessages,pmLoaded,
    loadPmThread,guidesLoaded,chatLoaded,accountsLoaded,ensureGuidesLoaded,ensureChatLoaded,ensureAccountsLoaded,
    wikiLoaded,supportLoaded,guideMetaLoaded,ensureWikiLoaded,ensureSupportLoaded,ensureGuideMetaLoaded,
    guild, discordUrl, siteNews, dbSaveError, clearDbSaveError: () => setDbSaveError(null),
    updateGuild: (g) => { setGuild(g); void persist('guild', g); },
    updateDiscordUrl: (url) => { setDiscordUrl(url); void persist('discord_url', url); },
    addSiteNews: (n) => saveSite('site_news', prev => [...prev, {
      ...n, id: 'sn' + Date.now(), authorName: user?.name || 'Редактор', likes: [],
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }], setSiteNews),
    updateSiteNews: (id, u) => saveSite('site_news', prev => prev.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x), setSiteNews),
    deleteSiteNews: (id) => saveSite('site_news', prev => prev.filter(x => x.id !== id), setSiteNews),
    unreadPMCount,
    loginWithPassword, register, logout,
    updateProgress,
    toggleFavoriteWeapon, toggleFavoriteSect, toggleCompletedGuide,
    addNote, deleteNote, setSelectedBuild,
    updateUserPicture, updateUserGameNickname,
    addGuide:(g)=>{
      const newGuide = {...g,id:'g'+Date.now(),authorName:user?.name||'',updatedAt:new Date().toISOString()} as GuideArticle;
      setGuides(prev => [newGuide, ...prev]);
      void (async () => {
        if (await contentStoreUsesNormalized('guides')) {
          const ok = await contentStoreAddGuide(newGuide);
          if (!ok) setDbSaveError('Не удалось сохранить гайд');
        } else {
          await persist('guides', [newGuide, ...guidesRef.current]);
        }
      })();
    },
    updateGuide: async (id, u) => {
      const current = guides.find(x => x.id === id);
      let nextVersions = guideVersions;
      if (current && user) {
        const snapshot: GuideVersion = {
          id: 'gv' + Date.now(),
          guideId: id,
          title: current.title,
          summary: current.summary,
          content: current.content,
          category: current.category,
          difficulty: current.difficulty,
          readTime: current.readTime,
          icon: current.icon,
          images: current.images,
          savedAt: new Date().toISOString(),
          savedBy: getDisplayName(user),
        };
        const forGuide = [snapshot, ...guideVersions.filter(v => v.guideId === id)].slice(0, MAX_GUIDE_VERSIONS);
        nextVersions = [...guideVersions.filter(v => v.guideId !== id), ...forGuide];
        setGuideVersions(nextVersions);
        const verErr = await persist('guide_versions', nextVersions);
        if (verErr) return;
      }
      const nextGuides = guides.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x);
      setGuides(nextGuides);
      const updated = nextGuides.find(x => x.id === id);
      if (await contentStoreUsesNormalized('guides') && updated) {
        const ok = await contentStoreUpdateGuide(id, updated);
        if (!ok) return 'Не удалось обновить гайд';
      } else {
        await persist('guides', nextGuides);
      }
    },
    getGuideVersions: (guideId) =>
      guideVersions
        .filter(v => v.guideId === guideId)
        .sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()),
    restoreGuideVersion: async (guideId, versionId) => {
      const version = guideVersions.find(v => v.id === versionId && v.guideId === guideId);
      if (!version) return 'Версия не найдена';
      const current = guides.find(g => g.id === guideId);
      if (!current) return 'Гайд не найден';
      let nextVersions = guideVersions;
      if (user) {
        const snapshot: GuideVersion = {
          id: 'gv' + Date.now(),
          guideId,
          title: current.title,
          summary: current.summary,
          content: current.content,
          category: current.category,
          difficulty: current.difficulty,
          readTime: current.readTime,
          icon: current.icon,
          images: current.images,
          savedAt: new Date().toISOString(),
          savedBy: getDisplayName(user),
        };
        const forGuide = [snapshot, ...guideVersions.filter(v => v.guideId === guideId)].slice(0, MAX_GUIDE_VERSIONS);
        nextVersions = [...guideVersions.filter(v => v.guideId !== guideId), ...forGuide];
      }
      const restored = {
        title: version.title,
        summary: version.summary,
        content: version.content,
        category: version.category,
        difficulty: version.difficulty,
        readTime: version.readTime,
        icon: version.icon,
        images: version.images,
        updatedAt: new Date().toISOString(),
      };
      const nextGuides = guides.map(g => g.id === guideId ? { ...g, ...restored } : g);
      setGuides(nextGuides);
      setGuideVersions(nextVersions);
      const e1 = await persist('guide_versions', nextVersions);
      if (e1) return e1;
      const updated = nextGuides.find(g => g.id === guideId);
      if (await contentStoreUsesNormalized('guides') && updated) {
        const ok = await contentStoreUpdateGuide(guideId, updated);
        return ok ? null : 'Не удалось восстановить гайд';
      }
      return persist('guides', nextGuides);
    },
    deleteGuide:(id)=>{
      const prev = guidesRef.current;
      const next = prev.filter(x => x.id !== id);
      setGuides(next);
      void (async () => {
        if (await contentStoreUsesNormalized('guides')) {
          const ok = await contentStoreDeleteGuide(id);
          if (!ok) { setGuides(prev); setDbSaveError('Не удалось удалить гайд'); }
        } else {
          await persist('guides', next);
        }
      })();
    },
    isAdmin:()=>user?.role==='admin',isEditor:()=>user?.role==='admin'||user?.role==='editor',
    adminSetUserRole:(id,r)=>dbUpdateAccount(id,{role:r}), adminBanUser:()=>{}, adminDeleteUser:(id)=>dbDeleteAccount(id),
    isUserOnline:(id)=>{ const u=registeredUsers.find(x=>x.id===id); return isOnlineByLastSeen(u?.lastSeenAt); },
    getUserDisplayName:(id,fallback='')=>{ const u=registeredUsers.find(x=>x.id===id); return u?getDisplayName(u):fallback; },
    getRoleConfig, hasPermission:(p)=>getRoleConfig(user?.role||'user').permissions.includes(p),
    updatePmSettings:(s)=>saveSite('site_settings', prev=>({...prev,pmSettings:{...prev.pmSettings,...s}}),setSiteSettings),
    purgeEmbeddedImagesFromDb: async () => {
      if (!user || user.role !== 'admin') return 'Только для администратора';
      const cleanGuides = sanitizeGuides(guides);
      const cleanWiki = sanitizeWiki(wikiArticles);
      const cleanNews = sanitizeSiteNews(siteNews);
      const cleanVersions = sanitizeGuideVersions(guideVersions);
      const cleanGuild = sanitizeGuildAvatar(guild);
      setGuides(cleanGuides);
      setWikiArticles(cleanWiki);
      setSiteNews(cleanNews);
      setGuideVersions(cleanVersions);
      setGuild(cleanGuild);
      const guidesNorm = await contentStoreUsesNormalized('guides');
      const wikiNorm = await contentStoreUsesNormalized('wiki');
      const results = await Promise.all([
        guidesNorm
          ? Promise.all(cleanGuides.map(g => contentStoreUpdateGuide(g.id, g))).then(ok => ok.every(Boolean) ? null : 'Ошибка очистки гайдов')
          : persist('guides', cleanGuides),
        wikiLoaded
          ? (wikiNorm
            ? Promise.all(cleanWiki.map(w => contentStoreUpdateWiki(w.id, w))).then(ok => ok.every(Boolean) ? null : 'Ошибка очистки вики')
            : persist('wiki', cleanWiki))
          : Promise.resolve(null),
        persist('site_news', cleanNews),
        guideMetaLoaded ? persist('guide_versions', cleanVersions) : Promise.resolve(null),
        persist('guild', cleanGuild),
      ]);
      const err = results.find(r => r);
      return err || null;
    },
    updateSiteSettings:(u)=>saveSite('site_settings', prev=>({...prev,...u}),setSiteSettings),
    addAnnouncement:(text,type)=>saveSite('site_settings', prev=>({...prev,announcements:[{id:'a'+Date.now(),text,type,active:true},...prev.announcements]}),setSiteSettings),
    removeAnnouncement:(id)=>saveSite('site_settings', prev=>({...prev,announcements:prev.announcements.filter(x=>x.id!==id)}),setSiteSettings),
    updateRoleDisplayName:(id,n)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.map(r=>r.id===id?{...r,displayName:n}:r)}),setSiteSettings),
    updateRoleColor:(id,c)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.map(r=>r.id===id?{...r,color:c}:r)}),setSiteSettings),
    addRole:(n,c,p)=>saveSite('site_settings', prev=>({...prev,roles:[...prev.roles,{id:'r'+Date.now(),displayName:n,color:c,permissions:p}]}),setSiteSettings),
    deleteRole:(id)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.filter(r=>r.id!==id)}),setSiteSettings),
    updateRolePermissions:(id,p)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.map(r=>r.id===id?{...r,permissions:p}:r)}),setSiteSettings),
    addWikiArticle:(a)=>{
      const article = {...a,id:'w'+Date.now(),authorName:user?.name||'',updatedAt:new Date().toLocaleDateString('ru-RU')} as WikiArticle;
      setWikiArticles(prev => [...prev, article]);
      void (async () => {
        if (await contentStoreUsesNormalized('wiki')) {
          const ok = await contentStoreAddWiki(article);
          if (!ok) setDbSaveError('Не удалось сохранить статью вики');
        } else {
          await persist('wiki', [...wikiRef.current, article]);
        }
      })();
    },
    updateWikiArticle:(id,u)=>{
      const next = wikiRef.current.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x);
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
    },
    deleteWikiArticle:(id)=>{
      const prev = wikiRef.current;
      const next = prev.filter(x => x.id !== id);
      setWikiArticles(next);
      void (async () => {
        if (await contentStoreUsesNormalized('wiki')) {
          const ok = await contentStoreDeleteWiki(id);
          if (!ok) { setWikiArticles(prev); setDbSaveError('Не удалось удалить статью вики'); }
        } else {
          await persist('wiki', next);
        }
      })();
    },
    createTicket: async (s, m) => {
      if (!user) return 'Войдите в аккаунт';
      const dn = getDisplayName(user);
      const ticket: SupportTicket = {
        id: 't' + Date.now(), userId: user.id, userName: dn, subject: s.trim(), message: m.trim(),
        status: 'open', createdAt: new Date().toISOString(), replies: [],
      };
      const prev = supportRef.current;
      const next = [...prev, ticket];
      setSupportTickets(next);
      const err = await persist('support', next);
      if (err) { setSupportTickets(prev); return err; }
      return null;
    },
    replyToTicket: async (id, m) => {
      if (!user) return 'Войдите в аккаунт';
      const dn = getDisplayName(user);
      const rc = getRoleConfig(user.role).displayName;
      const prev = supportRef.current;
      const next = prev.map(x => x.id === id ? {
        ...x, status: 'answered' as const,
        replies: [...x.replies, { id: 'r' + Date.now(), authorName: dn, authorRole: rc, message: m.trim(), createdAt: new Date().toISOString() }],
      } : x);
      setSupportTickets(next);
      const err = await persist('support', next);
      if (err) { setSupportTickets(prev); return err; }
      return null;
    },
    closeTicket: async (id) => {
      const prev = supportRef.current;
      const next = prev.map(x => x.id === id ? { ...x, status: 'closed' as const } : x);
      setSupportTickets(next);
      const err = await persist('support', next);
      if (err) { setSupportTickets(prev); return err; }
      return null;
    },
    deleteTicket: async (id) => {
      const prev = supportRef.current;
      const next = prev.filter(x => x.id !== id);
      setSupportTickets(next);
      const err = await persist('support', next);
      if (err) { setSupportTickets(prev); return err; }
      return null;
    },
    sendMessage: async (text) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = chatRef.current;
      if (prev.mutedUsers.some(m => m.userId === user.id && Date.now() < m.until)) {
        return 'Вы не можете писать в чат (ограничение)';
      }
      const dn = getDisplayName(user);
      const message: ChatMessage = {
        id: 'm' + Date.now(), userId: user.id, userName: dn, userRole: user.role,
        text: text.trim(), timestamp: Date.now(),
      };
      const next: ChatState = {
        ...prev,
        messages: trimChatMessages([...prev.messages, message]),
      };
      setChatState(next);
      if (await contentStoreUsesNormalized('chat')) {
        const { error } = await contentStoreSendChatMessage(message, prev);
        if (error) { setChatState(prev); return error; }
      } else {
        scheduleChatPersist(next);
      }
      return null;
    },
    deleteMessage: async (id) => {
      const prev = chatRef.current;
      const next: ChatState = {
        ...prev,
        messages: prev.messages.map(x => x.id === id ? { ...x, deleted: true } : x),
      };
      setChatState(next);
      if (chatPersistTimer.current) clearTimeout(chatPersistTimer.current);
      if (await contentStoreUsesNormalized('chat')) {
        const { error } = await contentStoreDeleteChatMessage(id, prev);
        if (error) { setChatState(prev); return error; }
      } else {
        const err = await persist('chat', next);
        if (err) { setChatState(prev); return err; }
      }
      return null;
    },
    muteUser: async (uid, minutes) => {
      const prev = chatRef.current;
      const until = Date.now() + minutes * 60000;
      const next: ChatState = {
        ...prev,
        mutedUsers: [...prev.mutedUsers.filter(m => m.userId !== uid), { userId: uid, until }],
      };
      setChatState(next);
      if (await contentStoreUsesNormalized('chat')) {
        return contentStoreMuteUser(uid, until, prev).then(r => r.error || null);
      }
      return persist('chat', next);
    },
    unmuteUser: async (uid) => {
      const prev = chatRef.current;
      const next: ChatState = { ...prev, mutedUsers: prev.mutedUsers.filter(m => m.userId !== uid) };
      setChatState(next);
      if (await contentStoreUsesNormalized('chat')) {
        return contentStoreUnmuteUser(uid, prev).then(r => r.error || null);
      }
      return persist('chat', next);
    },
    isUserMuted:(uid)=>chatState.mutedUsers.some(m=>m.userId===uid&&Date.now()<m.until),
    chatBanUser:(uid)=>{ muteUser(uid, 60*24*7); },
    sendPrivateMessage, markPMRead, deletePrivateMessageForMe, deletePrivateMessageForAll,
    deletePmDialogForMe, deletePmDialogForAll,
    addGuideComment: async (guideId, text) => {
      if (!user) return 'Войдите в аккаунт';
      const c: GuideComment = {
        id: 'gc' + Date.now(), guideId, userId: user.id, userName: getDisplayName(user),
        text: text.trim(), createdAt: new Date().toISOString(), likes: [],
      };
      const prev = guideCommentsRef.current;
      const next = [...prev, c];
      setGuideComments(next);
      if (await contentStoreUsesNormalized('comments')) {
        const ok = await contentStoreAddGuideComment(c);
        if (!ok) { setGuideComments(prev); return 'Не удалось сохранить комментарий'; }
      } else {
        const err = await persist('guide_comments', next);
        if (err) { setGuideComments(prev); return err; }
      }
      return null;
    },
    deleteGuideComment: (id) => {
      const prev = guideCommentsRef.current;
      const next = prev.filter(x => x.id !== id);
      setGuideComments(next);
      void (async () => {
        if (await contentStoreUsesNormalized('comments')) {
          const ok = await contentStoreDeleteGuideComment(id);
          if (!ok) { setGuideComments(prev); setDbSaveError('Не удалось удалить комментарий'); }
        } else {
          await persist('guide_comments', next);
        }
      })();
    },
    toggleGuideCommentLike: async (commentId) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = guideCommentsRef.current;
      const next = prev.map(c => {
        if (c.id !== commentId) return c;
        const likes = c.likes || [];
        const has = likes.includes(user.id);
        return { ...c, likes: has ? likes.filter(uid => uid !== user.id) : [...likes, user.id] };
      });
      setGuideComments(next);
      if (await contentStoreUsesNormalized('comments')) {
        return contentStoreSaveGuideCommentsAll(next).then(r => r.error || null);
      }
      return persist('guide_comments', next);
    },
    toggleSiteNewsLike: async (newsId) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = siteNewsRef.current;
      const next = prev.map(n => {
        if (n.id !== newsId) return n;
        const likes = n.likes || [];
        const has = likes.includes(user.id);
        return { ...n, likes: has ? likes.filter(uid => uid !== user.id) : [...likes, user.id] };
      });
      setSiteNews(next);
      const err = await persist('site_news', next);
      if (err) { setSiteNews(prev); return err; }
      return null;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){const c=useContext(AuthContext); if(!c)throw new Error('useAuth'); return c;}

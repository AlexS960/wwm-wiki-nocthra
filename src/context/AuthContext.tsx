import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { dbGetAccountByUsername, dbCreateAccount, dbUpdateAccount, dbDeleteAccount, dbLoadProgress, dbSaveProgress, dbInit, dbLoadSiteData, dbSaveSiteData, dbListAccounts } from '../lib/db';
import { subscribeSiteData, subscribeAccounts, subscribeUserProgress } from '../lib/realtime';
import { getDisplayName, formatLastSeen, isOnlineByLastSeen } from '../lib/displayName';
import { verifyPassword, hashPassword, isPasswordHashed } from '../lib/password';
import { type PrivateMessage } from '../lib/pm';
import {
  pmDeleteForAll,
  pmDeleteDialogForAll,
  pmHideForUser,
  pmInsertMessage,
  pmLoadInboxPreview,
  pmLoadThread,
  pmMarkRead,
  pmMigrateLegacyFromSiteData,
  pmTableExists,
} from '../lib/pmDb';
import { subscribePmMessages } from '../lib/pmRealtime';
import { trimChatMessages, CHAT_PERSIST_DEBOUNCE_MS } from '../lib/chat';
import {
  sanitizeGuides,
  sanitizeGuideVersions,
  sanitizeGuildAvatar,
  sanitizePictureField,
  sanitizeSiteDataPayload,
  sanitizeSiteNews,
  sanitizeWiki,
} from '../lib/siteImages';

export type { PrivateMessage };

const MAX_GUIDE_VERSIONS = 15;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export interface GuildData {
  name: string; subtitle: string; motto: string; description: string; avatar: string;
  info: { label: string; value: string }[]; activities: string[];
}

export const defaultGuild: GuildData = {
  name: 'NOCTHRA',
  subtitle: 'Гильдия Where Winds Meet',
  motto: '«Во тьме мы обретаем силу»',
  description:
    'Nocthra — русскоязычная гильдия в мире Where Winds Meet. Мы объединяем опытных воинов и новичков, проходим контент вместе и создаём сообщество, где каждый может найти своё место в Цзянху.',
  avatar: '',
  info: [
    { label: 'Сообщество', value: 'Русскоязычное' },
    { label: 'Активности', value: 'PvE, PvP, Рейды' },
    { label: 'Уровень', value: 'Все уровни' },
    { label: 'Основание', value: '24.04.2026' },
  ],
  activities: [
    'Совместное прохождение рейдов и ивентов',
    'Помощь новичкам в освоении игры',
    'PvP-турниры и тренировки',
    'Обмен знаниями и билдами',
    'Ведение базы знаний для гильдии',
  ],
};

export interface SiteNewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  icon: string;
  images?: string[];
  likes?: string[];
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = string;
export interface User { id: string; email: string; name: string; picture: string; gameNickname?: string; role: UserRole; }
export interface GuideArticle {
  id: string; title: string; category: string; difficulty: string; readTime: string;
  summary: string; content: string; authorName: string; updatedAt: string; icon: string;
  images?: string[];
}
export interface GuideComment {
  id: string; guideId: string; userId: string; userName: string; text: string; createdAt: string;
  likes?: string[];
}
export interface GuideVersion {
  id: string; guideId: string;
  title: string; summary: string; content: string; category: string;
  difficulty: string; readTime: string; icon: string; images?: string[];
  savedAt: string; savedBy: string;
}
export interface UserProgress { completedGuides: string[]; favoriteWeapons: string[]; favoriteSects: string[]; visitedRegions: string[]; notes: { id: string; title: string; content: string; date: string }[]; selectedBuild: string | null; }
export interface RegisteredUser { id: string; email: string; name: string; picture: string; gameNickname?: string; role: UserRole; joinedAt: string; lastSeen: string; lastSeenAt: string | null; isBanned: boolean; chatBanned?: boolean; }
export interface PmSettings { notificationSound: boolean; soundUrl: string; }
export interface RoleConfig { id: UserRole; displayName: string; color: string; permissions: string[]; }
export interface ChatMessage { id: string; userId: string; userName: string; userRole: string; text: string; timestamp: number; deleted?: boolean; }
export interface ChatState { messages: ChatMessage[]; mutedUsers: { userId: string; until: number }[]; }
export interface SiteSettings { siteName: string; siteDescription: string; discordUrl: string; maintenanceMode: boolean; announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[]; roles: RoleConfig[]; sections: {id:string;title:string;maintenance:boolean;message:string}[]; pmSettings: PmSettings; riddlesHiddenIds?: string[]; sectionOverrides?: Record<string, unknown>; }
export interface WikiArticle {
  id: string; section: string; title: string; content: string; icon: string;
  authorName: string; updatedAt: string; fields: Record<string, string>;
  images?: string[];
}
export interface SupportTicket { id: string; userId: string; userName: string; subject: string; message: string; status: 'open'|'answered'|'closed'; createdAt: string; replies: {id:string;authorName:string;authorRole:string;message:string;createdAt:string}[]; }
interface Ctx {
  user: User|null; progress: UserProgress; guides: GuideArticle[]; guideComments: GuideComment[]; guideVersions: GuideVersion[];
  registeredUsers: RegisteredUser[]; siteSettings: SiteSettings; isLoading: boolean;
  wikiArticles: WikiArticle[]; supportTickets: SupportTicket[]; chatState: ChatState; privateMessages: PrivateMessage[]; unreadPMCount: number;
  dbSaveError: string | null; clearDbSaveError: () => void;
  guild: GuildData; discordUrl: string; siteNews: SiteNewsItem[];
  updateGuild: (g: GuildData) => void; updateDiscordUrl: (url: string) => void;
  addSiteNews: (n: Omit<SiteNewsItem, 'id' | 'authorName' | 'createdAt' | 'updatedAt'>) => void;
  updateSiteNews: (id: string, u: Partial<SiteNewsItem>) => void;
  deleteSiteNews: (id: string) => void;
  loginWithPassword: (u:string,p:string,r:boolean)=>Promise<string|null>; register:(u:string,p:string,g?:string)=>Promise<string|null>; logout:()=>void;
  updateProgress: (u:Partial<UserProgress>)=>void; toggleFavoriteWeapon:(id:string)=>void; toggleFavoriteSect:(id:string)=>void; toggleCompletedGuide:(id:string)=>void;
  addNote:(t:string,c:string)=>void; deleteNote:(id:string)=>void; setSelectedBuild:(id:string|null)=>void;
  updateUserPicture:(p:string)=>void; updateUserGameNickname:(n:string)=>void;
  addGuide:(g:any)=>void; updateGuide:(id:string,u:any)=>Promise<void>; deleteGuide:(id:string)=>void;
  isAdmin:()=>boolean; isEditor:()=>boolean; adminSetUserRole:(id:string,r:string)=>void; adminBanUser:(id:string,b:boolean)=>void; adminDeleteUser:(id:string)=>void;
  updateSiteSettings:(u:any)=>void; addAnnouncement:(t:string,ty:any)=>void; removeAnnouncement:(id:string)=>void;
  getRoleConfig:(r:string)=>RoleConfig; hasPermission:(p:string)=>boolean;
  updateRoleDisplayName:(id:string,n:string)=>void; updateRoleColor:(id:string,c:string)=>void; addRole:(n:string,c:string,p:string[])=>void; deleteRole:(id:string)=>void; updateRolePermissions:(id:string,p:string[])=>void;
  addWikiArticle:(a:any)=>void; updateWikiArticle:(id:string,u:any)=>void; deleteWikiArticle:(id:string)=>void;
  sendMessage:(t:string)=>Promise<string|null>; deleteMessage:(id:string)=>Promise<string|null>;
  createTicket:(s:string,m:string)=>Promise<string|null>;
  replyToTicket:(id:string,m:string)=>Promise<string|null>;
  closeTicket:(id:string)=>Promise<string|null>;
  deleteTicket:(id:string)=>Promise<string|null>;
  muteUser:(id:string,m:number)=>void; unmuteUser:(id:string)=>void; isUserMuted:(id:string)=>boolean; chatBanUser:(id:string)=>void;
  sendPrivateMessage:(toId:string,text:string)=>Promise<string|null>;
  markPMRead:(partnerId:string)=>void;
  deletePrivateMessageForMe:(messageId:string)=>Promise<string|null>;
  deletePrivateMessageForAll:(messageId:string)=>Promise<string|null>;
  deletePmDialogForMe:(partnerId:string)=>Promise<string|null>;
  deletePmDialogForAll:(partnerId:string)=>Promise<string|null>;
  pmLoaded: boolean;
  loadPmThread:(partnerId:string)=>Promise<void>;
  guidesLoaded: boolean;
  chatLoaded: boolean;
  accountsLoaded: boolean;
  ensureGuidesLoaded: () => Promise<void>;
  ensureChatLoaded: () => Promise<void>;
  ensureAccountsLoaded: () => Promise<void>;
  addGuideComment:(guideId:string,text:string)=>Promise<string|null>;
  deleteGuideComment:(id:string)=>void;
  toggleGuideCommentLike:(commentId:string)=>Promise<string|null>;
  toggleSiteNewsLike:(newsId:string)=>Promise<string|null>;
  getGuideVersions:(guideId:string)=>GuideVersion[];
  restoreGuideVersion:(guideId:string,versionId:string)=>Promise<string|null>;
  isUserOnline:(id:string)=>boolean;
  getUserDisplayName:(id:string,fallback?:string)=>string;
  updatePmSettings:(s:Partial<PmSettings>)=>void;
  wikiLoaded: boolean;
  supportLoaded: boolean;
  guideMetaLoaded: boolean;
  ensureWikiLoaded: () => Promise<void>;
  ensureSupportLoaded: () => Promise<void>;
  ensureGuideMetaLoaded: () => Promise<void>;
  purgeEmbeddedImagesFromDb: () => Promise<string | null>;
}

const defP: UserProgress = { completedGuides:[],favoriteWeapons:[],favoriteSects:[],visitedRegions:[],notes:[],selectedBuild:null };
const defS: SiteSettings = {
  siteName:'WWM Вики Ру — Nocthra',siteDescription:'База знаний',discordUrl:'https://discord.gg/nocthra',maintenanceMode:false,announcements:[],
  pmSettings:{ notificationSound:true, soundUrl:'' },
  sectionOverrides: {},
  roles:[
    {id:'user',displayName:'Странник',color:'#b0a696',permissions:['read','profile','favorites','chat.write']},
    {id:'moderator',displayName:'Модератор',color:'#4abf85',permissions:['read','profile','favorites','chat.write','chat.delete','chat.mute','support.view_all','support.reply','support.close']},
    {id:'guildmaster',displayName:'Гильдмастер',color:'#d4a528',permissions:['read','profile','favorites','chat.write','chat.delete','chat.mute','chat.ban','support.view_all','support.reply','support.close','support.delete','guides.create','guides.edit','guild.edit']},
    {id:'admin',displayName:'Администратор',color:'#a882ff',permissions:['read','profile','favorites','chat.write','chat.delete','chat.mute','chat.ban','support.view_all','support.reply','support.close','support.delete','guides.create','guides.edit','guides.delete','guild.edit','users.manage','users.ban','users.roles','site.settings','site.announcements','admin.panel']},
  ],
  sections:[{id:'guides',title:'Гайды',maintenance:false,message:'...'}],
};

const AuthContext = createContext<Ctx|null>(null);

export function AuthProvider({children}:{children:ReactNode}) {
  const [user,setUser] = useState<User|null>(()=>{
    try { const s=localStorage.getItem('wwm_user'); return s?JSON.parse(s):null; } catch { return null; }
  });
  const [progress,setProgress] = useState<UserProgress>(defP);
  const [guides,setGuides] = useState<GuideArticle[]>([]);
  const [registeredUsers,setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [siteSettings,setSiteSettings] = useState<SiteSettings>(defS);
  const [chatState,setChatState] = useState<ChatState>({messages:[],mutedUsers:[]});
  const [wikiArticles,setWikiArticles] = useState<WikiArticle[]>([]);
  const [supportTickets,setSupportTickets] = useState<SupportTicket[]>([]);
  const [privateMessages,setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [pmLoaded, setPmLoaded] = useState(false);
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
  const pmRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guidesLoadRef = useRef<Promise<void> | null>(null);
  const chatLoadRef = useRef<Promise<void> | null>(null);
  const accountsLoadRef = useRef<Promise<void> | null>(null);
  const [guild,setGuild] = useState<GuildData>(defaultGuild);
  const [discordUrl,setDiscordUrl] = useState('https://discord.com/invite/mYqKkN3u4');
  const [siteNews,setSiteNews] = useState<SiteNewsItem[]>([]);
  const [guideComments,setGuideComments] = useState<GuideComment[]>([]);
  const [guideVersions,setGuideVersions] = useState<GuideVersion[]>([]);
  const [dbSaveError,setDbSaveError] = useState<string | null>(null);
  const [isLoading,setIsLoading] = useState(true);

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
      case 'guides': setGuides(sanitizeGuides(asArray<GuideArticle>(value))); break;
      case 'site_settings': if (value) setSiteSettings(mergeSiteSettings(value as SiteSettings)); break;
      case 'chat': setChatState(value as ChatState); break;
      case 'wiki': setWikiArticles(sanitizeWiki(asArray<WikiArticle>(value))); setWikiLoaded(true); break;
      case 'support': setSupportTickets(asArray<SupportTicket>(value)); setSupportLoaded(true); break;
      case 'pm': break; /* ЛС в таблице pm_messages, не в site_data */
      case 'guild': setGuild(sanitizeGuildAvatar(value as GuildData)); break;
      case 'discord_url': setDiscordUrl(typeof value === 'string' ? value : String(value)); break;
      case 'site_news': setSiteNews(sanitizeSiteNews(asArray<SiteNewsItem>(value))); break;
      case 'guide_comments': setGuideComments(asArray<GuideComment>(value)); setGuideMetaLoaded(true); break;
      case 'guide_versions': setGuideVersions(sanitizeGuideVersions(asArray<GuideVersion>(value))); setGuideMetaLoaded(true); break;
    }
  }, [mergeSiteSettings]);

  const dataReady = useRef(false);
  const chatRef = useRef(chatState);
  const supportRef = useRef(supportTickets);
  const pmRef = useRef(privateMessages);
  const guideCommentsRef = useRef(guideComments);
  const siteNewsRef = useRef(siteNews);

  chatRef.current = chatState;
  supportRef.current = supportTickets;
  pmRef.current = privateMessages;
  guideCommentsRef.current = guideComments;
  siteNewsRef.current = siteNews;

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
  }, []);

  const refreshPrivateMessages = useCallback(async () => {
    if (!user) {
      setPrivateMessages([]);
      setPmLoaded(true);
      return;
    }
    try {
      const ok = await pmTableExists();
      if (!ok) {
        setDbSaveError('Таблица pm_messages не найдена. Выполните supabase/pm-messages-setup.sql в Supabase SQL Editor.');
        setPmLoaded(true);
        return;
      }
      await pmMigrateLegacyFromSiteData();
      const msgs = await pmLoadInboxPreview(user.id);
      setPrivateMessages(msgs);
      setPmLoaded(true);
    } catch (e) {
      console.error('[pm] load', e);
      setDbSaveError(e instanceof Error ? e.message : 'Ошибка загрузки личных сообщений');
      setPmLoaded(true);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isLoading) return;
    void refreshPrivateMessages();
  }, [isLoading, refreshPrivateMessages]);

  const schedulePmRefresh = useCallback(() => {
    if (pmRefreshTimer.current) clearTimeout(pmRefreshTimer.current);
    pmRefreshTimer.current = setTimeout(() => {
      pmRefreshTimer.current = null;
      void refreshPrivateMessages();
    }, 800);
  }, [refreshPrivateMessages]);

  const loadPmThread = useCallback(async (partnerId: string) => {
    if (!user) return;
    try {
      const thread = await pmLoadThread(user.id, partnerId);
      setPrivateMessages(prev => {
        const rest = prev.filter(m =>
          !((m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id)),
        );
        return [...rest, ...thread].sort((a, b) => a.timestamp - b.timestamp);
      });
    } catch (e) {
      console.error('[pm] thread', e);
    }
  }, [user?.id]);

  const ensureGuidesLoaded = useCallback(async () => {
    if (guidesLoaded) return;
    if (!guidesLoadRef.current) {
      guidesLoadRef.current = (async () => {
        const g = await dbLoadSiteData('guides', []);
        setGuides(sanitizeGuides(asArray<GuideArticle>(g)));
        setGuidesLoaded(true);
      })();
    }
    await guidesLoadRef.current;
  }, [guidesLoaded]);

  const ensureChatLoaded = useCallback(async () => {
    if (chatLoaded) return;
    if (!chatLoadRef.current) {
      chatLoadRef.current = (async () => {
        const c = await dbLoadSiteData('chat', { messages: [], mutedUsers: [] });
        setChatState(c as ChatState);
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

    const refreshAccounts = async () => {
      try {
        const accs = await dbListAccounts();
        setRegisteredUsers(mapAccounts(accs));
      } catch {}
    };

    const unsubSite = subscribeSiteData(applySiteDataKey);
    const unsubAccounts = subscribeAccounts(refreshAccounts);
    const unsubPm = user ? subscribePmMessages(schedulePmRefresh) : () => {};

    return () => {
      unsubSite();
      unsubAccounts();
      unsubPm();
    };
  }, [isLoading, applySiteDataKey, mapAccounts, user?.id, schedulePmRefresh]);

  useEffect(() => {
    if (!user) return;
    return subscribeUserProgress(user.id, (data) => {
      if (data) setProgress(data as UserProgress);
    });
  }, [user?.id]);

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
    const payload = sanitizeSiteDataPayload('chat', chatRef.current);
    return dbSaveSiteData('chat', payload);
  }, []);

  const scheduleChatPersist = useCallback((next: ChatState) => {
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
        const w = await dbLoadSiteData('wiki', []);
        setWikiArticles(sanitizeWiki(asArray<WikiArticle>(w)));
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
        const [comments, versions] = await Promise.all([
          dbLoadSiteData('guide_comments', []),
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


  const loginWithPassword = async(u:string,p:string,remember:boolean) => {
    const acc = await dbGetAccountByUsername(u);
    if (!acc) return 'Неверный логин или пароль';
    const ok = await verifyPassword(p, acc.password_hash);
    if (!ok) return 'Неверный логин или пароль';
    if (!isPasswordHashed(acc.password_hash)) {
      const hashed = await hashPassword(p);
      void dbUpdateAccount(acc.id, { password_hash: hashed });
    }
    const ud:User = {id:acc.id,email:'',name:acc.username,picture:acc.picture||'',gameNickname:acc.game_nickname||'',role:acc.role};
    setUser(ud); if(remember) localStorage.setItem('wwm_user',JSON.stringify(ud));
    void dbUpdateAccount(acc.id, { last_seen: new Date().toISOString() });
    const pr = await dbLoadProgress(acc.id); if(pr) setProgress(pr);
    return null;
  };

  const register = async(u:string,p:string,gn='') => {
    const existing = await dbGetAccountByUsername(u);
    if (existing) return 'Такой логин уже занят';
    const res = await dbCreateAccount(u,p,gn);
    if('error' in res) return res.error;
    const ud:User = {id:res.id,email:'',name:res.username,picture:'',gameNickname:res.game_nickname||'',role:'user'};
    setUser(ud); localStorage.setItem('wwm_user',JSON.stringify(ud));
    return null;
  };

  const updateProgress = (u:any) => { setProgress(prev=>{ const n={...prev,...u}; if(user) dbSaveProgress(user.id,n); return n; }); };
  const getRoleConfig = (r:string) => siteSettings.roles.find(x=>x.id===r) || siteSettings.roles[0];

  const value: Ctx = {
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
    unreadPMCount: privateMessages.filter(x=>x.toId===user?.id&&!x.read&&!x.deletedForAll&&!x.hiddenFor?.includes(user?.id||'')).length,
    loginWithPassword, register, logout:()=>{ setUser(null); localStorage.removeItem('wwm_user'); },
    updateProgress,
    toggleFavoriteWeapon:(id)=>updateProgress({favoriteWeapons:progress.favoriteWeapons.includes(id)?progress.favoriteWeapons.filter(x=>x!==id):[...progress.favoriteWeapons,id]}),
    toggleFavoriteSect:(id)=>updateProgress({favoriteSects:progress.favoriteSects.includes(id)?progress.favoriteSects.filter(x=>x!==id):[...progress.favoriteSects,id]}),
    toggleCompletedGuide:(id)=>updateProgress({completedGuides:progress.completedGuides.includes(id)?progress.completedGuides.filter(x=>x!==id):[...progress.completedGuides,id]}),
    addNote:(t,c)=>updateProgress({notes:[{id:'n'+Date.now(),title:t,content:c,date:new Date().toLocaleDateString()},...progress.notes]}),
    deleteNote:(id)=>updateProgress({notes:progress.notes.filter(x=>x.id!==id)}),
    setSelectedBuild:(id)=>updateProgress({selectedBuild:id}),
    updateUserPicture:(p)=>{
      if(!user) return;
      const clean = sanitizePictureField(p);
      if(p.trim() && !clean) {
        setDbSaveError('Аватар: используйте ссылку https://… или загрузку в Storage, не base64.');
        return;
      }
      setUser({...user,picture:clean});
      void dbUpdateAccount(user.id,{picture:clean});
    },
    updateUserGameNickname:(n)=>{if(user){setUser({...user,gameNickname:n});dbUpdateAccount(user.id,{game_nickname:n});}},
    addGuide:(g)=>saveSite('guides', prev=>[{...g,id:'g'+Date.now(),authorName:user?.name||'',updatedAt:new Date().toISOString()},...prev],setGuides),
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
      await persist('guides', nextGuides);
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
      return persist('guides', nextGuides);
    },
    deleteGuide:(id)=>saveSite('guides', prev=>prev.filter(x=>x.id!==id),setGuides),
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
      const results = await Promise.all([
        persist('guides', cleanGuides),
        wikiLoaded ? persist('wiki', cleanWiki) : Promise.resolve(null),
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
    addWikiArticle:(a)=>saveSite('wiki', prev=>[...prev,{...a,id:'w'+Date.now(),authorName:user?.name||'',updatedAt:new Date().toLocaleDateString('ru-RU')}],setWikiArticles),
    updateWikiArticle:(id,u)=>saveSite('wiki', prev=>prev.map(x=>x.id===id?{...x,...u,updatedAt:new Date().toISOString()}:x),setWikiArticles),
    deleteWikiArticle:(id)=>saveSite('wiki', prev=>prev.filter(x=>x.id!==id),setWikiArticles),
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
      const next: ChatState = {
        ...prev,
        messages: trimChatMessages([...prev.messages, {
          id: 'm' + Date.now(), userId: user.id, userName: dn, userRole: user.role,
          text: text.trim(), timestamp: Date.now(),
        }]),
      };
      setChatState(next);
      scheduleChatPersist(next);
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
      const err = await persist('chat', next);
      if (err) { setChatState(prev); return err; }
      return null;
    },
    muteUser: async (uid, minutes) => {
      const prev = chatRef.current;
      const next: ChatState = {
        ...prev,
        mutedUsers: [...prev.mutedUsers.filter(m => m.userId !== uid), { userId: uid, until: Date.now() + minutes * 60000 }],
      };
      setChatState(next);
      return persist('chat', next);
    },
    unmuteUser: async (uid) => {
      const prev = chatRef.current;
      const next: ChatState = { ...prev, mutedUsers: prev.mutedUsers.filter(m => m.userId !== uid) };
      setChatState(next);
      return persist('chat', next);
    },
    isUserMuted:(uid)=>chatState.mutedUsers.some(m=>m.userId===uid&&Date.now()<m.until),
    chatBanUser:(uid)=>{ muteUser(uid, 60*24*7); },
    sendPrivateMessage: async (toId, text) => {
      if (!user) return 'Войдите в аккаунт';
      if (!toId?.trim() || !text?.trim()) return 'Укажите получателя и текст';
      const dn = getDisplayName(user);
      const target = registeredUsers.find(u => u.id === toId);
      const toDn = target ? getDisplayName(target) : '';
      const msg: PrivateMessage = {
        id: 'p' + Date.now() + Math.random().toString(36).slice(2, 6),
        fromId: user.id, fromName: dn, toId, toName: toDn,
        text: text.trim(), timestamp: Date.now(), read: false,
      };
      const prev = pmRef.current;
      setPrivateMessages([...prev, msg]);
      const { error } = await pmInsertMessage(msg);
      if (error) {
        setPrivateMessages(prev);
        return error;
      }
      return null;
    },
    markPMRead: async (partnerId) => {
      if (!user) return;
      const prev = pmRef.current;
      const hasUnread = prev.some(x => x.fromId === partnerId && x.toId === user.id && !x.read);
      if (!hasUnread) return;
      setPrivateMessages(prev.map(x =>
        x.fromId === partnerId && x.toId === user.id ? { ...x, read: true } : x,
      ));
      const { error } = await pmMarkRead(user.id, partnerId);
      if (error) {
        setPrivateMessages(prev);
        setDbSaveError(error);
      }
    },
    deletePrivateMessageForMe: async (messageId) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = pmRef.current;
      const msg = prev.find(m => m.id === messageId);
      if (!msg) return null;
      if (msg.hiddenFor?.includes(user.id)) return null;
      const next = prev.map(m =>
        m.id !== messageId ? m : { ...m, hiddenFor: [...(m.hiddenFor || []), user.id] },
      );
      setPrivateMessages(next);
      const { error } = await pmHideForUser(messageId, user.id);
      if (error) { setPrivateMessages(prev); return error; }
      return null;
    },
    deletePrivateMessageForAll: async (messageId) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = pmRef.current;
      const msg = prev.find(m => m.id === messageId);
      if (!msg) return null;
      const next = prev.map(m =>
        m.id === messageId ? { ...m, deletedForAll: true, text: '' } : m,
      );
      setPrivateMessages(next);
      const { error } = await pmDeleteForAll(messageId, user.id);
      if (error) { setPrivateMessages(prev); return error; }
      return null;
    },
    deletePmDialogForMe: async (partnerId) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = pmRef.current;
      const thread = prev.filter(m =>
        (m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id),
      );
      for (const m of thread) {
        const { error } = await pmHideForUser(m.id, user.id);
        if (error) return error;
      }
      setPrivateMessages(prev.map(m =>
        ((m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id))
          ? { ...m, hiddenFor: [...(m.hiddenFor || []), user.id] }
          : m,
      ));
      return null;
    },
    deletePmDialogForAll: async (partnerId) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = pmRef.current;
      const { error } = await pmDeleteDialogForAll(user.id, partnerId);
      if (error) return error;
      setPrivateMessages(prev.map(m =>
        ((m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id))
          ? { ...m, deletedForAll: true, text: '' }
          : m,
      ));
      return null;
    },
    addGuideComment: async (guideId, text) => {
      if (!user) return 'Войдите в аккаунт';
      const c: GuideComment = {
        id: 'gc' + Date.now(), guideId, userId: user.id, userName: getDisplayName(user),
        text: text.trim(), createdAt: new Date().toISOString(), likes: [],
      };
      const prev = guideCommentsRef.current;
      const next = [...prev, c];
      setGuideComments(next);
      const err = await persist('guide_comments', next);
      if (err) { setGuideComments(prev); return err; }
      return null;
    },
    deleteGuideComment: (id) => saveSite('guide_comments', prev => prev.filter(x => x.id !== id), setGuideComments),
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

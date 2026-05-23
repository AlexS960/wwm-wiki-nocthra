import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import { dbGetAccountByUsername, dbCreateAccount, dbUpdateAccount, dbDeleteAccount, dbLoadProgress, dbSaveProgress, dbInit, dbLoadSiteData, dbSaveSiteData, dbListAccounts } from '../lib/db';
import { subscribeSiteData, subscribeAccounts, subscribeUserProgress } from '../lib/realtime';
import { getDisplayName, formatLastSeen, isOnlineByLastSeen } from '../lib/displayName';
import { verifyPassword, hashPassword, isPasswordHashed } from '../lib/password';

const MAX_GUIDE_VERSIONS = 15;

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
export interface SiteSettings { siteName: string; siteDescription: string; discordUrl: string; maintenanceMode: boolean; announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[]; roles: RoleConfig[]; sections: {id:string;title:string;maintenance:boolean;message:string}[]; pmSettings: PmSettings; }
export interface WikiArticle {
  id: string; section: string; title: string; content: string; icon: string;
  authorName: string; updatedAt: string; fields: Record<string, string>;
  images?: string[];
}
export interface SupportTicket { id: string; userId: string; userName: string; subject: string; message: string; status: 'open'|'answered'|'closed'; createdAt: string; replies: {id:string;authorName:string;authorRole:string;message:string;createdAt:string}[]; }
export interface PrivateMessage { id: string; fromId: string; fromName: string; toId: string; toName: string; text: string; timestamp: number; read: boolean; }

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
  createTicket:(s:string,m:string)=>void; replyToTicket:(id:string,m:string)=>void; closeTicket:(id:string)=>void; deleteTicket:(id:string)=>void;
  sendMessage:(t:string)=>void; deleteMessage:(id:string)=>void;
  muteUser:(id:string,m:number)=>void; unmuteUser:(id:string)=>void; isUserMuted:(id:string)=>boolean; chatBanUser:(id:string)=>void;
  sendPrivateMessage:(toId:string,text:string)=>Promise<string|null>;
  markPMRead:(partnerId:string)=>void;
  addGuideComment:(guideId:string,text:string)=>Promise<string|null>;
  deleteGuideComment:(id:string)=>void;
  toggleGuideCommentLike:(commentId:string)=>Promise<string|null>;
  getGuideVersions:(guideId:string)=>GuideVersion[];
  restoreGuideVersion:(guideId:string,versionId:string)=>Promise<string|null>;
  isUserOnline:(id:string)=>boolean;
  getUserDisplayName:(id:string,fallback?:string)=>string;
  updatePmSettings:(s:Partial<PmSettings>)=>void;
}

const defP: UserProgress = { completedGuides:[],favoriteWeapons:[],favoriteSects:[],visitedRegions:[],notes:[],selectedBuild:null };
const defS: SiteSettings = {
  siteName:'WWM Wiki — Nocthra',siteDescription:'База знаний',discordUrl:'https://discord.gg/nocthra',maintenanceMode:false,announcements:[],
  pmSettings:{ notificationSound:true, soundUrl:'' },
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
    return { ...defS, ...s, pmSettings: { ...defS.pmSettings, ...(s.pmSettings || {}) } };
  }, []);

  const applySiteDataKey = useCallback((key: string, value: unknown) => {
    switch (key) {
      case 'guides': setGuides(value as GuideArticle[]); break;
      case 'site_settings': if (value) setSiteSettings(mergeSiteSettings(value as SiteSettings)); break;
      case 'chat': setChatState(value as ChatState); break;
      case 'wiki': setWikiArticles((value as WikiArticle[]) || []); break;
      case 'support': setSupportTickets((value as SupportTicket[]) || []); break;
      case 'pm': setPrivateMessages((value as PrivateMessage[]) || []); break;
      case 'guild': setGuild(value as GuildData); break;
      case 'discord_url': setDiscordUrl(typeof value === 'string' ? value : String(value)); break;
      case 'site_news': setSiteNews((value as SiteNewsItem[]) || []); break;
      case 'guide_comments': setGuideComments((value as GuideComment[]) || []); break;
      case 'guide_versions': setGuideVersions((value as GuideVersion[]) || []); break;
    }
  }, [mergeSiteSettings]);

  const dataReady = useRef(false);

  // ====== INIT ======
  useEffect(() => {
    let active = true;
    (async () => {
      await dbInit();
      const [accs, g, s, c, w, t, pm, guildData, discord, news, comments, versions] = await Promise.all([
        dbListAccounts(), dbLoadSiteData('guides', []), dbLoadSiteData('site_settings', null),
        dbLoadSiteData('chat', { messages: [], mutedUsers: [] }), dbLoadSiteData('wiki', []),
        dbLoadSiteData('support', []), dbLoadSiteData('pm', []),
        dbLoadSiteData('guild', defaultGuild), dbLoadSiteData('discord_url', 'https://discord.com/invite/mYqKkN3u4'),
        dbLoadSiteData('site_news', []), dbLoadSiteData('guide_comments', []), dbLoadSiteData('guide_versions', []),
      ]);
      if (!active) return;
      setRegisteredUsers(mapAccounts(accs));
      setGuides(g); setSiteSettings(mergeSiteSettings(s as SiteSettings | null));
      setChatState(c); setWikiArticles(w || []); setSupportTickets(t || []); setPrivateMessages(pm || []);
      setGuild(guildData); setDiscordUrl(discord);
      setSiteNews((news as SiteNewsItem[]) || []);
      setGuideComments((comments as GuideComment[]) || []);
      setGuideVersions((versions as GuideVersion[]) || []);
      if (user) { const p = await dbLoadProgress(user.id); if (p && active) setProgress(p); }
      dataReady.current = true;
      setIsLoading(false);
    })();
    return () => { active = false; };
  }, []);

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

    const fallback = setInterval(async () => {
      if (!dataReady.current || document.visibilityState !== 'visible') return;
      try {
        const pm = await dbLoadSiteData<PrivateMessage[]>('pm', []);
        setPrivateMessages(pm || []);
      } catch {}
    }, 90000);

    return () => {
      unsubSite();
      unsubAccounts();
      clearInterval(fallback);
    };
  }, [isLoading, applySiteDataKey, mapAccounts]);

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
    const iv = setInterval(ping, 45_000);
    const onVis = () => { if (document.visibilityState === 'visible') ping(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', onVis); };
  }, [user?.id]);

  // ====== FUNCTIONS ======
  const persist = useCallback(async (key: string, data: unknown) => {
    const { error } = await dbSaveSiteData(key, data);
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
    const res = await dbCreateAccount(u,p,gn);
    if('error' in res) return res.error;
    const ud:User = {id:res.id,email:'',name:res.username,picture:'',gameNickname:res.game_nickname||'',role:'user'};
    setUser(ud); localStorage.setItem('wwm_user',JSON.stringify(ud));
    return null;
  };

  const updateProgress = (u:any) => { setProgress(prev=>{ const n={...prev,...u}; if(user) dbSaveProgress(user.id,n); return n; }); };
  const getRoleConfig = (r:string) => siteSettings.roles.find(x=>x.id===r) || siteSettings.roles[0];

  const value: Ctx = {
    user,progress,guides,guideComments,guideVersions,registeredUsers,siteSettings,isLoading,wikiArticles,supportTickets,chatState,privateMessages,
    guild, discordUrl, siteNews, dbSaveError, clearDbSaveError: () => setDbSaveError(null),
    updateGuild: (g) => { setGuild(g); void persist('guild', g); },
    updateDiscordUrl: (url) => { setDiscordUrl(url); void persist('discord_url', url); },
    addSiteNews: (n) => saveSite('site_news', prev => [{
      ...n, id: 'sn' + Date.now(), authorName: user?.name || 'Редактор',
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }, ...prev], setSiteNews),
    updateSiteNews: (id, u) => saveSite('site_news', prev => prev.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x), setSiteNews),
    deleteSiteNews: (id) => saveSite('site_news', prev => prev.filter(x => x.id !== id), setSiteNews),
    unreadPMCount: privateMessages.filter(x=>x.toId===user?.id&&!x.read).length,
    loginWithPassword, register, logout:()=>{ setUser(null); localStorage.removeItem('wwm_user'); },
    updateProgress,
    toggleFavoriteWeapon:(id)=>updateProgress({favoriteWeapons:progress.favoriteWeapons.includes(id)?progress.favoriteWeapons.filter(x=>x!==id):[...progress.favoriteWeapons,id]}),
    toggleFavoriteSect:(id)=>updateProgress({favoriteSects:progress.favoriteSects.includes(id)?progress.favoriteSects.filter(x=>x!==id):[...progress.favoriteSects,id]}),
    toggleCompletedGuide:(id)=>updateProgress({completedGuides:progress.completedGuides.includes(id)?progress.completedGuides.filter(x=>x!==id):[...progress.completedGuides,id]}),
    addNote:(t,c)=>updateProgress({notes:[{id:'n'+Date.now(),title:t,content:c,date:new Date().toLocaleDateString()},...progress.notes]}),
    deleteNote:(id)=>updateProgress({notes:progress.notes.filter(x=>x.id!==id)}),
    setSelectedBuild:(id)=>updateProgress({selectedBuild:id}),
    updateUserPicture:(p)=>{if(user){setUser({...user,picture:p});dbUpdateAccount(user.id,{picture:p});}},
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
    updateSiteSettings:(u)=>saveSite('site_settings', prev=>({...prev,...u}),setSiteSettings),
    addAnnouncement:(text,type)=>saveSite('site_settings', prev=>({...prev,announcements:[{id:'a'+Date.now(),text,type,active:true},...prev.announcements]}),setSiteSettings),
    removeAnnouncement:(id)=>saveSite('site_settings', prev=>({...prev,announcements:prev.announcements.filter(x=>x.id!==id)}),setSiteSettings),
    updateRoleDisplayName:(id,n)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.map(r=>r.id===id?{...r,displayName:n}:r)}),setSiteSettings),
    updateRoleColor:(id,c)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.map(r=>r.id===id?{...r,color:c}:r)}),setSiteSettings),
    addRole:(n,c,p)=>saveSite('site_settings', prev=>({...prev,roles:[...prev.roles,{id:'r'+Date.now(),displayName:n,color:c,permissions:p}]}),setSiteSettings),
    deleteRole:(id)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.filter(r=>r.id!==id)}),setSiteSettings),
    updateRolePermissions:(id,p)=>saveSite('site_settings', prev=>({...prev,roles:prev.roles.map(r=>r.id===id?{...r,permissions:p}:r)}),setSiteSettings),
    addWikiArticle:(a)=>saveSite('wiki', prev=>[{...a,id:'w'+Date.now(),authorName:user?.name||'',updatedAt:new Date().toISOString()},...prev],setWikiArticles),
    updateWikiArticle:(id,u)=>saveSite('wiki', prev=>prev.map(x=>x.id===id?{...x,...u,updatedAt:new Date().toISOString()}:x),setWikiArticles),
    deleteWikiArticle:(id)=>saveSite('wiki', prev=>prev.filter(x=>x.id!==id),setWikiArticles),
    createTicket:(s,m)=>{if(!user)return; const dn=getDisplayName(user); saveSite('support', prev=>[...prev,{id:'t'+Date.now(),userId:user.id,userName:dn,subject:s,message:m,status:'open' as const,createdAt:new Date().toISOString(),replies:[]}],setSupportTickets);},
    replyToTicket:(id,m)=>{if(!user)return; const dn=getDisplayName(user); const rc=getRoleConfig(user.role).displayName; saveSite('support', prev=>prev.map(x=>x.id===id?{...x,status:'answered' as const,replies:[...x.replies,{id:'r'+Date.now(),authorName:dn,authorRole:rc,message:m,createdAt:new Date().toISOString()}]}:x),setSupportTickets);},
    closeTicket:(id)=>saveSite('support', prev=>prev.map(x=>x.id===id?{...x,status:'closed' as const}:x),setSupportTickets),
    deleteTicket:(id)=>saveSite('support', prev=>prev.filter(x=>x.id!==id),setSupportTickets),
    sendMessage:(text)=>{if(!user)return; const dn=getDisplayName(user); saveSite('chat', prev=>{
      if(prev.mutedUsers.some(m=>m.userId===user.id&&Date.now()<m.until)) return prev;
      return {...prev,messages:[...prev.messages,{id:'m'+Date.now(),userId:user.id,userName:dn,userRole:user.role,text,timestamp:Date.now()}]};
    },setChatState);},
    deleteMessage:(id)=>saveSite('chat', prev=>({...prev,messages:prev.messages.map(x=>x.id===id?{...x,deleted:true}:x)}),setChatState),
    muteUser:(uid,minutes)=>saveSite('chat', prev=>({...prev,mutedUsers:[...prev.mutedUsers.filter(m=>m.userId!==uid),{userId:uid,until:Date.now()+minutes*60000}]}),setChatState),
    unmuteUser:(uid)=>saveSite('chat', prev=>({...prev,mutedUsers:prev.mutedUsers.filter(m=>m.userId!==uid)}),setChatState),
    isUserMuted:(uid)=>chatState.mutedUsers.some(m=>m.userId===uid&&Date.now()<m.until),
    chatBanUser:(uid)=>{ muteUser(uid, 60*24*7); },
    sendPrivateMessage: async (toId, text) => {
      if (!user) return 'Войдите в аккаунт';
      if (!toId?.trim() || !text?.trim()) return 'Укажите получателя и текст';
      const dn = getDisplayName(user);
      const target = registeredUsers.find(u => u.id === toId);
      const toDn = target ? getDisplayName(target) : '';
      const msg: PrivateMessage = {
        id: 'p' + Date.now(), fromId: user.id, fromName: dn, toId, toName: toDn,
        text: text.trim(), timestamp: Date.now(), read: false,
      };
      const prev = privateMessages;
      const next = [...prev, msg];
      setPrivateMessages(next);
      const err = await persist('pm', next);
      if (err) {
        setPrivateMessages(prev);
        return 'Не удалось отправить. Возможно, исчерпан лимит Supabase (Egress) — см. панель Usage.';
      }
      return null;
    },
    markPMRead:(partnerId)=>saveSite('pm', prev=>prev.map(x=>x.fromId===partnerId&&x.toId===user?.id?{...x,read:true}:x),setPrivateMessages),
    addGuideComment: async (guideId, text) => {
      if (!user) return 'Войдите в аккаунт';
      const c: GuideComment = {
        id: 'gc' + Date.now(), guideId, userId: user.id, userName: getDisplayName(user),
        text: text.trim(), createdAt: new Date().toISOString(), likes: [],
      };
      const prev = guideComments;
      const next = [...prev, c];
      setGuideComments(next);
      return persist('guide_comments', next);
    },
    deleteGuideComment: (id) => saveSite('guide_comments', prev => prev.filter(x => x.id !== id), setGuideComments),
    toggleGuideCommentLike: async (commentId) => {
      if (!user) return 'Войдите в аккаунт';
      const prev = guideComments;
      const next = prev.map(c => {
        if (c.id !== commentId) return c;
        const likes = c.likes || [];
        const has = likes.includes(user.id);
        return { ...c, likes: has ? likes.filter(uid => uid !== user.id) : [...likes, user.id] };
      });
      setGuideComments(next);
      return persist('guide_comments', next);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(){const c=useContext(AuthContext); if(!c)throw new Error('useAuth'); return c;}

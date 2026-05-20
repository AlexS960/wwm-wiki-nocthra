import { createContext, useContext, useState, useEffect, type ReactNode, useRef } from 'react';
import { dbGetAccountByUsername, dbCreateAccount, dbUpdateAccount, dbDeleteAccount, dbLoadProgress, dbSaveProgress, dbInit, dbLoadSiteData, dbSaveSiteData, dbListAccounts } from '../lib/db';

export type UserRole = string;
export interface User { id: string; email: string; name: string; picture: string; gameNickname?: string; role: UserRole; }
export interface GuideArticle { id: string; title: string; category: string; difficulty: string; readTime: string; summary: string; content: string; authorName: string; updatedAt: string; icon: string; }
export interface UserProgress { completedGuides: string[]; favoriteWeapons: string[]; favoriteSects: string[]; visitedRegions: string[]; notes: { id: string; title: string; content: string; date: string }[]; selectedBuild: string | null; }
export interface RegisteredUser { id: string; email: string; name: string; picture: string; gameNickname?: string; role: UserRole; joinedAt: string; lastSeen: string; isBanned: boolean; }
export interface RoleConfig { id: UserRole; displayName: string; color: string; permissions: string[]; }
export interface ChatMessage { id: string; userId: string; userName: string; userRole: string; text: string; timestamp: number; deleted?: boolean; }
export interface ChatState { messages: ChatMessage[]; mutedUsers: { userId: string; until: number }[]; }
export interface SiteSettings { siteName: string; siteDescription: string; discordUrl: string; maintenanceMode: boolean; announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[]; roles: RoleConfig[]; sections: {id:string;title:string;maintenance:boolean;message:string}[]; }
export interface WikiArticle { id: string; section: string; title: string; content: string; icon: string; authorName: string; updatedAt: string; fields: Record<string, string>; }
export interface SupportTicket { id: string; userId: string; userName: string; subject: string; message: string; status: 'open' | 'answered' | 'closed'; createdAt: string; replies: { id: string; authorName: string; authorRole: string; message: string; createdAt: string }[]; }
export interface PrivateMessage { id: string; fromId: string; fromName: string; toId: string; toName: string; text: string; timestamp: number; read: boolean; }

interface AuthContextType {
  user: User | null; progress: UserProgress; guides: GuideArticle[]; registeredUsers: RegisteredUser[]; siteSettings: SiteSettings; isLoading: boolean;
  wikiArticles: WikiArticle[]; supportTickets: SupportTicket[]; chatState: ChatState; privateMessages: PrivateMessage[]; unreadPMCount: number;
  loginWithPassword: (u: string, p: string, r: boolean) => Promise<string | null>;
  register: (u: string, p: string, gn?: string) => Promise<string | null>;
  logout: () => void;
  updateProgress: (upd: Partial<UserProgress>) => void;
  toggleFavoriteWeapon: (id: string) => void; toggleFavoriteSect: (id: string) => void; toggleCompletedGuide: (id: string) => void;
  addNote: (t: string, c: string) => void; deleteNote: (id: string) => void; setSelectedBuild: (id: string | null) => void;
  updateUserPicture: (p: string) => void; updateUserGameNickname: (n: string) => void;
  addGuide: (g: any) => void; updateGuide: (id: string, u: any) => void; deleteGuide: (id: string) => void;
  isAdmin: () => boolean; isEditor: () => boolean; adminSetUserRole: (id: string, r: string) => void; adminBanUser: (id: string, b: boolean) => void; adminDeleteUser: (id: string) => void;
  updateSiteSettings: (u: any) => void; addAnnouncement: (t: string, ty: any) => void; removeAnnouncement: (id: string) => void;
  getRoleConfig: (r: string) => RoleConfig; hasPermission: (p: string) => boolean;
  addWikiArticle: (a: any) => void; updateWikiArticle: (id: string, u: any) => void; deleteWikiArticle: (id: string) => void;
  createTicket: (s: string, m: string) => void; replyToTicket: (id: string, m: string) => void; closeTicket: (id: string) => void;
  sendMessage: (t: string) => void; deleteMessage: (id: string) => void;
  sendPrivateMessage: (toId: string, toName: string, text: string) => void; markPMRead: (id: string) => void;
  isUserOnline: (id: string) => boolean;
  updateRoleDisplayName: (id: string, n: string) => void;
  updateRoleColor: (id: string, c: string) => void;
  addRole: (n: string, c: string, p: string[]) => void;
  deleteRole: (id: string) => void;
  updateRolePermissions: (id: string, p: string[]) => void;
  muteUser: (id: string, m: number) => void;
  unmuteUser: (id: string) => void;
  isUserMuted: (id: string) => boolean;
  chatBanUser: (id: string) => void;
  deleteTicket: (id: string) => void;
}

const defaultProgress: UserProgress = { completedGuides: [], favoriteWeapons: [], favoriteSects: [], visitedRegions: [], notes: [], selectedBuild: null };
const defaultSettings: SiteSettings = {
  siteName: 'WWM Wiki — Nocthra', siteDescription: 'Русскоязычная база знаний', discordUrl: 'https://discord.gg/nocthra', maintenanceMode: false, announcements: [],
  roles: [
    { id: 'user', displayName: 'Странник', color: '#b0a696', permissions: ['read','profile','favorites','chat.write'] },
    { id: 'admin', displayName: 'Администратор', color: '#a882ff', permissions: ['read','profile','favorites','chat.write','chat.delete','chat.mute','chat.ban','guides.create','guides.edit','guides.delete','guild.edit','users.manage','users.ban','users.roles','site.settings','site.announcements','admin.panel'] },
  ],
  sections: [{id:'guides',title:'Гайды',maintenance:false,message:'...'},{id:'weapons',title:'Оружие',maintenance:false,message:'...'}],
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [guides, setGuides] = useState<GuideArticle[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);
  const [chatState, setChatState] = useState<ChatState>({ messages: [], mutedUsers: [] });
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);
  
  // Versions ref to track local data freshness
  const versions = useRef<Record<string, number>>({});

  const updateStateAndSync = async (key: string, data: any, setter: (val: any) => void) => {
    setter(data);
    const ts = await dbSaveSiteData(key, data);
    versions.current[key] = ts;
  };

  useEffect(() => {
    (async () => {
      await dbInit();
      const [accs, gData, sData, cData, wData, tData, pmData] = await Promise.all([
        dbListAccounts(), dbLoadSiteData('guides', []), dbLoadSiteData('site_settings', null),
        dbLoadSiteData('chat', { messages: [], mutedUsers: [] }), dbLoadSiteData('wiki', []),
        dbLoadSiteData('support', []), dbLoadSiteData('pm', []),
      ]);
      setRegisteredUsers(accs.map(a => ({ id:a.id, email:'', name:a.username, picture:a.picture||'', gameNickname:a.game_nickname||'', role:a.role, joinedAt:a.created_at, lastSeen:'—', isBanned:false })));
      setGuides(gData.data); if (sData.data) setSiteSettings(sData.data as any);
      setChatState(cData.data); setWikiArticles(wData.data); setSupportTickets(tData.data); setPrivateMessages(pmData.data);
      // Initialize local versions
      versions.current = { guides: gData.ts, site_settings: sData.ts, chat: cData.ts, wiki: wData.ts, support: tData.ts, pm: pmData.ts };
      setIsLoading(false); setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(async () => {
      try {
        const [c, t, pm, g, s, w, accs] = await Promise.all([
          dbLoadSiteData('chat'), dbLoadSiteData('support'), dbLoadSiteData('pm'),
          dbLoadSiteData('guides'), dbLoadSiteData('site_settings'), dbLoadSiteData('wiki'),
          dbListAccounts()
        ]);
        // Update ONLY if server has newer data than our last write
        if (c.ts > (versions.current.chat || 0)) setChatState(c.data as any);
        if (t.ts > (versions.current.support || 0)) setSupportTickets(t.data as any);
        if (pm.ts > (versions.current.pm || 0)) setPrivateMessages(pm.data as any);
        if (g.ts > (versions.current.guides || 0)) setGuides(g.data as any);
        if (s.ts > (versions.current.site_settings || 0)) setSiteSettings(s.data as any);
        if (w.ts > (versions.current.wiki || 0)) setWikiArticles(w.data as any);
        
        setRegisteredUsers(accs.map(a => ({ id:a.id, email:'', name:a.username, picture:a.picture||'', gameNickname:a.game_nickname||'', role:a.role, joinedAt:a.created_at, lastSeen:'—', isBanned:false })));
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [ready]);

  const loginWithPassword = async (username: string, password: string) => {
    const acc = await dbGetAccountByUsername(username);
    if (!acc || acc.password_hash !== password) return 'Ошибка входа';
    setUser({ id: acc.id, email: '', name: acc.username, picture: acc.picture || '', gameNickname: acc.game_nickname || '', role: acc.role });
    const p = await dbLoadProgress(acc.id);
    if (p) setProgress(p as any);
    return null;
  };

  const register = async (username: string, password: string, gameNickname = '') => {
    const res = await dbCreateAccount(username, password, gameNickname);
    if ('error' in res) return res.error;
    setUser({ id: res.id, email: '', name: res.username, picture: '', gameNickname: res.game_nickname || '', role: 'user' });
    return null;
  };

  const logout = () => { setUser(null); setProgress(defaultProgress); };
  const isAdmin = () => user?.role === 'admin';
  const isEditor = () => user?.role === 'admin' || user?.role === 'editor';
  const getRoleConfig = (r: string) => siteSettings.roles.find(x => x.id === r) || siteSettings.roles[0];
  const hasPermission = (p: string) => getRoleConfig(user?.role || 'user').permissions.includes(p);

  const sendMessage = (text: string) => {
    if (!user) return;
    const msg = { id: 'm'+Date.now(), userId: user.id, userName: user.name, userRole: user.role, text, timestamp: Date.now() };
    const next = { ...chatState, messages: [...chatState.messages, msg] };
    updateStateAndSync('chat', next, setChatState);
  };

  const createTicket = (subject: string, message: string) => {
    if (!user) return;
    const t = { id: 't'+Date.now(), userId: user.id, userName: user.name, subject, message, status: 'open' as const, createdAt: new Date().toISOString(), replies: [] };
    updateStateAndSync('support', [...supportTickets, t], setSupportTickets);
  };

  const addGuide = (g: any) => {
    const next = [{ ...g, id: 'g'+Date.now(), authorName: user?.name, updatedAt: new Date().toISOString() }, ...guides];
    updateStateAndSync('guides', next, setGuides);
  };

  const addWikiArticle = (a: any) => {
    const next = [{ ...a, id: 'w'+Date.now(), authorName: user?.name, updatedAt: new Date().toISOString() }, ...wikiArticles];
    updateStateAndSync('wiki', next, setWikiArticles);
  };

  const updateProgress = (u: any) => { const next = { ...progress, ...u }; setProgress(next); if (user) dbSaveProgress(user.id, next as any); };

  return (
    <AuthContext.Provider value={{
      user, progress, guides, registeredUsers, siteSettings, isLoading, wikiArticles, supportTickets, chatState, privateMessages, unreadPMCount: privateMessages.filter(x => x.toId === user?.id && !x.read).length,
      loginWithPassword, register, logout, updateProgress, 
      toggleFavoriteWeapon: (id) => updateProgress({ favoriteWeapons: progress.favoriteWeapons.includes(id) ? progress.favoriteWeapons.filter(x => x !== id) : [...progress.favoriteWeapons, id] }),
      toggleFavoriteSect: (id) => updateProgress({ favoriteSects: progress.favoriteSects.includes(id) ? progress.favoriteSects.filter(x => x !== id) : [...progress.favoriteSects, id] }),
      toggleCompletedGuide: (id) => updateProgress({ completedGuides: progress.completedGuides.includes(id) ? progress.completedGuides.filter(x => x !== id) : [...progress.completedGuides, id] }),
      addNote: (t, c) => updateProgress({ notes: [{ id: 'n'+Date.now(), title: t, content: c, date: new Date().toLocaleDateString() }, ...progress.notes] }),
      deleteNote: (id) => updateProgress({ notes: progress.notes.filter(x => x.id !== id) }),
      setSelectedBuild: (id) => updateProgress({ selectedBuild: id }),
      updateUserPicture: (p) => { if (user) { setUser({...user, picture:p}); dbUpdateAccount(user.id, {picture:p}); } },
      updateUserGameNickname: (n) => { if (user) { setUser({...user, gameNickname:n}); dbUpdateAccount(user.id, {game_nickname:n}); } },
      addGuide, updateGuide: (id, u) => updateStateAndSync('guides', guides.map(x => x.id === id ? {...x,...u,updatedAt:new Date().toISOString()} : x), setGuides),
      deleteGuide: (id) => updateStateAndSync('guides', guides.filter(x => x.id !== id), setGuides),
      isAdmin, isEditor, adminSetUserRole: (id, r) => { dbUpdateAccount(id, {role:r}); }, adminBanUser: () => {}, adminDeleteUser: (id) => { dbDeleteAccount(id); },
      isUserOnline: () => true, updateSiteSettings: (u) => updateStateAndSync('site_settings', {...siteSettings,...u}, setSiteSettings),
      addAnnouncement: (text, type) => updateStateAndSync('site_settings', { ...siteSettings, announcements: [{ id: 'a'+Date.now(), text, type, active: true }, ...siteSettings.announcements] }, setSiteSettings),
      removeAnnouncement: (id) => updateStateAndSync('site_settings', { ...siteSettings, announcements: siteSettings.announcements.filter(x => x.id !== id) }, setSiteSettings),
      getRoleConfig, hasPermission, addWikiArticle, updateWikiArticle: (id, u) => updateStateAndSync('wiki', wikiArticles.map(x => x.id === id ? {...x,...u,updatedAt:new Date().toISOString()} : x), setWikiArticles),
      deleteWikiArticle: (id) => updateStateAndSync('wiki', wikiArticles.filter(x => x.id !== id), setWikiArticles),
      createTicket, replyToTicket: (id, m) => updateStateAndSync('support', supportTickets.map(x => x.id === id ? {...x,status:'answered',replies:[...x.replies,{id:'r'+Date.now(),authorName:user?.name||'',authorRole:'',message:m,createdAt:new Date().toISOString()}]} : x), setSupportTickets),
      closeTicket: (id) => updateStateAndSync('support', supportTickets.map(x => x.id === id ? {...x,status:'closed'} : x), setSupportTickets),
      sendMessage, deleteMessage: (id) => updateStateAndSync('chat', {...chatState, messages: chatState.messages.map(x => x.id === id ? {...x,deleted:true} : x)}, setChatState),
      sendPrivateMessage: (toId, toName, text) => { if (!user) return; const m = { id:'p'+Date.now(), fromId:user.id, fromName:user.name, toId, toName, text, timestamp:Date.now(), read:false }; updateStateAndSync('pm', [...privateMessages, m], setPrivateMessages); },
      markPMRead: (id) => updateStateAndSync('pm', privateMessages.map(x => x.fromId === id && x.toId === user?.id ? {...x,read:true} : x), setPrivateMessages),
    }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth error');
  return ctx;
}

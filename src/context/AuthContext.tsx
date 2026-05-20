import { createContext, useContext, useState, useEffect, type ReactNode, useRef, useMemo, useCallback } from 'react';
import * as db from '../lib/db';

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
  user: User | null; progress: UserProgress; guides: GuideArticle[]; registeredUsers: RegisteredUser[]; siteSettings: SiteSettings; isLoading: boolean; isSyncing: boolean;
  wikiArticles: WikiArticle[]; supportTickets: SupportTicket[]; chatState: ChatState; privateMessages: PrivateMessage[]; unreadPMCount: number;
  loginWithPassword: (u: string, p: string) => Promise<string | null>; register: (u: string, p: string, gn?: string) => Promise<string | null>; logout: () => void;
  updateProgress: (upd: Partial<UserProgress>) => void; toggleFavoriteWeapon: (id: string) => void; toggleFavoriteSect: (id: string) => void; toggleCompletedGuide: (id: string) => void;
  addNote: (t: string, c: string) => void; deleteNote: (id: string) => void; setSelectedBuild: (id: string | null) => void;
  updateUserPicture: (p: string) => void; updateUserGameNickname: (n: string) => void;
  addGuide: (g: any) => void; updateGuide: (id: string, u: any) => void; deleteGuide: (id: string) => void;
  isAdmin: () => boolean; isEditor: () => boolean; adminSetUserRole: (id: string, r: string) => void; adminBanUser: (id: string, b: boolean) => void; adminDeleteUser: (id: string) => void;
  updateSiteSettings: (u: any) => void; addAnnouncement: (t: string, ty: any) => void; removeAnnouncement: (id: string) => void;
  getRoleConfig: (r: string) => RoleConfig; hasPermission: (p: string) => boolean;
  updateRoleDisplayName: (id: string, n: string) => void; updateRoleColor: (id: string, c: string) => void; addRole: (n: string, c: string, p: string[]) => void; deleteRole: (id: string) => void; updateRolePermissions: (id: string, p: string[]) => void;
  addWikiArticle: (a: any) => void; updateWikiArticle: (id: string, u: any) => void; deleteWikiArticle: (id: string) => void;
  createTicket: (s: string, m: string) => void; replyToTicket: (id: string, m: string) => void; closeTicket: (id: string) => void; deleteTicket: (id: string) => void;
  sendMessage: (t: string) => void; deleteMessage: (id: string) => void;
  muteUser: (id: string, m: number) => void; unmuteUser: (id: string) => void; isUserMuted: (id: string) => boolean; chatBanUser: (id: string) => void;
  sendPrivateMessage: (toId: string, toName: string, text: string) => void; markPMRead: (id: string) => void;
  isUserOnline: (id: string) => boolean;
}

const defaultProgress: UserProgress = { completedGuides: [], favoriteWeapons: [], favoriteSects: [], visitedRegions: [], notes: [], selectedBuild: null };
const defaultSettings: SiteSettings = {
  siteName: 'WWM Wiki — Nocthra', siteDescription: 'База знаний', discordUrl: 'https://discord.gg/nocthra', maintenanceMode: false, announcements: [],
  roles: [
    { id: 'user', displayName: 'Странник', color: '#b0a696', permissions: ['read','profile','favorites','chat.write'] },
    { id: 'admin', displayName: 'Администратор', color: '#a882ff', permissions: ['read','profile','favorites','chat.write','chat.delete','chat.mute','chat.ban','guides.create','guides.edit','guides.delete','guild.edit','users.manage','users.ban','users.roles','site.settings','site.announcements','admin.panel'] },
  ],
  sections: [{id:'guides',title:'Гайды',maintenance:false,message:'...'}],
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [ready, setReady] = useState(false);
  
  const versions = useRef<Record<string, number>>({});
  const sync = useCallback(async (key: string, data: any, setter: (val: any) => void) => {
    setIsSyncing(true);
    try {
      setter(data);
      versions.current[key] = await db.siteData.save(key, data);
    } finally { setIsSyncing(false); }
  }, []);

  useEffect(() => {
    (async () => {
      await db.dbInit();
      const [accs, g, s, c, w, t, pm] = await Promise.all([
        db.accounts.list(), db.siteData.load('guides', []), db.siteData.load('site_settings', null),
        db.siteData.load('chat', { messages: [], mutedUsers: [] }), db.siteData.load('wiki', []),
        db.siteData.load('support', []), db.siteData.load('pm', []),
      ]);
      setRegisteredUsers(accs.map(a => ({ id:a.id, email:'', name:a.username, picture:a.picture||'', gameNickname:a.game_nickname||'', role:a.role, joinedAt:a.created_at, lastSeen:'—', isBanned:false })));
      setGuides(g.data); if (s.data) setSiteSettings(s.data as any);
      setChatState(c.data); setWikiArticles(w.data); setSupportTickets(t.data); setPrivateMessages(pm.data);
      versions.current = { guides: g.ts, site_settings: s.ts, chat: c.ts, wiki: w.ts, support: t.ts, pm: pm.ts };
      setIsLoading(false); setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(async () => {
      try {
        const [c, t, pm, g, s, w, accs] = await Promise.all([
          db.siteData.load('chat', chatState), db.siteData.load('support', supportTickets),
          db.siteData.load('pm', privateMessages), db.siteData.load('guides', guides),
          db.siteData.load('site_settings', siteSettings), db.siteData.load('wiki', wikiArticles),
          db.accounts.list()
        ]);
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
  }, [ready, chatState, supportTickets, privateMessages, guides, siteSettings, wikiArticles]);

  const isAdmin = useCallback(() => user?.role === 'admin', [user]);
  const isEditor = useCallback(() => user?.role === 'admin' || user?.role === 'editor', [user]);
  const getRoleConfig = useCallback((r: string) => siteSettings.roles.find(x => x.id === r) || siteSettings.roles[0], [siteSettings.roles]);
  const hasPermission = useCallback((p: string) => getRoleConfig(user?.role || 'user').permissions.includes(p), [user, getRoleConfig]);

  const value = useMemo(() => ({
    user, progress, guides, registeredUsers, siteSettings, isLoading, isSyncing, wikiArticles, supportTickets, chatState, privateMessages, unreadPMCount: privateMessages.filter(x => x.toId === user?.id && !x.read).length,
    loginWithPassword: async (u: string, p: string) => {
      const acc = await db.accounts.get(u);
      if (!acc || acc.password_hash !== p) return 'Ошибка';
      setUser({ id: acc.id, email: '', name: acc.username, picture: acc.picture || '', gameNickname: acc.game_nickname || '', role: acc.role });
      const pr = await db.progress.load(acc.id);
      if (pr) setProgress(pr);
      return null;
    },
    register: async (u: string, p: string, gn = '') => {
      try { const res = await db.accounts.create(u, p, gn); setUser({ id: res.id, email: '', name: res.username, picture: '', gameNickname: res.game_nickname || '', role: 'user' }); return null; }
      catch (e: any) { return e.message; }
    },
    logout: () => { setUser(null); setProgress(defaultProgress); },
    updateProgress: (u: any) => { const n = { ...progress, ...u }; setProgress(n); if (user) db.progress.save(user.id, n); },
    toggleFavoriteWeapon: (id: string) => value.updateProgress({ favoriteWeapons: progress.favoriteWeapons.includes(id) ? progress.favoriteWeapons.filter(x => x !== id) : [...progress.favoriteWeapons, id] }),
    toggleFavoriteSect: (id: string) => value.updateProgress({ favoriteSects: progress.favoriteSects.includes(id) ? progress.favoriteSects.filter(x => x !== id) : [...progress.favoriteSects, id] }),
    toggleCompletedGuide: (id: string) => value.updateProgress({ completedGuides: progress.completedGuides.includes(id) ? progress.completedGuides.filter(x => x !== id) : [...progress.completedGuides, id] }),
    addNote: (t: string, c: string) => value.updateProgress({ notes: [{ id: 'n'+Date.now(), title: t, content: c, date: new Date().toLocaleDateString() }, ...progress.notes] }),
    deleteNote: (id: string) => value.updateProgress({ notes: progress.notes.filter(x => x.id !== id) }),
    setSelectedBuild: (id: string | null) => value.updateProgress({ selectedBuild: id }),
    updateUserPicture: (p: string) => { if (user) { setUser({...user, picture:p}); db.accounts.update(user.id, {picture:p}); } },
    updateUserGameNickname: (n: string) => { if (user) { setUser({...user, gameNickname:n}); db.accounts.update(user.id, {game_nickname:n}); } },
    addGuide: (g: any) => sync('guides', [{ ...g, id: 'g'+Date.now(), authorName: user?.name, updatedAt: new Date().toISOString() }, ...guides], setGuides),
    updateGuide: (id: string, u: any) => sync('guides', guides.map(x => x.id === id ? {...x,...u,updatedAt:new Date().toISOString()} : x), setGuides),
    deleteGuide: (id: string) => sync('guides', guides.filter(x => x.id !== id), setGuides),
    isAdmin, isEditor, getRoleConfig, hasPermission,
    adminSetUserRole: (id: string, r: string) => db.accounts.update(id, {role:r}),
    adminBanUser: () => {}, adminDeleteUser: (id: string) => db.accounts.remove(id),
    updateSiteSettings: (u: any) => sync('site_settings', {...siteSettings,...u}, setSiteSettings),
    addAnnouncement: (text: string, type: any) => sync('site_settings', { ...siteSettings, announcements: [{ id: 'a'+Date.now(), text, type, active: true }, ...siteSettings.announcements] }, setSiteSettings),
    removeAnnouncement: (id: string) => sync('site_settings', { ...siteSettings, announcements: siteSettings.announcements.filter(x => x.id !== id) }, setSiteSettings),
    updateRoleDisplayName: (id: string, n: string) => sync('site_settings', { ...siteSettings, roles: siteSettings.roles.map(r => r.id === id ? { ...r, displayName: n } : r) }, setSiteSettings),
    updateRoleColor: (id: string, c: string) => sync('site_settings', { ...siteSettings, roles: siteSettings.roles.map(r => r.id === id ? { ...r, color: c } : r) }, setSiteSettings),
    addRole: (n: string, c: string, p: string[]) => sync('site_settings', { ...siteSettings, roles: [...siteSettings.roles, { id: 'r'+Date.now(), displayName: n, color: c, permissions: p }] }, setSiteSettings),
    deleteRole: (id) => sync('site_settings', { ...siteSettings, roles: siteSettings.roles.filter(r => r.id !== id) }, setSiteSettings),
    updateRolePermissions: (id: string, p: string[]) => sync('site_settings', { ...siteSettings, roles: siteSettings.roles.map(r => r.id === id ? { ...r, permissions: p } : r) }, setSiteSettings),
    addWikiArticle: (a: any) => sync('wiki', [{ ...a, id: 'w'+Date.now(), authorName: user?.name, updatedAt: new Date().toISOString() }, ...wikiArticles], setWikiArticles),
    updateWikiArticle: (id: string, u: any) => sync('wiki', wikiArticles.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x), setWikiArticles),
    deleteWikiArticle: (id: string) => sync('wiki', wikiArticles.filter(x => x.id !== id), setWikiArticles),
    createTicket: (subject: string, message: string) => { if (!user) return; const t = { id: 't'+Date.now(), userId: user.id, userName: user.name, subject, message, status: 'open' as const, createdAt: new Date().toISOString(), replies: [] }; sync('support', [...supportTickets, t], setSupportTickets); },
    replyToTicket: (id: string, m: string) => sync('support', supportTickets.map(x => x.id === id ? {...x,status:'answered',replies:[...x.replies,{id:'r'+Date.now(),authorName:user?.name||'',authorRole:'',message:m,createdAt: new Date().toISOString()}]} : x), setSupportTickets),
    closeTicket: (id: string) => sync('support', supportTickets.map(x => x.id === id ? {...x,status:'closed'} : x), setSupportTickets),
    deleteTicket: (id: string) => sync('support', supportTickets.filter(x => x.id !== id), setSupportTickets),
    sendMessage: (text: string) => { if (!user) return; const m = { id: 'm'+Date.now(), userId: user.id, userName: user.name, userRole: user.role, text, timestamp: Date.now() }; sync('chat', { ...chatState, messages: [...chatState.messages, m] }, setChatState); },
    deleteMessage: (id: string) => sync('chat', {...chatState, messages: chatState.messages.map(x => x.id === id ? {...x,deleted:true} : x)}, setChatState),
    muteUser: (id: string, m: number) => sync('chat', { ...chatState, mutedUsers: [...chatState.mutedUsers.filter(x => x.userId !== id), { userId: id, until: Date.now() + m * 60000 }] }, setChatState),
    unmuteUser: (id: string) => sync('chat', { ...chatState, mutedUsers: chatState.mutedUsers.filter(x => x.userId !== id) }, setChatState),
    isUserMuted: (id: string) => { const entry = chatState.mutedUsers.find(m => m.userId === id); return entry ? Date.now() <= entry.until : false; },
    chatBanUser: () => {},
    sendPrivateMessage: (toId: string, toName: string, text: string) => { if (!user) return; const m = { id:'p'+Date.now(), fromId:user.id, fromName:user.name, toId, toName, text, timestamp:Date.now(), read:false }; sync('pm', [...privateMessages, m], setPrivateMessages); },
    markPMRead: (id: string) => sync('pm', privateMessages.map(x => x.fromId === id && x.toId === user?.id ? {...x,read:true} : x), setPrivateMessages),
    isUserOnline: () => true,
  }), [user, progress, guides, registeredUsers, siteSettings, isLoading, isSyncing, wikiArticles, supportTickets, chatState, privateMessages, isAdmin, isEditor, getRoleConfig, hasPermission, sync]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth error');
  return ctx;
}

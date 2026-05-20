import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
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
}

const defaultProgress: UserProgress = { completedGuides: [], favoriteWeapons: [], favoriteSects: [], visitedRegions: [], notes: [], selectedBuild: null };
const defaultSettings: SiteSettings = {
  siteName: 'WWM Wiki — Nocthra', siteDescription: 'Русскоязычная база знаний', discordUrl: 'https://discord.gg/nocthra', maintenanceMode: false, announcements: [],
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
  const [ready, setReady] = useState(false);

  // Sync state to Supabase helper
  const sync = async (key: string, data: any) => { await dbSaveSiteData(key, data); };

  useEffect(() => {
    (async () => {
      await dbInit();
      const [accs, guidesD, settingsD, chatD, wikiD, supportD, pmD] = await Promise.all([
        dbListAccounts(), dbLoadSiteData('guides', []), dbLoadSiteData('site_settings', null),
        dbLoadSiteData('chat', { messages: [], mutedUsers: [] }), dbLoadSiteData('wiki', []),
        dbLoadSiteData('support', []), dbLoadSiteData('pm', []),
      ]);
      setRegisteredUsers(accs.map(a => ({ id:a.id, email:'', name:a.username, picture:a.picture||'', gameNickname:a.game_nickname||'', role:a.role, joinedAt:a.created_at, lastSeen:'—', isBanned:false })));
      setGuides(guidesD); if (settingsD) setSiteSettings(settingsD);
      setChatState(chatD); setWikiArticles(wikiD); setSupportTickets(supportD); setPrivateMessages(pmD);
      setIsLoading(false); setReady(true);
    })();
  }, []);

  // Poll for updates from others
  useEffect(() => {
    if (!ready) return;
    const interval = setInterval(async () => {
      try {
        const [chat, support, pm, g, s, w, accounts] = await Promise.all([
          dbLoadSiteData('chat', chatState), dbLoadSiteData('support', supportTickets),
          dbLoadSiteData('pm', privateMessages), dbLoadSiteData('guides', guides),
          dbLoadSiteData('site_settings', siteSettings), dbLoadSiteData('wiki', wikiArticles),
          dbListAccounts()
        ]);
        setChatState(chat); setSupportTickets(support); setPrivateMessages(pm); setGuides(g); setSiteSettings(s); setWikiArticles(w);
        setRegisteredUsers(accounts.map(a => ({ id:a.id, email:'', name:a.username, picture:a.picture||'', gameNickname:a.game_nickname||'', role:a.role, joinedAt:a.created_at, lastSeen:'—', isBanned:false })));
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, [ready]);

  const loginWithPassword = async (username: string, password: string) => {
    const acc = await dbGetAccountByUsername(username);
    if (!acc || acc.password_hash !== password) return 'Ошибка входа';
    const u: User = { id: acc.id, email: '', name: acc.username, picture: acc.picture || '', gameNickname: acc.game_nickname || '', role: acc.role };
    setUser(u);
    const p = await dbLoadProgress(u.id);
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
    setChatState(next); sync('chat', next);
  };

  const createTicket = (subject: string, message: string) => {
    if (!user) return;
    const t: SupportTicket = { id: 't'+Date.now(), userId: user.id, userName: user.name, subject, message, status: 'open', createdAt: new Date().toISOString(), replies: [] };
    const next = [...supportTickets, t];
    setSupportTickets(next); sync('support', next);
  };

  const updateProgress = (u: any) => { const next = { ...progress, ...u }; setProgress(next); if (user) dbSaveProgress(user.id, next as any); };
  const toggleFavoriteWeapon = (id: string) => updateProgress({ favoriteWeapons: progress.favoriteWeapons.includes(id) ? progress.favoriteWeapons.filter(x => x !== id) : [...progress.favoriteWeapons, id] });
  const toggleFavoriteSect = (id: string) => updateProgress({ favoriteSects: progress.favoriteSects.includes(id) ? progress.favoriteSects.filter(x => x !== id) : [...progress.favoriteSects, id] });
  const toggleCompletedGuide = (id: string) => updateProgress({ completedGuides: progress.completedGuides.includes(id) ? progress.completedGuides.filter(x => x !== id) : [...progress.completedGuides, id] });
  const addNote = (title: string, content: string) => updateProgress({ notes: [{ id: 'n'+Date.now(), title, content, date: new Date().toLocaleDateString() }, ...progress.notes] });
  const deleteNote = (id: string) => updateProgress({ notes: progress.notes.filter(x => x.id !== id) });
  const setSelectedBuild = (id: string | null) => updateProgress({ selectedBuild: id });

  const addGuide = (g: any) => { const next = [{ ...g, id: 'g'+Date.now(), authorName: user?.name, updatedAt: new Date().toISOString() }, ...guides]; setGuides(next); sync('guides', next); };
  const updateGuide = (id: string, u: any) => { const next = guides.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x); setGuides(next); sync('guides', next); };
  const deleteGuide = (id: string) => { const next = guides.filter(x => x.id !== id); setGuides(next); sync('guides', next); };

  const addWikiArticle = (a: any) => { const next = [{ ...a, id: 'w'+Date.now(), authorName: user?.name, updatedAt: new Date().toISOString() }, ...wikiArticles]; setWikiArticles(next); sync('wiki', next); };
  const updateWikiArticle = (id: string, u: any) => { const next = wikiArticles.map(x => x.id === id ? { ...x, ...u, updatedAt: new Date().toISOString() } : x); setWikiArticles(next); sync('wiki', next); };
  const deleteWikiArticle = (id: string) => { const next = wikiArticles.filter(x => x.id !== id); setWikiArticles(next); sync('wiki', next); };

  const updateSiteSettings = (u: any) => { const next = { ...siteSettings, ...u }; setSiteSettings(next); sync('site_settings', next); };
  const addAnnouncement = (text: string, type: any) => { const next = { ...siteSettings, announcements: [{ id: 'a'+Date.now(), text, type, active: true }, ...siteSettings.announcements] }; setSiteSettings(next); sync('site_settings', next); };
  const removeAnnouncement = (id: string) => { const next = { ...siteSettings, announcements: siteSettings.announcements.filter(x => x.id !== id) }; setSiteSettings(next); sync('site_settings', next); };

  const sendPrivateMessage = (toId: string, toName: string, text: string) => {
    if (!user) return;
    const m: PrivateMessage = { id: 'p'+Date.now(), fromId: user.id, fromName: user.name, toId, toName, text, timestamp: Date.now(), read: false };
    const next = [...privateMessages, m];
    setPrivateMessages(next); sync('pm', next);
  };
  const markPMRead = (id: string) => { const next = privateMessages.map(x => x.fromId === id && x.toId === user?.id ? { ...x, read: true } : x); setPrivateMessages(next); sync('pm', next); };

  return (
    <AuthContext.Provider value={{
      user, progress, guides, registeredUsers, siteSettings, isLoading, wikiArticles, supportTickets, chatState, privateMessages, unreadPMCount: privateMessages.filter(x => x.toId === user?.id && !x.read).length,
      loginWithPassword, register, logout, updateProgress, toggleFavoriteWeapon, toggleFavoriteSect, toggleCompletedGuide, addNote, deleteNote, setSelectedBuild,
      updateUserPicture: (p: string) => { if (user) { setUser({...user, picture:p}); dbUpdateAccount(user.id, {picture:p}); } },
      updateUserGameNickname: (n: string) => { if (user) { setUser({...user, gameNickname:n}); dbUpdateAccount(user.id, {game_nickname:n}); } },
      addGuide, updateGuide, deleteGuide, isAdmin, isEditor,
      adminSetUserRole: (id, r) => { dbUpdateAccount(id, {role:r}); },
      adminBanUser: (_id, _b) => {}, adminDeleteUser: (id) => { dbDeleteAccount(id); },
      isUserOnline: (_id) => true, updateSiteSettings, addAnnouncement, removeAnnouncement,
      getRoleConfig, hasPermission, addWikiArticle, updateWikiArticle, deleteWikiArticle,
      createTicket, replyToTicket: (id, m) => { const next = supportTickets.map(x => x.id === id ? { ...x, status: 'answered', replies: [...x.replies, { id:'r'+Date.now(), authorName:user?.name||'', authorRole:'', message:m, createdAt: new Date().toISOString() }] } : x); setSupportTickets(next as any); sync('support', next); },
      closeTicket: (id) => { const next = supportTickets.map(x => x.id === id ? { ...x, status: 'closed' } : x); setSupportTickets(next as any); sync('support', next); },
      deleteTicket: (id) => { const next = supportTickets.filter(x => x.id !== id); setSupportTickets(next); sync('support', next); },
      sendMessage, deleteMessage: (id) => { const next = { ...chatState, messages: chatState.messages.map(x => x.id === id ? { ...x, deleted: true } : x) }; setChatState(next); sync('chat', next); },
      sendPrivateMessage, markPMRead, muteUser: () => {}, unmuteUser: () => {}, isUserMuted: () => false, chatBanUser: () => {}
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

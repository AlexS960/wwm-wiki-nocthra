import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { dbGetAccountByUsername, dbCreateAccount, dbUpdateAccount, dbDeleteAccount, dbLoadProgress, dbSaveProgress, dbInit, dbLoadSiteData, dbSaveSiteData, dbSetOnline, dbGetOnlineStatuses, dbListAccounts } from '../lib/db';

export type UserRole = string;

export interface User {
  id: string; email: string; name: string; picture: string; gameNickname?: string; isDemo?: boolean; role: UserRole;
}
export interface GuideArticle {
  id: string; title: string; category: string; difficulty: string; readTime: string;
  summary: string; content: string; authorName: string; updatedAt: string; icon: string;
}
export interface UserProgress {
  completedGuides: string[]; favoriteWeapons: string[]; favoriteSects: string[];
  visitedRegions: string[]; notes: { id: string; title: string; content: string; date: string }[];
  selectedBuild: string | null;
}
export interface RegisteredUser {
  id: string; email: string; name: string; picture: string; gameNickname?: string;
  role: UserRole; joinedAt: string; lastSeen: string; lastActiveAt?: number; isBanned: boolean;
}
export interface RoleConfig { id: UserRole; displayName: string; color: string; permissions: string[]; }
export interface ChatMessage { id: string; userId: string; userName: string; userRole: string; text: string; timestamp: number; deleted?: boolean; }
export interface ChatState { messages: ChatMessage[]; mutedUsers: { userId: string; until: number }[]; }
export interface SiteSection { id: string; title: string; maintenance: boolean; message: string; }
export interface SiteSettings {
  siteName: string; siteDescription: string; discordUrl: string; maintenanceMode: boolean;
  announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[];
  roles: RoleConfig[]; sections: SiteSection[];
}
export interface WikiArticle {
  id: string; section: string; title: string; content: string; icon: string;
  authorName: string; updatedAt: string; fields: Record<string, string>;
}
export interface SupportTicket {
  id: string; userId: string; userName: string; subject: string; message: string;
  status: 'open' | 'answered' | 'closed'; createdAt: string;
  replies: { id: string; authorName: string; authorRole: string; message: string; createdAt: string }[];
}

export interface PrivateMessage {
  id: string; fromId: string; fromName: string; toId: string; toName: string;
  text: string; timestamp: number; read: boolean;
}

interface AuthContextType {
  user: User | null; progress: UserProgress; guides: GuideArticle[]; registeredUsers: RegisteredUser[];
  siteSettings: SiteSettings; isLoading: boolean;
  wikiArticles: WikiArticle[]; supportTickets: SupportTicket[]; chatState: ChatState;
  privateMessages: PrivateMessage[]; unreadPMCount: number;
  sendPrivateMessage: (toId: string, toName: string, text: string) => void;
  markPMRead: (fromId: string) => void;
  loginWithPassword: (username: string, password: string, remember: boolean) => Promise<string | null>;
  register: (username: string, password: string, gameNickname?: string) => Promise<string | null>;
  logout: () => Promise<void> | void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  toggleFavoriteWeapon: (weaponId: string) => void; toggleFavoriteSect: (sectId: string) => void;
  toggleCompletedGuide: (guideId: string) => void; toggleVisitedRegion: (regionId: string) => void;
  addNote: (title: string, content: string) => void; deleteNote: (noteId: string) => void;
  setSelectedBuild: (buildId: string | null) => void;
  updateUserPicture: (picture: string) => void; updateUserGameNickname: (gameNickname: string) => void;
  addGuide: (guide: Omit<GuideArticle, 'id' | 'authorName' | 'updatedAt'>) => void;
  updateGuide: (id: string, updates: Partial<GuideArticle>) => void; deleteGuide: (id: string) => void;
  setUserRole: (role: UserRole) => void; isEditor: () => boolean; isAdmin: () => boolean;
  adminSetUserRole: (userId: string, role: UserRole) => void; adminBanUser: (userId: string, banned: boolean) => void;
  adminDeleteUser: (userId: string) => void; isUserOnline: (userId: string) => boolean;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  addAnnouncement: (text: string, type: 'info' | 'warning' | 'success') => void;
  removeAnnouncement: (id: string) => void;
  getRoleConfig: (role: UserRole) => RoleConfig;
  updateRoleDisplayName: (roleId: UserRole, newName: string) => void;
  updateRoleColor: (roleId: UserRole, newColor: string) => void;
  hasPermission: (permission: string) => boolean;
  addRole: (displayName: string, color: string, permissions: string[]) => void;
  deleteRole: (roleId: string) => void; updateRolePermissions: (roleId: string, permissions: string[]) => void;
  addWikiArticle: (article: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => void;
  updateWikiArticle: (id: string, updates: Partial<WikiArticle>) => void;
  deleteWikiArticle: (id: string) => void;
  createTicket: (subject: string, message: string) => void;
  replyToTicket: (ticketId: string, message: string) => void;
  closeTicket: (ticketId: string) => void; deleteTicket: (ticketId: string) => void;
  sendMessage: (text: string) => void; deleteMessage: (msgId: string) => void;
  muteUser: (userId: string, minutes: number) => void; unmuteUser: (userId: string) => void;
  isUserMuted: (userId: string) => boolean; chatBanUser: (userId: string) => void;
}

const defaultProgress: UserProgress = {
  completedGuides: [], favoriteWeapons: [], favoriteSects: [], visitedRegions: [], notes: [], selectedBuild: null,
};

const defaultGuides: GuideArticle[] = [
  { id: 'guide-beginner', title: 'Полное руководство для новичков', category: 'Новичкам', difficulty: 'Начальный', readTime: '15 мин', summary: 'Всё, что нужно знать перед началом игры.', content: '## Начало игры\n\nПри создании персонажа вам предложат выбрать режим наведения и тип управления.\n\n## Система оружия\n\nВ игре нет жёстких классов. Ваш боевой стиль определяется оружием.\n\n## Кража Навыков\n\nПозволяет изучать техники любой секты без вступления в неё.', authorName: 'Nocthra Wiki', updatedAt: '2025-11-15', icon: '📖' },
  { id: 'guide-combat', title: 'Боевая система: полный гайд', category: 'Бой', difficulty: 'Средний', readTime: '20 мин', summary: 'Разбор боевой системы: парирование, уклонение, комбо.', content: '## Основы боя\n\nПарирование — ключевой навык. Успешное парирование открывает окно для контратаки.\n\n## Уклонение\n\nPerfect Dodge даёт i-frames.\n\n## Мистические Искусства\n\nБолее 40 уникальных техник.', authorName: 'Nocthra Wiki', updatedAt: '2025-11-15', icon: '⚔️' },
];

const defaultSiteSettings: SiteSettings = {
  siteName: 'WWM Wiki — Nocthra', siteDescription: 'Русскоязычная база знаний по Where Winds Meet',
  discordUrl: 'https://discord.gg/nocthra', maintenanceMode: false, announcements: [],
  roles: [
    { id: 'user', displayName: 'Странник', color: '#b0a696', permissions: ['read','profile','favorites','chat.write'] },
    { id: 'moderator', displayName: 'Модератор', color: '#00bcd4', permissions: ['read','profile','favorites','chat.write','chat.delete','chat.mute','chat.ban','support.view_all','support.reply','support.close'] },
    { id: 'editor', displayName: 'Редактор', color: '#d4a528', permissions: ['read','profile','favorites','chat.write','guides.create','guides.edit','guides.delete','support.view_all','support.reply'] },
    { id: 'admin', displayName: 'Администратор', color: '#a882ff', permissions: ['read','profile','favorites','chat.write','chat.delete','chat.mute','chat.ban','guides.create','guides.edit','guides.delete','guild.edit','support.view_all','support.reply','support.close','support.delete','users.manage','users.ban','users.roles','site.settings','site.announcements','admin.panel'] },
  ],
  sections: [
    { id: 'guides', title: 'Гайды', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'weapons', title: 'Оружие', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'builds', title: 'Билды', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'sects', title: 'Секты', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'bosses', title: 'Боссы', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'mystic', title: 'Арты', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'map', title: 'Карта', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'cooking', title: 'Готовка', maintenance: false, message: 'Раздел на техработах.' },
    { id: 'tips', title: 'Советы', maintenance: false, message: 'Раздел на техработах.' },
  ],
};

const AuthContext = createContext<AuthContextType | null>(null);

function loadFromLS<T>(key: string, fallback: T): T {
  try { const saved = localStorage.getItem(key); if (saved) return JSON.parse(saved); const session = sessionStorage.getItem(key); if (session) { localStorage.setItem(key, session); return JSON.parse(session); } } catch {}
  return fallback;
}
function saveToLS(key: string, data: unknown): void {
  try { const s = JSON.stringify(data); localStorage.setItem(key, s); sessionStorage.setItem(key, s); } catch {}
}

function initSiteSettings(): SiteSettings {
  const saved = loadFromLS<SiteSettings | null>('wwm_site_settings', null);
  if (!saved) return defaultSiteSettings;
  if (!saved.sections) saved.sections = defaultSiteSettings.sections;
  return saved;
}
function initGuides(): GuideArticle[] {
  const saved = loadFromLS<GuideArticle[] | null>('wwm_guides', null);
  if (saved) return saved;
  saveToLS('wwm_guides', defaultGuides);
  return defaultGuides;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadFromLS('wwm_user', null));
  const userRef = { current: null as User | null };
  userRef.current = user;
  const [progress, setProgress] = useState<UserProgress>(() => loadFromLS('wwm_progress', defaultProgress));
  const [guides, setGuides] = useState<GuideArticle[]>(initGuides);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => loadFromLS('wwm_registered_users', []));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initSiteSettings);
  const [chatState, setChatState] = useState<ChatState>(() => loadFromLS('wwm_chat', { messages: [], mutedUsers: [] }));
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>(() => loadFromLS('wwm_wiki', []));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => loadFromLS('wwm_support', []));
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>(() => loadFromLS('wwm_pm', []));
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [onlineStatuses, setOnlineStatuses] = useState<Record<string, number>>({});

  useEffect(() => {
    (async () => {
      await dbInit();
      // Load accounts from Supabase and convert to RegisteredUser
      const accounts = await dbListAccounts();
      const supabaseUsers: RegisteredUser[] = accounts.map(acc => ({
        id: acc.id, email: '', name: acc.username, picture: acc.picture || '',
        gameNickname: acc.game_nickname || '', role: acc.role,
        joinedAt: acc.created_at ? new Date(acc.created_at).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU'),
        lastSeen: '—', isBanned: false,
      }));

      const [serverGuides, serverUsers, serverSettings, serverChat, serverWiki, serverSupport] = await Promise.all([
        dbLoadSiteData<GuideArticle[]>('guides', []), dbLoadSiteData<RegisteredUser[]>('registered_users', []),
        dbLoadSiteData<SiteSettings | null>('site_settings', null), dbLoadSiteData<ChatState>('chat', { messages: [], mutedUsers: [] }),
        dbLoadSiteData<WikiArticle[]>('wiki', []), dbLoadSiteData<SupportTicket[]>('support', []),
      ]);
      if (serverGuides.length > 0) setGuides(serverGuides);
      // Merge Supabase accounts with stored registered users
      const mergedUsers = [...supabaseUsers];
      if (serverUsers.length > 0) {
        for (const su of serverUsers) {
          if (!mergedUsers.find(u => u.id === su.id)) mergedUsers.push(su);
          else { const idx = mergedUsers.findIndex(u => u.id === su.id); mergedUsers[idx] = { ...mergedUsers[idx], ...su, lastSeen: su.lastSeen || mergedUsers[idx].lastSeen }; }
        }
      }
      setRegisteredUsers(mergedUsers);
      if (serverSettings) setSiteSettings(serverSettings);
      if (serverChat.messages.length > 0) setChatState(serverChat);
      if (serverWiki.length > 0) setWikiArticles(serverWiki);
      if (serverSupport.length > 0) setSupportTickets(serverSupport);
      setIsLoading(false); setReady(true);
    })();
  }, []);

  useEffect(() => { if (user) { saveToLS('wwm_progress', progress); dbSaveProgress(user.id, progress as unknown as Record<string, unknown>); } }, [progress, user]);

  useEffect(() => {
    if (!user) return;
    const touch = () => { const nowTs = Date.now(); const now = new Date().toLocaleDateString('ru-RU'); setRegisteredUsers(prev => prev.map(u => u.id === user.id ? { ...u, lastSeen: now, lastActiveAt: nowTs } : u)); dbSetOnline(user.id); };
    touch(); const interval = setInterval(touch, 10000); return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!ready) return;
    const poll = async () => { const statuses = await dbGetOnlineStatuses(); setOnlineStatuses(statuses); };
    poll(); const interval = setInterval(poll, 5000); return () => clearInterval(interval);
  }, [ready]);

  useEffect(() => { if (ready) { dbSaveSiteData('guides', guides); } }, [guides, ready]);
  useEffect(() => { if (ready) { dbSaveSiteData('site_settings', siteSettings); } }, [siteSettings, ready]);
  useEffect(() => { if (ready) { dbSaveSiteData('chat', chatState); } }, [chatState, ready]);
  useEffect(() => { if (ready) { dbSaveSiteData('wiki', wikiArticles); } }, [wikiArticles, ready]);
  useEffect(() => { if (ready) { dbSaveSiteData('support', supportTickets); } }, [supportTickets, ready]);
  useEffect(() => { if (ready) { dbSaveSiteData('pm', privateMessages); } }, [privateMessages, ready]);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const [serverChat, serverSupport, serverPM, serverGuides, serverUsers, serverSettings, serverWiki, accounts] = await Promise.all([
          dbLoadSiteData<ChatState>('chat', { messages: [], mutedUsers: [] }),
          dbLoadSiteData<SupportTicket[]>('support', []),
          dbLoadSiteData<PrivateMessage[]>('pm', []),
          dbLoadSiteData<GuideArticle[]>('guides', []),
          dbLoadSiteData<RegisteredUser[]>('registered_users', []),
          dbLoadSiteData<SiteSettings | null>('site_settings', null),
          dbLoadSiteData<WikiArticle[]>('wiki', []),
          dbListAccounts(),
        ]);
        if (!cancelled) {
          setChatState(prev => JSON.stringify(prev) === JSON.stringify(serverChat) ? prev : serverChat);
          setSupportTickets(prev => JSON.stringify(prev) === JSON.stringify(serverSupport) ? prev : serverSupport);
          setPrivateMessages(prev => JSON.stringify(prev) === JSON.stringify(serverPM) ? prev : serverPM);
          if (serverGuides.length > 0) setGuides(prev => JSON.stringify(prev) === JSON.stringify(serverGuides) ? prev : serverGuides);
          if (serverSettings) setSiteSettings(prev => JSON.stringify(prev) === JSON.stringify(serverSettings) ? prev : serverSettings);
          if (serverWiki.length > 0) setWikiArticles(prev => JSON.stringify(prev) === JSON.stringify(serverWiki) ? prev : serverWiki);
            // Merge Supabase accounts into registeredUsers
          if (accounts.length > 0) {
            const supabaseUsers: RegisteredUser[] = accounts.map(acc => ({
              id: acc.id, email: '', name: acc.username, picture: acc.picture || '',
              gameNickname: acc.game_nickname || '', role: acc.role,
              joinedAt: acc.created_at ? new Date(acc.created_at).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU'),
              lastSeen: '—', isBanned: false,
            }));
            setRegisteredUsers(prev => {
              const merged = [...supabaseUsers];
              // Always include current user if logged in
              if (userRef.current && !merged.find(u => u.id === userRef.current!.id)) {
                const cu = userRef.current;
                merged.push({ id: cu.id, email: cu.email || '', name: cu.name, picture: cu.picture || '', gameNickname: cu.gameNickname || '', role: cu.role, joinedAt: new Date().toLocaleDateString('ru-RU'), lastSeen: new Date().toLocaleDateString('ru-RU'), lastActiveAt: Date.now(), isBanned: false });
              }
              for (const su of serverUsers) {
                if (!merged.find(u => u.id === su.id)) merged.push(su);
                else { const idx = merged.findIndex(u => u.id === su.id); merged[idx] = { ...merged[idx], ...su, lastSeen: su.lastSeen || merged[idx].lastSeen }; }
              }
              for (const pu of prev) {
                const mu = merged.find(u => u.id === pu.id);
                if (mu) { mu.lastActiveAt = pu.lastActiveAt; mu.lastSeen = pu.lastSeen || mu.lastSeen; }
              }
              return JSON.stringify(prev) === JSON.stringify(merged) ? prev : merged;
            });
          } else if (serverUsers.length > 0) {
            setRegisteredUsers(prev => JSON.stringify(prev) === JSON.stringify(serverUsers) ? prev : serverUsers);
          }
        }
      } catch {}
    };
    const interval = setInterval(poll, 2000); return () => { cancelled = true; clearInterval(interval); };
  }, [ready]);

  const registerUser = (u: User) => {
    const now = new Date().toLocaleDateString('ru-RU'); const nowTs = Date.now();
    setRegisteredUsers(prev => {
      const exists = prev.find(r => r.id === u.id);
      if (exists) return prev.map(r => r.id === u.id ? { ...r, lastSeen: now, lastActiveAt: nowTs, name: u.name, email: u.email, picture: u.picture, gameNickname: u.gameNickname } : r);
      return [...prev, { id: u.id, email: u.email, name: u.name, picture: u.picture, gameNickname: u.gameNickname, role: u.role, joinedAt: now, lastSeen: now, lastActiveAt: nowTs, isBanned: false }];
    });
  };

  const loginWithPassword = async (username: string, password: string, remember: boolean): Promise<string | null> => {
    const account = await dbGetAccountByUsername(username);
    if (!account) return 'Пользователь не найден';
    if (account.password_hash !== password) return 'Неверный пароль';
    const reg = registeredUsers.find(r => r.id === account.id);
    if (reg?.isBanned) return 'Аккаунт заблокирован';
    const u: User = { id: account.id, email: '', name: account.username, picture: account.picture || '', gameNickname: account.game_nickname || '', role: account.role };
    setUser(u); saveToLS('wwm_user', u);
    if (remember) saveToLS('wwm_remember', true); else { localStorage.removeItem('wwm_remember'); }
    registerUser(u);
    const serverProgress = await dbLoadProgress(u.id);
    if (serverProgress) setProgress(serverProgress as unknown as UserProgress);
    else { const localP = loadFromLS<UserProgress | null>(`wwm_progress_${u.id}`, null); if (localP) setProgress(localP); }
    return null;
  };

  const register = async (username: string, password: string, gameNickname = ''): Promise<string | null> => {
    if (username.trim().length < 3) return 'Логин минимум 3 символа';
    if (password.length < 4) return 'Пароль минимум 4 символа';
    const result = await dbCreateAccount(username.trim(), password, gameNickname.trim());
    if ('error' in result) return result.error;
    const u: User = { id: result.id, email: '', name: result.username, picture: result.picture || '', gameNickname: result.game_nickname || '', role: 'user' };
    setUser(u); saveToLS('wwm_user', u); saveToLS('wwm_remember', true); registerUser(u);
    return null;
  };

  const logout = async () => {
    if (user) { saveToLS(`wwm_progress_${user.id}`, progress); await dbSaveProgress(user.id, progress as unknown as Record<string, unknown>); }
    setUser(null); setProgress(defaultProgress);
    localStorage.removeItem('wwm_user'); sessionStorage.removeItem('wwm_user');
    localStorage.removeItem('wwm_progress'); sessionStorage.removeItem('wwm_progress');
    localStorage.removeItem('wwm_remember'); sessionStorage.removeItem('wwm_remember');
  };

  const setUserRole = (role: UserRole) => { if (user) { const u = { ...user, role }; setUser(u); saveToLS('wwm_user', u); saveToLS(`wwm_role_${user.id}`, role); } };
  const isEditor = () => !!user && (user.role === 'editor' || user.role === 'admin');
  const isAdmin = () => !!user && user.role === 'admin';
  const adminSetUserRole = (userId: string, role: UserRole) => { if (!isAdmin()) return; setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u)); localStorage.setItem(`wwm_role_${userId}`, role); dbUpdateAccount(userId, { role }); };
  const adminBanUser = (userId: string, banned: boolean) => { if (!isAdmin()) return; setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: banned } : u)); };
  const adminDeleteUser = (userId: string) => { if (!isAdmin()) return; setRegisteredUsers(prev => prev.filter(u => u.id !== userId)); dbDeleteAccount(userId); };
  const isUserOnline = (userId: string) => { const serverTs = onlineStatuses[userId]; if (serverTs && Date.now() - serverTs < 30000) return true; const ue = registeredUsers.find(u => u.id === userId); if (!ue?.lastActiveAt) return false; return Date.now() - ue.lastActiveAt < 30000; };
  const updateSiteSettings = (updates: Partial<SiteSettings>) => { if (!isAdmin()) return; setSiteSettings(prev => ({ ...prev, ...updates })); };
  const addAnnouncement = (text: string, type: 'info' | 'warning' | 'success') => { if (!isAdmin()) return; setSiteSettings(prev => ({ ...prev, announcements: [{ id: 'ann_' + Date.now(), text, type, active: true }, ...prev.announcements] })); };
  const removeAnnouncement = (id: string) => { if (!isAdmin()) return; setSiteSettings(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) })); };
  const updateProgress = (updates: Partial<UserProgress>) => setProgress(prev => ({ ...prev, ...updates }));
  const toggleFavoriteWeapon = (weaponId: string) => setProgress(prev => ({ ...prev, favoriteWeapons: prev.favoriteWeapons.includes(weaponId) ? prev.favoriteWeapons.filter(id => id !== weaponId) : [...prev.favoriteWeapons, weaponId] }));
  const toggleFavoriteSect = (sectId: string) => setProgress(prev => ({ ...prev, favoriteSects: prev.favoriteSects.includes(sectId) ? prev.favoriteSects.filter(id => id !== sectId) : [...prev.favoriteSects, sectId] }));
  const toggleCompletedGuide = (guideId: string) => setProgress(prev => ({ ...prev, completedGuides: prev.completedGuides.includes(guideId) ? prev.completedGuides.filter(id => id !== guideId) : [...prev.completedGuides, guideId] }));
  const toggleVisitedRegion = (regionId: string) => setProgress(prev => ({ ...prev, visitedRegions: prev.visitedRegions.includes(regionId) ? prev.visitedRegions.filter(id => id !== regionId) : [...prev.visitedRegions, regionId] }));
  const addNote = (title: string, content: string) => setProgress(prev => ({ ...prev, notes: [{ id: 'note_' + Date.now(), title, content, date: new Date().toLocaleDateString('ru-RU') }, ...prev.notes] }));
  const deleteNote = (noteId: string) => setProgress(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }));
  const setSelectedBuild = (buildId: string | null) => setProgress(prev => ({ ...prev, selectedBuild: buildId }));
  const updateUserPicture = (picture: string) => { if (!user) return; const u = { ...user, picture }; setUser(u); saveToLS('wwm_user', u); setRegisteredUsers(prev => prev.map(r => r.id === user.id ? { ...r, picture } : r)); dbUpdateAccount(user.id, { picture }); };
  const updateUserGameNickname = (gameNickname: string) => { if (!user) return; const u = { ...user, gameNickname }; setUser(u); saveToLS('wwm_user', u); setRegisteredUsers(prev => prev.map(r => r.id === user.id ? { ...r, gameNickname } : r)); dbUpdateAccount(user.id, { game_nickname: gameNickname }); };
  const addGuide = (guide: Omit<GuideArticle, 'id' | 'authorName' | 'updatedAt'>) => { if (!isEditor()) return; const now = new Date().toLocaleDateString('ru-RU'); setGuides(prev => [{ ...guide, id: 'guide_' + Date.now(), authorName: user!.name, updatedAt: now }, ...prev]); };
  const updateGuide = (id: string, updates: Partial<GuideArticle>) => { if (!isEditor()) return; setGuides(prev => prev.map(g => g.id === id ? { ...g, ...updates, updatedAt: new Date().toLocaleDateString('ru-RU') } : g)); };
  const deleteGuide = (id: string) => { if (!isEditor()) return; setGuides(prev => prev.filter(g => g.id !== id)); };
  const getRoleConfig = (role: UserRole): RoleConfig => siteSettings.roles.find(r => r.id === role) || siteSettings.roles[0];
  const updateRoleDisplayName = (roleId: UserRole, newName: string) => { if (!isAdmin()) return; setSiteSettings(prev => ({ ...prev, roles: prev.roles.map(r => r.id === roleId ? { ...r, displayName: newName } : r) })); };
  const updateRoleColor = (roleId: UserRole, newColor: string) => { if (!isAdmin()) return; setSiteSettings(prev => ({ ...prev, roles: prev.roles.map(r => r.id === roleId ? { ...r, color: newColor } : r) })); };
  const hasPermission = (permission: string): boolean => { if (!user) return false; return getRoleConfig(user.role).permissions.includes(permission); };
  const addRole = (displayName: string, color: string, permissions: string[]) => { if (!isAdmin()) return; setSiteSettings(prev => ({ ...prev, roles: [...prev.roles, { id: 'role_' + Date.now(), displayName, color, permissions }] })); };
  const deleteRole = (roleId: string) => { if (!isAdmin()) return; if (['user','editor','admin'].includes(roleId)) return; setRegisteredUsers(prev => prev.map(u => u.role === roleId ? { ...u, role: 'user' } : u)); setSiteSettings(prev => ({ ...prev, roles: prev.roles.filter(r => r.id !== roleId) })); };
  const updateRolePermissions = (roleId: string, permissions: string[]) => { if (!isAdmin()) return; setSiteSettings(prev => ({ ...prev, roles: prev.roles.map(r => r.id === roleId ? { ...r, permissions } : r) })); };
  const addWikiArticle = (article: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => { if (!isEditor()) return; setWikiArticles(prev => [{ ...article, id: 'wiki_' + Date.now(), authorName: user!.name, updatedAt: new Date().toLocaleDateString('ru-RU') }, ...prev]); };
  const updateWikiArticle = (id: string, updates: Partial<WikiArticle>) => { if (!isEditor()) return; setWikiArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toLocaleDateString('ru-RU') } : a)); };
  const deleteWikiArticle = (id: string) => { if (!isEditor()) return; setWikiArticles(prev => prev.filter(a => a.id !== id)); };
  const createTicket = (subject: string, message: string) => { if (!user) return; setSupportTickets(prev => [{ id: 'ticket_' + Date.now(), userId: user.id, userName: user.name, subject, message, status: 'open', createdAt: new Date().toLocaleDateString('ru-RU'), replies: [] }, ...prev]); };
  const replyToTicket = (ticketId: string, message: string) => { if (!user) return; const rc = getRoleConfig(user.role); setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: isAdmin() || isEditor() ? 'answered' : t.status, replies: [...t.replies, { id: 'reply_' + Date.now(), authorName: user.name, authorRole: rc.displayName, message, createdAt: new Date().toLocaleDateString('ru-RU') }] } : t)); };
  const closeTicket = (ticketId: string) => { setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t)); };
  const deleteTicket = (ticketId: string) => { if (!isAdmin()) return; setSupportTickets(prev => prev.filter(t => t.id !== ticketId)); };
  const sendMessage = (text: string) => { if (!user || !text.trim() || isUserMuted(user.id)) return; setChatState(prev => ({ ...prev, messages: [...prev.messages.slice(-200), { id: 'msg_' + Date.now(), userId: user.id, userName: user.name, userRole: user.role, text: text.trim(), timestamp: Date.now() }] })); };
  const deleteMessage = (msgId: string) => { if (!hasPermission('chat.delete')) return; setChatState(prev => ({ ...prev, messages: prev.messages.map(m => m.id === msgId ? { ...m, deleted: true } : m) })); };
  const muteUser = (userId: string, minutes: number) => { if (!hasPermission('chat.mute')) return; setChatState(prev => ({ ...prev, mutedUsers: [...prev.mutedUsers.filter(m => m.userId !== userId), { userId, until: Date.now() + minutes * 60000 }] })); };
  const unmuteUser = (userId: string) => { if (!hasPermission('chat.mute')) return; setChatState(prev => ({ ...prev, mutedUsers: prev.mutedUsers.filter(m => m.userId !== userId) })); };
  const isUserMuted = (userId: string): boolean => { const entry = chatState.mutedUsers.find(m => m.userId === userId); return entry ? Date.now() <= entry.until : false; };
  const chatBanUser = (userId: string) => { if (!hasPermission('chat.ban')) return; muteUser(userId, 525600); setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: true } : u)); };

  // Private Messages
  const sendPrivateMessage = (toId: string, toName: string, text: string) => {
    if (!user || !text.trim()) return;
    const pm: PrivateMessage = { id: 'pm_' + Date.now(), fromId: user.id, fromName: user.name, toId, toName, text: text.trim(), timestamp: Date.now(), read: false };
    setPrivateMessages(prev => [...prev, pm].slice(-500));
  };
  const markPMRead = (fromId: string) => {
    setPrivateMessages(prev => prev.map(m => m.fromId === fromId && m.toId === user?.id && !m.read ? { ...m, read: true } : m));
  };
  const unreadPMCount = privateMessages.filter(m => m.toId === user?.id && !m.read).length;

  return (
    <AuthContext.Provider value={{
      user, progress, guides, registeredUsers, siteSettings, isLoading, wikiArticles, supportTickets, chatState,
      privateMessages, unreadPMCount, sendPrivateMessage, markPMRead,
      loginWithPassword, register, logout, updateProgress,
      toggleFavoriteWeapon, toggleFavoriteSect, toggleCompletedGuide, toggleVisitedRegion,
      addNote, deleteNote, setSelectedBuild, updateUserPicture, updateUserGameNickname,
      addGuide, updateGuide, deleteGuide, setUserRole, isEditor, isAdmin,
      adminSetUserRole, adminBanUser, adminDeleteUser, isUserOnline,
      updateSiteSettings, addAnnouncement, removeAnnouncement,
      getRoleConfig, updateRoleDisplayName, updateRoleColor, hasPermission,
      addRole, deleteRole, updateRolePermissions,
      addWikiArticle, updateWikiArticle, deleteWikiArticle,
      createTicket, replyToTicket, closeTicket, deleteTicket,
      sendMessage, deleteMessage, muteUser, unmuteUser, isUserMuted, chatBanUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { dbGetAccountByUsername, dbCreateAccount, dbUpdateAccount, dbDeleteAccount, dbLoadProgress, dbSaveProgress, dbInit, dbLoadSiteData, dbSaveSiteData } from '../lib/db';

export type UserRole = string;

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  gameNickname?: string;
  isDemo?: boolean;
  role: UserRole;
}

export interface GuideArticle {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  readTime: string;
  summary: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  icon: string;
}

export interface UserProgress {
  completedGuides: string[];
  favoriteWeapons: string[];
  favoriteSects: string[];
  visitedRegions: string[];
  notes: { id: string; title: string; content: string; date: string }[];
  selectedBuild: string | null;
}

export interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  gameNickname?: string;
  role: UserRole;
  joinedAt: string;
  lastSeen: string;
  isBanned: boolean;
}

export interface RoleConfig {
  id: UserRole;
  displayName: string;
  color: string;
  permissions: string[];
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  text: string;
  timestamp: number;
  deleted?: boolean;
}

export interface ChatState {
  messages: ChatMessage[];
  mutedUsers: { userId: string; until: number }[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  discordUrl: string;
  maintenanceMode: boolean;
  announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[];
  roles: RoleConfig[];
}

export interface AuthAccount {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'answered' | 'closed';
  createdAt: string;
  replies: { id: string; authorName: string; authorRole: string; message: string; createdAt: string }[];
}

export interface WikiArticle {
  id: string;
  section: string; // 'weapons' | 'builds' | 'sects' | 'bosses' | 'mystic' | 'cooking'
  title: string;
  content: string;
  icon: string;
  authorName: string;
  updatedAt: string;
  fields: Record<string, string>; // flexible key-value fields per section
}

interface AuthContextType {
  user: User | null;
  progress: UserProgress;
  guides: GuideArticle[];
  registeredUsers: RegisteredUser[];
  siteSettings: SiteSettings;
  isLoading: boolean;
  loginWithPassword: (username: string, password: string, remember: boolean) => Promise<string | null>;
  register: (username: string, password: string, gameNickname?: string) => Promise<string | null>;
  logout: () => Promise<void> | void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  toggleFavoriteWeapon: (weaponId: string) => void;
  toggleFavoriteSect: (sectId: string) => void;
  toggleCompletedGuide: (guideId: string) => void;
  toggleVisitedRegion: (regionId: string) => void;
  addNote: (title: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  setSelectedBuild: (buildId: string | null) => void;
  updateUserPicture: (picture: string) => void;
  updateUserGameNickname: (gameNickname: string) => void;
  addGuide: (guide: Omit<GuideArticle, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>) => void;
  updateGuide: (id: string, updates: Partial<GuideArticle>) => void;
  deleteGuide: (id: string) => void;
  setUserRole: (role: UserRole) => void;
  isEditor: () => boolean;
  isAdmin: () => boolean;
  adminSetUserRole: (userId: string, role: UserRole) => void;
  adminBanUser: (userId: string, banned: boolean) => void;
  adminDeleteUser: (userId: string) => void;
  updateSiteSettings: (updates: Partial<SiteSettings>) => void;
  addAnnouncement: (text: string, type: 'info' | 'warning' | 'success') => void;
  removeAnnouncement: (id: string) => void;
  getRoleConfig: (role: UserRole) => RoleConfig;
  updateRoleDisplayName: (roleId: UserRole, newName: string) => void;
  updateRoleColor: (roleId: UserRole, newColor: string) => void;
  hasPermission: (permission: string) => boolean;
  addRole: (displayName: string, color: string, permissions: string[]) => void;
  deleteRole: (roleId: string) => void;
  updateRolePermissions: (roleId: string, permissions: string[]) => void;
  wikiArticles: WikiArticle[];
  addWikiArticle: (article: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => void;
  updateWikiArticle: (id: string, updates: Partial<WikiArticle>) => void;
  deleteWikiArticle: (id: string) => void;
  supportTickets: SupportTicket[];
  createTicket: (subject: string, message: string) => void;
  replyToTicket: (ticketId: string, message: string) => void;
  closeTicket: (ticketId: string) => void;
  deleteTicket: (ticketId: string) => void;
  chatState: ChatState;
  sendMessage: (text: string) => void;
  deleteMessage: (msgId: string) => void;
  muteUser: (userId: string, minutes: number) => void;
  unmuteUser: (userId: string) => void;
  isUserMuted: (userId: string) => boolean;
  chatBanUser: (userId: string) => void;
}

const defaultProgress: UserProgress = {
  completedGuides: [],
  favoriteWeapons: [],
  favoriteSects: [],
  visitedRegions: [],
  notes: [],
  selectedBuild: null,
};

// Default guides seeded on first load
const defaultGuides: GuideArticle[] = [
  {
    id: 'guide-beginner',
    title: 'Полное руководство для новичков',
    category: 'Новичкам',
    difficulty: 'Начальный',
    readTime: '15 мин',
    summary: 'Всё, что нужно знать перед началом игры: выбор режима, первые шаги, базовые механики.',
    content: `## Начало игры\n\nПри создании персонажа вам предложат выбрать: режим наведения для исследования, тип управления (ARPG или MMORPG), сложность, социальные предпочтения и режим игры (Соло или Онлайн).\n\n## Система оружия\n\nВ игре нет жёстких классов. Ваш боевой стиль определяется выбранным оружием и освоенными боевыми искусствами. Вы начинаете с Безымянного Меча и Безымянного Копья.\n\nКаждый персонаж может экипировать два оружия одновременно, обычно с взаимодополняющими наборами навыков.\n\n## Кража Навыков\n\nСистема «Кражи Навыков» позволяет изучать техники любой секты без вступления в неё. Найдите мастера, победите его и овладейте его стилем.\n\n## Передвижение\n\nИсследуйте мир свободно: взбирайтесь на крыши паркуром, используйте Windstride для быстрого перемещения или точки быстрого путешествия.\n\n## Последствия\n\nВаши действия имеют последствия: нарушение закона может привести к преследованию и даже заключению, а благородные деяния принесут славу героя.\n\n## Советы\n\n- Начните с билда Bellstrike — Splendor\n- Не торопитесь вступать в секту\n- Исследуйте каждый уголок\n- Используйте Windstride\n- Попробуйте разные профессии`,
    authorId: 'system',
    authorName: 'Nocthra Wiki',
    createdAt: '2025-11-15',
    updatedAt: '2025-11-15',
    icon: '📖',
  },
  {
    id: 'guide-combat',
    title: 'Боевая система: полный гайд',
    category: 'Бой',
    difficulty: 'Средний',
    readTime: '20 мин',
    summary: 'Подробный разбор боевой системы: парирование, уклонение, комбо, мистические искусства.',
    content: `## Основы боя\n\nБоевая система сочетает ближний и дальний бой, стелс и боевые искусства.\n\n## Оружие\n\nКаждое оружие имеет лёгкие и тяжёлые атаки, конверсию и уникальные навыки.\n\n## Парирование\n\nПарирование — ключевой навык. Окно парирования ~200мс до удара. Успешное парирование красных атак наносит массивный stagger-урон.\n\n**Важно:** Если босс наносит серию ударов, одно идеальное парирование может отменить всю серию.\n\n## Уклонение\n\nPerfect Dodge даёт i-frames и замедление времени (отключено в PvP). Сохраняйте dodge для критических моментов.\n\n## Execute\n\nКогда появляется подсказка Execute (F) — не нажимайте сразу! Продолжайте атаковать до последней секунды таймера для максимального урона.\n\n## Смена оружия\n\nНажатие Tab атакует и одновременно меняет оружие. Это основа продвинутых комбо.\n\n## Мистические Искусства\n\nБолее 40 уникальных техник: Тайцзи, Рёв Льва, Милосердный Захват, Удар по Точкам.\n\n## Советы\n\n- Практикуйте парирование\n- Изучите тайминги каждого оружия\n- Используйте Mystic Arts для контроля\n- Tab-swap для комбо между оружием`,
    authorId: 'system',
    authorName: 'Nocthra Wiki',
    createdAt: '2025-11-15',
    updatedAt: '2025-11-15',
    icon: '⚔️',
  },
  {
    id: 'guide-skill-theft',
    title: 'Система Кражи Навыков',
    category: 'Механики',
    difficulty: 'Средний',
    readTime: '10 мин',
    summary: 'Как работает уникальная система кражи техник у мастеров сект.',
    content: `## Что такое Кража Навыков?\n\nУникальная механика, позволяющая изучать боевые техники любой секты без вступления в неё.\n\n## Как это работает\n\n1. Каждое боевое искусство имеет святилище (Sanctum)\n2. Найдите мастера техники\n3. Вступите с ним в бой и победите\n4. Техника становится доступной\n\n## Преимущества\n\n- Не нужно вступать в секту\n- Можно комбинировать техники из разных школ\n- Создание гибридных билдов\n\n## Советы\n\n- Святилища отмечены на карте\n- Некоторые мастера очень сильны — подготовьтесь\n- Кража навыка не делает вас врагом секты`,
    authorId: 'system',
    authorName: 'Nocthra Wiki',
    createdAt: '2025-11-15',
    updatedAt: '2025-11-15',
    icon: '🥷',
  },
  {
    id: 'guide-coop',
    title: 'Кооператив и Рейды',
    category: 'Кооператив',
    difficulty: 'Средний',
    readTime: '12 мин',
    summary: 'Как проходить подземелья и рейды в группе до 4 человек.',
    content: `## Кооператив\n\nОбъединяйтесь до 4 игроков для подземелий и рейдов.\n\n## Оптимальный состав\n\n- 1 танк (Stonesplit — Might)\n- 1-2 DPS (Bellstrike / Bamboocut)\n- 1 целитель (Silkbind — Deluge)\n\n## Роли\n\n**Танк** использует провокацию для удержания агро. **DPS** концентрируется на уроне. **Целитель** поддерживает команду.\n\n## Еженедельные подземелья\n\nДоступны с ур. 50+ и 9000+ Martial Arts Score. Лучший источник экипировки.\n\n## Советы\n\n- Panacea Fan незаменим в рейдах\n- Координируйте ультимативные способности\n- Используйте баффы от кулинарии`,
    authorId: 'system',
    authorName: 'Nocthra Wiki',
    createdAt: '2025-11-15',
    updatedAt: '2025-11-15',
    icon: '👥',
  },
];

const AuthContext = createContext<AuthContextType | null>(null);

const defaultSiteSettings: SiteSettings = {
  siteName: 'WWM Wiki — Nocthra',
  siteDescription: 'Русскоязычная база знаний по Where Winds Meet',
  discordUrl: 'https://discord.gg/nocthra',
  maintenanceMode: false,
  announcements: [],
  roles: [
    { id: 'user', displayName: 'Странник', color: '#b0a696', permissions: ['read', 'profile', 'favorites', 'chat.write'] },
    { id: 'moderator', displayName: 'Модератор', color: '#00bcd4', permissions: ['read', 'profile', 'favorites', 'chat.write', 'chat.delete', 'chat.mute', 'chat.ban', 'support.view_all', 'support.reply', 'support.close'] },
    { id: 'editor', displayName: 'Редактор', color: '#d4a528', permissions: ['read', 'profile', 'favorites', 'chat.write', 'guides.create', 'guides.edit', 'guides.delete', 'support.view_all', 'support.reply'] },
    { id: 'admin', displayName: 'Администратор', color: '#a882ff', permissions: ['read', 'profile', 'favorites', 'chat.write', 'chat.delete', 'chat.mute', 'chat.ban', 'guides.create', 'guides.edit', 'guides.delete', 'guild.edit', 'support.view_all', 'support.reply', 'support.close', 'support.delete', 'users.manage', 'users.ban', 'users.roles', 'site.settings', 'site.announcements', 'admin.panel'] },
  ],
};

// Read from localStorage/sessionStorage synchronously — double backup
function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved);
    // Fallback to sessionStorage backup
    const session = sessionStorage.getItem(key);
    if (session) {
      localStorage.setItem(key, session);
      return JSON.parse(session);
    }
  } catch {}
  return fallback;
}

// Save to both localStorage and sessionStorage
function saveToLS(key: string, data: unknown): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    sessionStorage.setItem(key, serialized);
  } catch {}
}

function initSiteSettings(): SiteSettings {
  const saved = loadFromLS<SiteSettings | null>('wwm_site_settings', null);
  if (!saved) return defaultSiteSettings;
  if (saved.roles) {
    const ensurePerm = (roleId: string, perms: string[]) => {
      const role = saved.roles.find(r => r.id === roleId);
      if (role) {
        perms.forEach(p => {
          if (!role.permissions.includes(p)) role.permissions.push(p);
        });
      }
    };
    ensurePerm('admin', ['guild.edit', 'support.view_all', 'support.reply', 'support.close', 'support.delete']);
    ensurePerm('moderator', ['support.view_all', 'support.reply', 'support.close']);
    ensurePerm('editor', ['support.view_all', 'support.reply']);
  }
  return saved;
}

function initGuides(): GuideArticle[] {
  const saved = loadFromLS<GuideArticle[] | null>('wwm_guides', null);
  if (saved) return saved;
  saveToLS('wwm_guides', defaultGuides);
  return defaultGuides;
}

function initAccounts(): void {
  let accounts: AuthAccount[] = loadFromLS('wwm_accounts', []);
  // Also try backup
  if (accounts.length === 0) {
    try {
      const backup = localStorage.getItem('wwm_accounts_backup') || sessionStorage.getItem('wwm_accounts_backup');
      if (backup) accounts = JSON.parse(backup);
    } catch {}
  }
  if (!accounts.find(a => a.username === 'admin')) {
    accounts.push({ id: 'admin_root', username: 'admin', passwordHash: 'admin', role: 'admin', createdAt: new Date().toLocaleDateString('ru-RU') });
  }
  saveToLS('wwm_accounts', accounts);
  saveToLS('wwm_accounts_backup', accounts);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage (instant), then sync from Supabase
  const [user, setUser] = useState<User | null>(() => loadFromLS('wwm_user', null));
  const [progress, setProgress] = useState<UserProgress>(() => loadFromLS('wwm_progress', defaultProgress));
  const [guides, setGuides] = useState<GuideArticle[]>(initGuides);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => loadFromLS('wwm_registered_users', []));
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initSiteSettings);
  const [chatState, setChatState] = useState<ChatState>(() => loadFromLS('wwm_chat', { messages: [], mutedUsers: [] }));
  const [wikiArticles, setWikiArticles] = useState<WikiArticle[]>(() => loadFromLS('wwm_wiki', []));
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => loadFromLS('wwm_support', []));
  const [isLoading, setIsLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Init: load all shared data from Supabase, then mark ready
  useEffect(() => {
    (async () => {
      await dbInit();
      initAccounts();

      // Load shared data from server (overrides localStorage)
      const [serverGuides, serverUsers, serverSettings, serverChat, serverWiki, serverSupport, serverGuild] = await Promise.all([
        dbLoadSiteData<GuideArticle[]>('guides', []),
        dbLoadSiteData<RegisteredUser[]>('registered_users', []),
        dbLoadSiteData<SiteSettings | null>('site_settings', null),
        dbLoadSiteData<ChatState>('chat', { messages: [], mutedUsers: [] }),
        dbLoadSiteData<WikiArticle[]>('wiki', []),
        dbLoadSiteData<SupportTicket[]>('support', []),
        dbLoadSiteData<null>('guild', null),
      ]);

      if (serverGuides.length > 0) setGuides(serverGuides);
      if (serverUsers.length > 0) setRegisteredUsers(serverUsers);
      if (serverSettings) setSiteSettings(serverSettings);
      if (serverChat.messages.length > 0) setChatState(serverChat);
      if (serverWiki.length > 0) setWikiArticles(serverWiki);
      if (serverSupport.length > 0) setSupportTickets(serverSupport);
      if (serverGuild) {
        try { localStorage.setItem('wwm_guild', JSON.stringify(serverGuild)); } catch {}
      }

      setIsLoading(false);
      setReady(true);
    })();
  }, []);

  // Save to localStorage + Supabase on every change (only after initial load)
  useEffect(() => {
    if (user) {
      saveToLS('wwm_progress', progress);
      dbSaveProgress(user.id, progress as unknown as Record<string, unknown>);
    }
  }, [progress, user]);
  useEffect(() => { if (ready) { saveToLS('wwm_guides', guides); dbSaveSiteData('guides', guides); } }, [guides, ready]);
  useEffect(() => { if (ready) { saveToLS('wwm_registered_users', registeredUsers); dbSaveSiteData('registered_users', registeredUsers); } }, [registeredUsers, ready]);
  useEffect(() => { if (ready) { saveToLS('wwm_site_settings', siteSettings); dbSaveSiteData('site_settings', siteSettings); } }, [siteSettings, ready]);
  useEffect(() => { if (ready) { saveToLS('wwm_chat', chatState); dbSaveSiteData('chat', chatState); } }, [chatState, ready]);
  useEffect(() => { if (ready) { saveToLS('wwm_wiki', wikiArticles); dbSaveSiteData('wiki', wikiArticles); } }, [wikiArticles, ready]);
  useEffect(() => { if (ready) { saveToLS('wwm_support', supportTickets); dbSaveSiteData('support', supportTickets); } }, [supportTickets, ready]);

  // Register user on login
  const registerUser = (u: User) => {
    const now = new Date().toLocaleDateString('ru-RU');
    setRegisteredUsers(prev => {
      const exists = prev.find(r => r.id === u.id);
      if (exists) return prev.map(r => r.id === u.id ? { ...r, lastSeen: now, name: u.name, email: u.email, picture: u.picture, gameNickname: u.gameNickname } : r);
      return [...prev, { id: u.id, email: u.email, name: u.name, picture: u.picture, gameNickname: u.gameNickname, role: u.role, joinedAt: now, lastSeen: now, isBanned: false }];
    });
  };

  const loginWithPassword = async (username: string, password: string, remember: boolean): Promise<string | null> => {
    // Try Supabase first, then localStorage
    const account = await dbGetAccountByUsername(username);
    if (!account) return 'Пользователь не найден';
    if (account.password_hash !== password) return 'Неверный пароль';

    const reg = registeredUsers.find(r => r.id === account.id);
    if (reg?.isBanned) return 'Аккаунт заблокирован';

    const savedRole = localStorage.getItem(`wwm_role_${account.id}`);
    const u: User = {
      id: account.id,
      email: '',
      name: account.username,
      picture: account.picture || reg?.picture || '',
      gameNickname: account.game_nickname || reg?.gameNickname || '',
      role: (savedRole as UserRole) || account.role,
    };
    setUser(u);
    saveToLS('wwm_user', u);
    if (remember) saveToLS('wwm_remember', true);
    else { localStorage.removeItem('wwm_remember'); sessionStorage.removeItem('wwm_remember'); }
    registerUser(u);

    // Load progress from server or localStorage
    const serverProgress = await dbLoadProgress(u.id);
    if (serverProgress) {
      setProgress(serverProgress as unknown as UserProgress);
    } else {
      const localProgress = loadFromLS<UserProgress | null>(`wwm_progress_${u.id}`, null);
      if (localProgress) setProgress(localProgress);
    }
    return null;
  };

  const register = async (username: string, password: string, gameNickname = ''): Promise<string | null> => {
    if (username.trim().length < 3) return 'Логин минимум 3 символа';
    if (password.length < 4) return 'Пароль минимум 4 символа';

    const result = await dbCreateAccount(username.trim(), password, gameNickname.trim());
    if ('error' in result) return result.error;

    const u: User = {
      id: result.id,
      email: '',
      name: result.username,
      picture: result.picture || '',
      gameNickname: result.game_nickname || '',
      role: 'user',
    };
    setUser(u);
    saveToLS('wwm_user', u);
    saveToLS('wwm_remember', true);
    registerUser(u);
    return null;
  };

  const logout = async () => {
    if (user) {
      saveToLS(`wwm_progress_${user.id}`, progress);
      // Also save to server
      await dbSaveProgress(user.id, progress as unknown as Record<string, unknown>);
    }
    setUser(null); setProgress(defaultProgress);
    localStorage.removeItem('wwm_user'); sessionStorage.removeItem('wwm_user');
    localStorage.removeItem('wwm_progress'); sessionStorage.removeItem('wwm_progress');
    localStorage.removeItem('wwm_remember'); sessionStorage.removeItem('wwm_remember');
  };

  const setUserRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
      saveToLS('wwm_user', updated);
      saveToLS(`wwm_role_${user.id}`, role);
    }
  };

  const isEditor = () => !!user && (user.role === 'editor' || user.role === 'admin');
  const isAdmin = () => !!user && user.role === 'admin';

  const adminSetUserRole = (userId: string, role: UserRole) => {
    if (!isAdmin()) return;
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    localStorage.setItem(`wwm_role_${userId}`, role);
    dbUpdateAccount(userId, { role });
  };
  const adminBanUser = (userId: string, banned: boolean) => {
    if (!isAdmin()) return;
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: banned } : u));
  };
  const adminDeleteUser = (userId: string) => {
    if (!isAdmin()) return;
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
    dbDeleteAccount(userId);
  };

  const updateSiteSettings = (updates: Partial<SiteSettings>) => {
    if (!isAdmin()) return;
    setSiteSettings(prev => ({ ...prev, ...updates }));
  };
  const addAnnouncement = (text: string, type: 'info' | 'warning' | 'success') => {
    if (!isAdmin()) return;
    setSiteSettings(prev => ({
      ...prev,
      announcements: [{ id: 'ann_' + Date.now(), text, type, active: true }, ...prev.announcements],
    }));
  };
  const removeAnnouncement = (id: string) => {
    if (!isAdmin()) return;
    setSiteSettings(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
  };

  const updateProgress = (updates: Partial<UserProgress>) => setProgress(prev => ({ ...prev, ...updates }));

  const toggleFavoriteWeapon = (weaponId: string) => {
    setProgress(prev => ({ ...prev, favoriteWeapons: prev.favoriteWeapons.includes(weaponId) ? prev.favoriteWeapons.filter(id => id !== weaponId) : [...prev.favoriteWeapons, weaponId] }));
  };
  const toggleFavoriteSect = (sectId: string) => {
    setProgress(prev => ({ ...prev, favoriteSects: prev.favoriteSects.includes(sectId) ? prev.favoriteSects.filter(id => id !== sectId) : [...prev.favoriteSects, sectId] }));
  };
  const toggleCompletedGuide = (guideId: string) => {
    setProgress(prev => ({ ...prev, completedGuides: prev.completedGuides.includes(guideId) ? prev.completedGuides.filter(id => id !== guideId) : [...prev.completedGuides, guideId] }));
  };
  const toggleVisitedRegion = (regionId: string) => {
    setProgress(prev => ({ ...prev, visitedRegions: prev.visitedRegions.includes(regionId) ? prev.visitedRegions.filter(id => id !== regionId) : [...prev.visitedRegions, regionId] }));
  };
  const addNote = (title: string, content: string) => {
    setProgress(prev => ({ ...prev, notes: [{ id: 'note_' + Date.now(), title, content, date: new Date().toLocaleDateString('ru-RU') }, ...prev.notes] }));
  };
  const deleteNote = (noteId: string) => {
    setProgress(prev => ({ ...prev, notes: prev.notes.filter(n => n.id !== noteId) }));
  };
  const setSelectedBuild = (buildId: string | null) => {
    setProgress(prev => ({ ...prev, selectedBuild: buildId }));
  };

  const updateUserPicture = (picture: string) => {
    if (!user) return;
    const updated = { ...user, picture };
    setUser(updated);
    saveToLS('wwm_user', updated);
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? { ...u, picture } : u));
    dbUpdateAccount(user.id, { picture });
  };

  const updateUserGameNickname = (gameNickname: string) => {
    if (!user) return;
    const updated = { ...user, gameNickname };
    setUser(updated);
    saveToLS('wwm_user', updated);
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? { ...u, gameNickname } : u));
    dbUpdateAccount(user.id, { game_nickname: gameNickname });
  };

  const addGuide = (guide: Omit<GuideArticle, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>) => {
    if (!isEditor()) return;
    const now = new Date().toLocaleDateString('ru-RU');
    const newGuide: GuideArticle = {
      ...guide, id: 'guide_' + Date.now(),
      authorId: user!.id, authorName: user!.name, createdAt: now, updatedAt: now,
    };
    setGuides(prev => [newGuide, ...prev]);
  };
  const updateGuide = (id: string, updates: Partial<GuideArticle>) => {
    if (!isEditor()) return;
    setGuides(prev => prev.map(g => g.id === id ? { ...g, ...updates, updatedAt: new Date().toLocaleDateString('ru-RU') } : g));
  };
  const deleteGuide = (id: string) => {
    if (!isEditor()) return;
    setGuides(prev => prev.filter(g => g.id !== id));
  };

  const getRoleConfig = (role: UserRole): RoleConfig => {
    return siteSettings.roles.find(r => r.id === role) || siteSettings.roles[0];
  };

  const updateRoleDisplayName = (roleId: UserRole, newName: string) => {
    if (!isAdmin()) return;
    setSiteSettings(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.id === roleId ? { ...r, displayName: newName } : r),
    }));
  };

  const updateRoleColor = (roleId: UserRole, newColor: string) => {
    if (!isAdmin()) return;
    setSiteSettings(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.id === roleId ? { ...r, color: newColor } : r),
    }));
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const config = getRoleConfig(user.role);
    return config.permissions.includes(permission);
  };

  const addRole = (displayName: string, color: string, permissions: string[]) => {
    if (!isAdmin()) return;
    const id = 'role_' + Date.now();
    setSiteSettings(prev => ({
      ...prev,
      roles: [...prev.roles, { id, displayName, color, permissions }],
    }));
  };

  const deleteRole = (roleId: string) => {
    if (!isAdmin()) return;
    // Prevent deleting system roles
    if (['user', 'editor', 'admin'].includes(roleId)) return;
    // Move users with this role to 'user'
    setRegisteredUsers(prev => prev.map(u => u.role === roleId ? { ...u, role: 'user' } : u));
    setSiteSettings(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r.id !== roleId),
    }));
  };

  const updateRolePermissions = (roleId: string, permissions: string[]) => {
    if (!isAdmin()) return;
    setSiteSettings(prev => ({
      ...prev,
      roles: prev.roles.map(r => r.id === roleId ? { ...r, permissions } : r),
    }));
  };

  // ---- Chat functions ----
  const sendMessage = (text: string) => {
    if (!user || !text.trim()) return;
    if (isUserMuted(user.id)) return;
    const msg: ChatMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      userId: user.id, userName: user.name, userRole: user.role,
      text: text.trim(), timestamp: Date.now(),
    };
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages.slice(-200), msg], // keep last 200
    }));
  };

  const deleteMessage = (msgId: string) => {
    if (!hasPermission('chat.delete')) return;
    setChatState(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === msgId ? { ...m, deleted: true } : m),
    }));
  };

  const muteUser = (userId: string, minutes: number) => {
    if (!hasPermission('chat.mute')) return;
    setChatState(prev => ({
      ...prev,
      mutedUsers: [...prev.mutedUsers.filter(m => m.userId !== userId), { userId, until: Date.now() + minutes * 60000 }],
    }));
  };

  const unmuteUser = (userId: string) => {
    if (!hasPermission('chat.mute')) return;
    setChatState(prev => ({
      ...prev,
      mutedUsers: prev.mutedUsers.filter(m => m.userId !== userId),
    }));
  };

  const isUserMuted = (userId: string): boolean => {
    const entry = chatState.mutedUsers.find(m => m.userId === userId);
    if (!entry) return false;
    if (Date.now() > entry.until) return false;
    return true;
  };

  const chatBanUser = (userId: string) => {
    if (!hasPermission('chat.ban')) return;
    muteUser(userId, 525600);
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: true } : u));
  };

  // ---- Wiki Articles CRUD ----
  const addWikiArticle = (article: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => {
    if (!isEditor()) return;
    const now = new Date().toLocaleDateString('ru-RU');
    setWikiArticles(prev => [{ ...article, id: 'wiki_' + Date.now(), authorName: user!.name, updatedAt: now }, ...prev]);
  };
  const updateWikiArticle = (id: string, updates: Partial<WikiArticle>) => {
    if (!isEditor()) return;
    setWikiArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates, updatedAt: new Date().toLocaleDateString('ru-RU') } : a));
  };
  const deleteWikiArticle = (id: string) => {
    if (!isEditor()) return;
    setWikiArticles(prev => prev.filter(a => a.id !== id));
  };

  // ---- Support Tickets ----
  const createTicket = (subject: string, message: string) => {
    if (!user) return;
    const ticket: SupportTicket = {
      id: 'ticket_' + Date.now(), userId: user.id, userName: user.name,
      subject, message, status: 'open', createdAt: new Date().toLocaleDateString('ru-RU'), replies: [],
    };
    setSupportTickets(prev => [ticket, ...prev]);
  };
  const replyToTicket = (ticketId: string, message: string) => {
    if (!user) return;
    const rc = getRoleConfig(user.role);
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? {
      ...t, status: isAdmin() || isEditor() ? 'answered' : t.status,
      replies: [...t.replies, { id: 'reply_' + Date.now(), authorName: user.name, authorRole: rc.displayName, message, createdAt: new Date().toLocaleDateString('ru-RU') }],
    } : t));
  };
  const closeTicket = (ticketId: string) => {
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'closed' } : t));
  };
  const deleteTicket = (ticketId: string) => {
    if (!isAdmin()) return;
    setSupportTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  return (
    <AuthContext.Provider value={{
      user, progress, guides, registeredUsers, siteSettings, wikiArticles, supportTickets, chatState, isLoading,
      loginWithPassword, register, logout, updateProgress,
      toggleFavoriteWeapon, toggleFavoriteSect, toggleCompletedGuide, toggleVisitedRegion,
      addNote, deleteNote, setSelectedBuild, updateUserPicture, updateUserGameNickname,
      addGuide, updateGuide, deleteGuide,
      addWikiArticle, updateWikiArticle, deleteWikiArticle,
      createTicket, replyToTicket, closeTicket, deleteTicket,
      setUserRole, isEditor, isAdmin,
      adminSetUserRole, adminBanUser, adminDeleteUser,
      updateSiteSettings, addAnnouncement, removeAnnouncement,
      getRoleConfig, updateRoleDisplayName, updateRoleColor, hasPermission,
      addRole, deleteRole, updateRolePermissions,
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

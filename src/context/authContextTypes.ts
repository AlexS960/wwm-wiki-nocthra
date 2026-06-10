import type {
  GuideArticle,
  GuideComment,
  GuideVersion,
  UserProgress,
  RegisteredUser,
  SiteSettings,
  WikiArticle,
  SupportTicket,
  SuggestionTopic,
  ChatState,
  SiteNewsItem,
  GuildData,
  RegisteredGuild,
  User,
  RoleConfig,
  PmSettings,
  ChatMessage,
} from '../types/site';
import type { PrivateMessage } from '../lib/pm';

export const MAX_GUIDE_VERSIONS = 15;

export function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export const defaultUserProgress: UserProgress = {
  completedGuides: [],
  favoriteWeapons: [],
  favoriteSects: [],
  visitedRegions: [],
  notes: [],
  selectedBuild: null,
};

export const defaultSiteSettings: SiteSettings = {
  siteName: 'WWM Вики Ру — Nocthra',
  siteDescription: 'База знаний',
  discordUrl: 'https://discord.gg/nocthra',
  maintenanceMode: false,
  announcements: [],
  pmSettings: { notificationSound: true, soundUrl: '' },
  sectionOverrides: {},
  roles: [
    { id: 'user', displayName: 'Странник', color: '#b0a696', permissions: ['read', 'profile', 'favorites', 'chat.write'] },
    { id: 'moderator', displayName: 'Модератор', color: '#4abf85', permissions: ['read', 'profile', 'favorites', 'chat.write', 'chat.delete', 'chat.mute', 'staff.chat', 'support.view_all', 'support.reply', 'support.close'] },
    { id: 'guildmaster', displayName: 'Гильдмастер', color: '#d4a528', permissions: ['read', 'profile', 'favorites', 'chat.write', 'chat.delete', 'chat.mute', 'chat.ban', 'staff.chat', 'support.view_all', 'support.reply', 'support.close', 'support.delete', 'guides.create', 'guides.edit', 'guild.edit'] },
    { id: 'editor', displayName: 'Редактор', color: '#5865F2', permissions: ['read', 'profile', 'favorites', 'chat.write', 'staff.chat', 'guides.create', 'guides.edit'] },
    { id: 'admin', displayName: 'Администратор', color: '#a882ff', permissions: ['read', 'profile', 'favorites', 'chat.write', 'chat.delete', 'chat.mute', 'chat.ban', 'staff.chat', 'support.view_all', 'support.reply', 'support.close', 'support.delete', 'guides.create', 'guides.edit', 'guides.delete', 'guild.edit', 'guild.registry.manage', 'users.manage', 'users.ban', 'users.roles', 'site.settings', 'site.announcements', 'admin.panel'] },
  ],
  sections: [{ id: 'guides', title: 'Гайды', maintenance: false, message: '...' }],
  donation: {
    enabled: true,
    title: 'Поддержать проект',
    description: 'Вики развивается силами гильдии Nocthra. Любая поддержка помогает оплатить хостинг и улучшать сайт.',
    methods: [
      { id: 'd1', label: 'Boosty', value: 'Подписка / донат', url: 'https://boosty.to/' },
      { id: 'd2', label: 'СБП / карта', value: 'Укажите реквизиты в админке', url: '' },
    ],
  },
};

export interface AuthContextValue {
  user: User | null;
  progress: UserProgress;
  guides: GuideArticle[];
  guideComments: GuideComment[];
  guideVersions: GuideVersion[];
  registeredUsers: RegisteredUser[];
  refreshAccounts: () => Promise<void>;
  siteSettings: SiteSettings;
  isLoading: boolean;
  wikiArticles: WikiArticle[];
  supportTickets: SupportTicket[];
  suggestions: SuggestionTopic[];
  suggestionsLoaded: boolean;
  ensureSuggestionsLoaded: () => Promise<void>;
  createSuggestion: (title: string, body: string) => Promise<string | null>;
  replyToSuggestion: (topicId: string, message: string) => Promise<string | null>;
  closeSuggestion: (topicId: string) => Promise<string | null>;
  deleteSuggestion: (topicId: string) => Promise<string | null>;
  chatState: ChatState;
  privateMessages: PrivateMessage[];
  unreadPMCount: number;
  dbSaveError: string | null;
  clearDbSaveError: () => void;
  guild: GuildData;
  registeredGuilds: RegisteredGuild[];
  guildsLoaded: boolean;
  ensureGuildsLoaded: () => Promise<void>;
  refreshGuilds: () => Promise<void>;
  registerGuild: (input: import('../types/site').RegisteredGuildInput, registrarId?: string) => Promise<import('../types/site').RegisteredGuild | string>;
  updateRegisteredGuild: (id: string, updates: Partial<import('../types/site').RegisteredGuildInput>) => Promise<string | null>;
  deleteRegisteredGuild: (id: string) => Promise<string | null>;
  getGuildName: (guildId?: string) => string;
  getGuildById: (guildId?: string) => import('../types/site').RegisteredGuild | undefined;
  discordUrl: string;
  siteNews: SiteNewsItem[];
  updateGuild: (g: GuildData) => void;
  updateDiscordUrl: (url: string) => void;
  addSiteNews: (n: Omit<SiteNewsItem, 'id' | 'authorName' | 'createdAt' | 'updatedAt'>) => void;
  updateSiteNews: (id: string, u: Partial<SiteNewsItem>) => void;
  deleteSiteNews: (id: string) => void;
  loginWithPassword: (u: string, p: string, r: boolean) => Promise<string | null>;
  register: (u: string, p: string, nickname?: string, guildId?: string) => Promise<string | null>;
  logout: () => void;
  updateProgress: (u: Partial<UserProgress>) => void;
  toggleFavoriteWeapon: (id: string) => void;
  toggleFavoriteSect: (id: string) => void;
  toggleCompletedGuide: (id: string) => void;
  addNote: (t: string, c: string) => void;
  deleteNote: (id: string) => void;
  setSelectedBuild: (id: string | null) => void;
  updateUserPicture: (p: string) => void;
  updateUserGameNickname: (n: string) => void;
  updateUserGuild: (guildId: string) => void;
  addGuide: (g: Omit<GuideArticle, 'id' | 'authorName' | 'updatedAt'>) => void;
  updateGuide: (id: string, u: Partial<GuideArticle>) => Promise<void | string>;
  deleteGuide: (id: string) => void;
  isAdmin: () => boolean;
  canAccessAdminPanel: () => boolean;
  canAccessStaffChat: () => boolean;
  isEditor: () => boolean;
  adminSetUserRole: (id: string, r: string) => void;
  adminBanUser: (id: string, b: boolean) => void;
  adminDeleteUser: (id: string) => void;
  updateSiteSettings: (u: Partial<SiteSettings>) => void;
  addAnnouncement: (t: string, ty: 'info' | 'warning' | 'success') => void;
  removeAnnouncement: (id: string) => void;
  getRoleConfig: (r: string) => RoleConfig;
  hasPermission: (p: string) => boolean;
  updateRoleDisplayName: (id: string, n: string) => void;
  updateRoleColor: (id: string, c: string) => void;
  addRole: (n: string, c: string, p: string[]) => void;
  deleteRole: (id: string) => void;
  updateRolePermissions: (id: string, p: string[]) => void;
  addWikiArticle: (a: Omit<WikiArticle, 'id' | 'authorName' | 'updatedAt'>) => void;
  updateWikiArticle: (id: string, u: Partial<WikiArticle>) => void;
  deleteWikiArticle: (id: string) => void;
  sendMessage: (t: string) => Promise<string | null>;
  deleteMessage: (id: string) => Promise<string | null>;
  createTicket: (s: string, m: string) => Promise<string | null>;
  replyToTicket: (id: string, m: string) => Promise<string | null>;
  closeTicket: (id: string) => Promise<string | null>;
  deleteTicket: (id: string) => Promise<string | null>;
  muteUser: (id: string, m: number) => Promise<string | null>;
  unmuteUser: (id: string) => Promise<string | null>;
  isUserMuted: (id: string) => boolean;
  chatBanUser: (id: string) => void;
  sendPrivateMessage: (toId: string, text: string) => Promise<string | null>;
  sendStaffPrivateMessage: (toId: string, text: string) => Promise<string | null>;
  markPMRead: (partnerId: string) => void;
  deletePrivateMessageForMe: (messageId: string) => Promise<string | null>;
  deletePrivateMessageForAll: (messageId: string) => Promise<string | null>;
  deletePmDialogForMe: (partnerId: string) => Promise<string | null>;
  deletePmDialogForAll: (partnerId: string) => Promise<string | null>;
  pmLoaded: boolean;
  loadPmThread: (partnerId: string) => Promise<void>;
  guidesLoaded: boolean;
  chatLoaded: boolean;
  accountsLoaded: boolean;
  ensureGuidesLoaded: () => Promise<void>;
  ensureChatLoaded: () => Promise<void>;
  ensureAccountsLoaded: () => Promise<void>;
  addGuideComment: (guideId: string, text: string) => Promise<string | null>;
  deleteGuideComment: (id: string) => void;
  toggleGuideCommentLike: (commentId: string) => Promise<string | null>;
  toggleSiteNewsLike: (newsId: string) => Promise<string | null>;
  getGuideVersions: (guideId: string) => GuideVersion[];
  restoreGuideVersion: (guideId: string, versionId: string) => Promise<string | null>;
  isUserOnline: (id: string) => boolean;
  getUserDisplayName: (id: string, fallback?: string) => string;
  updatePmSettings: (s: Partial<PmSettings>) => void;
  wikiLoaded: boolean;
  supportLoaded: boolean;
  guideMetaLoaded: boolean;
  ensureWikiLoaded: () => Promise<void>;
  ensureSupportLoaded: () => Promise<void>;
  ensureGuideMetaLoaded: () => Promise<void>;
  purgeEmbeddedImagesFromDb: () => Promise<string | null>;
  guidesHasMore: boolean;
  guidesTotal: number;
  guidesLoading: boolean;
  loadMoreGuides: () => Promise<void>;
  searchGuidesList: (query: string, category: string) => Promise<void>;
  searchGuidesRemote: (query: string) => Promise<GuideArticle[]>;
  chatHasMore: boolean;
  chatLoadingMore: boolean;
  loadOlderChatMessages: () => Promise<void>;
  searchChatMessages: (query: string) => Promise<void>;
  clearChatSearch: () => void;
  chatSearchQuery: string;
  chatSearchResults: ChatMessage[] | null;
}

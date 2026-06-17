export type UserRole = string;

export interface GuildData {
  name: string;
  subtitle: string;
  motto: string;
  description: string;
  avatar: string;
  info: { label: string; value: string }[];
  activities: string[];
}

/** Гильдия, зарегистрированная пользователем на сайте */
export interface RegisteredGuild {
  id: string;
  name: string;
  description: string;
  server: string;
  leaderId: string;
  leaderName: string;
  leaderGameNickname: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RegisteredGuildInput {
  name: string;
  description?: string;
  server?: string;
  leaderId: string;
  leaderName?: string;
  leaderGameNickname?: string;
}

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

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string;
  gameNickname?: string;
  guildId?: string;
  role: UserRole;
  /** Идентификатор доступа к чату и ЛС (выдаёт администратор) */
  messengerAccessId?: string;
}

export interface GuideArticle {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  readTime: string;
  summary: string;
  content: string;
  authorName: string;
  updatedAt: string;
  icon: string;
  images?: string[];
}

export interface GuideComment {
  id: string;
  guideId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  likes?: string[];
}

export interface GuideVersion {
  id: string;
  guideId: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  difficulty: string;
  readTime: string;
  icon: string;
  images?: string[];
  savedAt: string;
  savedBy: string;
}

export interface UserProgress {
  completedGuides: string[];
  favoriteWeapons: string[];
  favoriteSects: string[];
  visitedRegions: string[];
  notes: { id: string; title: string; content: string; date: string }[];
  selectedBuild: string | null;
  /** Акцентный цвет UI из фиксированной палитры */
  accentColor?: string | null;
}

export interface RegisteredUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  gameNickname?: string;
  guildId?: string;
  role: UserRole;
  joinedAt: string;
  lastSeen: string;
  lastSeenAt: string | null;
  isBanned: boolean;
  chatBanned?: boolean;
  messengerAccessId?: string;
}

export interface PmSettings {
  notificationSound: boolean;
  soundUrl: string;
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

export interface DonationMethod {
  id: string;
  label: string;
  value: string;
  url?: string;
}

export interface DonationSettings {
  enabled: boolean;
  title: string;
  description: string;
  methods: DonationMethod[];
}

/** Блоки главной страницы (порядок и видимость) */
export type HomeBlockId = 'announcements' | 'hero' | 'news' | 'donation';

export interface HomeBlockConfig {
  id: HomeBlockId;
  visible: boolean;
}

export interface HeroSettings {
  titleWhite: string;
  titleGold: string;
  subtitle: string;
  tagline: string;
  logoUrl: string;
  bgImageUrl: string;
  discordTitle: string;
  discordSubtitle: string;
  lolkaTitle: string;
  lolkaSubtitle: string;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterSettings {
  brandName: string;
  aboutText: string;
  legalText: string;
  copyright: string;
  links: FooterLink[];
}

export interface SiteBranding {
  headerTitle: string;
  headerSubtitle: string;
}

export interface SuggestionReply {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

export interface SuggestionTopic {
  id: string;
  userId: string;
  userName: string;
  title: string;
  body: string;
  status: 'open' | 'closed';
  createdAt: string;
  replies: SuggestionReply[];
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  discordUrl: string;
  lolkaUrl?: string;
  maintenanceMode: boolean;
  announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[];
  roles: RoleConfig[];
  sections: { id: string; title: string; maintenance: boolean; message: string }[];
  pmSettings: PmSettings;
  donation?: DonationSettings;
  riddlesHiddenIds?: string[];
  sectionOverrides?: Record<string, unknown>;
  branding?: SiteBranding;
  hero?: HeroSettings;
  footer?: FooterSettings;
  homeBlocks?: HomeBlockConfig[];
  /** Данные парсеров Game8 (синхронизация из админки) */
  parsedContent?: ParsedContent;
  /** Настраиваемые URL страниц-источников для парсеров */
  parserSources?: Record<string, ParserSourceConfig>;
  /** Категории разделов (фильтры + редактор) */
  sectionCategories?: Record<string, SectionCategoryDef[]>;
  /** Пользовательские разделы вики (конструктор) */
  sectionDefinitions?: CustomSectionDefinition[];
}

export type SectionFieldType =
  | 'text'
  | 'textarea'
  | 'markdown'
  | 'category'
  | 'icon'
  | 'number'
  | 'tags';

export interface SectionFieldDef {
  key: string;
  type: SectionFieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  showInCard?: boolean;
}

export type SectionTemplate = 'wiki-cards';

export interface CustomSectionDefinition {
  id: string;
  label: string;
  title: string;
  icon: string;
  description: string;
  /** URL-путь, по умолчанию /{id} */
  path?: string;
  visible?: boolean;
  showInWikiHub?: boolean;
  template: SectionTemplate;
  fields: SectionFieldDef[];
  iconChoices?: string[];
  categories?: SectionCategoryDef[];
}

export interface SectionCategoryDef {
  id: string;
  label: string;
  icon?: string;
  badgeClass?: string;
}

export interface ParserSourceConfig {
  url: string;
  updatedAt?: string;
}

export interface ParsedContentMeta {
  syncedAt: string;
  count?: number;
}

export interface ParsedContent {
  riddles?: {
    clues: import('../data/riddles').RiddleClue[];
    masters: import('../data/riddles').RiddleMaster[];
    syncedAt?: string;
  };
  innerpath?: {
    items: unknown[];
    meta?: Record<string, unknown>;
    syncedAt?: string;
  };
  npcLocations?: {
    items: Array<{
      id: string;
      nameEn: string;
      region: string;
      regionLabel?: string;
      locationTitle: string;
      subregion: string;
      locationDetail: string;
    }>;
    syncedAt?: string;
  };
  meta?: Record<string, ParsedContentMeta>;
}

export interface WikiArticle {
  id: string;
  section: string;
  title: string;
  content: string;
  icon: string;
  authorName: string;
  updatedAt: string;
  fields: Record<string, string>;
  images?: string[];
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

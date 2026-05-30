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
  lastSeenAt: string | null;
  isBanned: boolean;
  chatBanned?: boolean;
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

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  discordUrl: string;
  maintenanceMode: boolean;
  announcements: { id: string; text: string; type: 'info' | 'warning' | 'success'; active: boolean }[];
  roles: RoleConfig[];
  sections: { id: string; title: string; maintenance: boolean; message: string }[];
  pmSettings: PmSettings;
  riddlesHiddenIds?: string[];
  sectionOverrides?: Record<string, unknown>;
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

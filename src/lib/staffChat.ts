/** Роли с доступом к служебному чату (Telegram-подобная страница). */
export const STAFF_CHAT_ROLE_IDS = ['admin', 'guildmaster', 'editor', 'moderator'] as const;

export type StaffChatRoleId = (typeof STAFF_CHAT_ROLE_IDS)[number];

const ROLE_ALIASES: Record<string, StaffChatRoleId> = {
  admin: 'admin',
  administrator: 'admin',
  администратор: 'admin',
  moderator: 'moderator',
  модератор: 'moderator',
  guildmaster: 'guildmaster',
  гильдмастер: 'guildmaster',
  editor: 'editor',
  редактор: 'editor',
};

export function normalizeStaffRole(role: string): StaffChatRoleId | null {
  const raw = (role || '').trim();
  if (!raw) return null;
  if ((STAFF_CHAT_ROLE_IDS as readonly string[]).includes(raw)) return raw as StaffChatRoleId;
  const key = raw.toLowerCase();
  return ROLE_ALIASES[key] ?? null;
}

export function isStaffChatRole(role: string): boolean {
  return normalizeStaffRole(role) !== null;
}

export function canAccessStaffChat(user: { role: string } | null | undefined): boolean {
  return !!user && isStaffChatRole(user.role);
}

/** Ключ диалога 1:1 */
export function staffDmChatKey(partnerId: string): string {
  return `dm:${partnerId}`;
}

/** Ключ группового чата */
export function staffGroupChatKey(roomId: string): string {
  return `group:${roomId}`;
}

export function parseStaffChatKey(key: string): { type: 'dm'; partnerId: string } | { type: 'group'; roomId: string } | null {
  if (key.startsWith('dm:')) return { type: 'dm', partnerId: key.slice(3) };
  if (key.startsWith('group:')) return { type: 'group', roomId: key.slice(6) };
  return null;
}

export function getStaffChatThemeStorageKey(chatKey: string): string {
  return `wwm_staff_theme_${chatKey}`;
}

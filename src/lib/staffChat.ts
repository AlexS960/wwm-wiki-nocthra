/** Роли с доступом к служебному чату (Telegram-подобная страница). */
export const STAFF_CHAT_ROLE_IDS = ['admin', 'guildmaster', 'editor', 'moderator'] as const;

export type StaffChatRoleId = (typeof STAFF_CHAT_ROLE_IDS)[number];

export function isStaffChatRole(role: string): boolean {
  return (STAFF_CHAT_ROLE_IDS as readonly string[]).includes(role);
}

export function canAccessStaffChat(user: { role: string } | null | undefined): boolean {
  return !!user && isStaffChatRole(user.role);
}

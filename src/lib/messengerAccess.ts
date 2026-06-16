import type { RoleConfig, User } from '../types/site';

/** Роли с доступом к чату без персонального идентификатора (модерация / служебный чат). */
const MESSENGER_ROLE_PERMS = ['chat.delete', 'chat.mute', 'chat.ban', 'staff.chat', 'admin.panel'] as const;

export function generateMessengerAccessId(): string {
  const part = crypto.randomUUID().replace(/-/g, '').slice(0, 8).toUpperCase();
  return `MSG-${part}`;
}

export function canUseMessenger(
  user: Pick<User, 'role' | 'messengerAccessId'> | null | undefined,
  siteRoles?: RoleConfig[],
): boolean {
  if (!user) return false;
  const rc = siteRoles?.find(r => r.id === user.role);
  if (rc?.permissions.some(p => (MESSENGER_ROLE_PERMS as readonly string[]).includes(p))) {
    return true;
  }
  return !!user.messengerAccessId?.trim();
}

import type { RegisteredGuild, RegisteredUser, User } from '../types/site';

/** Роль «Гильдмастер» на сайте — владелец гильдии Nocthra (баннер, guild.edit). */
export const SITE_GUILDMASTER_ROLE = 'guildmaster';

export function isSiteGuildmaster(user: User | null | undefined): boolean {
  return user?.role === SITE_GUILDMASTER_ROLE || user?.role === 'admin';
}

export function canManageGuildRegistry(hasPermission: (p: string) => boolean): boolean {
  return hasPermission('admin.panel') || hasPermission('guild.registry.manage');
}

/** Редактирование записи в реестре: создатель/лидер гильдии или админ. */
export function canEditRegisteredGuild(
  user: User | null | undefined,
  guild: RegisteredGuild,
  hasPermission: (p: string) => boolean,
): boolean {
  if (!user) return false;
  if (canManageGuildRegistry(hasPermission)) return true;
  return guild.leaderId === user.id;
}

export function getGuildMembers(guildId: string, users: RegisteredUser[]): RegisteredUser[] {
  if (!guildId) return [];
  return users
    .filter(u => u.guildId === guildId)
    .sort((a, b) => {
      const na = (a.gameNickname || a.name).toLowerCase();
      const nb = (b.gameNickname || b.name).toLowerCase();
      return na.localeCompare(nb, 'ru');
    });
}

export function getLeaderDisplayName(guild: RegisteredGuild): string {
  return guild.leaderGameNickname?.trim() || guild.leaderName?.trim() || '—';
}

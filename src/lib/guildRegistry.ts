import type { RegisteredGuild, RegisteredUser, RoleConfig, User } from '../types/site';
import { trimText } from './asText';

/** Системный id роли «Гильдмастер» на сайте (баннер Nocthra, guild.edit). */
export const SITE_GUILDMASTER_ROLE = 'guildmaster';

/** Кастомный id роли «Гильдмастер» в настройках сайта. */
export const SITE_GUILDMASTER_CUSTOM_ROLE_ID = 'role_1778707826577';

const SITE_GUILDMASTER_DISPLAY = 'гильдмастер';

function roleConfigFor(roleId: string, siteRoles?: RoleConfig[]): RoleConfig | undefined {
  return siteRoles?.find(r => r.id === roleId);
}

/** Все id ролей, считающихся «Гильдмастером» сайта. */
export function siteGuildmasterRoleIds(siteRoles?: RoleConfig[]): string[] {
  const ids = new Set<string>([SITE_GUILDMASTER_ROLE, SITE_GUILDMASTER_CUSTOM_ROLE_ID]);
  for (const r of siteRoles || []) {
    if (trimText(r.displayName).toLowerCase() === SITE_GUILDMASTER_DISPLAY) ids.add(r.id);
  }
  return [...ids];
}

export function isSiteGuildmasterRole(roleId: string, siteRoles?: RoleConfig[]): boolean {
  if (roleId === SITE_GUILDMASTER_ROLE || roleId === SITE_GUILDMASTER_CUSTOM_ROLE_ID) return true;
  const rc = roleConfigFor(roleId, siteRoles);
  return trimText(rc?.displayName).toLowerCase() === SITE_GUILDMASTER_DISPLAY;
}

export function isSiteGuildmaster(user: User | null | undefined, siteRoles?: RoleConfig[]): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return isSiteGuildmasterRole(user.role, siteRoles);
}

export function findSiteGuildmaster(
  users: RegisteredUser[],
  siteRoles?: RoleConfig[],
): RegisteredUser | undefined {
  const ids = new Set(siteGuildmasterRoleIds(siteRoles));
  return users.find(u => ids.has(u.role));
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

import type { RoleConfig } from '../types/site';
import { defaultSiteSettings } from '../context/authContextTypes';
import { trimText } from './asText';

/** Системные id ролей с доступом к служебному чату */
export const STAFF_CHAT_ROLE_IDS = ['admin', 'guildmaster', 'editor', 'moderator'] as const;

export type StaffChatRoleId = (typeof STAFF_CHAT_ROLE_IDS)[number];

const STAFF_CHAT_PERMISSION = 'staff.chat';

/** По отображаемому имени (для кастомных id вроде role_1778707826577) */
const STAFF_ROLE_DISPLAY_NAMES = new Set([
  'администратор',
  'гильдмастер',
  'редактор',
  'модератор',
]);

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

function roleConfigFor(roleId: string, siteRoles?: RoleConfig[]): RoleConfig | undefined {
  return siteRoles?.find(r => r.id === roleId);
}

/** Доступ к служебному чату: системный id, право staff.chat или имя роли «Гильдмастер» и т.д. */
export function isStaffChatRole(roleId: string, siteRoles?: RoleConfig[]): boolean {
  if (normalizeStaffRole(roleId)) return true;
  const rc = roleConfigFor(roleId, siteRoles);
  if (!rc) return false;
  if (rc.permissions?.includes(STAFF_CHAT_PERMISSION)) return true;
  return STAFF_ROLE_DISPLAY_NAMES.has(trimText(rc.displayName).toLowerCase());
}

export function canAccessStaffChat(
  user: { role: string } | null | undefined,
  siteRoles?: RoleConfig[],
): boolean {
  return !!user && isStaffChatRole(user.role, siteRoles);
}

/** Добавляет в список ролей недостающие системные (Гильдмастер, Редактор и т.д.), не дублируя по displayName */
export function mergeStaffRolesWithDefaults(roles: RoleConfig[]): RoleConfig[] {
  const out = [...roles];
  for (const def of defaultSiteSettings.roles) {
    if (def.id === 'user') continue;
    const hasId = out.some(r => r.id === def.id);
    const hasName = out.some(r => trimText(r.displayName).toLowerCase() === trimText(def.displayName).toLowerCase());
    if (!hasId && !hasName) out.push({ ...def });
  }
  return out;
}

/** Уникальные роли команды для фильтра (по id роли в аккаунте) */
export function staffRoleFilterOptions(
  members: { role: string; roleName: string; roleColor: string }[],
  siteRoles?: RoleConfig[],
): { id: string; label: string; color: string }[] {
  const seen = new Set<string>();
  const opts: { id: string; label: string; color: string }[] = [];
  for (const m of members) {
    if (seen.has(m.role)) continue;
    seen.add(m.role);
    const rc = roleConfigFor(m.role, siteRoles);
    opts.push({
      id: m.role,
      label: rc?.displayName || m.roleName,
      color: rc?.color || m.roleColor,
    });
  }
  return opts.sort((a, b) => a.label.localeCompare(b.label, 'ru'));
}

export function staffDmChatKey(partnerId: string): string {
  return `dm:${partnerId}`;
}

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

/** Удалить группу «у всех» — создатель или роль с admin.panel */
export function canDeleteStaffGroupForAll(
  userId: string,
  userRole: string,
  room: { createdBy: string },
  siteRoles?: RoleConfig[],
): boolean {
  if (room.createdBy === userId) return true;
  const rc = roleConfigFor(userRole, siteRoles);
  if (rc?.permissions?.includes('admin.panel')) return true;
  return userRole === 'admin';
}

/** Id ролей для предфильтра в SQL (системные + staff.chat) */
export function staffRoleIdsForQuery(siteRoles?: RoleConfig[]): string[] {
  const ids = new Set<string>([...STAFF_CHAT_ROLE_IDS]);
  for (const r of siteRoles || []) {
    if (r.permissions?.includes(STAFF_CHAT_PERMISSION)) ids.add(r.id);
    if (STAFF_ROLE_DISPLAY_NAMES.has(trimText(r.displayName).toLowerCase())) ids.add(r.id);
  }
  return [...ids];
}

export interface RolePermissionDef {
  id: string;
  label: string;
  group: string;
}

export const ALL_ROLE_PERMISSIONS: RolePermissionDef[] = [
  { id: 'read', label: 'Просмотр контента', group: 'Базовые' },
  { id: 'profile', label: 'Профиль и заметки', group: 'Базовые' },
  { id: 'favorites', label: 'Избранное', group: 'Базовые' },
  { id: 'chat.write', label: 'Писать в чат', group: 'Чат' },
  { id: 'chat.delete', label: 'Удаление сообщений', group: 'Чат' },
  { id: 'chat.mute', label: 'Мут пользователей', group: 'Чат' },
  { id: 'chat.ban', label: 'Бан в чате', group: 'Чат' },
  { id: 'staff.chat', label: 'Служебный чат', group: 'Чат' },
  { id: 'support.view_all', label: 'Доступ к техподдержке', group: 'Техподдержка' },
  { id: 'support.reply', label: 'Ответы на обращения', group: 'Техподдержка' },
  { id: 'support.close', label: 'Закрытие обращений', group: 'Техподдержка' },
  { id: 'support.delete', label: 'Удаление обращений', group: 'Техподдержка' },
  { id: 'guides.create', label: 'Создание гайдов', group: 'Гайды' },
  { id: 'guides.edit', label: 'Редактирование гайдов', group: 'Гайды' },
  { id: 'guides.delete', label: 'Удаление гайдов', group: 'Гайды' },
  { id: 'guild.edit', label: 'Редактирование инфо. гильдии', group: 'Гильдия' },
  { id: 'users.manage', label: 'Управление пользователями', group: 'Администрация' },
  { id: 'users.ban', label: 'Бан / разбан', group: 'Администрация' },
  { id: 'users.roles', label: 'Назначение ролей', group: 'Администрация' },
  { id: 'site.settings', label: 'Настройки сайта', group: 'Администрация' },
  { id: 'site.announcements', label: 'Объявления', group: 'Администрация' },
  { id: 'admin.panel', label: 'Админ-панель', group: 'Администрация' },
];

export const ROLE_PRESET_COLORS = ['#b0a696', '#d4a528', '#a882ff', '#4abf85', '#e85555', '#5865F2', '#ff6b9d', '#00bcd4', '#f59e0b', '#ec4899'];

export const PERM_GROUPS = [...new Set(ALL_ROLE_PERMISSIONS.map(p => p.group))];

export function isSystemRole(id: string): boolean {
  return ['user', 'editor', 'admin'].includes(id);
}

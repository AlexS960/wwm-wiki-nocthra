import type { ChatState, SiteSettings } from '../types/site';
import { defaultSiteSettings } from '../context/authContextTypes';
import { mergeStaffRolesWithDefaults } from './staffChat';

const defS = defaultSiteSettings;

export function normalizeChatState(value: unknown): ChatState {
  if (!value || typeof value !== 'object') {
    return { messages: [], mutedUsers: [] };
  }
  const v = value as Partial<ChatState>;
  return {
    messages: Array.isArray(v.messages) ? v.messages : [],
    mutedUsers: Array.isArray(v.mutedUsers) ? v.mutedUsers : [],
  };
}

export function mergeSiteSettingsSafe(s: SiteSettings | null | undefined): SiteSettings {
  if (!s) return defS;
  return {
    ...defS,
    ...s,
    roles: mergeStaffRolesWithDefaults(
      Array.isArray(s.roles) && s.roles.length > 0 ? s.roles : defS.roles,
    ),
    announcements: Array.isArray(s.announcements) ? s.announcements : defS.announcements,
    sections: Array.isArray(s.sections) && s.sections.length > 0 ? s.sections : defS.sections,
    pmSettings: { ...defS.pmSettings, ...(s.pmSettings || {}) },
    riddlesHiddenIds: Array.isArray(s.riddlesHiddenIds) ? s.riddlesHiddenIds : [],
    sectionOverrides: s.sectionOverrides && typeof s.sectionOverrides === 'object' ? s.sectionOverrides : {},
  };
}

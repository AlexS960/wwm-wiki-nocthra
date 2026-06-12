import type { ChatState, SiteSettings } from '../types/site';
import { defaultSiteSettings } from '../context/authContextTypes';
import { seedAllSectionCategories } from './sectionCategoriesMerge';
import {
  mergeBranding,
  mergeFooterSettings,
  mergeHeroSettings,
  mergeHomeBlocks,
} from './siteConstructor';
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
  if (!s) {
    return {
      ...defS,
      sectionCategories: seedAllSectionCategories(undefined),
    };
  }
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
    donation: {
      ...defS.donation!,
      ...(s.donation && typeof s.donation === 'object' ? s.donation : {}),
      methods: Array.isArray(s.donation?.methods) && s.donation.methods.length > 0
        ? s.donation.methods
        : defS.donation!.methods,
    },
    lolkaUrl: typeof s.lolkaUrl === 'string' ? s.lolkaUrl : defS.lolkaUrl,
    branding: mergeBranding(s.branding),
    hero: mergeHeroSettings(s.hero),
    footer: mergeFooterSettings(s.footer, s.discordUrl || defS.discordUrl, s.lolkaUrl || defS.lolkaUrl),
    homeBlocks: mergeHomeBlocks(s.homeBlocks),
    parsedContent: s.parsedContent && typeof s.parsedContent === 'object' ? s.parsedContent : undefined,
    parserSources:
      s.parserSources && typeof s.parserSources === 'object' ? s.parserSources : undefined,
    sectionCategories: seedAllSectionCategories(s.sectionCategories),
  };
}

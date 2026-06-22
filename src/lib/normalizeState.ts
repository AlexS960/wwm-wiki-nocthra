import type { ChatState, RoleConfig, SiteSettings } from '../types/site';
import { defaultSiteSettings } from '../context/authContextTypes';
import { seedAllSectionCategories } from './sectionCategoriesMerge';
import type { SectionCategoryDef } from '../data/sectionCategories';
import { asText, trimText } from './asText';
import {
  mergeBranding,
  mergeFooterSettings,
  mergeHeroSettings,
  mergeHomeBlocks,
} from './siteConstructor';
import { mergeStaffRolesWithDefaults } from './staffChat';

const defS = defaultSiteSettings;

function normalizeRoleConfig(raw: unknown): RoleConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as RoleConfig;
  const id = trimText(o.id);
  if (!id) return null;
  return {
    id,
    displayName: trimText(o.displayName) || id,
    color: asText(o.color) || '#b0a696',
    permissions: Array.isArray(o.permissions) ? o.permissions.map(p => asText(p)).filter(Boolean) : [],
  };
}

function normalizeSiteRoles(roles: unknown): RoleConfig[] {
  if (!Array.isArray(roles) || roles.length === 0) return defS.roles;
  return roles.map(normalizeRoleConfig).filter((r): r is RoleConfig => r !== null);
}

function normalizeSectionCategory(raw: unknown): SectionCategoryDef | null {
  if (typeof raw === 'string') {
    const label = raw.trim();
    if (!label) return null;
    return { id: label, label, icon: '✦' };
  }
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as SectionCategoryDef;
  const label = trimText(o.label || o.id);
  const id = trimText(o.id || label);
  if (!id) return null;
  return {
    id,
    label: label || id,
    icon: asText(o.icon) || '✦',
    badgeClass: asText(o.badgeClass) || undefined,
  };
}

function normalizeSectionCategoriesRecord(
  stored?: Record<string, unknown>,
): Record<string, SectionCategoryDef[]> {
  const out: Record<string, SectionCategoryDef[]> = {};
  if (stored && typeof stored === 'object') {
    for (const [key, val] of Object.entries(stored)) {
      if (!Array.isArray(val)) continue;
      const cats = val.map(normalizeSectionCategory).filter((c): c is SectionCategoryDef => c !== null);
      if (cats.length) out[key] = cats;
    }
  }
  return seedAllSectionCategories(out);
}

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
    roles: mergeStaffRolesWithDefaults(normalizeSiteRoles(s.roles)),
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
    sectionCategories: normalizeSectionCategoriesRecord(s.sectionCategories as Record<string, unknown> | undefined),
    sectionDefinitions: Array.isArray(s.sectionDefinitions) ? s.sectionDefinitions : [],
    pinnedGuildIds: Array.isArray(s.pinnedGuildIds)
      ? s.pinnedGuildIds.map(id => trimText(id)).filter(Boolean)
      : [],
  };
}

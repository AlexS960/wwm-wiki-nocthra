import { WIKI_HUB_SECTIONS, CONTENT_SECTION_IDS, WIKI_SECTION_LABELS, type WikiSectionMeta } from '../data/sections';
import { createCategoryId } from './sectionCategoriesMerge';
import type { CustomSectionDefinition, SiteSettings } from '../types/site';

export const DEFAULT_SECTION_ICONS = ['✦', '⚔️', '📖', '🔮', '💎', '🔥', '⚡', '🌙', '⭐', '🎯'];

/** Латиница, цифры, кириллица, подчёркивание и дефис */
export const SECTION_ID_PATTERN = /^[\w\u0400-\u04FF][\w\u0400-\u04FF-]*$/u;

export function isValidSectionId(id: string): boolean {
  return Boolean(id.trim() && SECTION_ID_PATTERN.test(id.trim()));
}

export const DEFAULT_WIKI_FIELDS = [
  { key: 'title', type: 'text' as const, label: 'Заголовок', required: true, showInCard: true },
  { key: 'summary', type: 'textarea' as const, label: 'Краткое описание', showInCard: true },
  { key: 'category', type: 'category' as const, label: 'Категория', required: true },
  { key: 'icon', type: 'icon' as const, label: 'Иконка' },
  { key: 'content', type: 'markdown' as const, label: 'Содержание', required: true },
];

export function slugSectionId(label: string): string {
  const base = label
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF-]/g, '')
    .slice(0, 32);
  return base ? `custom-${base}` : `custom-${Date.now()}`;
}

export function sanitizeSectionDefinition(raw: unknown): CustomSectionDefinition | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Partial<CustomSectionDefinition>;
  const id = String(o.id || '').trim();
  if (!isValidSectionId(id)) return null;
  const label = String(o.label || o.title || id).trim();
  const title = String(o.title || label).trim();
  const fields = Array.isArray(o.fields) && o.fields.length
    ? o.fields.filter(f => f?.key && f?.type).map(f => ({
        key: String(f.key),
        type: f.type,
        label: String(f.label || f.key),
        placeholder: f.placeholder ? String(f.placeholder) : undefined,
        required: Boolean(f.required),
        showInCard: f.showInCard !== false,
      }))
    : DEFAULT_WIKI_FIELDS;

  return {
    id,
    label,
    title,
    icon: String(o.icon || '✦'),
    description: String(o.description || ''),
    path: o.path ? String(o.path) : `/${id}`,
    visible: o.visible !== false,
    showInWikiHub: o.showInWikiHub !== false,
    template: o.template === 'wiki-cards' ? 'wiki-cards' : 'wiki-cards',
    fields,
    iconChoices: Array.isArray(o.iconChoices) ? o.iconChoices.map(String) : DEFAULT_SECTION_ICONS,
    categories: Array.isArray(o.categories) ? o.categories : undefined,
  };
}

export function sanitizeSectionDefinitions(raw: unknown): CustomSectionDefinition[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(sanitizeSectionDefinition).filter((x): x is CustomSectionDefinition => x !== null);
}

export function getCustomSections(settings?: SiteSettings | null): CustomSectionDefinition[] {
  return sanitizeSectionDefinitions(settings?.sectionDefinitions);
}

export function getCustomSectionById(
  id: string,
  settings?: SiteSettings | null,
): CustomSectionDefinition | undefined {
  return getCustomSections(settings).find(s => s.id === id);
}

export function resolveAllWikiSections(settings?: SiteSettings | null): WikiSectionMeta[] {
  const builtinIds = new Set(WIKI_HUB_SECTIONS.map(s => s.id));
  const custom = getCustomSections(settings)
    .filter(s => s.visible !== false && s.showInWikiHub !== false && !builtinIds.has(s.id))
    .map(s => ({
      id: s.id,
      label: s.label,
      title: s.title,
      icon: s.icon,
      description: s.description,
    }));
  return [...WIKI_HUB_SECTIONS, ...custom];
}

export function getSectionMetaResolved(
  id: string,
  settings?: SiteSettings | null,
): WikiSectionMeta | undefined {
  const builtin = WIKI_HUB_SECTIONS.find(s => s.id === id);
  if (builtin) return builtin;
  const custom = getCustomSectionById(id, settings);
  if (!custom || custom.visible === false) return undefined;
  return {
    id: custom.id,
    label: custom.label,
    title: custom.title,
    icon: custom.icon,
    description: custom.description,
  };
}

export function isContentSectionResolved(id: string, settings?: SiteSettings | null): boolean {
  if (CONTENT_SECTION_IDS.includes(id)) return true;
  const custom = getCustomSectionById(id, settings);
  return Boolean(custom && custom.visible !== false);
}

export function isCustomSection(id: string, settings?: SiteSettings | null): boolean {
  return Boolean(getCustomSectionById(id, settings));
}

export function getWikiSectionLabels(settings?: SiteSettings | null): Record<string, string> {
  const custom = Object.fromEntries(
    getCustomSections(settings).map(s => [s.id, s.label]),
  );
  return { ...WIKI_SECTION_LABELS, ...custom };
}

export function createEmptySection(label: string): CustomSectionDefinition {
  const id = slugSectionId(label || 'раздел');
  const defaultCatLabel = 'Прочее';
  return {
    id,
    label: label || 'Новый раздел',
    title: label || 'Новый раздел',
    icon: '✦',
    description: '',
    path: `/${id}`,
    visible: true,
    showInWikiHub: true,
    template: 'wiki-cards',
    fields: [...DEFAULT_WIKI_FIELDS],
    iconChoices: [...DEFAULT_SECTION_ICONS],
    categories: [{ id: createCategoryId(id, defaultCatLabel), label: defaultCatLabel, icon: '✦' }],
  };
}

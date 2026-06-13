import {
  DEFAULT_SECTION_CATEGORIES,
  type SectionCategoryDef,
  getDefaultSectionCategories,
} from '../data/sectionCategories';
import { trimText } from './asText';

/** Разделы, где id категории = отображаемое название (хранится в поле type/category) */
export const LABEL_AS_ID_SECTIONS = new Set([
  'weapons',
  'mystic',
  'sects',
  'lifeskills',
  'builds',
  'npcs',
  'guides',
]);

/** Старые / ошибочные id → канонический id */
export const CATEGORY_ALIASES: Record<string, Record<string, string>> = {
  weapons: {
    'Двойные клинки': 'Парные Клинки',
    'мо-клинок': 'Мо-клинок',
    'верёвочный-дротик': 'Верёвочный Дротик',
    'веревочный-дротик': 'Верёвочный Дротик',
    hangblade: 'Хангблэйд',
    'хангблэйд': 'Хангблэйд',
  },
};

export function usesLabelAsCategoryId(sectionKey: string): boolean {
  return LABEL_AS_ID_SECTIONS.has(sectionKey);
}

export function createCategoryId(sectionKey: string, label: string): string {
  const trimmed = trimText(label);
  if (!trimmed) return `cat-${Date.now()}`;
  if (usesLabelAsCategoryId(sectionKey)) return trimmed;
  return trimmed
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0400-\u04FF-]/g, '')
    .slice(0, 48) || `cat-${Date.now()}`;
}

export function normalizeCategoryId(sectionKey: string, rawId: string | undefined | null): string {
  const id = String(rawId || '').trim();
  if (!id) return '';
  const aliases = CATEGORY_ALIASES[sectionKey];
  return aliases?.[id] ?? aliases?.[id.toLowerCase()] ?? id;
}

export function mergeCategoriesDefinitionFirst(
  primary: SectionCategoryDef[],
  secondary?: SectionCategoryDef[] | null,
): SectionCategoryDef[] {
  if (!secondary?.length) return [...primary];
  const secondaryById = new Map(secondary.map(c => [c.id, c]));
  const seen = new Set<string>();
  const result: SectionCategoryDef[] = [];
  for (const c of primary) {
    result.push(secondaryById.get(c.id) ?? c);
    seen.add(c.id);
  }
  for (const c of secondary) {
    if (!seen.has(c.id)) result.push(c);
  }
  return result;
}

export function mergeCategoryLists(
  defaults: SectionCategoryDef[],
  stored?: SectionCategoryDef[] | null,
): SectionCategoryDef[] {
  /** Только первичное заполнение: если в базе уже есть список — не трогаем */
  if (Array.isArray(stored) && stored.length > 0) return stored;

  const map = new Map<string, SectionCategoryDef>();
  for (const d of defaults) map.set(d.id, { ...d });
  for (const s of stored || []) {
    const prev = map.get(s.id);
    map.set(s.id, prev ? { ...prev, ...s, label: s.label || prev.label } : s);
  }

  const seen = new Set<string>();
  const result: SectionCategoryDef[] = [];
  for (const d of defaults) {
    const item = map.get(d.id);
    if (item) {
      result.push(item);
      seen.add(d.id);
    }
  }
  for (const s of stored || []) {
    if (!seen.has(s.id)) {
      result.push(s);
      seen.add(s.id);
    }
  }
  return result;
}

export function categoriesNeedPersist(
  stored: SectionCategoryDef[] | undefined,
  merged: SectionCategoryDef[],
): boolean {
  if (!stored?.length) return true;
  if (stored.length !== merged.length) return true;
  const storedIds = new Set(stored.map(c => c.id));
  return merged.some(c => !storedIds.has(c.id));
}

export function seedAllSectionCategories(
  stored?: Record<string, SectionCategoryDef[]>,
): Record<string, SectionCategoryDef[]> {
  const out: Record<string, SectionCategoryDef[]> = { ...(stored || {}) };
  for (const [key, defaults] of Object.entries(DEFAULT_SECTION_CATEGORIES)) {
    if (!out[key]?.length) out[key] = defaults;
  }
  return out;
}

export function resolveSectionCategories(
  sectionKey: string,
  stored?: SectionCategoryDef[] | null,
): SectionCategoryDef[] {
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return getDefaultSectionCategories(sectionKey);
}

export function buildSectionFilterOptions(
  categories: SectionCategoryDef[],
  items: unknown[],
  getCategoryId: (item: unknown) => string,
  sectionKey?: string,
): { value: string; label: string; icon?: string }[] {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const raw = getCategoryId(item);
    const id = sectionKey ? normalizeCategoryId(sectionKey, raw) : raw;
    if (id) counts[id] = (counts[id] ?? 0) + 1;
  }

  const options: { value: string; label: string; icon?: string }[] = [
    { value: 'all', label: `Все (${items.length})` },
  ];

  for (const cat of categories) {
    options.push({
      value: cat.id,
      label: `${cat.label} (${counts[cat.id] ?? 0})`,
      icon: cat.icon,
    });
  }

  return options;
}

export type { SectionCategoryDef };

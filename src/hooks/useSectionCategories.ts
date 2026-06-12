import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDefaultSectionCategories } from '../data/sectionCategories';
import {
  categoriesNeedPersist,
  createCategoryId,
  mergeCategoryLists,
  normalizeCategoryId,
  resolveSectionCategories,
  type SectionCategoryDef,
} from '../lib/sectionCategoriesMerge';

export function useSectionCategories(sectionKey: string) {
  const { siteSettings, updateSiteSettings, isEditor, isAdmin } = useAuth();
  const canManage = isEditor() || isAdmin();
  const defaults = useMemo(() => getDefaultSectionCategories(sectionKey), [sectionKey]);
  const stored = siteSettings.sectionCategories?.[sectionKey];
  const seededRef = useRef(false);

  const categories = useMemo(
    () => resolveSectionCategories(sectionKey, stored),
    [sectionKey, stored],
  );

  const setCategories = useCallback(
    (next: SectionCategoryDef[]) => {
      updateSiteSettings({
        sectionCategories: {
          ...(siteSettings.sectionCategories || {}),
          [sectionKey]: next,
        },
      });
    },
    [sectionKey, siteSettings.sectionCategories, updateSiteSettings],
  );

  /** Однократно дописывает дефолтные категории в Supabase (для редакторов) */
  useEffect(() => {
    if (!canManage || seededRef.current) return;
    const merged = mergeCategoryLists(defaults, stored);
    if (categoriesNeedPersist(stored, merged)) {
      seededRef.current = true;
      setCategories(merged);
    }
  }, [canManage, defaults, stored, setCategories]);

  const addCategory = useCallback(
    (label: string, icon?: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const id = createCategoryId(sectionKey, trimmed);
      if (categories.some(c => c.id === id)) return;
      setCategories([...categories, { id, label: trimmed, icon: icon?.trim() || '✦' }]);
    },
    [categories, sectionKey, setCategories],
  );

  const removeCategory = useCallback(
    (id: string) => {
      setCategories(categories.filter(c => c.id !== id));
    },
    [categories, setCategories],
  );

  const resetCategories = useCallback(() => {
    setCategories(defaults);
  }, [defaults, setCategories]);

  const normalizeId = useCallback(
    (rawId: string | undefined | null) => normalizeCategoryId(sectionKey, rawId),
    [sectionKey],
  );

  const getLabel = useCallback(
    (id: string) => {
      const norm = normalizeCategoryId(sectionKey, id);
      return categories.find(c => c.id === norm)?.label ?? norm;
    },
    [categories, sectionKey],
  );

  const resolveCategory = useCallback(
    (id: string): SectionCategoryDef => {
      const norm = normalizeCategoryId(sectionKey, id);
      const hit = categories.find(c => c.id === norm);
      if (hit) return hit;
      return { id: norm, label: norm, icon: '✦' };
    },
    [categories, sectionKey],
  );

  const matchesFilter = useCallback(
    (rawCategoryId: string | undefined | null, filterValue: string) => {
      if (filterValue === 'all') return true;
      return normalizeCategoryId(sectionKey, rawCategoryId) === filterValue;
    },
    [sectionKey],
  );

  return {
    categories,
    setCategories,
    addCategory,
    removeCategory,
    resetCategories,
    getLabel,
    resolveCategory,
    normalizeId,
    matchesFilter,
    canManage,
  };
}

export type { SectionCategoryDef };

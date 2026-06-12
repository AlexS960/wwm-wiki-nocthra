import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDefaultSectionCategories } from '../data/sectionCategories';
import { getCustomSectionById } from '../lib/sectionRegistry';
import {
  createCategoryId,
  mergeCategoriesDefinitionFirst,
  normalizeCategoryId,
  resolveSectionCategories,
  type SectionCategoryDef,
} from '../lib/sectionCategoriesMerge';

export function useSectionCategories(sectionKey: string) {
  const { siteSettings, updateSiteSettings, isEditor, isAdmin } = useAuth();
  const canManage = isEditor() || isAdmin();
  const defaults = useMemo(() => getDefaultSectionCategories(sectionKey), [sectionKey]);
  const customDefaults = useMemo(() => {
    const fromDef = getCustomSectionById(sectionKey, siteSettings)?.categories;
    if (fromDef?.length) return fromDef;
    return defaults;
  }, [sectionKey, siteSettings, defaults]);
  const stored = siteSettings.sectionCategories?.[sectionKey];
  const seededRef = useRef(false);

  const defCategories = useMemo(
    () => getCustomSectionById(sectionKey, siteSettings)?.categories,
    [sectionKey, siteSettings],
  );

  const categories = useMemo(() => {
    if (defCategories?.length) {
      return stored?.length
        ? mergeCategoriesDefinitionFirst(stored, defCategories)
        : defCategories;
    }
    const resolved = resolveSectionCategories(sectionKey, stored);
    if (resolved.length) return resolved;
    return customDefaults;
  }, [defCategories, sectionKey, stored, customDefaults]);

  const setCategories = useCallback(
    (next: SectionCategoryDef[] | ((prev: SectionCategoryDef[]) => SectionCategoryDef[])) => {
      updateSiteSettings(prev => {
        const current = resolveSectionCategories(sectionKey, prev.sectionCategories?.[sectionKey]);
        const resolved = typeof next === 'function' ? next(current) : next;
        return {
          sectionCategories: {
            ...(prev.sectionCategories || {}),
            [sectionKey]: resolved,
          },
        };
      });
    },
    [sectionKey, updateSiteSettings],
  );

  /** Первичная запись дефолтов в Supabase, только если списка ещё нет */
  useEffect(() => {
    if (!canManage || seededRef.current || stored?.length) return;
    const toSeed = defCategories?.length ? defCategories : customDefaults;
    if (!toSeed.length) return;
    seededRef.current = true;
    setCategories(toSeed);
  }, [canManage, defCategories, customDefaults, stored, setCategories]);

  const addCategory = useCallback(
    (label: string, icon?: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const id = createCategoryId(sectionKey, trimmed);
      setCategories(prev => {
        if (prev.some(c => c.id === id)) return prev;
        return [...prev, { id, label: trimmed, icon: icon?.trim() || '✦' }];
      });
    },
    [sectionKey, setCategories],
  );

  const removeCategory = useCallback(
    (id: string) => {
      setCategories(prev => prev.filter(c => c.id !== id));
    },
    [setCategories],
  );

  const moveCategory = useCallback(
    (index: number, dir: -1 | 1) => {
      setCategories(prev => {
        const next = [...prev];
        const target = index + dir;
        if (target < 0 || target >= next.length) return prev;
        [next[index], next[target]] = [next[target], next[index]];
        return next;
      });
    },
    [setCategories],
  );

  const resetCategories = useCallback(() => {
    setCategories(customDefaults);
  }, [customDefaults, setCategories]);

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
    moveCategory,
    resetCategories,
    getLabel,
    resolveCategory,
    normalizeId,
    matchesFilter,
    canManage,
  };
}

export type { SectionCategoryDef };

import { useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  type SectionCategoryDef,
  getDefaultSectionCategories,
  slugCategoryId,
} from '../data/sectionCategories';

export function useSectionCategories(sectionKey: string) {
  const { siteSettings, updateSiteSettings, isEditor, isAdmin } = useAuth();
  const canManage = isEditor() || isAdmin();
  const defaults = useMemo(() => getDefaultSectionCategories(sectionKey), [sectionKey]);
  const stored = siteSettings.sectionCategories?.[sectionKey];

  const categories = useMemo(() => {
    if (Array.isArray(stored) && stored.length > 0) return stored;
    return defaults;
  }, [stored, defaults]);

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

  const addCategory = useCallback(
    (label: string, icon?: string) => {
      const trimmed = label.trim();
      if (!trimmed) return;
      const id = slugCategoryId(trimmed);
      if (categories.some(c => c.id === id || c.label === trimmed)) return;
      setCategories([...categories, { id, label: trimmed, icon: icon?.trim() || '✦' }]);
    },
    [categories, setCategories],
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

  const getLabel = useCallback(
    (id: string) => categories.find(c => c.id === id)?.label ?? id,
    [categories],
  );

  const resolveCategory = useCallback(
    (id: string): SectionCategoryDef => {
      const hit = categories.find(c => c.id === id);
      if (hit) return hit;
      return { id, label: id, icon: '✦' };
    },
    [categories],
  );

  return {
    categories,
    setCategories,
    addCategory,
    removeCategory,
    resetCategories,
    getLabel,
    resolveCategory,
    canManage,
  };
}

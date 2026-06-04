import { useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

/** Загружает и сохраняет переопределения статического контента раздела в siteSettings.sectionOverrides. */
export function useSectionOverrides<T>(sectionKey: string, defaultItems: T[]) {
  const { siteSettings, updateSiteSettings, isEditor, isAdmin } = useAuth();
  const canManage = isEditor() || isAdmin();
  const sectionOverrides = siteSettings.sectionOverrides || {};

  const items = useMemo(
    () => (Array.isArray(sectionOverrides[sectionKey]) ? sectionOverrides[sectionKey] as T[] : defaultItems),
    [sectionOverrides, sectionKey, defaultItems],
  );

  const persistItems = useCallback(
    (next: T[]) => {
      updateSiteSettings({ sectionOverrides: { ...sectionOverrides, [sectionKey]: next } });
    },
    [sectionOverrides, sectionKey, updateSiteSettings],
  );

  return { items, persistItems, canManage };
}

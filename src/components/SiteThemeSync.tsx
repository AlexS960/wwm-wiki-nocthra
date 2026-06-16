import { useEffect } from 'react';
import { useAuthState } from '../context/AuthContext';
import { applySiteTheme } from '../lib/siteConstructor';

/** Применяет настраиваемый фон и тему из конструктора сайта */
export default function SiteThemeSync() {
  const { siteSettings } = useAuthState();

  useEffect(() => {
    if (siteSettings.hero) applySiteTheme(siteSettings.hero);
  }, [siteSettings.hero?.bgImageUrl]);

  return null;
}

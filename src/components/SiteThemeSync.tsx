import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applySiteTheme } from '../lib/siteConstructor';

/** Применяет настраиваемый фон и тему из конструктора сайта */
export default function SiteThemeSync() {
  const { siteSettings } = useAuth();

  useEffect(() => {
    if (siteSettings.hero) applySiteTheme(siteSettings.hero);
  }, [siteSettings.hero?.bgImageUrl]);

  return null;
}

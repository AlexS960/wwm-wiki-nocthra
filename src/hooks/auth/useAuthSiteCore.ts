import { useCallback, useEffect, useState } from 'react';
import { dbInit, dbLoadProgress, dbLoadSiteData } from '../../lib/db';
import { defaultGuild } from '../../types/site';
import type { GuildData, SiteSettings, User, UserProgress } from '../../types/site';
import { defaultSiteSettings } from '../../context/authContextTypes';
import { sanitizeGuildAvatar } from '../../lib/siteImages';

const defS = defaultSiteSettings;

type Deps = {
  user: User | null;
  setProgress: (p: UserProgress) => void;
  setDbSaveError: (msg: string | null) => void;
};

export function useAuthSiteCore({ user, setProgress, setDbSaveError }: Deps) {
  const [isLoading, setIsLoading] = useState(true);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defS);
  const [guild, setGuild] = useState<GuildData>(defaultGuild);
  const [discordUrl, setDiscordUrl] = useState('https://discord.com/invite/mYqKkN3u4');

  const mergeSiteSettings = useCallback((s: SiteSettings | null): SiteSettings => {
    if (!s) return defS;
    return {
      ...defS,
      ...s,
      pmSettings: { ...defS.pmSettings, ...(s.pmSettings || {}) },
      riddlesHiddenIds: Array.isArray(s.riddlesHiddenIds) ? s.riddlesHiddenIds : [],
      sectionOverrides: s.sectionOverrides && typeof s.sectionOverrides === 'object' ? s.sectionOverrides : {},
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await dbInit();
      } catch {
        setDbSaveError(
          'Не удалось подключиться к Supabase. Проверьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY (.env локально или Environment Variables на Vercel + Redeploy).',
        );
        setIsLoading(false);
        return;
      }
      const [s, guildData, discord] = await Promise.all([
        dbLoadSiteData('site_settings', null),
        dbLoadSiteData('guild', defaultGuild),
        dbLoadSiteData('discord_url', 'https://discord.com/invite/mYqKkN3u4'),
      ]);
      if (!active) return;
      setSiteSettings(mergeSiteSettings(s as SiteSettings | null));
      setGuild(sanitizeGuildAvatar(guildData as GuildData));
      setDiscordUrl(discord);
      if (user) {
        const p = await dbLoadProgress(user.id);
        if (p && active) setProgress(p);
      }
      setIsLoading(false);
    })();
    return () => { active = false; };
  }, [mergeSiteSettings, setProgress, user?.id, setDbSaveError]);

  const getRoleConfig = useCallback(
    (r: string) => siteSettings.roles.find(x => x.id === r) || siteSettings.roles[0],
    [siteSettings.roles],
  );

  return {
    isLoading,
    siteSettings,
    setSiteSettings,
    guild,
    setGuild,
    discordUrl,
    setDiscordUrl,
    mergeSiteSettings,
    getRoleConfig,
  };
}

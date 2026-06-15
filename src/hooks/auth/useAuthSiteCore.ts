import { useCallback, useEffect, useState } from 'react';
import { dbInit, dbLoadProgress, dbLoadSiteData, dbSaveProgress } from '../../lib/db';
import { defaultGuild } from '../../types/site';
import type { GuildData, SiteSettings, User, UserProgress } from '../../types/site';
import { defaultSiteSettings } from '../../context/authContextTypes';
import { sanitizeGuildAvatar } from '../../lib/siteImages';
import { mergeSiteSettingsSafe } from '../../lib/normalizeState';
import { loadProgressLocal, normalizeUserProgress, saveProgressLocal } from '../../lib/userProgress';

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

  const mergeSiteSettings = useCallback(
    (s: SiteSettings | null) => mergeSiteSettingsSafe(s),
    [],
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await dbInit();
      } catch {
        setDbSaveError(
          'Не удалось подключиться к Supabase. Проверьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY (.env локально или Environment Variables на Vercel + Redeploy).',
        );
        if (user) {
          const fromLocal = loadProgressLocal(user.id);
          if (fromLocal) setProgress(fromLocal);
        }
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
        const fromDb = await dbLoadProgress(user.id);
        const fromLocal = loadProgressLocal(user.id);
        const merged = normalizeUserProgress(fromDb ?? fromLocal ?? null);
        if (active) setProgress(merged);
        if (fromDb) saveProgressLocal(user.id, merged);
        else if (fromLocal) void dbSaveProgress(user.id, merged);
      }
      setIsLoading(false);
    })();
    return () => { active = false; };
  }, [mergeSiteSettings, setProgress, user?.id, setDbSaveError]);

  const getRoleConfig = useCallback(
    (r: string) => {
      const roles = siteSettings.roles?.length ? siteSettings.roles : defS.roles;
      return roles.find(x => x.id === r) || roles[0];
    },
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

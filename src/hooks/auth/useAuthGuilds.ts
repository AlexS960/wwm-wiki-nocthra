import { useCallback, useRef, useState } from 'react';
import { dbCreateRegisteredGuild, dbListRegisteredGuilds } from '../../lib/db';
import { getDisplayName } from '../../lib/displayName';
import type { RegisteredGuild, User } from '../../types/site';

export function useAuthGuilds(user: User | null) {
  const [registeredGuilds, setRegisteredGuilds] = useState<RegisteredGuild[]>([]);
  const [guildsLoaded, setGuildsLoaded] = useState(false);
  const loadRef = useRef<Promise<void> | null>(null);

  const ensureGuildsLoaded = useCallback(async () => {
    if (guildsLoaded) return;
    if (!loadRef.current) {
      loadRef.current = (async () => {
        const list = await dbListRegisteredGuilds();
        setRegisteredGuilds(list);
        setGuildsLoaded(true);
      })();
    }
    await loadRef.current;
  }, [guildsLoaded]);

  const refreshGuilds = useCallback(async () => {
    const list = await dbListRegisteredGuilds();
    setRegisteredGuilds(list);
    setGuildsLoaded(true);
  }, []);

  const registerGuild = useCallback(async (
    name: string,
    description = '',
    server = '',
  ): Promise<string | null> => {
    if (!user) return 'Войдите в аккаунт';
    const res = await dbCreateRegisteredGuild({
      name,
      description,
      server,
      leaderId: user.id,
      leaderName: getDisplayName(user),
    });
    if ('error' in res) return res.error;
    setRegisteredGuilds(prev => [...prev, res].sort((a, b) => a.name.localeCompare(b.name, 'ru')));
    return null;
  }, [user]);

  const getGuildName = useCallback((guildId?: string) => {
    if (!guildId) return '';
    return registeredGuilds.find(g => g.id === guildId)?.name || '';
  }, [registeredGuilds]);

  return {
    registeredGuilds,
    guildsLoaded,
    ensureGuildsLoaded,
    refreshGuilds,
    registerGuild,
    getGuildName,
  };
}

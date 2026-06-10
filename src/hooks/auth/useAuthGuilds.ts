import { useCallback, useRef, useState } from 'react';
import {
  dbCreateRegisteredGuild,
  dbDeleteRegisteredGuild,
  dbListRegisteredGuilds,
  dbUpdateAccount,
  dbUpdateRegisteredGuild,
} from '../../lib/db';
import { getDisplayName } from '../../lib/displayName';
import type { RegisteredGuild, RegisteredGuildInput, RegisteredUser, User } from '../../types/site';

export function useAuthGuilds(user: User | null, refreshAccounts?: () => Promise<void>) {
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
    input: RegisteredGuildInput,
    registrarId?: string,
  ): Promise<RegisteredGuild | string> => {
    if (!user) return 'Войдите в аккаунт';
    if (!input.leaderId) return 'Выберите гильдмастера из списка';

    const res = await dbCreateRegisteredGuild({
      name: input.name,
      description: input.description,
      server: input.server,
      leaderId: input.leaderId,
      leaderName: input.leaderName || '',
      leaderGameNickname: input.leaderGameNickname || '',
    });
    if ('error' in res) return res.error;

    if (registrarId && registrarId !== input.leaderId) {
      await dbUpdateAccount(registrarId, { guild_id: res.id });
    }

    setRegisteredGuilds(prev => [...prev, res].sort((a, b) => a.name.localeCompare(b.name, 'ru')));
    void refreshAccounts?.();
    return res;
  }, [user, refreshAccounts]);

  const updateRegisteredGuild = useCallback(async (
    id: string,
    updates: Partial<RegisteredGuildInput>,
  ): Promise<string | null> => {
    const dbUpdates: Parameters<typeof dbUpdateRegisteredGuild>[1] = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.server !== undefined) dbUpdates.server = updates.server;
    if (updates.leaderId !== undefined) dbUpdates.leader_id = updates.leaderId;
    if (updates.leaderName !== undefined) dbUpdates.leader_name = updates.leaderName;
    if (updates.leaderGameNickname !== undefined) dbUpdates.leader_game_nickname = updates.leaderGameNickname;

    const res = await dbUpdateRegisteredGuild(id, dbUpdates);
    if (res.error) return res.error;

    if (updates.leaderId) {
      await dbUpdateAccount(updates.leaderId, { guild_id: id });
    }

    setRegisteredGuilds(prev =>
      prev.map(g => g.id === id ? {
        ...g,
        name: updates.name?.trim() ?? g.name,
        description: updates.description?.trim() ?? g.description,
        server: updates.server?.trim() ?? g.server,
        leaderId: updates.leaderId ?? g.leaderId,
        leaderName: updates.leaderName?.trim() ?? g.leaderName,
        leaderGameNickname: updates.leaderGameNickname?.trim() ?? g.leaderGameNickname,
        updatedAt: new Date().toISOString(),
      } : g).sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    );
    void refreshAccounts?.();
    return null;
  }, [refreshAccounts]);

  const deleteRegisteredGuild = useCallback(async (id: string): Promise<string | null> => {
    const res = await dbDeleteRegisteredGuild(id);
    if (res.error) return res.error;
    setRegisteredGuilds(prev => prev.filter(g => g.id !== id));
    void refreshAccounts?.();
    return null;
  }, [refreshAccounts]);

  const getGuildName = useCallback((guildId?: string) => {
    if (!guildId) return '';
    return registeredGuilds.find(g => g.id === guildId)?.name || '';
  }, [registeredGuilds]);

  const getGuildById = useCallback((guildId?: string) => {
    if (!guildId) return undefined;
    return registeredGuilds.find(g => g.id === guildId);
  }, [registeredGuilds]);

  return {
    registeredGuilds,
    guildsLoaded,
    ensureGuildsLoaded,
    refreshGuilds,
    registerGuild,
    updateRegisteredGuild,
    deleteRegisteredGuild,
    getGuildName,
    getGuildById,
  };
}

export function buildLeaderOptions(users: RegisteredUser[], currentUser: User | null) {
  const withNick = users.filter(u => u.gameNickname?.trim());
  if (currentUser?.gameNickname?.trim() && !withNick.some(u => u.id === currentUser.id)) {
    withNick.unshift({
      id: currentUser.id,
      email: '',
      name: currentUser.name,
      picture: currentUser.picture,
      gameNickname: currentUser.gameNickname,
      guildId: currentUser.guildId,
      role: currentUser.role,
      joinedAt: '',
      lastSeen: '',
      lastSeenAt: null,
      isBanned: false,
    });
  }
  return withNick.sort((a, b) =>
    (a.gameNickname || a.name).localeCompare(b.gameNickname || b.name, 'ru'),
  );
}

export function leaderOptionLabel(u: Pick<RegisteredUser, 'gameNickname' | 'name'>) {
  const nick = u.gameNickname?.trim();
  return nick ? `${nick} (${u.name})` : u.name;
}

export function leaderFromUser(u: Pick<RegisteredUser, 'id' | 'name' | 'gameNickname'>): Pick<RegisteredGuildInput, 'leaderId' | 'leaderName' | 'leaderGameNickname'> {
  return {
    leaderId: u.id,
    leaderName: u.name,
    leaderGameNickname: u.gameNickname?.trim() || '',
  };
}

export function leaderFromCurrentUser(user: User): Pick<RegisteredGuildInput, 'leaderId' | 'leaderName' | 'leaderGameNickname'> {
  return {
    leaderId: user.id,
    leaderName: user.name,
    leaderGameNickname: user.gameNickname?.trim() || getDisplayName(user),
  };
}

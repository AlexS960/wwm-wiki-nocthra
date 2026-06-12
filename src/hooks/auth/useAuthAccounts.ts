import { useCallback, useRef, useState } from 'react';
import { dbListAccounts, dbUpdateAccount } from '../../lib/db';
import type { RegisteredUser, User } from '../../types/site';
import { formatLastSeen } from '../../lib/displayName';

export function useAuthAccounts(user: User | null) {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [accountsLoaded, setAccountsLoaded] = useState(false);
  const accountsLoadRef = useRef<Promise<void> | null>(null);

  const mapAccounts = useCallback((accs: Awaited<ReturnType<typeof dbListAccounts>>) =>
    accs.map(a => {
      const lastSeenAt = a.last_seen || null;
      return {
        id: a.id,
        email: '',
        name: a.username,
        picture: a.picture || '',
        gameNickname: a.game_nickname || '',
        guildId: a.guild_id || '',
        role: a.role,
        joinedAt: a.created_at,
        lastSeenAt,
        lastSeen: formatLastSeen(lastSeenAt),
        isBanned: false,
      };
    }),
  []);

  const ensureAccountsLoaded = useCallback(async () => {
    if (accountsLoaded) return;
    if (!accountsLoadRef.current) {
      accountsLoadRef.current = (async () => {
        const accs = await dbListAccounts();
        setRegisteredUsers(mapAccounts(accs));
        setAccountsLoaded(true);
      })();
    }
    await accountsLoadRef.current;
  }, [accountsLoaded, mapAccounts]);

  const refreshAccounts = useCallback(async () => {
    try {
      const accs = await dbListAccounts();
      setRegisteredUsers(mapAccounts(accs));
    } catch {}
  }, [mapAccounts]);

  const pingLastSeen = useCallback(() => {
    if (!user) return;
    const now = new Date().toISOString();
    void dbUpdateAccount(user.id, { last_seen: now });
    setRegisteredUsers(prev =>
      prev.map(u => u.id === user.id ? { ...u, lastSeenAt: now, lastSeen: formatLastSeen(now) } : u),
    );
  }, [user?.id]);

  return {
    registeredUsers,
    setRegisteredUsers,
    accountsLoaded,
    ensureAccountsLoaded,
    refreshAccounts,
    pingLastSeen,
    mapAccounts,
  };
}

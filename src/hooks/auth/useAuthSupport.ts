import { useCallback, useRef, useState } from 'react';
import type { RoleConfig, SupportTicket, User } from '../../types/site';
import {
  contentStoreLoadSupportTickets,
  contentStoreUsesNormalized,
  contentStoreAddSupportTicket,
  contentStoreUpdateSupportTicket,
  contentStoreDeleteSupportTicket,
} from '../../lib/contentStore';
import { getDisplayName } from '../../lib/displayName';
import type { MutableRefObject } from 'react';
import type { NormalizedDomains } from './types';

type Deps = {
  user: User | null;
  persist: (key: string, data: unknown) => Promise<string | null>;
  getRoleConfig: (r: string) => RoleConfig;
  normalizedRef: MutableRefObject<NormalizedDomains>;
};

export function useAuthSupport({ user, persist, getRoleConfig, normalizedRef }: Deps) {
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [supportLoaded, setSupportLoaded] = useState(false);
  const supportLoadRef = useRef<Promise<void> | null>(null);
  const supportRef = useRef(supportTickets);
  supportRef.current = supportTickets;

  const ensureSupportLoaded = useCallback(async () => {
    if (supportLoaded) return;
    if (!supportLoadRef.current) {
      supportLoadRef.current = (async () => {
        normalizedRef.current.support = await contentStoreUsesNormalized('support');
        setSupportTickets(await contentStoreLoadSupportTickets());
        setSupportLoaded(true);
      })();
    }
    await supportLoadRef.current;
  }, [supportLoaded, normalizedRef]);

  const createTicket = useCallback(async (s: string, m: string) => {
    if (!user) return 'Войдите в аккаунт';
    const dn = getDisplayName(user);
    const ticket: SupportTicket = {
      id: 't' + Date.now(),
      userId: user.id,
      userName: dn,
      subject: s.trim(),
      message: m.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
      replies: [],
    };
    const prev = supportRef.current;
    const next = [...prev, ticket];
    setSupportTickets(next);
    if (await contentStoreUsesNormalized('support')) {
      const ok = await contentStoreAddSupportTicket(ticket);
      if (!ok) {
        setSupportTickets(prev);
        return 'Не удалось создать тикет';
      }
    } else {
      const err = await persist('support', next);
      if (err) {
        setSupportTickets(prev);
        return err;
      }
    }
    return null;
  }, [user, persist]);

  const replyToTicket = useCallback(async (id: string, m: string) => {
    if (!user) return 'Войдите в аккаунт';
    const dn = getDisplayName(user);
    const rc = getRoleConfig(user.role).displayName;
    const prev = supportRef.current;
    const next = prev.map(x => x.id === id ? {
      ...x,
      status: 'answered' as const,
      replies: [...x.replies, {
        id: 'r' + Date.now(),
        authorName: dn,
        authorRole: rc,
        message: m.trim(),
        createdAt: new Date().toISOString(),
      }],
    } : x);
    setSupportTickets(next);
    const updated = next.find(x => x.id === id);
    if (await contentStoreUsesNormalized('support') && updated) {
      const ok = await contentStoreUpdateSupportTicket(updated);
      if (!ok) {
        setSupportTickets(prev);
        return 'Не удалось ответить на тикет';
      }
    } else {
      const err = await persist('support', next);
      if (err) {
        setSupportTickets(prev);
        return err;
      }
    }
    return null;
  }, [user, persist, getRoleConfig]);

  const closeTicket = useCallback(async (id: string) => {
    const prev = supportRef.current;
    const next = prev.map(x => x.id === id ? { ...x, status: 'closed' as const } : x);
    setSupportTickets(next);
    const updated = next.find(x => x.id === id);
    if (await contentStoreUsesNormalized('support') && updated) {
      const ok = await contentStoreUpdateSupportTicket(updated);
      if (!ok) {
        setSupportTickets(prev);
        return 'Не удалось закрыть тикет';
      }
    } else {
      const err = await persist('support', next);
      if (err) {
        setSupportTickets(prev);
        return err;
      }
    }
    return null;
  }, [persist]);

  const deleteTicket = useCallback(async (id: string) => {
    const prev = supportRef.current;
    const next = prev.filter(x => x.id !== id);
    setSupportTickets(next);
    if (await contentStoreUsesNormalized('support')) {
      const ok = await contentStoreDeleteSupportTicket(id);
      if (!ok) {
        setSupportTickets(prev);
        return 'Не удалось удалить тикет';
      }
    } else {
      const err = await persist('support', next);
      if (err) {
        setSupportTickets(prev);
        return err;
      }
    }
    return null;
  }, [persist]);

  return {
    supportTickets,
    setSupportTickets,
    supportLoaded,
    setSupportLoaded,
    ensureSupportLoaded,
    createTicket,
    replyToTicket,
    closeTicket,
    deleteTicket,
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import type { User, RegisteredUser } from '../types/site';
import { getDisplayName } from '../lib/displayName';
import type { PrivateMessage } from '../lib/pm';
import { logger } from '../lib/logger';
import {
  pmDeleteForAll,
  pmDeleteDialogForAll,
  pmHideForUser,
  pmInsertMessage,
  pmLoadInboxPreview,
  pmLoadThread,
  pmMarkRead,
  pmMigrateLegacyFromSiteData,
  pmTableExists,
} from '../lib/pmDb';
import { isStaffChatRole } from '../lib/staffChat';
import type { RoleConfig } from '../types/site';

interface UseAuthPmOptions {
  user: User | null;
  registeredUsers: RegisteredUser[];
  siteRoles: RoleConfig[];
  isLoading: boolean;
  setDbSaveError: (error: string | null) => void;
}

export function useAuthPm({ user, registeredUsers, siteRoles, isLoading, setDbSaveError }: UseAuthPmOptions) {
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [pmLoaded, setPmLoaded] = useState(false);
  const pmRef = useRef(privateMessages);
  const pmRefreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  pmRef.current = privateMessages;

  const refreshPrivateMessages = useCallback(async () => {
    if (!user) {
      setPrivateMessages([]);
      setPmLoaded(true);
      return;
    }
    try {
      const ok = await pmTableExists();
      if (!ok) {
        setDbSaveError('Таблица pm_messages не найдена. Выполните supabase/pm-messages-setup.sql в Supabase SQL Editor.');
        setPmLoaded(true);
        return;
      }
      await pmMigrateLegacyFromSiteData();
      const msgs = await pmLoadInboxPreview(user.id);
      setPrivateMessages(msgs);
      setPmLoaded(true);
    } catch (e) {
      logger.error('Failed to load private messages', 'pm', e);
      setDbSaveError(e instanceof Error ? e.message : 'Ошибка загрузки личных сообщений');
      setPmLoaded(true);
    }
  }, [user?.id, setDbSaveError]);

  useEffect(() => {
    if (isLoading) return;
    void refreshPrivateMessages();
  }, [isLoading, refreshPrivateMessages]);

  const schedulePmRefresh = useCallback(() => {
    if (pmRefreshTimer.current) clearTimeout(pmRefreshTimer.current);
    pmRefreshTimer.current = setTimeout(() => {
      pmRefreshTimer.current = null;
      void refreshPrivateMessages();
    }, 800);
  }, [refreshPrivateMessages]);

  const loadPmThread = useCallback(async (partnerId: string) => {
    if (!user) return;
    try {
      const thread = await pmLoadThread(user.id, partnerId);
      setPrivateMessages(prev => {
        const rest = prev.filter(m =>
          !((m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id)),
        );
        return [...rest, ...thread].sort((a, b) => a.timestamp - b.timestamp);
      });
    } catch (e) {
      logger.error('Failed to load PM thread', 'pm', e);
    }
  }, [user?.id]);

  const unreadPMCount = privateMessages.filter(
    x => x.toId === user?.id && !x.read && !x.deletedForAll && !x.hiddenFor?.includes(user?.id || ''),
  ).length;

  const sendPrivateMessage = useCallback(async (toId: string, text: string) => {
    if (!user) return 'Войдите в аккаунт';
    if (!toId?.trim() || !text?.trim()) return 'Укажите получателя и текст';
    const dn = getDisplayName(user);
    const target = registeredUsers.find(u => u.id === toId);
    const toDn = target ? getDisplayName(target) : '';
    const msg: PrivateMessage = {
      id: 'p' + Date.now() + Math.random().toString(36).slice(2, 6),
      fromId: user.id,
      fromName: dn,
      toId,
      toName: toDn,
      text: text.trim(),
      timestamp: Date.now(),
      read: false,
    };
    const prev = pmRef.current;
    setPrivateMessages([...prev, msg]);
    const { error } = await pmInsertMessage(msg);
    if (error) {
      setPrivateMessages(prev);
      return error;
    }
    return null;
  }, [user, registeredUsers]);

  const sendStaffPrivateMessage = useCallback(async (toId: string, text: string) => {
    if (!user) return 'Войдите в аккаунт';
    if (!isStaffChatRole(user.role, siteRoles)) return 'Нет доступа к служебному чату';
    const target = registeredUsers.find(u => u.id === toId);
    if (!target || !isStaffChatRole(target.role, siteRoles)) {
      return 'Собеседник не в списке команды';
    }
    return sendPrivateMessage(toId, text);
  }, [user, registeredUsers, siteRoles, sendPrivateMessage]);

  const markPMRead = useCallback(async (partnerId: string) => {
    if (!user) return;
    const prev = pmRef.current;
    const hasUnread = prev.some(x => x.fromId === partnerId && x.toId === user.id && !x.read);
    if (!hasUnread) return;
    setPrivateMessages(prev.map(x =>
      x.fromId === partnerId && x.toId === user.id ? { ...x, read: true } : x,
    ));
    const { error } = await pmMarkRead(user.id, partnerId);
    if (error) {
      setPrivateMessages(prev);
      setDbSaveError(error);
    }
  }, [user, setDbSaveError]);

  const deletePrivateMessageForMe = useCallback(async (messageId: string) => {
    if (!user) return 'Войдите в аккаунт';
    const prev = pmRef.current;
    const msg = prev.find(m => m.id === messageId);
    if (!msg) return null;
    if (msg.hiddenFor?.includes(user.id)) return null;
    setPrivateMessages(prev.filter(m => m.id !== messageId));
    const { error } = await pmHideForUser(messageId, user.id);
    if (error) {
      setPrivateMessages(prev);
      return error;
    }
    return null;
  }, [user]);

  const deletePrivateMessageForAll = useCallback(async (messageId: string) => {
    if (!user) return 'Войдите в аккаунт';
    const prev = pmRef.current;
    const msg = prev.find(m => m.id === messageId);
    if (!msg) return null;
    setPrivateMessages(prev.filter(m => m.id !== messageId));
    const { error } = await pmDeleteForAll(messageId, user.id);
    if (error) {
      setPrivateMessages(prev);
      return error;
    }
    return null;
  }, [user]);

  const deletePmDialogForMe = useCallback(async (partnerId: string) => {
    if (!user) return 'Войдите в аккаунт';
    const prev = pmRef.current;
    const inThread = (m: PrivateMessage) =>
      (m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id);
    const thread = prev.filter(inThread);
    for (const m of thread) {
      const { error } = await pmHideForUser(m.id, user.id);
      if (error) return error;
    }
    setPrivateMessages(prev.filter(m => !inThread(m)));
    return null;
  }, [user]);

  const deletePmDialogForAll = useCallback(async (partnerId: string) => {
    if (!user) return 'Войдите в аккаунт';
    const prev = pmRef.current;
    const inThread = (m: PrivateMessage) =>
      (m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id);
    const { error } = await pmDeleteDialogForAll(user.id, partnerId);
    if (error) return error;
    setPrivateMessages(prev.filter(m => !inThread(m)));
    return null;
  }, [user]);

  return {
    privateMessages,
    pmLoaded,
    loadPmThread,
    schedulePmRefresh,
    unreadPMCount,
    sendPrivateMessage,
    sendStaffPrivateMessage,
    markPMRead,
    deletePrivateMessageForMe,
    deletePrivateMessageForAll,
    deletePmDialogForMe,
    deletePmDialogForAll,
  };
}

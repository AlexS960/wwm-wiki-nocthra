import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChatMessage, ChatState, User } from '../../types/site';
import {
  contentStoreLoadChat,
  contentStoreLoadOlderChat,
  contentStoreSearchChat,
  contentStoreUsesNormalized,
  contentStoreSendChatMessage,
  contentStoreDeleteChatMessage,
  contentStoreMuteUser,
  contentStoreUnmuteUser,
  contentStoreSaveChatAll,
} from '../../lib/contentStore';
import { dbSaveSiteData } from '../../lib/db';
import { trimChatMessages, CHAT_PERSIST_DEBOUNCE_MS } from '../../lib/chat';
import { sanitizeSiteDataPayload } from '../../lib/siteImages';
import { getDisplayName } from '../../lib/displayName';
import type { MutableRefObject } from 'react';
import type { NormalizedDomains } from './types';

type Deps = {
  user: User | null;
  persist: (key: string, data: unknown) => Promise<string | null>;
  normalizedRef: MutableRefObject<NormalizedDomains>;
};

export function useAuthChat({ user, persist, normalizedRef }: Deps) {
  const [chatState, setChatState] = useState<ChatState>({ messages: [], mutedUsers: [] });
  const [chatLoaded, setChatLoaded] = useState(false);
  const [chatHasMore, setChatHasMore] = useState(false);
  const [chatLoadingMore, setChatLoadingMore] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatSearchResults, setChatSearchResults] = useState<ChatMessage[] | null>(null);

  const chatRef = useRef(chatState);
  const chatLoadRef = useRef<Promise<void> | null>(null);
  const chatPersistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  chatRef.current = chatState;

  const ensureChatLoaded = useCallback(async () => {
    if (chatLoaded) return;
    if (!chatLoadRef.current) {
      chatLoadRef.current = (async () => {
        normalizedRef.current.chat = await contentStoreUsesNormalized('chat');
        const state = await contentStoreLoadChat();
        setChatState(state);
        if (normalizedRef.current.chat && state.messages.length > 0) {
          setChatHasMore(true);
        } else {
          setChatHasMore(false);
        }
        setChatLoaded(true);
      })();
    }
    await chatLoadRef.current;
  }, [chatLoaded, normalizedRef]);

  const loadOlderChatMessages = useCallback(async () => {
    if (!chatHasMore || chatLoadingMore || chatState.messages.length === 0) return;
    setChatLoadingMore(true);
    try {
      const oldest = chatRef.current.messages[0];
      const before = new Date(oldest.timestamp).toISOString();
      const { messages, hasMore } = await contentStoreLoadOlderChat(before);
      setChatHasMore(hasMore);
      if (messages.length > 0) {
        setChatState(prev => ({
          ...prev,
          messages: [...messages, ...prev.messages],
        }));
      } else {
        setChatHasMore(false);
      }
    } finally {
      setChatLoadingMore(false);
    }
  }, [chatHasMore, chatLoadingMore, chatState.messages.length]);

  const searchChatMessages = useCallback(async (query: string) => {
    setChatSearchQuery(query);
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setChatSearchResults(null);
      return;
    }
    const results = await contentStoreSearchChat(trimmed);
    setChatSearchResults(results);
  }, []);

  const clearChatSearch = useCallback(() => {
    setChatSearchQuery('');
    setChatSearchResults(null);
  }, []);

  const flushChatPersist = useCallback(() => {
    if (chatPersistTimer.current) {
      clearTimeout(chatPersistTimer.current);
      chatPersistTimer.current = null;
    }
    if (normalizedRef.current.chat) return contentStoreSaveChatAll(chatRef.current);
    const payload = sanitizeSiteDataPayload('chat', chatRef.current);
    return dbSaveSiteData('chat', payload);
  }, [normalizedRef]);

  const scheduleChatPersist = useCallback((next: ChatState) => {
    if (normalizedRef.current.chat) return;
    if (chatPersistTimer.current) clearTimeout(chatPersistTimer.current);
    chatPersistTimer.current = setTimeout(() => {
      chatPersistTimer.current = null;
      void dbSaveSiteData('chat', sanitizeSiteDataPayload('chat', next));
    }, CHAT_PERSIST_DEBOUNCE_MS);
  }, [normalizedRef]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden' && chatPersistTimer.current) {
        void flushChatPersist();
      }
    };
    const onUnload = () => {
      if (chatPersistTimer.current) void flushChatPersist();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('beforeunload', onUnload);
      if (chatPersistTimer.current) void flushChatPersist();
    };
  }, [flushChatPersist]);

  const sendMessage = useCallback(async (text: string) => {
    if (!user) return 'Войдите в аккаунт';
    const prev = chatRef.current;
    if (prev.mutedUsers.some(m => m.userId === user.id && Date.now() < m.until)) {
      return 'Вы не можете писать в чат (ограничение)';
    }
    const dn = getDisplayName(user);
    const message: ChatMessage = {
      id: 'm' + Date.now(),
      userId: user.id,
      userName: dn,
      userRole: user.role,
      text: text.trim(),
      timestamp: Date.now(),
    };
    const next: ChatState = {
      ...prev,
      messages: trimChatMessages([...prev.messages, message]),
    };
    setChatState(next);
    if (await contentStoreUsesNormalized('chat')) {
      const { error } = await contentStoreSendChatMessage(message, prev);
      if (error) {
        setChatState(prev);
        return error;
      }
    } else {
      scheduleChatPersist(next);
    }
    return null;
  }, [user, scheduleChatPersist]);

  const deleteMessage = useCallback(async (id: string) => {
    const prev = chatRef.current;
    const next: ChatState = {
      ...prev,
      messages: prev.messages.map(x => x.id === id ? { ...x, deleted: true } : x),
    };
    setChatState(next);
    if (chatPersistTimer.current) clearTimeout(chatPersistTimer.current);
    if (await contentStoreUsesNormalized('chat')) {
      const { error } = await contentStoreDeleteChatMessage(id, prev);
      if (error) {
        setChatState(prev);
        return error;
      }
    } else {
      const err = await persist('chat', next);
      if (err) {
        setChatState(prev);
        return err;
      }
    }
    return null;
  }, [persist]);

  const muteUser = useCallback(async (uid: string, minutes: number) => {
    const prev = chatRef.current;
    const until = Date.now() + minutes * 60000;
    const next: ChatState = {
      ...prev,
      mutedUsers: [...prev.mutedUsers.filter(m => m.userId !== uid), { userId: uid, until }],
    };
    setChatState(next);
    if (await contentStoreUsesNormalized('chat')) {
      return contentStoreMuteUser(uid, until, prev).then(r => r.error || null);
    }
    return persist('chat', next);
  }, [persist]);

  const unmuteUser = useCallback(async (uid: string) => {
    const prev = chatRef.current;
    const next: ChatState = { ...prev, mutedUsers: prev.mutedUsers.filter(m => m.userId !== uid) };
    setChatState(next);
    if (await contentStoreUsesNormalized('chat')) {
      return contentStoreUnmuteUser(uid, prev).then(r => r.error || null);
    }
    return persist('chat', next);
  }, [persist]);

  const isUserMuted = useCallback(
    (uid: string) => chatState.mutedUsers.some(m => m.userId === uid && Date.now() < m.until),
    [chatState.mutedUsers],
  );

  return {
    chatState,
    setChatState,
    chatLoaded,
    chatHasMore,
    chatLoadingMore,
    chatSearchQuery,
    chatSearchResults,
    ensureChatLoaded,
    loadOlderChatMessages,
    searchChatMessages,
    clearChatSearch,
    sendMessage,
    deleteMessage,
    muteUser,
    unmuteUser,
    isUserMuted,
  };
}

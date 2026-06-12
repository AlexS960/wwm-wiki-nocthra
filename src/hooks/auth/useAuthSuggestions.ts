import { useCallback, useRef, useState } from 'react';
import type { SuggestionTopic, User } from '../../types/site';
import { dbLoadSiteData } from '../../lib/db';
import { getDisplayName } from '../../lib/displayName';
import type { MutableRefObject } from 'react';

type Deps = {
  user: User | null;
  persist: (key: string, data: unknown) => Promise<string | null>;
};

export function useAuthSuggestions({ user, persist }: Deps) {
  const [suggestions, setSuggestions] = useState<SuggestionTopic[]>([]);
  const [suggestionsLoaded, setSuggestionsLoaded] = useState(false);
  const loadRef = useRef<Promise<void> | null>(null);
  const ref = useRef(suggestions);
  ref.current = suggestions;

  const ensureSuggestionsLoaded = useCallback(async () => {
    if (suggestionsLoaded) return;
    if (!loadRef.current) {
      loadRef.current = (async () => {
        const data = await dbLoadSiteData<SuggestionTopic[]>('suggestions', []);
        setSuggestions(Array.isArray(data) ? data : []);
        setSuggestionsLoaded(true);
      })();
    }
    await loadRef.current;
  }, [suggestionsLoaded]);

  const saveAll = useCallback(async (next: SuggestionTopic[]) => {
    setSuggestions(next);
    return persist('suggestions', next);
  }, [persist]);

  const createSuggestion = useCallback(async (title: string, body: string) => {
    if (!user) return 'Войдите в аккаунт';
    if (!title.trim() || !body.trim()) return 'Заполните заголовок и текст';
    const topic: SuggestionTopic = {
      id: 'sg' + Date.now(),
      userId: user.id,
      userName: getDisplayName(user),
      title: title.trim(),
      body: body.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
      replies: [],
    };
    const next = [topic, ...ref.current];
    return saveAll(next);
  }, [user, saveAll]);

  const replyToSuggestion = useCallback(async (topicId: string, message: string) => {
    if (!user) return 'Войдите в аккаунт';
    if (!message.trim()) return 'Введите сообщение';
    let updated: SuggestionTopic | null = null;
    const next = ref.current.map(t => {
      if (t.id !== topicId) return t;
      updated = {
        ...t,
        replies: [
          ...t.replies,
          {
            id: 'sgr' + Date.now(),
            userId: user.id,
            userName: getDisplayName(user),
            message: message.trim(),
            createdAt: new Date().toISOString(),
          },
        ],
      };
      return updated;
    });
    if (!updated) return 'Тема не найдена';
    return saveAll(next);
  }, [user, saveAll]);

  const closeSuggestion = useCallback(async (topicId: string) => {
    const next = ref.current.map(t => t.id === topicId ? { ...t, status: 'closed' as const } : t);
    return saveAll(next);
  }, [saveAll]);

  const deleteSuggestion = useCallback(async (topicId: string) => {
    return saveAll(ref.current.filter(t => t.id !== topicId));
  }, [saveAll]);

  return {
    suggestions,
    suggestionsLoaded,
    ensureSuggestionsLoaded,
    createSuggestion,
    replyToSuggestion,
    closeSuggestion,
    deleteSuggestion,
  };
}

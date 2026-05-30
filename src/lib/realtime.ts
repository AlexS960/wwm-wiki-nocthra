import { getSupabase } from './supabase';

export function parseSiteDataValue(raw: unknown): unknown {
  if (raw === null || raw === undefined) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw;
}

export type SiteDataChangeHandler = (key: string, value: unknown) => void;

/** Подписка на изменения таблицы site_data (настройки и т.д.) */
export function subscribeSiteData(onChange: SiteDataChangeHandler): () => void {
  const channel = getSupabase()
    .channel('site_data-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_data' },
      (payload) => {
        const row = (payload.new ?? payload.old) as { key?: string; data?: unknown } | undefined;
        if (!row?.key || row.data === undefined) return;
        onChange(row.key, parseSiteDataValue(row.data));
      },
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}

/** Подписка на изменения аккаунтов */
export function subscribeAccounts(onChange: () => void): () => void {
  const channel = getSupabase()
    .channel('accounts-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'accounts' },
      () => onChange(),
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}

/** Подписка на прогресс конкретного пользователя */
export function subscribeUserProgress(
  userId: string,
  onChange: (data: unknown) => void,
): () => void {
  const channel = getSupabase()
    .channel(`user_progress-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'user_progress',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        const row = payload.new as { data?: unknown } | undefined;
        if (!row?.data) return;
        onChange(parseSiteDataValue(row.data));
      },
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}

// ====== НОВЫЕ ПОДПИСКИ НА НОРМАЛИЗОВАННЫЕ ТАБЛИЦЫ ======

/** Подписка на изменения гайдов */
export function subscribeGuides(onChange: (guide: unknown) => void): () => void {
  const channel = getSupabase()
    .channel('guides-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'guides' },
      (payload) => onChange(payload.new),
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}

/** Подписка на изменения комментариев к гайдам */
export function subscribeGuideComments(onChange: (comment: unknown) => void): () => void {
  const channel = getSupabase()
    .channel('guide_comments-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'guide_comments' },
      (payload) => onChange(payload.new),
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}

/** Подписка на изменения чата */
export function subscribeChatMessages(onChange: (message: unknown) => void): () => void {
  const channel = getSupabase()
    .channel('chat_messages-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'chat_messages' },
      (payload) => onChange(payload.new),
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}

/** Подписка на изменения вики */
export function subscribeWikiArticles(onChange: (article: unknown) => void): () => void {
  const channel = getSupabase()
    .channel('wiki_articles-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'wiki_articles' },
      (payload) => onChange(payload.new),
    )
    .subscribe();

  return () => {
    getSupabase().removeChannel(channel);
  };
}

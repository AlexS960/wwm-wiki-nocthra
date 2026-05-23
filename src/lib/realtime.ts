import { supabase } from './supabase';

export function parseSiteDataValue(raw: unknown): unknown {
  if (raw === null || raw === undefined) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw;
}

export type SiteDataChangeHandler = (key: string, value: unknown) => void;

/** Подписка на изменения таблицы site_data (чат, вики, настройки и т.д.) */
export function subscribeSiteData(onChange: SiteDataChangeHandler): () => void {
  const channel = supabase
    .channel('site_data-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'site_data' },
      (payload) => {
        const row = (payload.new ?? payload.old) as { key?: string; data?: unknown } | undefined;
        if (!row?.key || row.data === undefined) return;
        onChange(row.key, parseSiteDataValue(row.data));
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Подписка на изменения аккаунтов */
export function subscribeAccounts(onChange: () => void): () => void {
  const channel = supabase
    .channel('accounts-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'accounts' },
      () => onChange()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Подписка на прогресс конкретного пользователя */
export function subscribeUserProgress(
  userId: string,
  onChange: (data: unknown) => void
): () => void {
  const channel = supabase
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
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

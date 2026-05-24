import { pb } from './pocketbase';

export function parseSiteDataValue(raw: unknown): unknown {
  if (raw === null || raw === undefined) return raw;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  return raw;
}

export type SiteDataChangeHandler = (key: string, value: unknown) => void;

type Unsubscribe = () => void;

async function subscribeCollection(
  collection: string,
  callback: (record: Record<string, unknown> | undefined, action: string) => void,
): Promise<Unsubscribe> {
  const unsub = await pb.collection(collection).subscribe('*', (e) => {
    callback(e.record as Record<string, unknown> | undefined, e.action);
  });
  return () => { void unsub(); };
}

/** Подписка на изменения коллекции site_data (чат, вики, настройки и т.д.) */
export function subscribeSiteData(onChange: SiteDataChangeHandler): () => void {
  let active = true;
  let unsubscribe: Unsubscribe | null = null;

  void subscribeCollection('site_data', (record) => {
    if (!active || !record?.key || record.data === undefined) return;
    onChange(String(record.key), parseSiteDataValue(record.data));
  }).then(fn => {
    if (!active) fn();
    else unsubscribe = fn;
  });

  return () => {
    active = false;
    unsubscribe?.();
  };
}

/** Подписка на изменения аккаунтов */
export function subscribeAccounts(onChange: () => void): () => void {
  let active = true;
  let unsubscribe: Unsubscribe | null = null;

  void subscribeCollection('accounts', () => {
    if (active) onChange();
  }).then(fn => {
    if (!active) fn();
    else unsubscribe = fn;
  });

  return () => {
    active = false;
    unsubscribe?.();
  };
}

/** Подписка на прогресс конкретного пользователя */
export function subscribeUserProgress(
  userId: string,
  onChange: (data: unknown) => void,
): () => void {
  let active = true;
  let unsubscribe: Unsubscribe | null = null;

  void subscribeCollection('user_progress', (record) => {
    if (!active || !record || String(record.user_id) !== userId || record.data === undefined) return;
    onChange(parseSiteDataValue(record.data));
  }).then(fn => {
    if (!active) fn();
    else unsubscribe = fn;
  });

  return () => {
    active = false;
    unsubscribe?.();
  };
}

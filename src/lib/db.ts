import { pb, escapeFilterValue } from './pocketbase';
import { hashPassword } from './password';
import { checkSiteDataSize } from './siteDataLimits';

export interface DbAccount {
  id: string;
  username: string;
  role: string;
  picture?: string;
  game_nickname?: string;
  password_hash: string;
  created_at: string;
  last_seen?: string | null;
}

function parseDbJson<T>(raw: unknown, fallback?: T): T {
  if (raw === null || raw === undefined) return fallback as T;
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as T; } catch { return raw as T; }
  }
  return raw as T;
}

function mapAccount(record: Record<string, unknown>): DbAccount {
  return {
    id: String(record.id),
    username: String(record.username ?? ''),
    role: String(record.role ?? 'user'),
    picture: record.picture ? String(record.picture) : '',
    game_nickname: record.game_nickname ? String(record.game_nickname) : '',
    password_hash: String(record.password_hash ?? ''),
    created_at: String(record.created_at ?? ''),
    last_seen: record.last_seen ? String(record.last_seen) : null,
  };
}

// ====== accounts ======
export async function dbInit() {
  await pb.collection('accounts').getList(1, 1);
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  const records = await pb.collection('accounts').getFullList({ sort: '-created_at' });
  return records.map(r => mapAccount(r as Record<string, unknown>));
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const q = escapeFilterValue(username.trim());
  try {
    const record = await pb.collection('accounts').getFirstListItem(`username ~ "${q}"`);
    return mapAccount(record as Record<string, unknown>);
  } catch {
    return null;
  }
}

/** PocketBase: id — 15 символов [a-z0-9] */
function newAccountId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 15);
}

export async function dbCreateAccount(username: string, password: string, gameNickname: string): Promise<DbAccount | { error: string }> {
  const password_hash = await hashPassword(password);
  const account: DbAccount = {
    id: newAccountId(),
    username: username.trim(),
    password_hash,
    role: 'user',
    picture: '',
    game_nickname: gameNickname.trim(),
    created_at: new Date().toISOString(),
  };
  try {
    await pb.collection('accounts').create({
      id: account.id,
      username: account.username,
      password_hash: account.password_hash,
      role: account.role,
      picture: account.picture,
      game_nickname: account.game_nickname,
      created_at: account.created_at,
    });
    return account;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Не удалось создать аккаунт';
    return { error: message };
  }
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>) {
  await pb.collection('accounts').update(id, updates);
}

export async function dbDeleteAccount(id: string) {
  await pb.collection('accounts').delete(id);
}

// ====== site_data (key → data JSON) ======
export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<T> {
  try {
    const record = await pb.collection('site_data').getFirstListItem(`key="${escapeFilterValue(key)}"`);
    return parseDbJson<T>((record as { data?: unknown }).data, fallback);
  } catch {
    return fallback as T;
  }
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<{ error?: string }> {
  const sizeCheck = checkSiteDataSize(value);
  if (!sizeCheck.ok) return { error: sizeCheck.message };

  const payload = {
    key,
    data: value,
    updated_at: new Date().toISOString(),
  };

  try {
    const existing = await pb.collection('site_data').getFirstListItem(`key="${escapeFilterValue(key)}"`);
    await pb.collection('site_data').update(existing.id, payload);
  } catch {
    try {
      await pb.collection('site_data').create(payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка сохранения';
      console.error('[db] save', key, message);
      return { error: message };
    }
  }
  return {};
}

// ====== user_progress ======
export async function dbLoadProgress(userId: string): Promise<any> {
  try {
    const record = await pb.collection('user_progress').getFirstListItem(`user_id="${escapeFilterValue(userId)}"`);
    return parseDbJson((record as { data?: unknown }).data, null);
  } catch {
    return null;
  }
}

export async function dbSaveProgress(userId: string, data: unknown) {
  const payload = {
    user_id: userId,
    data,
    updated_at: new Date().toISOString(),
  };
  try {
    const existing = await pb.collection('user_progress').getFirstListItem(`user_id="${escapeFilterValue(userId)}"`);
    await pb.collection('user_progress').update(existing.id, payload);
  } catch {
    await pb.collection('user_progress').create(payload);
  }
}

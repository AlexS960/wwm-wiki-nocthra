import { supabase } from './supabase';
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

// ====== accounts ======
export async function dbInit() {
  await supabase.from('accounts').select('id').limit(1);
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  const { data } = await supabase.from('accounts').select('*').order('created_at', { ascending: false });
  return (data || []) as DbAccount[];
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const { data } = await supabase.from('accounts').select('*').ilike('username', username.trim()).maybeSingle();
  return data as DbAccount | null;
}

export async function dbCreateAccount(username: string, password: string, gameNickname: string): Promise<DbAccount | { error: string }> {
  const password_hash = await hashPassword(password);
  const account: DbAccount = {
    id: 'user_' + crypto.randomUUID().slice(0, 8),
    username: username.trim(),
    password_hash,
    role: 'user',
    picture: '',
    game_nickname: gameNickname.trim(),
    created_at: new Date().toISOString(),
  };
  const { error } = await supabase.from('accounts').insert(account);
  if (error) return { error: error.message };
  return account;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>) {
  await supabase.from('accounts').update(updates).eq('id', id);
}

export async function dbDeleteAccount(id: string) {
  await supabase.from('accounts').delete().eq('id', id);
}

// ====== site_data (key → data JSON) ======
export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<T> {
  const { data, error } = await supabase.from('site_data').select('data').eq('key', key).maybeSingle();
  if (error) {
    console.error('[db] load', key, error.message);
    return fallback as T;
  }
  if (!data) return fallback as T;
  return parseDbJson<T>(data.data, fallback);
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<{ error?: string }> {
  const sizeCheck = checkSiteDataSize(value);
  if (!sizeCheck.ok) return { error: sizeCheck.message };

  const { error } = await supabase.from('site_data').upsert(
    { key, data: value, updated_at: new Date().toISOString() },
    { onConflict: 'key' },
  );
  if (error) {
    console.error('[db] save', key, error.message);
    return { error: error.message };
  }
  return {};
}

// ====== user_progress ======
export async function dbLoadProgress(userId: string): Promise<any> {
  const { data, error } = await supabase.from('user_progress').select('data').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return parseDbJson(data.data, null);
}

export async function dbSaveProgress(userId: string, data: unknown) {
  await supabase.from('user_progress').upsert(
    { user_id: userId, data, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  );
}

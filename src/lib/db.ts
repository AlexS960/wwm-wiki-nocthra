import { supabase } from './supabase';

export interface DbAccount {
  id: string;
  username: string;
  role: string;
  picture?: string;
  game_nickname?: string;
  password_hash: string;
  created_at: string;
}

// ============ accounts ============

export async function dbInit(): Promise<void> {
  // Just verify connection works
  const { error } = await supabase.from('accounts').select('id').limit(1);
  if (error) console.warn('Supabase init check:', error.message);
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  const { data } = await supabase.from('accounts').select('*');
  return (data as DbAccount[]) || [];
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const { data } = await supabase.from('accounts').select('*').eq('username', username.toLowerCase()).maybeSingle();
  return (data as DbAccount) || null;
}

export async function dbCreateAccount(username: string, password: string, gameNickname: string): Promise<DbAccount | { error: string }> {
  const existing = await dbGetAccountByUsername(username);
  if (existing) return { error: 'Пользователь уже существует' };

  const account: DbAccount = {
    id: 'user_' + crypto.randomUUID().slice(0, 8),
    username: username.trim(),
    password_hash: password,
    role: 'user',
    picture: '',
    game_nickname: gameNickname.trim(),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('accounts').insert(account);
  if (error) return { error: 'Ошибка создания: ' + error.message };
  return account;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<void> {
  await supabase.from('accounts').update(updates).eq('id', id);
}

export async function dbDeleteAccount(id: string): Promise<void> {
  await supabase.from('accounts').delete().eq('id', id);
}

// ============ site_data (key-value) ============

export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<T> {
  const { data, error } = await supabase.from('site_data').select('value').eq('key', key).maybeSingle();
  if (error) { console.warn('dbLoadSiteData error:', error.message); return fallback as T; }
  if (data) {
    try { return JSON.parse(data.value) as T; } catch { return data.value as unknown as T; }
  }
  return fallback as T;
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<void> {
  const s = JSON.stringify(value);
  const { error } = await supabase.from('site_data').upsert(
    { key, value: s, updated_at: new Date().toISOString() },
    { onConflict: 'key' }
  );
  if (error) console.warn('dbSaveSiteData error:', error.message);
}

// ============ user_progress ============

export async function dbLoadProgress(userId: string): Promise<Record<string, unknown> | null> {
  const { data } = await supabase.from('user_progress').select('data').eq('user_id', userId).maybeSingle();
  if (data && data.data) {
    try { return JSON.parse(data.data); } catch { return data.data; }
  }
  return null;
}

export async function dbSaveProgress(userId: string, progress: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from('user_progress').upsert(
    { user_id: userId, data: JSON.stringify(progress), updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
  if (error) console.warn('dbSaveProgress error:', error.message);
}

// ============ online (stored in site_data) ============

export async function dbSetOnline(userId: string): Promise<void> {
  dbSaveSiteData('online_' + userId, Date.now());
}

export async function dbGetOnlineStatuses(): Promise<Record<string, number>> {
  const { data } = await supabase.from('site_data').select('key,value').like('key', 'online_%');
  const result: Record<string, number> = {};
  if (data) {
    for (const row of data) {
      result[(row.key as string).replace('online_', '')] = parseInt(row.value as string, 10);
    }
  }
  return result;
}

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
  await supabase.from('accounts').select('id').limit(1);
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  const { data } = await supabase.from('accounts').select('*');
  return (data as DbAccount[]) || [];
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const { data } = await supabase
    .from('accounts')
    .select('*')
    .ilike('username', username)
    .maybeSingle();
  return (data as DbAccount) || null;
}

export async function dbCreateAccount(username: string, password: string, gameNickname: string): Promise<DbAccount | { error: string }> {
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
  if (error) return { error: error.message };
  return account;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<void> {
  await supabase.from('accounts').update(updates).eq('id', id);
}

export async function dbDeleteAccount(id: string): Promise<void> {
  await supabase.from('accounts').delete().eq('id', id);
}

// ============ site_data ============
// Используем эту таблицу как хранилище JSON-объектов по ключу (chat, guides, etc.)
export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<{data: T, ts: number}> {
  const { data } = await supabase.from('site_data').select('value, updated_at').eq('key', key).maybeSingle();
  if (data) {
    try { 
      return { 
        data: JSON.parse(data.value) as T, 
        ts: new Date(data.updated_at).getTime() 
      };
    } catch { 
      return { data: data.value as unknown as T, ts: new Date(data.updated_at).getTime() };
    }
  }
  return { data: fallback as T, ts: 0 };
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<number> {
  const now = new Date().toISOString();
  const s = JSON.stringify(value);
  await supabase.from('site_data').upsert(
    { key, value: s, updated_at: now },
    { onConflict: 'key' }
  );
  return new Date(now).getTime();
}

// ============ user_progress ============
export async function dbLoadProgress(userId: string): Promise<Record<string, unknown> | null> {
  const { data } = await supabase.from('user_progress').select('data').eq('user_id', userId).maybeSingle();
  if (data?.data) {
    try { return JSON.parse(data.data); } catch { return data.data; }
  }
  return null;
}

export async function dbSaveProgress(userId: string, progress: Record<string, unknown>): Promise<void> {
  await supabase.from('user_progress').upsert(
    { user_id: userId, data: JSON.stringify(progress), updated_at: new Date().toISOString() },
    { onConflict: 'user_id' }
  );
}

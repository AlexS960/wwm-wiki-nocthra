import { supabase } from './supabase';

export interface DbAccount {
  id: string; username: string; role: string; picture?: string;
  game_nickname?: string; password_hash: string; created_at: string;
}

// ====== accounts ======
export async function dbListAccounts(): Promise<DbAccount[]> {
  const { data } = await supabase.from('accounts').select('*').order('created_at');
  return (data || []) as DbAccount[];
}

export async function dbGetAccount(username: string): Promise<DbAccount | null> {
  const { data } = await supabase.from('accounts').select('*').ilike('username', username).maybeSingle();
  return data as DbAccount | null;
}

export async function dbCreateAccount(username: string, pw: string, nick: string): Promise<DbAccount> {
  const row = { id: 'u' + crypto.randomUUID().slice(0, 8), username: username.trim(), password_hash: pw, role: 'user', game_nickname: nick.trim(), created_at: new Date().toISOString() };
  const { data, error } = await supabase.from('accounts').insert(row).select().single();
  if (error) throw new Error(error.message);
  return data as DbAccount;
}

export async function dbUpdateAccount(id: string, u: Partial<DbAccount>) {
  await supabase.from('accounts').update(u).eq('id', id);
}

export async function dbDeleteAccount(id: string) {
  await supabase.from('accounts').delete().eq('id', id);
}

// ====== site_data (key → JSON value) ======
export async function dbLoad<T>(key: string, fallback: T): Promise<T> {
  const { data } = await supabase.from('site_data').select('value').eq('key', key).maybeSingle();
  if (data?.value) { try { return JSON.parse(data.value) as T; } catch {} }
  return fallback;
}

export async function dbSave(key: string, value: unknown): Promise<void> {
  await supabase.from('site_data').upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() }, { onConflict: 'key' });
}

// ====== user_progress ======
export async function dbLoadProgress(uid: string): Promise<any> {
  const { data } = await supabase.from('user_progress').select('data').eq('user_id', uid).maybeSingle();
  if (data?.data) { try { return JSON.parse(data.data); } catch {} }
  return null;
}

export async function dbSaveProgress(uid: string, d: any) {
  await supabase.from('user_progress').upsert({ user_id: uid, data: JSON.stringify(d), updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
}

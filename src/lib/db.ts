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

const ACCOUNTS_KEY = 'wwm_db_accounts';

function cacheAccounts(acc: DbAccount[]) { try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(acc)); } catch {} }
function getCached(): DbAccount[] { try { const r = localStorage.getItem(ACCOUNTS_KEY); return r ? JSON.parse(r) : []; } catch { return []; } }

export async function dbInit(): Promise<void> {
  const { data, error } = await supabase.from('accounts').select('*');
  if (error || !data || data.length === 0) {
    const cached = getCached();
    if (!cached.find(a => a.username === 'admin')) {
      cached.push({ id: 'admin_root', username: 'admin', password_hash: 'admin', role: 'admin', picture: '', game_nickname: '', created_at: new Date().toLocaleDateString('ru-RU') });
      cacheAccounts(cached);
    }
    return;
  }
  cacheAccounts(data as DbAccount[]);
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  const { data } = await supabase.from('accounts').select('*');
  if (data && data.length > 0) { cacheAccounts(data as DbAccount[]); return data as DbAccount[]; }
  return getCached();
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const { data } = await supabase.from('accounts').select('*').eq('username', username.toLowerCase()).maybeSingle();
  if (data) return data as DbAccount;
  return getCached().find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function dbCreateAccount(username: string, password: string, gameNickname: string): Promise<DbAccount | { error: string }> {
  const existing = await dbGetAccountByUsername(username);
  if (existing) return { error: 'Пользователь уже существует' };
  const account: DbAccount = { id: 'user_' + crypto.randomUUID().slice(0, 8), username: username.trim(), password_hash: password, role: 'user', picture: '', game_nickname: gameNickname.trim(), created_at: new Date().toISOString() };
  const { error } = await supabase.from('accounts').insert(account);
  if (error) { const c = getCached(); c.push(account); cacheAccounts(c); return account; }
  const c = getCached(); if (!c.find(a => a.id === account.id)) c.push(account); cacheAccounts(c);
  return account;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<void> {
  await supabase.from('accounts').update(updates).eq('id', id);
  const c = getCached(); const idx = c.findIndex(a => a.id === id);
  if (idx >= 0) { c[idx] = { ...c[idx], ...updates }; cacheAccounts(c); }
}

export async function dbDeleteAccount(id: string): Promise<void> {
  await supabase.from('accounts').delete().eq('id', id);
  cacheAccounts(getCached().filter(a => a.id !== id));
}

// ====== Shared State — Supabase ONLY (no localStorage fallback for writes) ======

export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<T> {
  const { data } = await supabase.from('shared_state').select('value').eq('key', key).maybeSingle();
  if (data) { try { return JSON.parse(data.value) as T; } catch { return data.value as unknown as T; } }
  return fallback as T;
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<void> {
  const s = JSON.stringify(value);
  const { error } = await supabase.from('shared_state').upsert({ key, value: s, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) console.warn('dbSaveSiteData upsert error:', error.message);
}

export async function dbLoadProgress(userId: string): Promise<Record<string, unknown> | null> {
  const { data } = await supabase.from('shared_state').select('value').eq('key', 'progress_' + userId).maybeSingle();
  if (data) { try { return JSON.parse(data.value); } catch {} }
  return null;
}

export async function dbSaveProgress(userId: string, progress: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from('shared_state').upsert({ key: 'progress_' + userId, value: JSON.stringify(progress), updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) console.warn('dbSaveProgress upsert error:', error.message);
}

export async function dbSetOnline(userId: string): Promise<void> {
  const { error } = await supabase.from('shared_state').upsert({ key: 'online_' + userId, value: String(Date.now()), updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) console.warn('dbSetOnline upsert error:', error.message);
}

export async function dbGetOnlineStatuses(): Promise<Record<string, number>> {
  const { data } = await supabase.from('shared_state').select('key,value').like('key', 'online_%');
  const result: Record<string, number> = {};
  if (data) { for (const row of data) { result[(row.key as string).replace('online_', '')] = parseInt(row.value as string, 10); } return result; }
  return {};
}

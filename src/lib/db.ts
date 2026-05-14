import { supabase } from './supabase';

// ====== Database adapter ======
// All shared data goes to Supabase. Falls back to localStorage if offline.

export interface DbAccount {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  game_nickname: string;
  picture: string;
  created_at: string;
}

let online: boolean | null = null;

async function isOnline(): Promise<boolean> {
  if (online !== null) return online;
  try {
    const { error } = await supabase.from('accounts').select('id').limit(1);
    online = !error;
  } catch {
    online = false;
  }
  return online;
}

// ====== GENERIC SITE DATA (shared for all users) ======

export async function dbLoadSiteData<T>(key: string, fallback: T): Promise<T> {
  if (await isOnline()) {
    const { data } = await supabase.from('site_data').select('data').eq('key', key).single();
    if (data?.data !== null && data?.data !== undefined) return data.data as T;
  }
  // Fallback localStorage
  try {
    const saved = localStorage.getItem(`wwm_${key}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<void> {
  // Always save to localStorage as cache
  try {
    localStorage.setItem(`wwm_${key}`, JSON.stringify(value));
    sessionStorage.setItem(`wwm_${key}`, JSON.stringify(value));
  } catch {}

  if (await isOnline()) {
    await supabase.from('site_data').upsert({
      key,
      data: value,
      updated_at: new Date().toISOString(),
    });
  }
}

// ====== ACCOUNTS ======

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  if (await isOnline()) {
    const { data } = await supabase.from('accounts').select('*').ilike('username', username).single();
    return data || null;
  }
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  return accounts.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function dbCreateAccount(username: string, password: string): Promise<DbAccount | { error: string }> {
  if (await isOnline()) {
    const { data, error } = await supabase
      .from('accounts')
      .insert({ username, password_hash: password, role: 'user', game_nickname: '', picture: '' })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') return { error: 'Этот логин уже занят' };
      return { error: error.message };
    }
    return data;
  }
  // Fallback
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  if (accounts.find(a => a.username.toLowerCase() === username.toLowerCase())) {
    return { error: 'Этот логин уже занят' };
  }
  const acc: DbAccount = {
    id: 'user_' + Date.now(), username, password_hash: password,
    role: 'user', game_nickname: '', picture: '', created_at: new Date().toISOString(),
  };
  accounts.push(acc);
  localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
  return acc;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<void> {
  if (await isOnline()) {
    await supabase.from('accounts').update(updates).eq('id', id);
    return;
  }
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  const idx = accounts.findIndex(a => a.id === id);
  if (idx >= 0) {
    accounts[idx] = { ...accounts[idx], ...updates };
    localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
  }
}

// ====== PROGRESS ======

export async function dbLoadProgress(userId: string): Promise<Record<string, unknown> | null> {
  if (await isOnline()) {
    const { data } = await supabase.from('user_progress').select('data').eq('user_id', userId).single();
    return data?.data || null;
  }
  const saved = localStorage.getItem(`wwm_progress_${userId}`);
  return saved ? JSON.parse(saved) : null;
}

export async function dbSaveProgress(userId: string, progress: Record<string, unknown>): Promise<void> {
  localStorage.setItem(`wwm_progress_${userId}`, JSON.stringify(progress));
  if (await isOnline()) {
    await supabase.from('user_progress').upsert({
      user_id: userId, data: progress, updated_at: new Date().toISOString(),
    });
  }
}

// ====== INIT ======

export async function dbInit(): Promise<void> {
  const ok = await isOnline();
  if (ok) {
    const { data } = await supabase.from('accounts').select('id').eq('username', 'admin').single();
    if (!data) {
      await supabase.from('accounts').insert({
        username: 'admin', password_hash: 'admin', role: 'admin', game_nickname: '', picture: '',
      });
    }
    console.log('[DB] Supabase connected ✓');
  } else {
    const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
    if (!accounts.find(a => a.username === 'admin')) {
      accounts.push({
        id: 'admin_root', username: 'admin', password_hash: 'admin',
        role: 'admin', game_nickname: '', picture: '', created_at: new Date().toISOString(),
      });
      localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
    }
    console.log('[DB] Offline mode, using localStorage');
  }
}

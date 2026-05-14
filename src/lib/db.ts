import { supabase } from './supabase';

// ====== Database adapter ======
// Tries Supabase first, falls back to localStorage if unavailable.

export interface DbAccount {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  game_nickname: string;
  picture: string;
  created_at: string;
}

export interface DbProgress {
  user_id: string;
  data: Record<string, unknown>;
  updated_at: string;
}

let supabaseAvailable: boolean | null = null;

async function checkSupabase(): Promise<boolean> {
  if (supabaseAvailable !== null) return supabaseAvailable;
  try {
    const { error } = await supabase.from('accounts').select('id').limit(1);
    supabaseAvailable = !error;
  } catch {
    supabaseAvailable = false;
  }
  return supabaseAvailable;
}

// ====== ACCOUNTS ======

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  if (await checkSupabase()) {
    const { data } = await supabase
      .from('accounts')
      .select('*')
      .ilike('username', username)
      .single();
    return data || null;
  }
  // Fallback localStorage
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  return accounts.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function dbCreateAccount(username: string, password: string): Promise<DbAccount | { error: string }> {
  if (await checkSupabase()) {
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        username,
        password_hash: password,
        role: 'user',
        game_nickname: '',
        picture: '',
      })
      .select()
      .single();
    if (error) {
      if (error.code === '23505') return { error: 'Этот логин уже занят' };
      return { error: error.message };
    }
    return data;
  }
  // Fallback localStorage
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  if (accounts.find(a => a.username.toLowerCase() === username.toLowerCase())) {
    return { error: 'Этот логин уже занят' };
  }
  const newAcc: DbAccount = {
    id: 'user_' + Date.now(),
    username,
    password_hash: password,
    role: 'user',
    game_nickname: '',
    picture: '',
    created_at: new Date().toISOString(),
  };
  accounts.push(newAcc);
  localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
  try { sessionStorage.setItem('wwm_accounts', JSON.stringify(accounts)); } catch {}
  try { localStorage.setItem('wwm_accounts_backup', JSON.stringify(accounts)); } catch {}
  return newAcc;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<void> {
  if (await checkSupabase()) {
    await supabase.from('accounts').update(updates).eq('id', id);
    return;
  }
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  const idx = accounts.findIndex(a => a.id === id);
  if (idx >= 0) {
    accounts[idx] = { ...accounts[idx], ...updates };
    localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
    try { sessionStorage.setItem('wwm_accounts', JSON.stringify(accounts)); } catch {}
  }
}

// ====== PROGRESS ======

export async function dbLoadProgress(userId: string): Promise<Record<string, unknown> | null> {
  if (await checkSupabase()) {
    const { data } = await supabase
      .from('user_progress')
      .select('data')
      .eq('user_id', userId)
      .single();
    return data?.data || null;
  }
  // Fallback
  const saved = localStorage.getItem(`wwm_progress_${userId}`);
  return saved ? JSON.parse(saved) : null;
}

export async function dbSaveProgress(userId: string, progress: Record<string, unknown>): Promise<void> {
  if (await checkSupabase()) {
    await supabase
      .from('user_progress')
      .upsert({ user_id: userId, data: progress, updated_at: new Date().toISOString() });
    return;
  }
  localStorage.setItem(`wwm_progress_${userId}`, JSON.stringify(progress));
}

// ====== INIT ======

export async function dbInit(): Promise<void> {
  const isOnline = await checkSupabase();
  if (isOnline) {
    // Ensure admin account exists on server
    const { data } = await supabase
      .from('accounts')
      .select('id')
      .eq('username', 'admin')
      .single();
    if (!data) {
      await supabase.from('accounts').insert({
        username: 'admin',
        password_hash: 'admin',
        role: 'admin',
        game_nickname: '',
        picture: '',
      });
    }
    console.log('[DB] Connected to Supabase ✓');
  } else {
    // Fallback: seed localStorage
    const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
    if (!accounts.find(a => a.username === 'admin')) {
      accounts.push({
        id: 'admin_root',
        username: 'admin',
        password_hash: 'admin',
        role: 'admin',
        game_nickname: '',
        picture: '',
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
    }
    console.log('[DB] Supabase unavailable, using localStorage fallback');
  }
}

export function isUsingSupabase(): boolean {
  return supabaseAvailable === true;
}

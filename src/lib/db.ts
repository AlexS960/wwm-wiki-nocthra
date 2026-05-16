import { supabase } from './supabase';

export interface DbAccount {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  game_nickname: string;
  picture: string;
  created_at: string;
}

let _online: boolean | null = null;

async function checkOnline(): Promise<boolean> {
  try {
    const { error } = await supabase.from('site_data').select('key').limit(1);
    _online = !error;
    if (error) console.warn('[DB] Supabase check failed:', error.message);
  } catch (e) {
    _online = false;
    console.warn('[DB] Supabase unreachable:', e);
  }
  return _online;
}

async function isOnline(): Promise<boolean> {
  if (_online === null) return checkOnline();
  return _online;
}

// ====== SITE DATA (shared) ======

export async function dbLoadSiteData<T>(key: string, fallback: T): Promise<T> {
  try {
    if (await isOnline()) {
      const { data, error } = await supabase
        .from('site_data')
        .select('data')
        .eq('key', key)
        .single();
      if (!error && data && data.data !== null && data.data !== undefined) {
        return data.data as T;
      }
    }
  } catch (e) {
    console.warn(`[DB] Load ${key} failed:`, e);
  }
  try {
    const saved = localStorage.getItem(`wwm_${key}`);
    if (saved) return JSON.parse(saved);
  } catch {}
  return fallback;
}

export async function dbSaveSiteData(key: string, value: unknown): Promise<void> {
  // Always cache locally
  try {
    const s = JSON.stringify(value);
    localStorage.setItem(`wwm_${key}`, s);
    sessionStorage.setItem(`wwm_${key}`, s);
  } catch {}

  try {
    if (await isOnline()) {
      // Try update first
      const { error: updateErr } = await supabase
        .from('site_data')
        .update({ data: value, updated_at: new Date().toISOString() })
        .eq('key', key);

      if (updateErr) {
        // If update fails (row doesn't exist), try insert
        const { error: insertErr } = await supabase
          .from('site_data')
          .insert({ key, data: value, updated_at: new Date().toISOString() });

        if (insertErr) {
          console.error(`[DB] Save ${key} failed:`, insertErr.message);
        }
      }
    }
  } catch (e) {
    console.warn(`[DB] Save ${key} error:`, e);
  }
}

// ====== ACCOUNTS ======

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  try {
    if (await isOnline()) {
      const { data } = await supabase
        .from('accounts')
        .select('*')
        .ilike('username', username)
        .single();
      return data || null;
    }
  } catch {}
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  return accounts.find(a => a.username.toLowerCase() === username.toLowerCase()) || null;
}

export async function dbCreateAccount(username: string, password: string, gameNickname = ''): Promise<DbAccount | { error: string }> {
  try {
    if (await isOnline()) {
      const { data, error } = await supabase
        .from('accounts')
        .insert({ username, password_hash: password, role: 'user', game_nickname: gameNickname, picture: '' })
        .select()
        .single();
      if (error) {
        if (error.code === '23505') return { error: 'Этот логин уже занят' };
        return { error: error.message };
      }
      return data;
    }
  } catch {}
  // Fallback
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  if (accounts.find(a => a.username.toLowerCase() === username.toLowerCase())) {
    return { error: 'Этот логин уже занят' };
  }
  const acc: DbAccount = {
    id: 'user_' + Date.now(), username, password_hash: password,
    role: 'user', game_nickname: gameNickname, picture: '', created_at: new Date().toISOString(),
  };
  accounts.push(acc);
  localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
  return acc;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<void> {
  try {
    if (await isOnline()) {
      await supabase.from('accounts').update(updates).eq('id', id);
      return;
    }
  } catch {}
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  const idx = accounts.findIndex(a => a.id === id);
  if (idx >= 0) {
    accounts[idx] = { ...accounts[idx], ...updates };
    localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
  }
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  try {
    if (await isOnline()) {
      const { data, error } = await supabase
        .from('accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
    }
  } catch (e) {
    console.warn('[DB] List accounts failed:', e);
  }
  return JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
}

export async function dbDeleteAccount(id: string): Promise<void> {
  try {
    if (await isOnline()) {
      await supabase.from('accounts').delete().eq('id', id);
      return;
    }
  } catch (e) {
    console.warn('[DB] Delete account failed:', e);
  }
  const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
  localStorage.setItem('wwm_accounts', JSON.stringify(accounts.filter(a => a.id !== id)));
}

// ====== PROGRESS ======

export async function dbLoadProgress(userId: string): Promise<Record<string, unknown> | null> {
  try {
    if (await isOnline()) {
      const { data } = await supabase
        .from('user_progress')
        .select('data')
        .eq('user_id', userId)
        .single();
      return data?.data || null;
    }
  } catch {}
  const saved = localStorage.getItem(`wwm_progress_${userId}`);
  return saved ? JSON.parse(saved) : null;
}

export async function dbSaveProgress(userId: string, progress: Record<string, unknown>): Promise<void> {
  localStorage.setItem(`wwm_progress_${userId}`, JSON.stringify(progress));
  try {
    if (await isOnline()) {
      // Try update first
      const { error: updateErr } = await supabase
        .from('user_progress')
        .update({ data: progress, updated_at: new Date().toISOString() })
        .eq('user_id', userId);

      if (updateErr) {
        // Insert if doesn't exist
        await supabase
          .from('user_progress')
          .insert({ user_id: userId, data: progress, updated_at: new Date().toISOString() });
      }
    }
  } catch {}
}

// ====== INIT ======

export async function dbInit(): Promise<void> {
  const ok = await checkOnline();
  if (ok) {
    try {
      const { data } = await supabase.from('accounts').select('id').eq('username', 'admin').single();
      if (!data) {
        await supabase.from('accounts').insert({
          username: 'admin', password_hash: 'admin', role: 'admin', game_nickname: '', picture: '',
        });
      }
    } catch {}
    console.log('[DB] ✅ Supabase connected');
  } else {
    const accounts: DbAccount[] = JSON.parse(localStorage.getItem('wwm_accounts') || '[]');
    if (!accounts.find(a => a.username === 'admin')) {
      accounts.push({
        id: 'admin_root', username: 'admin', password_hash: 'admin',
        role: 'admin', game_nickname: '', picture: '', created_at: new Date().toISOString(),
      });
      localStorage.setItem('wwm_accounts', JSON.stringify(accounts));
    }
    console.log('[DB] ⚠️ Offline mode — localStorage');
  }
}

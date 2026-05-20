import { supabase } from './supabase';

export interface DbAccount {
  id: string; username: string; role: string; picture?: string;
  game_nickname?: string; password_hash: string; created_at: string;
}

// Селекторы для часто используемых таблиц
const TABLE = {
  ACCOUNTS: 'accounts',
  SITE_DATA: 'site_data',
  PROGRESS: 'user_progress'
} as const;

export async function dbInit() {
  return supabase.from(TABLE.ACCOUNTS).select('id', { count: 'estimated', head: true });
}

// ====== Accounts ======
export const accounts = {
  async list(): Promise<DbAccount[]> {
    const { data } = await supabase.from(TABLE.ACCOUNTS).select('*').order('created_at', { ascending: false });
    return data || [];
  },
  async get(username: string): Promise<DbAccount | null> {
    const { data } = await supabase.from(TABLE.ACCOUNTS).select('*').ilike('username', username).maybeSingle();
    return data;
  },
  async create(username: string, password_hash: string, game_nickname: string) {
    const { data, error } = await supabase.from(TABLE.ACCOUNTS).insert({
      id: `user_${crypto.randomUUID().slice(0, 8)}`,
      username: username.trim(),
      password_hash,
      role: 'user',
      game_nickname: game_nickname.trim(),
      created_at: new Date().toISOString()
    }).select().single();
    if (error) throw error;
    return data;
  },
  async update(id: string, updates: Partial<DbAccount>) {
    return supabase.from(TABLE.ACCOUNTS).update(updates).eq('id', id);
  },
  async remove(id: string) {
    return supabase.from(TABLE.ACCOUNTS).delete().eq('id', id);
  }
};

// ====== Site Data (Key-Value) ======
export const siteData = {
  async load<T>(key: string, fallback: T): Promise<{data: T, ts: number}> {
    const { data } = await supabase.from(TABLE.SITE_DATA).select('value, updated_at').eq('key', key).maybeSingle();
    if (!data) return { data: fallback, ts: 0 };
    return { data: JSON.parse(data.value), ts: new Date(data.updated_at).getTime() };
  },
  async save(key: string, value: any): Promise<number> {
    const now = new Date().toISOString();
    const { error } = await supabase.from(TABLE.SITE_DATA).upsert(
      { key, value: JSON.stringify(value), updated_at: now },
      { onConflict: 'key' }
    );
    if (error) throw error;
    return new Date(now).getTime();
  },
  // Подписка на изменения в реальном времени
  subscribe(key: string, callback: (payload: any) => void) {
    return supabase
      .channel(`public:site_data:key=eq.${key}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: TABLE.SITE_DATA, filter: `key=eq.${key}` }, 
        payload => callback(JSON.parse(payload.new.value))
      )
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: TABLE.SITE_DATA, filter: `key=eq.${key}` }, 
        payload => callback(JSON.parse(payload.new.value))
      )
      .subscribe();
  }
};

// ====== User Progress ======
export const progress = {
  async load(userId: string): Promise<any> {
    const { data } = await supabase.from(TABLE.PROGRESS).select('data').eq('user_id', userId).maybeSingle();
    return data?.data ? JSON.parse(data.data) : null;
  },
  async save(userId: string, data: any) {
    return supabase.from(TABLE.PROGRESS).upsert(
      { user_id: userId, data: JSON.stringify(data), updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );
  }
};

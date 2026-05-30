import { getSupabase, isSupabaseConfigured } from './supabase';
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
  if (!isSupabaseConfigured) throw new Error('SUPABASE_NOT_CONFIGURED');
  await getSupabase().from('accounts').select('id').limit(1);
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  const { data } = await getSupabase().from('accounts').select('*').order('created_at', { ascending: false });
  return (data || []) as DbAccount[];
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const { data } = await getSupabase().from('accounts').select('*').ilike('username', username.trim()).maybeSingle();
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
  const { error } = await getSupabase().from('accounts').insert(account);
  if (error) return { error: error.message };
  return account;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>) {
  await getSupabase().from('accounts').update(updates).eq('id', id);
}

export async function dbDeleteAccount(id: string) {
  await getSupabase().from('accounts').delete().eq('id', id);
}

// ====== site_data (key → data JSON) ======
export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<T> {
  const { data, error } = await getSupabase().from('site_data').select('data').eq('key', key).maybeSingle();
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

  const { error } = await getSupabase().from('site_data').upsert(
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
  const { data, error } = await getSupabase().from('user_progress').select('data').eq('user_id', userId).maybeSingle();
  if (error || !data) return null;
  return parseDbJson(data.data, null);
}

export async function dbSaveProgress(userId: string, data: unknown) {
  await getSupabase().from('user_progress').upsert(
    { user_id: userId, data, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  );
}

// ====== GUIDES (новые нормализованные функции) ======
export interface DbGuide {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  category?: string;
  difficulty?: string;
  read_time?: string;
  icon?: string;
  images?: string[];
  author_id?: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export async function dbLoadGuides(): Promise<DbGuide[]> {
  const { data, error } = await getSupabase().from('guides').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('[db] load guides', error.message);
    return [];
  }
  return (data || []) as DbGuide[];
}

export async function dbGetGuideById(id: string): Promise<DbGuide | null> {
  const { data, error } = await getSupabase().from('guides').select('*').eq('id', id).maybeSingle();
  if (error) return null;
  return data as DbGuide | null;
}

export async function dbInsertGuide(guide: Omit<DbGuide, 'created_at' | 'updated_at'>): Promise<string | null> {
  const newGuide: DbGuide = {
    ...guide,
    id: guide.id || ('g' + Date.now() + Math.random().toString(36).slice(2, 8)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabase().from('guides').insert(newGuide);
  if (error) {
    console.error('[db] insert guide', error.message);
    return null;
  }
  return newGuide.id;
}

export async function dbUpdateGuide(id: string, updates: Partial<DbGuide>): Promise<boolean> {
  const { error } = await getSupabase().from('guides').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  return !error;
}

export async function dbDeleteGuide(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('guides').delete().eq('id', id);
  return !error;
}

// ====== GUIDE COMMENTS ======
export interface DbGuideComment {
  id: string;
  guide_id: string;
  user_id: string;
  user_name: string;
  text: string;
  likes?: string[];
  created_at: string;
}

export async function dbLoadGuideComments(guideId: string): Promise<DbGuideComment[]> {
  const { data, error } = await getSupabase()
    .from('guide_comments')
    .select('*')
    .eq('guide_id', guideId)
    .order('created_at', { ascending: true });
  if (error) return [];
  return (data || []) as DbGuideComment[];
}

export async function dbInsertGuideComment(comment: Omit<DbGuideComment, 'created_at'> & { guideId: string }): Promise<string | null> {
  const newComment: DbGuideComment = {
    id: comment.id || ('gc' + Date.now()),
    guide_id: comment.guideId,
    user_id: comment.user_id,
    user_name: comment.user_name,
    text: comment.text,
    likes: comment.likes || [],
    created_at: new Date().toISOString(),
  };
  const { error } = await getSupabase().from('guide_comments').insert(newComment);
  if (error) return null;
  return newComment.id;
}

export async function dbDeleteGuideComment(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('guide_comments').delete().eq('id', id);
  return !error;
}

// ====== WIKI ARTICLES ======
export interface DbWikiArticle {
  id: string;
  section: string;
  title: string;
  content?: string;
  icon?: string;
  author_id?: string;
  author_name?: string;
  fields?: Record<string, string>;
  images?: string[];
  created_at: string;
  updated_at: string;
}

export async function dbLoadWikiArticles(): Promise<DbWikiArticle[]> {
  const { data, error } = await getSupabase().from('wiki_articles').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return (data || []) as DbWikiArticle[];
}

export async function dbLoadWikiBySection(section: string): Promise<DbWikiArticle[]> {
  const { data, error } = await getSupabase()
    .from('wiki_articles')
    .select('*')
    .eq('section', section)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data || []) as DbWikiArticle[];
}

export async function dbInsertWikiArticle(article: Omit<DbWikiArticle, 'created_at' | 'updated_at'>): Promise<string | null> {
  const newArticle: DbWikiArticle = {
    ...article,
    id: article.id || ('w' + Date.now() + Math.random().toString(36).slice(2, 8)),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabase().from('wiki_articles').insert(newArticle);
  if (error) {
    console.error('[db] insert wiki', error.message);
    return null;
  }
  return newArticle.id;
}

export async function dbUpdateWikiArticle(id: string, updates: Partial<DbWikiArticle>): Promise<boolean> {
  const { error } = await getSupabase()
    .from('wiki_articles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export async function dbDeleteWikiArticle(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('wiki_articles').delete().eq('id', id);
  return !error;
}

export async function dbLoadAllGuideComments(): Promise<DbGuideComment[]> {
  const { data, error } = await getSupabase()
    .from('guide_comments')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) return [];
  return (data || []) as DbGuideComment[];
}

// ====== CHAT ======
export interface DbChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  user_role: string;
  message: string;
  deleted: boolean;
  created_at: string;
}

export async function dbLoadChatMessages(limit: number = 500): Promise<DbChatMessage[]> {
  const { data, error } = await getSupabase()
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []).reverse() as DbChatMessage[];
}

export async function dbInsertChatMessage(message: Omit<DbChatMessage, 'created_at'>): Promise<boolean> {
  const newMessage: DbChatMessage = {
    ...message,
    id: message.id || ('m' + Date.now() + Math.random().toString(36).slice(2, 8)),
    created_at: new Date().toISOString(),
  };
  const { error } = await getSupabase().from('chat_messages').insert(newMessage);
  return !error;
}

export async function dbDeleteChatMessage(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('chat_messages').update({ deleted: true }).eq('id', id);
  return !error;
}

export async function dbGetMutedUsers(): Promise<{ user_id: string; muted_until: string }[]> {
  const { data, error } = await getSupabase().from('chat_muted_users').select('*');
  if (error) return [];
  return data || [];
}

export async function dbMuteUser(userId: string, until: string): Promise<boolean> {
  const { error } = await getSupabase().from('chat_muted_users').upsert(
    { user_id: userId, muted_until: until },
    { onConflict: 'user_id' }
  );
  return !error;
}

export async function dbUnmuteUser(userId: string): Promise<boolean> {
  const { error } = await getSupabase().from('chat_muted_users').delete().eq('user_id', userId);
  return !error;
}

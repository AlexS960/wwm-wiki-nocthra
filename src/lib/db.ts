import { getSupabase, isSupabaseConfigured } from './supabase';
import { hashPassword } from './password';
import { checkSiteDataSize } from './siteDataLimits';
import { isStaffChatRole, staffRoleIdsForQuery } from './staffChat';

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

/** Аккаунты со служебными ролями (включая кастомные id с правом staff.chat). */
export async function dbListStaffAccounts(
  siteRoles?: import('../types/site').RoleConfig[],
): Promise<DbAccount[]> {
  const roleIds = staffRoleIdsForQuery(siteRoles);
  const { data, error } = await getSupabase()
    .from('accounts')
    .select('id, username, role, picture, game_nickname, password_hash, created_at, last_seen')
    .in('role', roleIds)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('[db] staff accounts', error);
    return [];
  }
  const fromQuery = (data || []) as DbAccount[];
  const known = new Set(fromQuery.map(a => a.id));
  const { data: extra } = await getSupabase()
    .from('accounts')
    .select('id, username, role, picture, game_nickname, password_hash, created_at, last_seen')
    .order('created_at', { ascending: false });
  const customStaff = ((extra || []) as DbAccount[]).filter(
    a => !known.has(a.id) && isStaffChatRole(a.role, siteRoles),
  );
  return [...fromQuery, ...customStaff];
}

export async function dbGetAccountByUsername(username: string): Promise<DbAccount | null> {
  const { data } = await getSupabase().from('accounts').select('*').ilike('username', username.trim()).maybeSingle();
  return data as DbAccount | null;
}

export async function dbGetAccountById(id: string): Promise<DbAccount | null> {
  const { data } = await getSupabase().from('accounts').select('*').eq('id', id).maybeSingle();
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

export const GUIDES_PAGE_SIZE = 20;
export const CHAT_PAGE_SIZE = 100;
export const CHAT_LOAD_MORE_SIZE = 50;

export interface DbGuidesPageResult {
  items: DbGuide[];
  total: number;
  hasMore: boolean;
}

export async function dbLoadGuidesPage(params: {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
}): Promise<DbGuidesPageResult> {
  const page = Math.max(1, params.page ?? 1);
  const limit = params.limit ?? GUIDES_PAGE_SIZE;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = getSupabase().from('guides').select('*', { count: 'exact' });

  if (params.category && params.category !== 'Все') {
    q = q.eq('category', params.category);
  }
  const trimmed = params.query?.trim();
  if (trimmed) {
    q = q.textSearch('search_vector', trimmed, { type: 'websearch', config: 'russian' });
  }

  let { data, error, count } = await q
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    const msg = error.message.toLowerCase();
    const missingFts = msg.includes('search_vector') || msg.includes('does not exist');
    if (trimmed && missingFts) {
      const fallback = await dbLoadGuidesPage({ ...params, query: undefined });
      const qLower = trimmed.toLowerCase();
      const filtered = fallback.items.filter(g =>
        `${g.title} ${g.summary} ${g.content} ${g.category}`.toLowerCase().includes(qLower),
      );
      const slice = filtered.slice(from, from + limit);
      return {
        items: slice,
        total: filtered.length,
        hasMore: from + slice.length < filtered.length,
      };
    }
    console.error('[db] load guides page', error.message);
    return { items: [], total: 0, hasMore: false };
  }

  const total = count ?? 0;
  return {
    items: (data || []) as DbGuide[],
    total,
    hasMore: from + (data?.length ?? 0) < total,
  };
}

export async function dbSearchGuides(query: string, limit = 20): Promise<DbGuide[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const { data, error } = await getSupabase()
    .from('guides')
    .select('*')
    .textSearch('search_vector', trimmed, { type: 'websearch', config: 'russian' })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) {
    const all = await dbLoadGuides();
    const qLower = trimmed.toLowerCase();
    return all.filter(g =>
      `${g.title} ${g.summary} ${g.content} ${g.category}`.toLowerCase().includes(qLower),
    ).slice(0, limit);
  }
  return (data || []) as DbGuide[];
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

export async function dbUpdateGuideComment(id: string, updates: Partial<Pick<DbGuideComment, 'likes' | 'text'>>): Promise<boolean> {
  const { error } = await getSupabase().from('guide_comments').update(updates).eq('id', id);
  return !error;
}

// ====== GUIDE VERSIONS ======
export interface DbGuideVersion {
  id: string;
  guide_id: string;
  title: string;
  summary?: string;
  content?: string;
  category?: string;
  difficulty?: string;
  read_time?: string;
  icon?: string;
  images?: string[];
  saved_at: string;
  saved_by: string;
}

export async function dbLoadGuideVersions(): Promise<DbGuideVersion[]> {
  const { data, error } = await getSupabase()
    .from('guide_versions')
    .select('*')
    .order('saved_at', { ascending: false });
  if (error) return [];
  return (data || []) as DbGuideVersion[];
}

export async function dbSyncGuideVersions(versions: DbGuideVersion[]): Promise<boolean> {
  const { error: delError } = await getSupabase().from('guide_versions').delete().neq('id', '');
  if (delError) {
    console.error('[db] sync guide_versions delete', delError.message);
    return false;
  }
  if (versions.length === 0) return true;
  const { error } = await getSupabase().from('guide_versions').insert(versions);
  if (error) console.error('[db] sync guide_versions insert', error.message);
  return !error;
}

// ====== SITE NEWS ======
export interface DbSiteNews {
  id: string;
  title: string;
  summary?: string;
  content?: string;
  category?: string;
  icon?: string;
  images?: string[];
  likes?: string[];
  author_id?: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

export async function dbLoadSiteNews(): Promise<DbSiteNews[]> {
  const { data, error } = await getSupabase().from('site_news').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return (data || []) as DbSiteNews[];
}

export async function dbInsertSiteNews(item: Omit<DbSiteNews, 'created_at' | 'updated_at'>): Promise<string | null> {
  const row: DbSiteNews = {
    ...item,
    likes: item.likes || [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabase().from('site_news').insert(row);
  if (error) {
    console.error('[db] insert site_news', error.message);
    return null;
  }
  return row.id;
}

export async function dbUpdateSiteNews(id: string, updates: Partial<DbSiteNews>): Promise<boolean> {
  const { error } = await getSupabase()
    .from('site_news')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  return !error;
}

export async function dbDeleteSiteNews(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('site_news').delete().eq('id', id);
  return !error;
}

// ====== SUPPORT TICKETS ======
export interface DbSupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  replies: { id: string; authorName: string; authorRole: string; message: string; createdAt: string }[];
}

export async function dbLoadSupportTickets(): Promise<DbSupportTicket[]> {
  const { data, error } = await getSupabase().from('support_tickets').select('*').order('created_at', { ascending: false });
  if (error) return [];
  return (data || []) as DbSupportTicket[];
}

export async function dbInsertSupportTicket(ticket: Omit<DbSupportTicket, 'created_at'>): Promise<string | null> {
  const row: DbSupportTicket = {
    ...ticket,
    replies: ticket.replies || [],
    created_at: new Date().toISOString(),
  };
  const { error } = await getSupabase().from('support_tickets').insert(row);
  if (error) {
    console.error('[db] insert support_tickets', error.message);
    return null;
  }
  return row.id;
}

export async function dbUpdateSupportTicket(id: string, updates: Partial<DbSupportTicket>): Promise<boolean> {
  const { error } = await getSupabase().from('support_tickets').update(updates).eq('id', id);
  return !error;
}

export async function dbDeleteSupportTicket(id: string): Promise<boolean> {
  const { error } = await getSupabase().from('support_tickets').delete().eq('id', id);
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

export async function dbLoadChatMessages(limit: number = CHAT_PAGE_SIZE): Promise<DbChatMessage[]> {
  const { data, error } = await getSupabase()
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []).reverse() as DbChatMessage[];
}

export async function dbLoadChatMessagesBefore(beforeCreatedAt: string, limit = CHAT_LOAD_MORE_SIZE): Promise<DbChatMessage[]> {
  const { data, error } = await getSupabase()
    .from('chat_messages')
    .select('*')
    .lt('created_at', beforeCreatedAt)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []).reverse() as DbChatMessage[];
}

export async function dbCountChatMessages(): Promise<number> {
  const { count, error } = await getSupabase()
    .from('chat_messages')
    .select('*', { count: 'exact', head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function dbSearchChatMessages(query: string, limit = 50): Promise<DbChatMessage[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const { data, error } = await getSupabase()
    .from('chat_messages')
    .select('*')
    .textSearch('search_vector', trimmed, { type: 'websearch', config: 'russian' })
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

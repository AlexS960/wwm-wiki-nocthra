import { getSupabase, isSupabaseConfigured } from './supabase';
import { hashPassword } from './password';
import { checkSiteDataSize } from './siteDataLimits';
import { isStaffChatRole, staffRoleIdsForQuery } from './staffChat';
import { logger } from './logger';
import { dbgLog } from './debugSessionLog';
import type { UserProgress } from '../types/site';
import { normalizeUserProgress } from './userProgress';

export interface DbAccount {
  id: string;
  username: string;
  role: string;
  picture?: string;
  game_nickname?: string;
  guild_id?: string;
  messenger_access_id?: string;
  password_hash: string;
  created_at: string;
  last_seen?: string | null;
}

export interface VisitStats {
  totalHits: number;
  uniqueIps: number;
  anonymousHits: number;
  registeredHits: number;
  topPaths: { path: string; hits: number }[];
  topIps: { ip: string; hits: number; lastSeen: string }[];
  daily: { day: string; hits: number; uniqueIps: number }[];
}

export interface DbRegisteredGuild {
  id: string;
  name: string;
  description?: string;
  server?: string;
  leader_id?: string;
  leader_name?: string;
  leader_game_nickname?: string;
  created_at: string;
  updated_at?: string | null;
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

const ACCOUNT_PUBLIC_FIELDS =
  'id, username, role, picture, game_nickname, guild_id, created_at, last_seen, messenger_access_id';

type AccountPublicRow = Omit<DbAccount, 'password_hash'>;

function mapPublicAccounts(rows: AccountPublicRow[] | null | undefined): DbAccount[] {
  return (rows || []).map(a => ({ ...a, password_hash: '' }));
}

/** Списки аккаунтов: view accounts_public (без password_hash), fallback на таблицу. */
async function dbSelectPublicAccounts(
  build: (source: 'accounts_public' | 'accounts') => PromiseLike<{ data: unknown; error: unknown }>,
): Promise<DbAccount[]> {
  const fromView = await build('accounts_public');
  if (!fromView.error && fromView.data) {
    return mapPublicAccounts(fromView.data as AccountPublicRow[]);
  }
  const fromTable = await build('accounts');
  if (fromTable.error) {
    logger.error('Failed to load accounts', 'db', fromTable.error);
    return [];
  }
  return mapPublicAccounts(fromTable.data as AccountPublicRow[]);
}

export async function dbListAccounts(): Promise<DbAccount[]> {
  const { data, error } = await getSupabase()
    .from('accounts')
    .select(ACCOUNT_PUBLIC_FIELDS)
    .order('created_at', { ascending: false });
  if (error) {
    logger.error('Failed to load accounts', 'db', error.message);
    return dbSelectPublicAccounts(source =>
      getSupabase()
        .from(source)
        .select(ACCOUNT_PUBLIC_FIELDS)
        .order('created_at', { ascending: false }),
    );
  }
  return mapPublicAccounts(data as AccountPublicRow[]);
}

/** Аккаунты со служебными ролями (включая кастомные id с правом staff.chat). */
export async function dbListStaffAccounts(
  siteRoles?: import('../types/site').RoleConfig[],
): Promise<DbAccount[]> {
  const roleIds = staffRoleIdsForQuery(siteRoles);
  const fromQuery = await dbSelectPublicAccounts(source =>
    getSupabase()
      .from(source)
      .select(ACCOUNT_PUBLIC_FIELDS)
      .in('role', roleIds)
      .order('created_at', { ascending: false }),
  );
  const known = new Set(fromQuery.map(a => a.id));
  const all = await dbSelectPublicAccounts(source =>
    getSupabase()
      .from(source)
      .select(ACCOUNT_PUBLIC_FIELDS)
      .order('created_at', { ascending: false }),
  );
  const customStaff = all.filter(
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

export async function dbCreateAccount(
  username: string,
  password: string,
  gameNickname: string,
  guildId = '',
): Promise<DbAccount | { error: string }> {
  const password_hash = await hashPassword(password);
  const account: DbAccount = {
    id: 'user_' + crypto.randomUUID().slice(0, 8),
    username: username.trim(),
    password_hash,
    role: 'user',
    picture: '',
    game_nickname: gameNickname.trim(),
    guild_id: guildId.trim(),
    created_at: new Date().toISOString(),
  };
  const { error } = await getSupabase().from('accounts').insert(account);
  if (error) return { error: error.message };
  return account;
}

export async function dbUpdateAccount(id: string, updates: Partial<DbAccount>): Promise<{ error?: string }> {
  const { error } = await getSupabase().from('accounts').update(updates).eq('id', id);
  if (error) {
    logger.error('Failed to update account', 'db', error.message);
    return { error: error.message };
  }
  return {};
}

export async function dbDeleteAccount(id: string): Promise<{ error?: string }> {
  const { error } = await getSupabase().from('accounts').delete().eq('id', id);
  if (error) {
    logger.error('Failed to delete account', 'db', error.message);
    return { error: error.message };
  }
  return {};
}

function mapDbGuild(row: DbRegisteredGuild): import('../types/site').RegisteredGuild {
  return {
    id: row.id,
    name: row.name,
    description: row.description || '',
    server: row.server || '',
    leaderId: row.leader_id || '',
    leaderName: row.leader_name || '',
    leaderGameNickname: row.leader_game_nickname || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at || undefined,
  };
}

export async function dbListRegisteredGuilds(): Promise<import('../types/site').RegisteredGuild[]> {
  const { data, error } = await getSupabase()
    .from('registered_guilds')
    .select('*')
    .order('name', { ascending: true });
  if (error) {
    logger.error('Failed to load registered guilds', 'db', error.message);
    return [];
  }
  return ((data || []) as DbRegisteredGuild[]).map(mapDbGuild);
}

export async function dbGetRegisteredGuildByName(name: string): Promise<import('../types/site').RegisteredGuild | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const { data, error } = await getSupabase()
    .from('registered_guilds')
    .select('*')
    .ilike('name', trimmed)
    .maybeSingle();
  if (error || !data) return null;
  return mapDbGuild(data as DbRegisteredGuild);
}

export async function dbGetRegisteredGuildById(id: string): Promise<import('../types/site').RegisteredGuild | null> {
  const { data, error } = await getSupabase()
    .from('registered_guilds')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return mapDbGuild(data as DbRegisteredGuild);
}

export async function dbCreateRegisteredGuild(params: {
  name: string;
  description?: string;
  server?: string;
  leaderId?: string;
  leaderName?: string;
  leaderGameNickname?: string;
}): Promise<import('../types/site').RegisteredGuild | { error: string }> {
  const name = params.name.trim();
  const existing = await dbGetRegisteredGuildByName(name);
  if (existing) return { error: 'Гильдия с таким названием уже зарегистрирована' };

  const now = new Date().toISOString();
  const row: DbRegisteredGuild = {
    id: 'guild_' + crypto.randomUUID().slice(0, 8),
    name,
    description: (params.description || '').trim(),
    server: (params.server || '').trim(),
    leader_id: params.leaderId || '',
    leader_name: (params.leaderName || '').trim(),
    leader_game_nickname: (params.leaderGameNickname || '').trim(),
    created_at: now,
    updated_at: now,
  };
  const { error } = await getSupabase().from('registered_guilds').insert(row);
  if (error) {
    if (error.message.toLowerCase().includes('duplicate') || error.message.toLowerCase().includes('unique')) {
      return { error: 'Гильдия с таким названием уже зарегистрирована' };
    }
    return { error: error.message };
  }
  if (row.leader_id) {
    await getSupabase().from('accounts').update({ guild_id: row.id }).eq('id', row.leader_id);
  }
  return mapDbGuild(row);
}

export async function dbUpdateRegisteredGuild(
  id: string,
  updates: Partial<Pick<DbRegisteredGuild, 'name' | 'description' | 'server' | 'leader_id' | 'leader_name' | 'leader_game_nickname'>>,
): Promise<{ error?: string }> {
  const payload: Partial<DbRegisteredGuild> = { ...updates, updated_at: new Date().toISOString() };
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.description !== undefined) payload.description = updates.description.trim();
  if (updates.server !== undefined) payload.server = updates.server.trim();
  if (updates.leader_name !== undefined) payload.leader_name = updates.leader_name.trim();
  if (updates.leader_game_nickname !== undefined) payload.leader_game_nickname = updates.leader_game_nickname.trim();

  const { error } = await getSupabase().from('registered_guilds').update(payload).eq('id', id);
  if (error) return { error: error.message };
  return {};
}

export async function dbDeleteRegisteredGuild(id: string): Promise<{ error?: string }> {
  await getSupabase().from('accounts').update({ guild_id: '' }).eq('guild_id', id);
  const { error } = await getSupabase().from('registered_guilds').delete().eq('id', id);
  if (error) return { error: error.message };
  return {};
}

// ====== site_data (key → data JSON) ======
export async function dbLoadSiteData<T>(key: string, fallback?: T): Promise<T> {
  const { data, error } = await getSupabase().from('site_data').select('data').eq('key', key).maybeSingle();
  if (error) {
    logger.error(`Failed to load site data: ${key}`, 'db', error.message);
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
    logger.error(`Failed to save site data: ${key}`, 'db', error.message);
    return { error: error.message };
  }
  return {};
}

// ====== user_progress ======
export async function dbLoadProgress(userId: string): Promise<{ progress: UserProgress; savedAt: string | null } | null> {
  const { data, error } = await getSupabase()
    .from('user_progress')
    .select('data, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error || !data) return null;
  return {
    progress: normalizeUserProgress(parseDbJson(data.data, null)),
    savedAt: typeof data.updated_at === 'string' ? data.updated_at : null,
  };
}

export async function dbSaveProgress(userId: string, data: UserProgress): Promise<{ error?: string }> {
  const payload = typeof data === 'string' ? data : JSON.stringify(data);
  const { error } = await getSupabase().from('user_progress').upsert(
    { user_id: userId, data: payload, updated_at: new Date().toISOString() },
    { onConflict: 'user_id' },
  );
  if (error) {
    logger.error('Failed to save user progress', 'db', error.message);
    return { error: error.message };
  }
  return {};
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
    logger.error('Failed to load guides page', 'db', error.message);
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
    logger.error('Failed to load guides', 'db', error.message);
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
    logger.error('Failed to insert guide', 'db', error.message);
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
    logger.error('Failed to delete guide_versions', 'db', delError.message);
    return false;
  }
  if (versions.length === 0) return true;
  const { error } = await getSupabase().from('guide_versions').insert(versions);
  if (error) logger.error('Failed to insert guide_versions', 'db', error.message);
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
    logger.error('Failed to insert site_news', 'db', error.message);
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
    logger.error('Failed to insert support_tickets', 'db', error.message);
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
    logger.error('Failed to insert wiki article', 'db', error.message);
    return null;
  }
  return newArticle.id;
}

export async function dbUpsertWikiArticle(article: Omit<DbWikiArticle, 'created_at' | 'updated_at'>): Promise<boolean> {
  const now = new Date().toISOString();
  const { data: existing } = await getSupabase()
    .from('wiki_articles')
    .select('created_at')
    .eq('id', article.id)
    .maybeSingle();
  const row: DbWikiArticle = {
    ...article,
    created_at: existing?.created_at || now,
    updated_at: now,
  };
  const { error } = await getSupabase().from('wiki_articles').upsert(row, { onConflict: 'id' });
  if (error) {
    logger.error('Failed to upsert wiki article', 'db', error.message);
    return false;
  }
  return true;
}

export async function dbUpdateWikiArticle(
  id: string,
  updates: Partial<DbWikiArticle>,
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await getSupabase()
    .from('wiki_articles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id');
  if (error) {
    logger.error('Failed to update wiki article', 'db', error.message);
    return { ok: false, error: error.message };
  }
  if (!data?.length) {
    const msg = `Статья ${id} не найдена в базе`;
    logger.warn(msg, 'db');
    return { ok: false, error: msg };
  }
  return { ok: true };
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
    .eq('deleted', false)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data || []).reverse() as DbChatMessage[];
}

export async function dbLoadChatMessagesBefore(beforeCreatedAt: string, limit = CHAT_LOAD_MORE_SIZE): Promise<DbChatMessage[]> {
  const { data, error } = await getSupabase()
    .from('chat_messages')
    .select('*')
    .eq('deleted', false)
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
  const { error } = await getSupabase().from('chat_messages').delete().eq('id', id);
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

// ====== site_visits (аналитика) ======
function visitIpFromRow(row: { client_ip?: string | null; visitor_id?: string | null }): string {
  const fromColumn = row.client_ip?.trim();
  if (fromColumn && fromColumn !== 'unknown') return fromColumn;
  const legacy = row.visitor_id?.trim() || '';
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(legacy) || legacy.includes(':')) return legacy;
  return '';
}

export async function dbRecordVisit(row: {
  client_ip: string;
  user_id: string | null;
  path: string;
}): Promise<void> {
  const ip = row.client_ip.trim() || 'unknown';
  const { error } = await getSupabase().from('site_visits').insert({
    visitor_id: ip,
    client_ip: ip,
    user_id: row.user_id,
    path: row.path,
    hit_at: new Date().toISOString(),
  });
  if (error) {
    const msg = error.message.toLowerCase();
    dbgLog('db.ts:dbRecordVisit', 'insert failed', { err: error.message.slice(0, 120), ipKind: ip === 'unknown' ? 'unknown' : 'resolved' }, 'B');
    if (msg.includes('does not exist') || msg.includes('could not find')) return;
    if (msg.includes('client_ip')) {
      const { error: legacyErr } = await getSupabase().from('site_visits').insert({
        visitor_id: ip,
        user_id: row.user_id,
        path: row.path,
        hit_at: new Date().toISOString(),
      });
      dbgLog('db.ts:dbRecordVisit', 'legacy insert', { ok: !legacyErr, err: legacyErr?.message?.slice(0, 80) }, 'B');
      if (legacyErr) logger.warn('Failed to record visit', 'analytics', legacyErr.message);
      return;
    }
    logger.warn('Failed to record visit', 'analytics', error.message);
    return;
  }
  dbgLog('db.ts:dbRecordVisit', 'insert ok', { ipKind: ip === 'unknown' ? 'unknown' : 'resolved', path: row.path }, 'B');
}

export async function dbGetVisitStats(days: number): Promise<{ stats: VisitStats | null; error?: string }> {
  const since = new Date(Date.now() - days * 86400000).toISOString();
  const { data, error } = await getSupabase()
    .from('site_visits')
    .select('visitor_id, client_ip, user_id, path, hit_at')
    .gte('hit_at', since)
    .order('hit_at', { ascending: false })
    .limit(10000);

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('does not exist') || msg.includes('could not find')) {
      return {
        stats: {
          totalHits: 0,
          uniqueIps: 0,
          anonymousHits: 0,
          registeredHits: 0,
          topPaths: [],
          topIps: [],
          daily: [],
        },
        error: 'Таблица site_visits не найдена. Выполните миграции 14 и 15 в Supabase.',
      };
    }
    if (msg.includes('client_ip')) {
      const fallback = await getSupabase()
        .from('site_visits')
        .select('visitor_id, user_id, path, hit_at')
        .gte('hit_at', since)
        .order('hit_at', { ascending: false })
        .limit(10000);
      if (fallback.error) return { stats: null, error: fallback.error.message };
      return buildVisitStats((fallback.data || []) as Array<{
        visitor_id: string;
        client_ip?: string;
        user_id: string | null;
        path: string;
        hit_at: string;
      }>);
    }
    return { stats: null, error: error.message };
  }

  return buildVisitStats(data || []);
}

function buildVisitStats(rows: Array<{
  visitor_id: string;
  client_ip?: string | null;
  user_id: string | null;
  path: string;
  hit_at: string;
}>): { stats: VisitStats | null; error?: string } {
  const ips = new Set<string>();
  let anonymousHits = 0;
  let registeredHits = 0;
  const pathCounts = new Map<string, number>();
  const ipCounts = new Map<string, { hits: number; lastSeen: string }>();
  const dailyMap = new Map<string, { hits: number; ips: Set<string> }>();

  for (const row of rows) {
    const ip = visitIpFromRow(row);
    if (ip) ips.add(ip);
    if (row.user_id) registeredHits++;
    else anonymousHits++;
    pathCounts.set(row.path, (pathCounts.get(row.path) || 0) + 1);
    if (ip) {
      const bucket = ipCounts.get(ip) || { hits: 0, lastSeen: row.hit_at };
      bucket.hits++;
      if (row.hit_at > bucket.lastSeen) bucket.lastSeen = row.hit_at;
      ipCounts.set(ip, bucket);
    }
    const day = row.hit_at.slice(0, 10);
    const dayBucket = dailyMap.get(day) || { hits: 0, ips: new Set<string>() };
    dayBucket.hits++;
    if (ip) dayBucket.ips.add(ip);
    dailyMap.set(day, dayBucket);
  }

  const topPaths = [...pathCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([path, hits]) => ({ path, hits }));

  const topIps = [...ipCounts.entries()]
    .sort((a, b) => b[1].hits - a[1].hits)
    .slice(0, 20)
    .map(([ip, v]) => ({
      ip,
      hits: v.hits,
      lastSeen: new Date(v.lastSeen).toLocaleString('ru-RU'),
    }));

  const daily = [...dailyMap.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([day, v]) => ({
      day,
      hits: v.hits,
      uniqueIps: v.ips.size,
    }));

  const result = {
    stats: {
      totalHits: rows.length,
      uniqueIps: ips.size,
      anonymousHits,
      registeredHits,
      topPaths,
      topIps,
      daily,
    },
  };
  dbgLog('db.ts:buildVisitStats', 'stats built', {
    rows: rows.length,
    uniqueIps: ips.size,
    topIpsCount: topIps.length,
    legacyVisitorRows: rows.filter(r => !visitIpFromRow(r)).length,
  }, 'E');
  return result;
}

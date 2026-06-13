import type {
  GuideArticle,
  GuideComment,
  GuideVersion,
  WikiArticle,
  ChatState,
  ChatMessage,
  SiteNewsItem,
  SupportTicket,
} from '../types/site';
import {
  dbLoadSiteData,
  dbSaveSiteData,
  dbLoadGuides,
  dbLoadGuidesPage,
  dbSearchGuides,
  dbLoadChatMessagesBefore,
  dbCountChatMessages,
  dbSearchChatMessages,
  GUIDES_PAGE_SIZE,
  CHAT_PAGE_SIZE,
  CHAT_LOAD_MORE_SIZE,
  dbInsertGuide,
  dbUpdateGuide,
  dbDeleteGuide,
  dbLoadAllGuideComments,
  dbInsertGuideComment,
  dbDeleteGuideComment,
  dbUpdateGuideComment,
  dbLoadWikiArticles,
  dbInsertWikiArticle,
  dbUpdateWikiArticle,
  dbUpsertWikiArticle,
  dbDeleteWikiArticle,
  dbLoadChatMessages,
  dbInsertChatMessage,
  dbDeleteChatMessage,
  dbGetMutedUsers,
  dbMuteUser,
  dbUnmuteUser,
  dbLoadGuideVersions,
  dbSyncGuideVersions,
  dbLoadSiteNews,
  dbInsertSiteNews,
  dbUpdateSiteNews,
  dbDeleteSiteNews,
  dbLoadSupportTickets,
  dbInsertSupportTicket,
  dbUpdateSupportTicket,
  dbDeleteSupportTicket,
  type DbGuide,
  type DbWikiArticle,
  type DbGuideVersion,
  type DbSiteNews,
  type DbSupportTicket,
} from './db';
import {
  adaptGuide,
  adaptWikiArticle,
  adaptChatMessage,
  adaptSiteNews,
  adaptSupportTicket,
  adaptGuideVersion,
} from './adapters';
import { isTableReady } from './tableReady';
import { trimChatMessages } from './chat';

export interface GuidesPageResult {
  items: GuideArticle[];
  total: number;
  hasMore: boolean;
}

type ContentDomain = 'guides' | 'wiki' | 'chat' | 'comments' | 'news' | 'support' | 'versions';

const tableReady: Record<ContentDomain, boolean | null> = {
  guides: null,
  wiki: null,
  chat: null,
  comments: null,
  news: null,
  support: null,
  versions: null,
};

const TABLE_BY_DOMAIN: Record<ContentDomain, string> = {
  guides: 'guides',
  wiki: 'wiki_articles',
  chat: 'chat_messages',
  comments: 'guide_comments',
  news: 'site_news',
  support: 'support_tickets',
  versions: 'guide_versions',
};

async function usesTable(domain: ContentDomain): Promise<boolean> {
  const cached = tableReady[domain];
  if (cached !== null && cached !== undefined) return cached;
  const ready = await isTableReady(TABLE_BY_DOMAIN[domain]);
  tableReady[domain] = ready;
  return ready;
}

function guideToDb(guide: GuideArticle): Omit<DbGuide, 'created_at' | 'updated_at'> {
  return {
    id: guide.id,
    title: guide.title,
    summary: guide.summary,
    content: guide.content,
    category: guide.category,
    difficulty: guide.difficulty,
    read_time: guide.readTime,
    icon: guide.icon,
    images: guide.images,
    author_name: guide.authorName,
  };
}

function wikiToDb(article: WikiArticle): Omit<DbWikiArticle, 'created_at' | 'updated_at'> {
  return {
    id: article.id,
    section: article.section,
    title: article.title,
    content: article.content,
    icon: article.icon,
    author_name: article.authorName,
    fields: article.fields,
    images: article.images,
  };
}

function newsToDb(item: SiteNewsItem): Omit<DbSiteNews, 'created_at' | 'updated_at'> {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    content: item.content,
    category: item.category,
    icon: item.icon,
    images: item.images,
    likes: item.likes,
    author_name: item.authorName,
  };
}

function versionToDb(v: GuideVersion): DbGuideVersion {
  return {
    id: v.id,
    guide_id: v.guideId,
    title: v.title,
    summary: v.summary,
    content: v.content,
    category: v.category,
    difficulty: v.difficulty,
    read_time: v.readTime,
    icon: v.icon,
    images: v.images,
    saved_at: v.savedAt,
    saved_by: v.savedBy,
  };
}

function ticketToDb(t: SupportTicket): Omit<DbSupportTicket, 'created_at'> {
  return {
    id: t.id,
    user_id: t.userId,
    user_name: t.userName,
    subject: t.subject,
    message: t.message,
    status: t.status,
    replies: t.replies,
  };
}

function commentFromDb(c: {
  id: string;
  guide_id: string;
  user_id: string;
  user_name: string;
  text: string;
  created_at: string;
  likes?: string[];
}): GuideComment {
  return {
    id: c.id,
    guideId: c.guide_id,
    userId: c.user_id,
    userName: c.user_name,
    text: c.text,
    createdAt: c.created_at,
    likes: c.likes,
  };
}

export async function contentStoreUsesNormalized(domain: ContentDomain): Promise<boolean> {
  return usesTable(domain);
}

export async function contentStoreLoadGuides(): Promise<GuideArticle[]> {
  if (await usesTable('guides')) return (await dbLoadGuides()).map(adaptGuide);
  return dbLoadSiteData<GuideArticle[]>('guides', []);
}

export async function contentStoreLoadGuidesPage(params: {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
}): Promise<GuidesPageResult> {
  if (await usesTable('guides')) {
    const r = await dbLoadGuidesPage(params);
    return { items: r.items.map(adaptGuide), total: r.total, hasMore: r.hasMore };
  }
  let items = await dbLoadSiteData<GuideArticle[]>('guides', []);
  const q = params.query?.trim().toLowerCase();
  if (q) {
    items = items.filter(g =>
      `${g.title} ${g.summary} ${g.content} ${g.category}`.toLowerCase().includes(q),
    );
  }
  if (params.category && params.category !== 'Все') {
    items = items.filter(g => g.category === params.category);
  }
  const limit = params.limit ?? GUIDES_PAGE_SIZE;
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * limit;
  const slice = items.slice(from, from + limit);
  return { items: slice, total: items.length, hasMore: from + slice.length < items.length };
}

export async function contentStoreSearchGuides(query: string, limit = 20): Promise<GuideArticle[]> {
  if (await usesTable('guides')) {
    return (await dbSearchGuides(query, limit)).map(adaptGuide);
  }
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const items = await dbLoadSiteData<GuideArticle[]>('guides', []);
  return items
    .filter(g => `${g.title} ${g.summary} ${g.content} ${g.category}`.toLowerCase().includes(q))
    .slice(0, limit);
}

export async function contentStoreLoadWiki(): Promise<WikiArticle[]> {
  if (await usesTable('wiki')) return (await dbLoadWikiArticles()).map(adaptWikiArticle);
  return dbLoadSiteData<WikiArticle[]>('wiki', []);
}

export async function contentStoreLoadGuideComments(): Promise<GuideComment[]> {
  if (await usesTable('comments')) return (await dbLoadAllGuideComments()).map(commentFromDb);
  return dbLoadSiteData<GuideComment[]>('guide_comments', []);
}

export async function contentStoreLoadGuideVersions(): Promise<GuideVersion[]> {
  if (await usesTable('versions')) return (await dbLoadGuideVersions()).map(adaptGuideVersion);
  return dbLoadSiteData<GuideVersion[]>('guide_versions', []);
}

export async function contentStoreLoadSiteNews(): Promise<SiteNewsItem[]> {
  if (await usesTable('news')) return (await dbLoadSiteNews()).map(adaptSiteNews);
  return dbLoadSiteData<SiteNewsItem[]>('site_news', []);
}

export async function contentStoreLoadSupportTickets(): Promise<SupportTicket[]> {
  if (await usesTable('support')) return (await dbLoadSupportTickets()).map(adaptSupportTicket);
  return dbLoadSiteData<SupportTicket[]>('support', []);
}

export async function contentStoreLoadChat(): Promise<ChatState> {
  if (await usesTable('chat')) {
    const [messages, mutedUsers] = await Promise.all([
      dbLoadChatMessages(CHAT_PAGE_SIZE),
      dbGetMutedUsers(),
    ]);
    return {
      messages: messages.map(adaptChatMessage),
      mutedUsers: mutedUsers.map(m => ({
        userId: m.user_id,
        until: new Date(m.muted_until).getTime(),
      })),
    };
  }
  return dbLoadSiteData<ChatState>('chat', { messages: [], mutedUsers: [] });
}

export async function contentStoreLoadOlderChat(beforeCreatedAt: string): Promise<{
  messages: ChatMessage[];
  hasMore: boolean;
}> {
  if (await usesTable('chat')) {
    const [older, total] = await Promise.all([
      dbLoadChatMessagesBefore(beforeCreatedAt, CHAT_LOAD_MORE_SIZE),
      dbCountChatMessages(),
    ]);
    const messages = older.map(adaptChatMessage);
    const loadedCount = messages.length;
    return { messages, hasMore: loadedCount >= CHAT_LOAD_MORE_SIZE && loadedCount < total };
  }
  const state = await dbLoadSiteData<ChatState>('chat', { messages: [], mutedUsers: [] });
  const beforeTs = new Date(beforeCreatedAt).getTime();
  const older = state.messages.filter(m => m.timestamp < beforeTs);
  const slice = older.slice(-CHAT_LOAD_MORE_SIZE);
  return { messages: slice, hasMore: older.length > slice.length };
}

export async function contentStoreSearchChat(query: string, limit = 50): Promise<ChatMessage[]> {
  if (await usesTable('chat')) {
    return (await dbSearchChatMessages(query, limit)).map(adaptChatMessage);
  }
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const state = await dbLoadSiteData<ChatState>('chat', { messages: [], mutedUsers: [] });
  return state.messages.filter(m => m.text.toLowerCase().includes(q)).slice(-limit);
}

export async function contentStoreAddGuide(guide: GuideArticle): Promise<boolean> {
  if (!(await usesTable('guides'))) return false;
  return !!(await dbInsertGuide(guideToDb(guide)));
}

export async function contentStoreUpdateGuide(id: string, guide: GuideArticle): Promise<boolean> {
  if (!(await usesTable('guides'))) return false;
  return dbUpdateGuide(id, guideToDb(guide));
}

export async function contentStoreDeleteGuide(id: string): Promise<boolean> {
  if (!(await usesTable('guides'))) return false;
  return dbDeleteGuide(id);
}

export async function contentStoreAddWiki(article: WikiArticle): Promise<boolean> {
  if (!(await usesTable('wiki'))) return false;
  return !!(await dbInsertWikiArticle(wikiToDb(article)));
}

export async function contentStoreUpsertWiki(article: WikiArticle): Promise<boolean> {
  if (!(await usesTable('wiki'))) return false;
  return dbUpsertWikiArticle(wikiToDb(article));
}

export async function contentStoreUpdateWiki(id: string, article: WikiArticle): Promise<boolean> {
  if (!(await usesTable('wiki'))) return false;
  return dbUpdateWikiArticle(id, wikiToDb(article));
}

export async function contentStoreDeleteWiki(id: string): Promise<boolean> {
  if (!(await usesTable('wiki'))) return false;
  return dbDeleteWikiArticle(id);
}

export async function contentStoreAddGuideComment(comment: GuideComment): Promise<boolean> {
  if (!(await usesTable('comments'))) return false;
  return !!(await dbInsertGuideComment({
    id: comment.id,
    guideId: comment.guideId,
    user_id: comment.userId,
    user_name: comment.userName,
    text: comment.text,
    likes: comment.likes,
  }));
}

export async function contentStoreDeleteGuideComment(id: string): Promise<boolean> {
  if (!(await usesTable('comments'))) return false;
  return dbDeleteGuideComment(id);
}

export async function contentStoreUpdateGuideCommentLikes(commentId: string, likes: string[]): Promise<boolean> {
  if (!(await usesTable('comments'))) return false;
  return dbUpdateGuideComment(commentId, { likes });
}

export async function contentStoreSaveGuideCommentsAll(comments: GuideComment[]): Promise<{ error?: string }> {
  if (await usesTable('comments')) return {};
  return dbSaveSiteData('guide_comments', comments);
}

export async function contentStoreSyncGuideVersions(versions: GuideVersion[]): Promise<{ error?: string }> {
  if (await usesTable('versions')) {
    const ok = await dbSyncGuideVersions(versions.map(versionToDb));
    return ok ? {} : { error: 'Ошибка сохранения версий гайда' };
  }
  return dbSaveSiteData('guide_versions', versions);
}

export async function contentStoreAddSiteNews(item: SiteNewsItem): Promise<boolean> {
  if (!(await usesTable('news'))) return false;
  return !!(await dbInsertSiteNews(newsToDb(item)));
}

export async function contentStoreUpdateSiteNews(id: string, item: SiteNewsItem): Promise<boolean> {
  if (!(await usesTable('news'))) return false;
  return dbUpdateSiteNews(id, newsToDb(item));
}

export async function contentStoreDeleteSiteNews(id: string): Promise<boolean> {
  if (!(await usesTable('news'))) return false;
  return dbDeleteSiteNews(id);
}

export async function contentStoreUpdateSiteNewsLikes(newsId: string, likes: string[]): Promise<boolean> {
  if (!(await usesTable('news'))) return false;
  return dbUpdateSiteNews(newsId, { likes });
}

export async function contentStoreSaveSiteNewsAll(items: SiteNewsItem[]): Promise<{ error?: string }> {
  if (await usesTable('news')) return {};
  return dbSaveSiteData('site_news', items);
}

export async function contentStoreAddSupportTicket(ticket: SupportTicket): Promise<boolean> {
  if (!(await usesTable('support'))) return false;
  return !!(await dbInsertSupportTicket(ticketToDb(ticket)));
}

export async function contentStoreUpdateSupportTicket(ticket: SupportTicket): Promise<boolean> {
  if (!(await usesTable('support'))) return false;
  return dbUpdateSupportTicket(ticket.id, ticketToDb(ticket));
}

export async function contentStoreDeleteSupportTicket(id: string): Promise<boolean> {
  if (!(await usesTable('support'))) return false;
  return dbDeleteSupportTicket(id);
}

export async function contentStoreSendChatMessage(message: ChatMessage, current: ChatState): Promise<{ error?: string }> {
  if (await usesTable('chat')) {
    const ok = await dbInsertChatMessage({
      id: message.id,
      user_id: message.userId,
      user_name: message.userName,
      user_role: message.userRole,
      message: message.text,
      deleted: false,
    });
    return ok ? {} : { error: 'Ошибка отправки сообщения' };
  }
  const next: ChatState = {
    ...current,
    messages: trimChatMessages([...current.messages, message]),
  };
  const { error } = await dbSaveSiteData('chat', next);
  return error ? { error } : {};
}

export async function contentStoreDeleteChatMessage(id: string, current: ChatState): Promise<{ error?: string }> {
  if (await usesTable('chat')) {
    const ok = await dbDeleteChatMessage(id);
    return ok ? {} : { error: 'Ошибка удаления сообщения' };
  }
  const next: ChatState = {
    ...current,
    messages: current.messages.map(m => (m.id === id ? { ...m, deleted: true } : m)),
  };
  const { error } = await dbSaveSiteData('chat', next);
  return error ? { error } : {};
}

export async function contentStoreMuteUser(userId: string, untilMs: number, current: ChatState): Promise<{ error?: string }> {
  if (await usesTable('chat')) {
    const ok = await dbMuteUser(userId, new Date(untilMs).toISOString());
    return ok ? {} : { error: 'Ошибка мута' };
  }
  const next: ChatState = {
    ...current,
    mutedUsers: [...current.mutedUsers.filter(m => m.userId !== userId), { userId, until: untilMs }],
  };
  const { error } = await dbSaveSiteData('chat', next);
  return error ? { error } : {};
}

export async function contentStoreUnmuteUser(userId: string, current: ChatState): Promise<{ error?: string }> {
  if (await usesTable('chat')) {
    const ok = await dbUnmuteUser(userId);
    return ok ? {} : { error: 'Ошибка размута' };
  }
  const next: ChatState = {
    ...current,
    mutedUsers: current.mutedUsers.filter(m => m.userId !== userId),
  };
  const { error } = await dbSaveSiteData('chat', next);
  return error ? { error } : {};
}

export async function contentStoreSaveChatAll(state: ChatState): Promise<{ error?: string }> {
  if (await usesTable('chat')) return {};
  return dbSaveSiteData('chat', state);
}

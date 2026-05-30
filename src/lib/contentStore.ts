import type { GuideArticle, GuideComment, WikiArticle, ChatState, ChatMessage } from '../types/site';
import {
  dbLoadSiteData,
  dbSaveSiteData,
  dbLoadGuides,
  dbInsertGuide,
  dbUpdateGuide,
  dbDeleteGuide,
  dbLoadAllGuideComments,
  dbInsertGuideComment,
  dbDeleteGuideComment,
  dbLoadWikiArticles,
  dbInsertWikiArticle,
  dbUpdateWikiArticle,
  dbDeleteWikiArticle,
  dbLoadChatMessages,
  dbInsertChatMessage,
  dbDeleteChatMessage,
  dbGetMutedUsers,
  dbMuteUser,
  dbUnmuteUser,
  type DbGuide,
  type DbWikiArticle,
} from './db';
import { adaptGuide, adaptWikiArticle, adaptChatMessage } from './adapters';
import { isTableReady } from './tableReady';
import { trimChatMessages } from './chat';

const CHAT_LIMIT = 500;

let guidesNormalized: boolean | null = null;
let wikiNormalized: boolean | null = null;
let chatNormalized: boolean | null = null;
let commentsNormalized: boolean | null = null;

async function usesGuidesTable() {
  if (guidesNormalized === null) guidesNormalized = await isTableReady('guides');
  return guidesNormalized;
}

async function usesWikiTable() {
  if (wikiNormalized === null) wikiNormalized = await isTableReady('wiki_articles');
  return wikiNormalized;
}

async function usesChatTable() {
  if (chatNormalized === null) chatNormalized = await isTableReady('chat_messages');
  return chatNormalized;
}

async function usesCommentsTable() {
  if (commentsNormalized === null) commentsNormalized = await isTableReady('guide_comments');
  return commentsNormalized;
}

function guideToDb(guide: GuideArticle): Omit<DbGuide, 'created_at'> {
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
    updated_at: guide.updatedAt,
  };
}

function wikiToDb(article: WikiArticle): Omit<DbWikiArticle, 'created_at'> {
  return {
    id: article.id,
    section: article.section,
    title: article.title,
    content: article.content,
    icon: article.icon,
    author_name: article.authorName,
    fields: article.fields,
    images: article.images,
    updated_at: article.updatedAt,
  };
}

function commentFromDb(c: { id: string; guide_id: string; user_id: string; user_name: string; text: string; created_at: string; likes?: string[] }): GuideComment {
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

export async function contentStoreUsesNormalized(domain: 'guides' | 'wiki' | 'chat' | 'comments'): Promise<boolean> {
  switch (domain) {
    case 'guides': return usesGuidesTable();
    case 'wiki': return usesWikiTable();
    case 'chat': return usesChatTable();
    case 'comments': return usesCommentsTable();
  }
}

export async function contentStoreLoadGuides(): Promise<GuideArticle[]> {
  if (await usesGuidesTable()) {
    return (await dbLoadGuides()).map(adaptGuide);
  }
  return await dbLoadSiteData<GuideArticle[]>('guides', []);
}

export async function contentStoreLoadWiki(): Promise<WikiArticle[]> {
  if (await usesWikiTable()) {
    return (await dbLoadWikiArticles()).map(adaptWikiArticle);
  }
  return await dbLoadSiteData<WikiArticle[]>('wiki', []);
}

export async function contentStoreLoadGuideComments(): Promise<GuideComment[]> {
  if (await usesCommentsTable()) {
    return (await dbLoadAllGuideComments()).map(commentFromDb);
  }
  return await dbLoadSiteData<GuideComment[]>('guide_comments', []);
}

export async function contentStoreLoadChat(): Promise<ChatState> {
  if (await usesChatTable()) {
    const [messages, mutedUsers] = await Promise.all([
      dbLoadChatMessages(CHAT_LIMIT),
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
  return await dbLoadSiteData<ChatState>('chat', { messages: [], mutedUsers: [] });
}

export async function contentStoreAddGuide(guide: GuideArticle): Promise<boolean> {
  if (!(await usesGuidesTable())) return false;
  return !!(await dbInsertGuide(guideToDb(guide)));
}

export async function contentStoreUpdateGuide(id: string, guide: GuideArticle): Promise<boolean> {
  if (!(await usesGuidesTable())) return false;
  return dbUpdateGuide(id, guideToDb(guide));
}

export async function contentStoreDeleteGuide(id: string): Promise<boolean> {
  if (!(await usesGuidesTable())) return false;
  return dbDeleteGuide(id);
}

export async function contentStoreAddWiki(article: WikiArticle): Promise<boolean> {
  if (!(await usesWikiTable())) return false;
  return !!(await dbInsertWikiArticle(wikiToDb(article)));
}

export async function contentStoreUpdateWiki(id: string, article: WikiArticle): Promise<boolean> {
  if (!(await usesWikiTable())) return false;
  return dbUpdateWikiArticle(id, wikiToDb(article));
}

export async function contentStoreDeleteWiki(id: string): Promise<boolean> {
  if (!(await usesWikiTable())) return false;
  return dbDeleteWikiArticle(id);
}

export async function contentStoreAddGuideComment(comment: GuideComment): Promise<boolean> {
  if (!(await usesCommentsTable())) return false;
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
  if (!(await usesCommentsTable())) return false;
  return dbDeleteGuideComment(id);
}

export async function contentStoreSaveGuideCommentsAll(comments: GuideComment[]): Promise<{ error?: string }> {
  if (await usesCommentsTable()) {
    return {};
  }
  return dbSaveSiteData('guide_comments', comments);
}

export async function contentStoreSendChatMessage(message: ChatMessage, current: ChatState): Promise<{ error?: string }> {
  if (await usesChatTable()) {
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
  if (await usesChatTable()) {
    const ok = await dbDeleteChatMessage(id);
    return ok ? {} : { error: 'Ошибка удаления сообщения' };
  }
  const next: ChatState = {
    ...current,
    messages: current.messages.map(m => m.id === id ? { ...m, deleted: true } : m),
  };
  const { error } = await dbSaveSiteData('chat', next);
  return error ? { error } : {};
}

export async function contentStoreMuteUser(userId: string, untilMs: number, current: ChatState): Promise<{ error?: string }> {
  if (await usesChatTable()) {
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
  if (await usesChatTable()) {
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
  if (await usesChatTable()) return {};
  return dbSaveSiteData('chat', state);
}

import { normalizeWikiArticle } from './wikiNormalize';

import type {
  DbGuide,
  DbWikiArticle,
  DbChatMessage,
  DbSiteNews,
  DbSupportTicket,
  DbGuideVersion,
} from './db';
import type {
  GuideArticle,
  WikiArticle,
  ChatMessage,
  SiteNewsItem,
  SupportTicket,
  GuideVersion,
} from '../types/site';

// Адаптер для гайдов
export function adaptGuide(db: DbGuide): GuideArticle {
  return {
    id: db.id,
    title: db.title,
    category: db.category || '',
    difficulty: db.difficulty || '',
    readTime: db.read_time || '',
    summary: db.summary || '',
    content: db.content || '',
    authorName: db.author_name || '',
    updatedAt: db.updated_at,
    icon: db.icon || '',
    images: db.images,
  };
}

// Адаптер для вики-статей
export function adaptWikiArticle(db: DbWikiArticle): WikiArticle {
  return normalizeWikiArticle({
    id: db.id,
    section: db.section,
    title: db.title,
    content: db.content || '',
    icon: db.icon || '',
    authorName: db.author_name || '',
    updatedAt: db.updated_at,
    fields: db.fields || {},
    images: db.images,
  });
}

// Адаптер для чат-сообщений
export function adaptChatMessage(db: DbChatMessage): ChatMessage {
  return {
    id: db.id,
    userId: db.user_id,
    userName: db.user_name,
    userRole: db.user_role,
    text: db.message,
    timestamp: new Date(db.created_at).getTime(),
    deleted: db.deleted,
  };
}

export function adaptSiteNews(db: DbSiteNews): SiteNewsItem {
  return {
    id: db.id,
    title: db.title,
    summary: db.summary || '',
    content: db.content || '',
    category: db.category || '',
    icon: db.icon || '',
    images: db.images,
    likes: db.likes,
    authorName: db.author_name || '',
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export function adaptSupportTicket(db: DbSupportTicket): SupportTicket {
  return {
    id: db.id,
    userId: db.user_id,
    userName: db.user_name,
    subject: db.subject,
    message: db.message,
    status: db.status as SupportTicket['status'],
    createdAt: db.created_at,
    replies: db.replies || [],
  };
}

export function adaptGuideVersion(db: DbGuideVersion): GuideVersion {
  return {
    id: db.id,
    guideId: db.guide_id,
    title: db.title,
    summary: db.summary || '',
    content: db.content || '',
    category: db.category || '',
    difficulty: db.difficulty || '',
    readTime: db.read_time || '',
    icon: db.icon || '',
    images: db.images,
    savedAt: db.saved_at,
    savedBy: db.saved_by,
  };
}
// Адаптеры типов для совместимости между DB и Frontend

import type { DbGuide, DbWikiArticle, DbChatMessage } from '../lib/db';
import type { GuideArticle, WikiArticle, ChatMessage } from '../types/site';

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
  return {
    id: db.id,
    section: db.section,
    title: db.title,
    content: db.content || '',
    icon: db.icon || '',
    authorName: db.author_name || '',
    updatedAt: db.updated_at,
    fields: db.fields || {},
    images: db.images,
  };
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
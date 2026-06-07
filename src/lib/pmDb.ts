import { getSupabase } from './supabase';
import { dbLoadSiteData, dbSaveSiteData } from './db';
import type { PrivateMessage } from './pm';
import { PM_DELETE_FOR_ALL_MS } from './pm';

/** Превью для списка чатов (не вся история) */
const INBOX_PREVIEW_LIMIT = 100;
/** Сообщений в открытом диалоге */
const THREAD_LIMIT = 120;
const LEGACY_MIGRATE_KEY = 'wwm_pm_table_migrated_v1';

type PmRow = {
  id: string;
  from_id: string;
  from_name: string;
  to_id: string;
  to_name: string;
  text: string;
  created_at: string;
  read: boolean;
  deleted_for_all: boolean;
  hidden_for: string[] | null;
};

function rowToPm(row: PmRow): PrivateMessage {
  return {
    id: row.id,
    fromId: row.from_id,
    fromName: row.from_name,
    toId: row.to_id,
    toName: row.to_name,
    text: row.text,
    timestamp: new Date(row.created_at).getTime(),
    read: row.read,
    deletedForAll: row.deleted_for_all,
    hiddenFor: row.hidden_for || [],
  };
}

function pmToRow(msg: PrivateMessage): PmRow {
  return {
    id: msg.id,
    from_id: msg.fromId,
    from_name: msg.fromName,
    to_id: msg.toId,
    to_name: msg.toName,
    text: msg.text,
    created_at: new Date(msg.timestamp).toISOString(),
    read: msg.read,
    deleted_for_all: !!msg.deletedForAll,
    hidden_for: msg.hiddenFor || [],
  };
}

export async function pmTableExists(): Promise<boolean> {
  const { error } = await getSupabase().from('pm_messages').select('id').limit(1);
  if (!error) return true;
  const msg = error.message.toLowerCase();
  return !msg.includes('does not exist') && !msg.includes('could not find');
}

/** Последние сообщения для списка чатов (лёгкий запрос) */
export async function pmLoadInboxPreview(userId: string): Promise<PrivateMessage[]> {
  const { data, error } = await getSupabase()
    .from('pm_messages')
    .select('*')
    .or(`from_id.eq.${userId},to_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(INBOX_PREVIEW_LIMIT);

  if (error) throw new Error(error.message);
  return (data as PmRow[]).map(rowToPm).reverse();
}

/** История одного диалога — только при открытии чата */
export async function pmLoadThread(userId: string, partnerId: string): Promise<PrivateMessage[]> {
  const { data, error } = await getSupabase()
    .from('pm_messages')
    .select('*')
    .or(
      `and(from_id.eq.${userId},to_id.eq.${partnerId}),and(from_id.eq.${partnerId},to_id.eq.${userId})`,
    )
    .order('created_at', { ascending: true })
    .limit(THREAD_LIMIT);

  if (error) throw new Error(error.message);
  return (data as PmRow[]).map(rowToPm);
}

export async function pmInsertMessage(msg: PrivateMessage): Promise<{ error?: string }> {
  const { error } = await getSupabase().from('pm_messages').insert(pmToRow(msg));
  if (error) return { error: error.message };
  return {};
}

export async function pmMarkRead(userId: string, partnerId: string): Promise<{ error?: string }> {
  const { error } = await getSupabase()
    .from('pm_messages')
    .update({ read: true })
    .eq('to_id', userId)
    .eq('from_id', partnerId)
    .eq('read', false);
  if (error) return { error: error.message };
  return {};
}

export async function pmHideForUser(messageId: string, userId: string): Promise<{ error?: string }> {
  const { data, error: fetchErr } = await getSupabase()
    .from('pm_messages')
    .select('hidden_for')
    .eq('id', messageId)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };
  if (!data) return { error: 'Сообщение не найдено' };

  const hidden = (data.hidden_for || []) as string[];
  if (hidden.includes(userId)) return {};

  const { error } = await getSupabase()
    .from('pm_messages')
    .update({ hidden_for: [...hidden, userId] })
    .eq('id', messageId);

  if (error) return { error: error.message };
  return {};
}

export async function pmDeleteForAll(messageId: string, senderId: string): Promise<{ error?: string }> {
  const { data, error: fetchErr } = await getSupabase()
    .from('pm_messages')
    .select('from_id, created_at, deleted_for_all')
    .eq('id', messageId)
    .maybeSingle();

  if (fetchErr) return { error: fetchErr.message };
  if (!data) return { error: 'Сообщение не найдено' };
  if (data.from_id !== senderId) return { error: 'Можно удалить только свои сообщения' };
  if (data.deleted_for_all) return {};
  if (Date.now() - new Date(data.created_at).getTime() > PM_DELETE_FOR_ALL_MS) {
    return { error: 'Удалить у всех можно в течение 48 часов после отправки' };
  }

  const { error } = await getSupabase()
    .from('pm_messages')
    .update({ deleted_for_all: true, text: '' })
    .eq('id', messageId);

  if (error) return { error: error.message };
  return {};
}

/** "Удалить у всех" целиком диалога: помечаем удалёнными все сообщения между двумя пользователями. */
export async function pmDeleteDialogForAll(userId: string, partnerId: string): Promise<{ error?: string }> {
  const { error } = await getSupabase()
    .from('pm_messages')
    .update({ deleted_for_all: true, text: '' })
    .or(`and(from_id.eq.${userId},to_id.eq.${partnerId}),and(from_id.eq.${partnerId},to_id.eq.${userId})`);
  if (error) return { error: error.message };
  return {};
}

/** Один раз переносит site_data.pm → pm_messages */
export async function pmMigrateLegacyFromSiteData(): Promise<{ migrated: number; skipped: boolean; error?: string }> {
  try {
    if (localStorage.getItem(LEGACY_MIGRATE_KEY) === '1') {
      return { migrated: 0, skipped: true };
    }
  } catch {
    /* ignore */
  }

  const { count, error: countErr } = await getSupabase()
    .from('pm_messages')
    .select('*', { count: 'exact', head: true });

  if (countErr) return { migrated: 0, skipped: false, error: countErr.message };
  if ((count ?? 0) > 0) {
    try { localStorage.setItem(LEGACY_MIGRATE_KEY, '1'); } catch { /* ignore */ }
    return { migrated: 0, skipped: true };
  }

  const legacy = await dbLoadSiteData<PrivateMessage[]>('pm', []);
  if (!Array.isArray(legacy) || legacy.length === 0) {
    try { localStorage.setItem(LEGACY_MIGRATE_KEY, '1'); } catch { /* ignore */ }
    return { migrated: 0, skipped: true };
  }

  const rows = legacy.map(pmToRow);
  const batchSize = 100;
  for (let i = 0; i < rows.length; i += batchSize) {
    const chunk = rows.slice(i, i + batchSize);
    const { error } = await getSupabase().from('pm_messages').insert(chunk);
    if (error) return { migrated: i, skipped: false, error: error.message };
  }

  await dbSaveSiteData('pm', []);
  try { localStorage.setItem(LEGACY_MIGRATE_KEY, '1'); } catch { /* ignore */ }
  return { migrated: rows.length, skipped: false };
}

export async function pmCountUnread(userId: string): Promise<number> {
  const { count, error } = await getSupabase()
    .from('pm_messages')
    .select('*', { count: 'exact', head: true })
    .eq('to_id', userId)
    .eq('read', false)
    .eq('deleted_for_all', false);

  if (error) return 0;
  return count ?? 0;
}

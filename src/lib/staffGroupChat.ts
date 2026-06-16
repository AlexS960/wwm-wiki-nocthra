import { getSupabase } from './supabase';
import { logger } from './logger';

export interface StaffGroupRoom {
  id: string;
  title: string;
  themeId: string;
  createdBy: string;
  createdAt: string;
  memberIds: string[];
}

export interface StaffGroupInboxRow {
  room: StaffGroupRoom;
  lastText: string;
  lastTs: number;
  unreadCount: number;
}

export interface StaffGroupMessage {
  id: string;
  roomId: string;
  fromId: string;
  fromName: string;
  text: string;
  timestamp: number;
  deletedForAll?: boolean;
}

type RoomRow = {
  id: string;
  title: string;
  theme_id: string;
  created_by: string;
  created_at: string;
};

type MemberRow = { room_id: string; user_id: string };
type MsgRow = {
  id: string;
  room_id: string;
  from_id: string;
  from_name: string;
  text: string;
  created_at: string;
  deleted_for_all: boolean;
};

type InboxRpcRow = {
  room_id: string;
  title: string;
  theme_id: string;
  created_by: string;
  created_at: string;
  member_ids: string[];
  last_text: string;
  last_ts: string;
  unread_count: number;
};

let tablesReady: boolean | null = null;

export async function staffGroupTablesExist(): Promise<boolean> {
  if (tablesReady !== null) return tablesReady;
  const { error } = await getSupabase().from('staff_group_rooms').select('id').limit(1);
  if (!error) {
    tablesReady = true;
    return true;
  }
  const msg = error.message.toLowerCase();
  tablesReady = !(msg.includes('does not exist') || msg.includes('could not find'));
  return tablesReady;
}

function rowToRoom(row: RoomRow, memberIds: string[]): StaffGroupRoom {
  return {
    id: row.id,
    title: row.title,
    themeId: row.theme_id || 'purple',
    createdBy: row.created_by,
    createdAt: row.created_at,
    memberIds,
  };
}

function rowToMsg(row: MsgRow): StaffGroupMessage {
  return {
    id: row.id,
    roomId: row.room_id,
    fromId: row.from_id,
    fromName: row.from_name,
    text: row.text,
    timestamp: new Date(row.created_at).getTime(),
    deletedForAll: row.deleted_for_all,
  };
}

/** Один запрос: комнаты + превью + непрочитанные (RPC staff_group_inbox) */
export async function staffLoadGroupInbox(userId: string): Promise<StaffGroupInboxRow[]> {
  if (!(await staffGroupTablesExist())) return [];
  const { data, error } = await getSupabase().rpc('staff_group_inbox', { p_user_id: userId });
  if (!error && data?.length) {
    return (data as InboxRpcRow[]).map(row => ({
      room: {
        id: row.room_id,
        title: row.title,
        themeId: row.theme_id || 'purple',
        createdBy: row.created_by,
        createdAt: row.created_at,
        memberIds: row.member_ids || [],
      },
      lastText: row.last_text || 'Нет сообщений',
      lastTs: new Date(row.last_ts).getTime(),
      unreadCount: Number(row.unread_count) || 0,
    }));
  }
  return staffLoadGroupInboxFallback(userId);
}

async function staffLoadGroupInboxFallback(userId: string): Promise<StaffGroupInboxRow[]> {
  const rooms = await staffLoadUserGroupRooms(userId);
  const rows: StaffGroupInboxRow[] = [];
  for (const room of rooms) {
    const msgs = await staffLoadGroupMessages(room.id, 1);
    const last = msgs[msgs.length - 1];
    rows.push({
      room,
      lastText: last ? last.text : 'Нет сообщений',
      lastTs: last?.timestamp || new Date(room.createdAt).getTime(),
      unreadCount: 0,
    });
  }
  return rows.sort((a, b) => b.lastTs - a.lastTs);
}

export async function staffLoadUserGroupRooms(userId: string): Promise<StaffGroupRoom[]> {
  if (!(await staffGroupTablesExist())) return [];
  const { data: memberships, error: mErr } = await getSupabase()
    .from('staff_group_members')
    .select('room_id')
    .eq('user_id', userId);
  if (mErr || !memberships?.length) return [];
  const roomIds = memberships.map((m: { room_id: string }) => m.room_id);
  const { data: rooms, error: rErr } = await getSupabase()
    .from('staff_group_rooms')
    .select('*')
    .in('id', roomIds)
    .order('created_at', { ascending: false });
  if (rErr || !rooms) return [];
  const { data: allMembers } = await getSupabase()
    .from('staff_group_members')
    .select('room_id, user_id')
    .in('room_id', roomIds);
  const byRoom = new Map<string, string[]>();
  for (const m of (allMembers || []) as MemberRow[]) {
    const list = byRoom.get(m.room_id) || [];
    list.push(m.user_id);
    byRoom.set(m.room_id, list);
  }
  return (rooms as RoomRow[]).map(r => rowToRoom(r, byRoom.get(r.id) || []));
}

export async function staffLoadGroupMessages(roomId: string, limit = 200): Promise<StaffGroupMessage[]> {
  if (!(await staffGroupTablesExist())) return [];
  const { data, error } = await getSupabase()
    .from('staff_group_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) return [];
  return (data as MsgRow[]).map(rowToMsg);
}

export async function staffMarkGroupRead(userId: string, roomId: string): Promise<void> {
  if (!(await staffGroupTablesExist())) return;
  const now = new Date().toISOString();
  const { error } = await getSupabase()
    .from('staff_group_read_state')
    .upsert({ room_id: roomId, user_id: userId, last_read_at: now }, { onConflict: 'room_id,user_id' });
  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('does not exist') || msg.includes('could not find')) return;
    logger.warn('Failed to mark staff group as read', 'staff-group', error.message);
  }
}

export async function staffCreateGroupRoom(params: {
  title: string;
  themeId: string;
  createdBy: string;
  memberIds: string[];
}): Promise<{ room?: StaffGroupRoom; error?: string }> {
  if (!(await staffGroupTablesExist())) {
    return { error: 'Таблицы группового чата не найдены. Выполните supabase/migrations/05_staff_group_chat.sql' };
  }
  const id = 'sg' + Date.now() + Math.random().toString(36).slice(2, 8);
  const members = [...new Set([params.createdBy, ...params.memberIds])];
  const roomRow: RoomRow = {
    id,
    title: params.title.trim() || 'Групповой чат',
    theme_id: params.themeId,
    created_by: params.createdBy,
    created_at: new Date().toISOString(),
  };
  const { error: rErr } = await getSupabase().from('staff_group_rooms').insert(roomRow);
  if (rErr) return { error: rErr.message };
  const memberRows = members.map(uid => ({ room_id: id, user_id: uid }));
  const { error: mErr } = await getSupabase().from('staff_group_members').insert(memberRows);
  if (mErr) return { error: mErr.message };
  return { room: rowToRoom(roomRow, members) };
}

export async function staffAddGroupMembers(roomId: string, userIds: string[]): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц группового чата' };
  const unique = [...new Set(userIds.filter(Boolean))];
  if (!unique.length) return {};
  const rows = unique.map(uid => ({ room_id: roomId, user_id: uid }));
  const { error } = await getSupabase().from('staff_group_members').upsert(rows, {
    onConflict: 'room_id,user_id',
    ignoreDuplicates: true,
  });
  return error ? { error: error.message } : {};
}

export async function staffInsertGroupMessage(msg: StaffGroupMessage): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц группового чата' };
  const { error } = await getSupabase().from('staff_group_messages').insert({
    id: msg.id,
    room_id: msg.roomId,
    from_id: msg.fromId,
    from_name: msg.fromName,
    text: msg.text,
    created_at: new Date(msg.timestamp).toISOString(),
    deleted_for_all: !!msg.deletedForAll,
  });
  return error ? { error: error.message } : {};
}

export async function staffDeleteGroupMessageForAll(
  messageId: string,
  senderId: string,
): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц' };
  const { data, error: fetchErr } = await getSupabase()
    .from('staff_group_messages')
    .select('from_id')
    .eq('id', messageId)
    .maybeSingle();
  if (fetchErr) return { error: fetchErr.message };
  if (!data) return { error: 'Сообщение не найдено' };
  if (data.from_id !== senderId) return { error: 'Можно удалить только свои сообщения' };
  const { error } = await getSupabase()
    .from('staff_group_messages')
    .delete()
    .eq('id', messageId);
  return error ? { error: error.message } : {};
}

export async function staffUpdateRoomTheme(roomId: string, themeId: string): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц' };
  const { error } = await getSupabase().from('staff_group_rooms').update({ theme_id: themeId }).eq('id', roomId);
  return error ? { error: error.message } : {};
}

export async function staffUpdateRoomTitle(roomId: string, title: string): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц' };
  const trimmed = title.trim();
  if (!trimmed) return { error: 'Введите название' };
  const { error } = await getSupabase().from('staff_group_rooms').update({ title: trimmed }).eq('id', roomId);
  return error ? { error: error.message } : {};
}

export async function staffLeaveGroupRoom(userId: string, roomId: string): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц' };
  const { error } = await getSupabase()
    .from('staff_group_members')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);
  return error ? { error: error.message } : {};
}

export async function staffDeleteGroupRoom(roomId: string): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц' };
  const { error } = await getSupabase().from('staff_group_rooms').delete().eq('id', roomId);
  return error ? { error: error.message } : {};
}

export function subscribeStaffGroupMessages(roomId: string, onMessage: () => void): () => void {
  const channel = getSupabase()
    .channel(`staff-group-${roomId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'staff_group_messages', filter: `room_id=eq.${roomId}` },
      () => onMessage(),
    )
    .subscribe();
  return () => {
    void getSupabase().removeChannel(channel);
  };
}

/** Обновление списка чатов при новых сообщениях в любой группе пользователя */
export function subscribeStaffGroupInbox(userId: string, onChange: () => void): () => void {
  const channel = getSupabase()
    .channel(`staff-group-inbox-${userId}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'staff_group_messages' },
      () => onChange(),
    )
    .subscribe();
  return () => {
    void getSupabase().removeChannel(channel);
  };
}

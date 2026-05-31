import { getSupabase } from './supabase';

export interface StaffGroupRoom {
  id: string;
  title: string;
  themeId: string;
  createdBy: string;
  createdAt: string;
  memberIds: string[];
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

export async function staffCreateGroupRoom(params: {
  title: string;
  themeId: string;
  createdBy: string;
  memberIds: string[];
}): Promise<{ room?: StaffGroupRoom; error?: string }> {
  if (!(await staffGroupTablesExist())) {
    return { error: 'Таблицы группового чата не найдены. Выполните supabase/staff-group-chat-setup.sql' };
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

/** Удалить чат только у себя (выйти из группы) */
export async function staffLeaveGroupRoom(userId: string, roomId: string): Promise<{ error?: string }> {
  if (!(await staffGroupTablesExist())) return { error: 'Нет таблиц' };
  const { error } = await getSupabase()
    .from('staff_group_members')
    .delete()
    .eq('room_id', roomId)
    .eq('user_id', userId);
  return error ? { error: error.message } : {};
}

/** Удалить групповой чат у всех участников */
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

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  isStaffChatRole,
  staffDmChatKey,
  staffGroupChatKey,
  parseStaffChatKey,
  getStaffChatThemeStorageKey,
  staffRoleFilterOptions,
  canDeleteStaffGroupForAll,
} from '../lib/staffChat';
import { dbListStaffAccounts, type DbAccount } from '../lib/db';
import { filterPmForUser, getPmPreviewText } from '../lib/pm';
import {
  staffLoadGroupInbox,
  staffLoadGroupMessages,
  staffCreateGroupRoom,
  staffInsertGroupMessage,
  staffUpdateRoomTheme,
  staffUpdateRoomTitle,
  staffLeaveGroupRoom,
  staffDeleteGroupRoom,
  staffMarkGroupRead,
  staffAddGroupMembers,
  staffDeleteGroupMessageForAll,
  subscribeStaffGroupMessages,
  subscribeStaffGroupInbox,
  type StaffGroupRoom,
  type StaffGroupMessage,
} from '../lib/staffGroupChat';
import type { StaffMemberView, StaffConversation } from '../components/staffChat/types';

function accountToStaffView(
  a: DbAccount,
  getRoleConfig: (r: string) => { displayName: string; color: string },
): StaffMemberView {
  const rc = getRoleConfig(a.role);
  return {
    id: a.id,
    username: a.username,
    displayName: a.game_nickname?.trim() || a.username,
    role: a.role,
    roleName: rc.displayName,
    roleColor: rc.color,
    picture: a.picture || '',
  };
}

function loadDmThemesFromStorage(keys: string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of keys) {
    try {
      const v = localStorage.getItem(getStaffChatThemeStorageKey(key));
      if (v) out[key] = v;
    } catch { /* ignore */ }
  }
  return out;
}

export function useStaffChat() {
  const {
    user,
    siteSettings,
    privateMessages,
    pmLoaded,
    sendStaffPrivateMessage,
    markPMRead,
    loadPmThread,
    deletePmDialogForMe,
    deletePmDialogForAll,
    getUserDisplayName,
    getRoleConfig,
    refreshAccounts,
  } = useAuth();

  const [staffList, setStaffList] = useState<StaffMemberView[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [groupRooms, setGroupRooms] = useState<StaffGroupRoom[]>([]);
  const [groupPreviews, setGroupPreviews] = useState<Record<string, { text: string; ts: number; unread: number }>>({});
  const [groupMessages, setGroupMessages] = useState<Record<string, StaffGroupMessage[]>>({});

  const [sidebarTab, setSidebarTab] = useState<'chats' | 'team'>('chats');
  const [search, setSearch] = useState('');
  const [activeChatKey, setActiveChatKey] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [dmThemes, setDmThemes] = useState<Record<string, string>>({});
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogMenu, setDialogMenu] = useState<{ chatKey: string; x: number; y: number } | null>(null);
  const [editingGroupTitle, setEditingGroupTitle] = useState(false);
  const [groupTitleDraft, setGroupTitleDraft] = useState('');
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    setLoadError(null);
    try {
      await refreshAccounts();
      const accs = await dbListStaffAccounts(siteSettings.roles);
      setStaffList(accs.map(a => accountToStaffView(a, getRoleConfig)));
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Не удалось загрузить команду');
    } finally {
      setStaffLoading(false);
    }
  }, [getRoleConfig, refreshAccounts, siteSettings.roles]);

  const loadGroups = useCallback(async () => {
    if (!user) return;
    try {
      const inbox = await staffLoadGroupInbox(user.id);
      setGroupRooms(inbox.map(r => r.room));
      const previews: Record<string, { text: string; ts: number; unread: number }> = {};
      for (const row of inbox) {
        previews[row.room.id] = { text: row.lastText, ts: row.lastTs, unread: row.unreadCount };
      }
      setGroupPreviews(previews);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Не удалось загрузить группы');
    }
  }, [user?.id]);

  useEffect(() => {
    void loadStaff();
    void loadGroups();
  }, [loadStaff, loadGroups]);

  useEffect(() => {
    if (!user) return;
    return subscribeStaffGroupInbox(user.id, () => {
      void loadGroups();
    });
  }, [user?.id, loadGroups]);

  const staffById = useMemo(() => new Map(staffList.map(s => [s.id, s])), [staffList]);

  const myMessages = useMemo(
    () => (user ? filterPmForUser(privateMessages, user.id) : []),
    [privateMessages, user?.id],
  );

  const getThemeForChat = useCallback((key: string, defaultTheme = 'purple') => {
    const parsed = parseStaffChatKey(key);
    if (parsed?.type === 'group') {
      const room = groupRooms.find(r => r.id === parsed.roomId);
      return room?.themeId || defaultTheme;
    }
    return dmThemes[key] || defaultTheme;
  }, [groupRooms, dmThemes]);

  useEffect(() => {
    const dmKeys = myMessages.map(m => {
      const otherId = m.fromId === user?.id ? m.toId : m.fromId;
      return staffDmChatKey(otherId);
    });
    setDmThemes(prev => ({ ...loadDmThemesFromStorage([...new Set(dmKeys)]), ...prev }));
  }, [myMessages.length, user?.id]);

  const setThemeForChat = useCallback(async (key: string, themeId: string) => {
    const parsed = parseStaffChatKey(key);
    if (parsed?.type === 'group') {
      await staffUpdateRoomTheme(parsed.roomId, themeId);
      setGroupRooms(prev => prev.map(r => r.id === parsed.roomId ? { ...r, themeId } : r));
    } else {
      try {
        localStorage.setItem(getStaffChatThemeStorageKey(key), themeId);
      } catch { /* ignore */ }
      setDmThemes(prev => ({ ...prev, [key]: themeId }));
    }
    setShowThemePicker(false);
  }, []);

  const conversations = useMemo((): StaffConversation[] => {
    if (!user) return [];
    const staffIds = new Set(staffList.map(s => s.id));
    const items: StaffConversation[] = [];

    for (const room of groupRooms) {
      const prev = groupPreviews[room.id];
      items.push({
        key: staffGroupChatKey(room.id),
        type: 'group',
        title: room.title,
        subtitle: `${room.memberIds.length} участников`,
        lastMsg: prev?.text || 'Групповой чат',
        ts: prev?.ts || new Date(room.createdAt).getTime(),
        unread: prev?.unread || 0,
        themeId: room.themeId,
        roomId: room.id,
        memberCount: room.memberIds.length,
      });
    }

    const dmMap = new Map<string, StaffConversation>();
    for (const m of myMessages) {
      const otherId = m.fromId === user.id ? m.toId : m.fromId;
      if (!staffIds.has(otherId)) continue;
      const preview = getPmPreviewText(m, user.id);
      if (!preview && !m.deletedForAll) continue;
      const s = staffById.get(otherId);
      const line = preview || 'Сообщение удалено';
      const existing = dmMap.get(otherId);
      if (existing) {
        if (m.timestamp > existing.ts) {
          existing.lastMsg = line;
          existing.ts = m.timestamp;
        }
        if (m.toId === user.id && !m.read && !m.deletedForAll) existing.unread++;
      } else {
        dmMap.set(otherId, {
          key: staffDmChatKey(otherId),
          type: 'dm',
          title: s?.displayName || getUserDisplayName(otherId, m.fromId === user.id ? m.toName : m.fromName),
          subtitle: s?.roleName,
          lastMsg: line,
          ts: m.timestamp,
          unread: m.toId === user.id && !m.read && !m.deletedForAll ? 1 : 0,
          themeId: getThemeForChat(staffDmChatKey(otherId)),
          partnerId: otherId,
        });
      }
    }
    items.push(...dmMap.values());
    return items.sort((a, b) => b.ts - a.ts);
  }, [user, staffList, groupRooms, groupPreviews, myMessages, staffById, getUserDisplayName, getThemeForChat]);

  const filteredConversations = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(c => c.title.toLowerCase().includes(q) || c.lastMsg.toLowerCase().includes(q));
  }, [conversations, search]);

  const roleOptions = useMemo(
    () => staffRoleFilterOptions(staffList, siteSettings.roles),
    [staffList, siteSettings.roles],
  );

  const filteredTeam = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = staffList.filter(s => s.id !== user?.id);
    if (roleFilter !== 'all') list = list.filter(s => s.role === roleFilter);
    if (!q) return list;
    return list.filter(s =>
      s.displayName.toLowerCase().includes(q)
      || s.username.toLowerCase().includes(q)
      || s.roleName.toLowerCase().includes(q),
    );
  }, [staffList, search, user?.id, roleFilter]);

  const activeParsed = activeChatKey ? parseStaffChatKey(activeChatKey) : null;

  const activeDmMsgs = useMemo(() => {
    if (!user || activeParsed?.type !== 'dm') return [];
    const partnerId = activeParsed.partnerId;
    return myMessages
      .filter(m => (m.fromId === user.id && m.toId === partnerId) || (m.fromId === partnerId && m.toId === user.id))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [myMessages, user, activeParsed]);

  const activeGroupMsgs = activeParsed?.type === 'group'
    ? (groupMessages[activeParsed.roomId] || [])
    : [];

  const activeRoom = activeParsed?.type === 'group'
    ? groupRooms.find(r => r.id === activeParsed.roomId)
    : undefined;

  const selectChat = useCallback((key: string) => {
    setActiveChatKey(key);
    setMobileShowChat(true);
    setSendError(null);
    const parsed = parseStaffChatKey(key);
    if (parsed?.type === 'dm') {
      void loadPmThread(parsed.partnerId);
      void markPMRead(parsed.partnerId);
    } else if (parsed?.type === 'group' && user) {
      void staffMarkGroupRead(user.id, parsed.roomId);
      setGroupPreviews(prev => {
        const cur = prev[parsed.roomId];
        return {
          ...prev,
          [parsed.roomId]: {
            text: cur?.text || 'Групповой чат',
            ts: cur?.ts || Date.now(),
            unread: 0,
          },
        };
      });
      void staffLoadGroupMessages(parsed.roomId).then(msgs => {
        setGroupMessages(prev => ({ ...prev, [parsed.roomId]: msgs }));
      });
    }
  }, [loadPmThread, markPMRead, user?.id]);

  const activeRoomId = activeParsed?.type === 'group' ? activeParsed.roomId : null;

  useEffect(() => {
    if (!activeRoomId) return;
    return subscribeStaffGroupMessages(activeRoomId, () => {
      void staffLoadGroupMessages(activeRoomId).then(msgs => {
        setGroupMessages(prev => ({ ...prev, [activeRoomId]: msgs }));
        const last = msgs[msgs.length - 1];
        if (last && user) {
          setGroupPreviews(prev => ({
            ...prev,
            [activeRoomId]: {
              text: last.deletedForAll ? 'Сообщение удалено' : last.text,
              ts: last.timestamp,
              unread: last.fromId === user.id ? 0 : (prev[activeRoomId]?.unread || 0),
            },
          }));
          if (activeChatKey === staffGroupChatKey(activeRoomId)) {
            void staffMarkGroupRead(user.id, activeRoomId);
          }
        }
      });
    });
  }, [activeRoomId, user?.id, activeChatKey]);

  useEffect(() => {
    if (messagesScrollRef.current) {
      messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
    }
  }, [activeDmMsgs.length, activeGroupMsgs.length, activeChatKey]);

  const handleSend = useCallback(async () => {
    if (!text.trim() || !activeChatKey || !user || sending) return;
    setSending(true);
    setSendError(null);

    if (activeParsed?.type === 'dm') {
      const err = await sendStaffPrivateMessage(activeParsed.partnerId, text.trim());
      setSending(false);
      if (err) setSendError(err);
      else setText('');
      return;
    }

    if (activeParsed?.type === 'group') {
      const msg: StaffGroupMessage = {
        id: 'sgm' + Date.now(),
        roomId: activeParsed.roomId,
        fromId: user.id,
        fromName: user.gameNickname?.trim() || user.name,
        text: text.trim(),
        timestamp: Date.now(),
      };
      const prev = groupMessages[activeParsed.roomId] || [];
      setGroupMessages(p => ({ ...p, [activeParsed.roomId]: [...prev, msg] }));
      const { error } = await staffInsertGroupMessage(msg);
      setSending(false);
      if (error) {
        setGroupMessages(p => ({ ...p, [activeParsed.roomId]: prev }));
        setSendError(error);
      } else {
        setText('');
        setGroupPreviews(p => ({
          ...p,
          [activeParsed.roomId]: { text: msg.text, ts: msg.timestamp, unread: 0 },
        }));
      }
    }
  }, [text, activeChatKey, user, sending, activeParsed, sendStaffPrivateMessage, groupMessages]);

  const handleCreateGroup = useCallback(async (title: string, themeId: string, memberIds: string[]) => {
    if (!user) return 'Войдите в аккаунт';
    const { room, error } = await staffCreateGroupRoom({
      title,
      themeId,
      createdBy: user.id,
      memberIds,
    });
    if (error) return error;
    if (room) {
      await loadGroups();
      selectChat(staffGroupChatKey(room.id));
    }
    return null;
  }, [user, loadGroups, selectChat]);

  const handleAddMembers = useCallback(async (roomId: string, memberIds: string[]) => {
    const { error } = await staffAddGroupMembers(roomId, memberIds);
    if (error) return error;
    await loadGroups();
    if (activeParsed?.type === 'group' && activeParsed.roomId === roomId) {
      const msgs = await staffLoadGroupMessages(roomId);
      setGroupMessages(prev => ({ ...prev, [roomId]: msgs }));
    }
    return null;
  }, [loadGroups, activeParsed]);

  const handleDeleteGroupMessage = useCallback(async (messageId: string) => {
    if (!user) return 'Войдите в аккаунт';
    const err = (await staffDeleteGroupMessageForAll(messageId, user.id)).error;
    if (err) return err;
    if (activeParsed?.type === 'group') {
      const msgs = await staffLoadGroupMessages(activeParsed.roomId);
      setGroupMessages(prev => ({ ...prev, [activeParsed.roomId]: msgs }));
    }
    return null;
  }, [user, activeParsed]);

  const handleDeleteDialogForMe = useCallback(async (chatKey: string) => {
    setDialogMenu(null);
    if (!user) return;
    const parsed = parseStaffChatKey(chatKey);
    if (!parsed) return;
    if (parsed.type === 'dm') {
      const err = await deletePmDialogForMe(parsed.partnerId);
      if (err) setSendError(err);
      else if (activeChatKey === chatKey) setActiveChatKey(null);
    } else {
      const err = await staffLeaveGroupRoom(user.id, parsed.roomId);
      if (err) setSendError(err);
      else {
        await loadGroups();
        if (activeChatKey === chatKey) setActiveChatKey(null);
      }
    }
  }, [user, deletePmDialogForMe, activeChatKey, loadGroups]);

  const handleDeleteDialogForAll = useCallback(async (chatKey: string) => {
    setDialogMenu(null);
    const parsed = parseStaffChatKey(chatKey);
    if (!parsed || !user) return;
    const ok = window.confirm(
      parsed.type === 'dm'
        ? 'Удалить весь диалог у всех? Переписка будет удалена у вас и у собеседника.'
        : 'Удалить групповой чат у всех участников? Это действие нельзя отменить.',
    );
    if (!ok) return;
    if (parsed.type === 'dm') {
      const err = await deletePmDialogForAll(parsed.partnerId);
      if (err) setSendError(err);
      else if (activeChatKey === chatKey) setActiveChatKey(null);
    } else {
      const room = groupRooms.find(r => r.id === parsed.roomId);
      if (!room || !canDeleteStaffGroupForAll(user.id, user.role, room, siteSettings.roles)) {
        setSendError('Удалить группу у всех может только создатель или администратор');
        return;
      }
      const err = (await staffDeleteGroupRoom(parsed.roomId)).error;
      if (err) setSendError(err);
      else {
        await loadGroups();
        if (activeChatKey === chatKey) setActiveChatKey(null);
      }
    }
  }, [user, deletePmDialogForAll, activeChatKey, groupRooms, siteSettings.roles]);

  const saveGroupTitle = useCallback(async () => {
    if (!activeParsed || activeParsed.type !== 'group') return;
    const err = (await staffUpdateRoomTitle(activeParsed.roomId, groupTitleDraft)).error;
    if (err) setSendError(err);
    else {
      setGroupRooms(prev => prev.map(r => r.id === activeParsed.roomId ? { ...r, title: groupTitleDraft.trim() } : r));
      setEditingGroupTitle(false);
    }
  }, [activeParsed, groupTitleDraft]);

  const openDialogMenu = useCallback((e: React.MouseEvent, chatKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDialogMenu({ chatKey, x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    if (!dialogMenu) return;
    const close = () => setDialogMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [dialogMenu]);

  const activeConv = conversations.find(c => c.key === activeChatKey);

  return {
    user,
    siteSettings,
    staffList,
    staffLoading,
    loadError,
    pmLoaded,
    sidebarTab,
    setSidebarTab,
    search,
    setSearch,
    activeChatKey,
    mobileShowChat,
    setMobileShowChat,
    text,
    setText,
    sending,
    sendError,
    setSendError,
    showCreateGroup,
    setShowCreateGroup,
    showThemePicker,
    setShowThemePicker,
    showMembersModal,
    setShowMembersModal,
    roleFilter,
    setRoleFilter,
    dialogMenu,
    editingGroupTitle,
    setEditingGroupTitle,
    groupTitleDraft,
    setGroupTitleDraft,
    messagesScrollRef,
    filteredConversations,
    filteredTeam,
    roleOptions,
    activeParsed,
    activeDmMsgs,
    activeGroupMsgs,
    activeRoom,
    activeConv,
    getThemeForChat,
    setThemeForChat,
    selectChat,
    handleSend,
    handleCreateGroup,
    handleAddMembers,
    handleDeleteGroupMessage,
    handleDeleteDialogForMe,
    handleDeleteDialogForAll,
    saveGroupTitle,
    openDialogMenu,
    staffById,
    getUserDisplayName,
    getRoleConfig,
    groupRooms,
  };
}

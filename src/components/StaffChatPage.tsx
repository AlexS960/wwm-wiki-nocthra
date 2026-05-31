import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowLeft, MessageSquare, Search, ShieldAlert, Users, UsersRound, Palette } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  canAccessStaffChat,
  isStaffChatRole,
  staffDmChatKey,
  staffGroupChatKey,
  parseStaffChatKey,
  getStaffChatThemeStorageKey,
  normalizeStaffRole,
} from '../lib/staffChat';
import { dbListStaffAccounts, type DbAccount } from '../lib/db';
import type { PrivateMessage } from '../lib/pm';
import { filterPmForUser, getPmPreviewText } from '../lib/pm';
import { getDisplayName } from '../lib/displayName';
import { renderBBCode } from '../lib/bbcode';
import {
  staffLoadUserGroupRooms,
  staffLoadGroupMessages,
  staffCreateGroupRoom,
  staffInsertGroupMessage,
  staffUpdateRoomTheme,
  subscribeStaffGroupMessages,
  type StaffGroupRoom,
  type StaffGroupMessage,
} from '../lib/staffGroupChat';
import StaffChatComposer from './staffChat/StaffChatComposer';
import CreateGroupModal from './staffChat/CreateGroupModal';
import { getStaffChatTheme, STAFF_CHAT_THEMES } from './staffChat/staffChatThemes';
import type { StaffMemberView, StaffConversation } from './staffChat/types';

interface StaffChatPageProps {
  onBack: () => void;
  onLoginClick: () => void;
}

function formatListTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

function accountToStaffView(a: DbAccount, getRoleConfig: (r: string) => { displayName: string; color: string }): StaffMemberView {
  const role = normalizeStaffRole(a.role) || a.role;
  const rc = getRoleConfig(role);
  return {
    id: a.id,
    username: a.username,
    displayName: a.game_nickname?.trim() || a.username,
    role,
    roleName: rc.displayName,
    roleColor: rc.color,
    picture: a.picture || '',
  };
}

export default function StaffChatPage({ onBack, onLoginClick }: StaffChatPageProps) {
  const {
    user,
    privateMessages,
    pmLoaded,
    sendPrivateMessage,
    markPMRead,
    loadPmThread,
    getUserDisplayName,
    getRoleConfig,
    refreshAccounts,
  } = useAuth();

  const [staffList, setStaffList] = useState<StaffMemberView[]>([]);
  const [staffLoading, setStaffLoading] = useState(true);
  const [groupRooms, setGroupRooms] = useState<StaffGroupRoom[]>([]);
  const [groupMessages, setGroupMessages] = useState<Record<string, StaffGroupMessage[]>>({});
  const [groupPreviews, setGroupPreviews] = useState<Record<string, { text: string; ts: number }>>({});

  const [sidebarTab, setSidebarTab] = useState<'chats' | 'team'>('chats');
  const [search, setSearch] = useState('');
  const [activeChatKey, setActiveChatKey] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [dmThemes, setDmThemes] = useState<Record<string, string>>({});
  const messagesScrollRef = useRef<HTMLDivElement>(null);

  const loadStaff = useCallback(async () => {
    setStaffLoading(true);
    try {
      await refreshAccounts();
      const accs = await dbListStaffAccounts();
      const views = accs
        .filter(a => isStaffChatRole(a.role))
        .map(a => accountToStaffView(a, getRoleConfig));
      setStaffList(views);
    } finally {
      setStaffLoading(false);
    }
  }, [getRoleConfig, refreshAccounts]);

  const loadGroups = useCallback(async () => {
    if (!user) return;
    const rooms = await staffLoadUserGroupRooms(user.id);
    setGroupRooms(rooms);
    const previews: Record<string, { text: string; ts: number }> = {};
    await Promise.all(
      rooms.map(async room => {
        const msgs = await staffLoadGroupMessages(room.id, 1);
        const last = msgs[msgs.length - 1];
        if (last) previews[room.id] = { text: last.deletedForAll ? 'Сообщение удалено' : last.text, ts: last.timestamp };
        else previews[room.id] = { text: 'Нет сообщений', ts: new Date(room.createdAt).getTime() };
      }),
    );
    setGroupPreviews(previews);
  }, [user?.id]);

  useEffect(() => {
    void loadStaff();
    void loadGroups();
  }, [loadStaff, loadGroups]);

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
    return dmThemes[key] || (() => {
      try {
        return localStorage.getItem(getStaffChatThemeStorageKey(key)) || defaultTheme;
      } catch {
        return defaultTheme;
      }
    })();
  }, [groupRooms, dmThemes]);

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
        unread: 0,
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

  const filteredTeam = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = staffList.filter(s => s.id !== user?.id);
    if (!q) return list;
    return list.filter(s =>
      s.displayName.toLowerCase().includes(q)
      || s.username.toLowerCase().includes(q)
      || s.roleName.toLowerCase().includes(q),
    );
  }, [staffList, search, user?.id]);

  const activeParsed = activeChatKey ? parseStaffChatKey(activeChatKey) : null;
  const activeTheme = activeChatKey ? getStaffChatTheme(getThemeForChat(activeChatKey)) : getStaffChatTheme('purple');

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

  const selectChat = useCallback((key: string) => {
    setActiveChatKey(key);
    setMobileShowChat(true);
    setSendError(null);
    const parsed = parseStaffChatKey(key);
    if (parsed?.type === 'dm') {
      void loadPmThread(parsed.partnerId);
      void markPMRead(parsed.partnerId);
    } else if (parsed?.type === 'group') {
      void staffLoadGroupMessages(parsed.roomId).then(msgs => {
        setGroupMessages(prev => ({ ...prev, [parsed.roomId]: msgs }));
      });
    }
  }, [loadPmThread, markPMRead]);

  useEffect(() => {
    if (!activeParsed || activeParsed.type !== 'group') return;
    return subscribeStaffGroupMessages(activeParsed.roomId, () => {
      void staffLoadGroupMessages(activeParsed.roomId).then(msgs => {
        setGroupMessages(prev => ({ ...prev, [activeParsed.roomId]: msgs }));
        const last = msgs[msgs.length - 1];
        if (last) {
          setGroupPreviews(prev => ({
            ...prev,
            [activeParsed.roomId]: { text: last.deletedForAll ? 'Сообщение удалено' : last.text, ts: last.timestamp },
          }));
        }
      });
    });
  }, [activeParsed?.type === 'group' ? activeParsed.roomId : null]);

  useEffect(() => {
    messagesScrollRef.current && (messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight);
  }, [activeDmMsgs.length, activeGroupMsgs.length, activeChatKey]);

  const handleSend = async () => {
    if (!text.trim() || !activeChatKey || !user || sending) return;
    setSending(true);
    setSendError(null);

    if (activeParsed?.type === 'dm') {
      const partner = staffById.get(activeParsed.partnerId);
      if (!partner) {
        setSendError('Собеседник не в списке команды');
        setSending(false);
        return;
      }
      const err = await sendPrivateMessage(activeParsed.partnerId, text.trim());
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
        setGroupPreviews(p => ({ ...p, [activeParsed.roomId]: { text: msg.text, ts: msg.timestamp } }));
      }
    }
  };

  const handleCreateGroup = async (title: string, themeId: string, memberIds: string[]) => {
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
  };

  const renderMessage = (body: string, isSelf: boolean, fromLabel?: string, deleted?: boolean) => (
    <div className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[min(85%,28rem)] rounded-2xl px-3.5 py-2 text-sm ${isSelf ? activeTheme.selfBubble : activeTheme.otherBubble} ${deleted ? 'opacity-75 italic' : ''}`}>
        {!isSelf && fromLabel && <p className={`text-[10px] mb-1 ${activeTheme.accent}`}>{fromLabel}</p>}
        {deleted ? (
          <span className="text-ink-500">Сообщение удалено</span>
        ) : (
          <div className="break-words whitespace-pre-wrap">
            {renderBBCode(body, {
              linkClassName: 'text-blue-300 underline break-all',
              quoteClassName: 'border-l-2 border-purple-400/40 pl-2 italic text-ink-300',
              codeClassName: 'font-mono text-xs bg-ink-900/50 px-1 rounded',
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] pt-16 md:pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <MessageSquare className="w-14 h-14 text-purple-400/50 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-white mb-2">Служебный чат</h2>
          <p className="text-ink-400 text-sm mb-6">Войдите в аккаунт</p>
          <button type="button" onClick={onLoginClick} className="px-6 py-2.5 bg-purple-500/20 text-purple-300 rounded-lg cursor-pointer">Войти</button>
        </div>
      </div>
    );
  }

  if (!canAccessStaffChat(user)) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] pt-16 md:pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-14 h-14 text-crimson-400 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-white mb-2">Доступ ограничен</h2>
          <p className="text-ink-400 text-sm mb-6">Доступно для: Администратор, Гильдмастер, Редактор, Модератор.</p>
          <button type="button" onClick={onBack} className="px-6 py-2.5 bg-gold-400/20 text-gold-400 rounded-lg cursor-pointer">На главную</button>
        </div>
      </div>
    );
  }

  const sidebarClass = mobileShowChat ? 'hidden md:flex' : 'flex';
  const mainClass = mobileShowChat ? 'flex' : 'hidden md:flex';
  const activeConv = conversations.find(c => c.key === activeChatKey);

  return (
    <div className="h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] pt-16 md:pt-20 flex flex-col bg-ink-900/40">
      <div className="shrink-0 px-3 sm:px-4 py-2 border-b border-ink-700/40 flex items-center gap-3 bg-ink-900/80">
        <button type="button" onClick={onBack} className="p-2 rounded-lg text-ink-400 hover:text-gold-400 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <MessageSquare className="w-5 h-5 text-purple-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-lg font-bold text-white truncate">Служебный чат</h1>
          <p className="text-[11px] text-ink-500">{staffList.length} в команде · {groupRooms.length} групп</p>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 max-w-7xl w-full mx-auto border-x border-ink-700/30">
        <aside className={`${sidebarClass} w-full md:w-[340px] lg:w-[400px] shrink-0 flex-col border-r border-ink-700/40 bg-ink-900/60`}>
          <div className="flex border-b border-ink-700/40">
            <button
              type="button"
              onClick={() => setSidebarTab('chats')}
              className={`flex-1 py-2.5 text-xs font-medium cursor-pointer ${sidebarTab === 'chats' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-ink-400'}`}
            >
              Чаты
            </button>
            <button
              type="button"
              onClick={() => setSidebarTab('team')}
              className={`flex-1 py-2.5 text-xs font-medium cursor-pointer ${sidebarTab === 'team' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-ink-400'}`}
            >
              Команда ({staffList.length})
            </button>
          </div>

          <div className="p-3 border-b border-ink-700/30 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={sidebarTab === 'team' ? 'Поиск по имени или роли…' : 'Поиск чатов…'}
                className="w-full bg-ink-800/80 border border-ink-700/50 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/40"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowCreateGroup(true)}
              className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 cursor-pointer shrink-0"
              title="Групповой чат"
            >
              <UsersRound className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {sidebarTab === 'team' ? (
              staffLoading ? (
                <p className="text-ink-500 text-sm text-center py-8">Загрузка команды…</p>
              ) : filteredTeam.length === 0 ? (
                <p className="text-ink-500 text-sm text-center py-8 px-4">Никого не найдено</p>
              ) : (
                filteredTeam.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectChat(staffDmChatKey(s.id))}
                    className={`w-full flex items-center gap-3 px-3 py-3 cursor-pointer text-left border-b border-ink-800/50 hover:bg-ink-800/40 ${
                      activeChatKey === staffDmChatKey(s.id) ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-ink-700 flex items-center justify-center text-base font-bold shrink-0" style={{ color: s.roleColor }}>
                      {s.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-white truncate">{s.displayName}</div>
                      <div className="text-xs truncate" style={{ color: s.roleColor }}>{s.roleName}</div>
                      <div className="text-[10px] text-ink-500 truncate">@{s.username}</div>
                    </div>
                  </button>
                ))
              )
            ) : !pmLoaded && staffLoading ? (
              <p className="text-ink-500 text-sm text-center py-8">Загрузка…</p>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-ink-500 text-sm mb-3">Нет чатов. Откройте вкладку «Команда» или создайте группу.</p>
                <button type="button" onClick={() => setSidebarTab('team')} className="text-purple-400 text-xs cursor-pointer hover:underline">
                  Список команды
                </button>
              </div>
            ) : (
              filteredConversations.map(chat => {
                const active = activeChatKey === chat.key;
                return (
                  <button
                    key={chat.key}
                    type="button"
                    onClick={() => selectChat(chat.key)}
                    className={`w-full flex items-center gap-3 px-3 py-3 cursor-pointer text-left border-b border-ink-800/50 transition-colors ${
                      active ? 'bg-purple-500/10' : 'hover:bg-ink-800/40'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${chat.type === 'group' ? 'bg-purple-500/20' : 'bg-ink-700'}`}>
                      {chat.type === 'group' ? <Users className="w-5 h-5 text-purple-400" /> : (
                        <span className="text-base font-bold text-purple-300">{chat.title.charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="text-sm font-medium text-white truncate">{chat.title}</span>
                        <span className="text-[10px] text-ink-500 shrink-0">{formatListTime(chat.ts)}</span>
                      </div>
                      <div className="flex justify-between gap-2 mt-0.5">
                        <span className="text-xs text-ink-400 truncate">{chat.lastMsg}</span>
                        {chat.unread > 0 && (
                          <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                            {chat.unread > 9 ? '9+' : chat.unread}
                          </span>
                        )}
                      </div>
                      {chat.subtitle && <span className="text-[10px] text-ink-500">{chat.subtitle}</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className={`${mainClass} flex-1 flex-col min-w-0 ${activeTheme.panelBg}`}>
          {!activeChatKey ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageSquare className="w-16 h-16 text-ink-700 mb-4" />
              <p className="text-ink-400 text-sm">Выберите чат или участника команды</p>
            </div>
          ) : (
            <>
              <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-ink-700/40 bg-ink-800/50 relative">
                <button type="button" className="md:hidden p-1.5 text-ink-400 hover:text-white cursor-pointer" onClick={() => setMobileShowChat(false)}>
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0 flex-1">
                  <div className="text-white font-medium truncate">{activeConv?.title || 'Чат'}</div>
                  {activeConv?.subtitle && <div className="text-xs text-ink-400 truncate">{activeConv.subtitle}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => setShowThemePicker(v => !v)}
                  className={`p-2 rounded-lg cursor-pointer ${activeTheme.accentSoft} ${activeTheme.accent}`}
                  title="Тема чата"
                >
                  <Palette className="w-4 h-4" />
                </button>
                {showThemePicker && (
                  <div className="absolute right-4 top-full mt-1 z-40 p-2 bg-ink-900 border border-ink-700/50 rounded-xl shadow-xl grid grid-cols-2 gap-1 min-w-[200px]">
                    {STAFF_CHAT_THEMES.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => void setThemeForChat(activeChatKey, t.id)}
                        className={`px-2 py-1.5 rounded text-xs cursor-pointer ${getThemeForChat(activeChatKey) === t.id ? `${t.accentSoft} ${t.accent}` : 'text-ink-400 hover:bg-ink-800'}`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div ref={messagesScrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
                {activeParsed?.type === 'dm' ? (
                  activeDmMsgs.length === 0 ? (
                    <p className="text-center text-ink-500 text-sm py-8">Напишите первое сообщение</p>
                  ) : (
                    activeDmMsgs.map(msg => renderMessage(
                      msg.text,
                      msg.fromId === user.id,
                      undefined,
                      msg.deletedForAll,
                    ))
                  )
                ) : activeGroupMsgs.length === 0 ? (
                  <p className="text-center text-ink-500 text-sm py-8">Напишите в группу</p>
                ) : (
                  activeGroupMsgs.map(msg => renderMessage(
                    msg.text,
                    msg.fromId === user.id,
                    msg.fromId !== user.id ? getUserDisplayName(msg.fromId, msg.fromName) : undefined,
                    msg.deletedForAll,
                  ))
                )}
              </div>

              {sendError && (
                <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-crimson-400/10 border border-crimson-400/30 text-crimson-300 text-xs">{sendError}</div>
              )}

              <StaffChatComposer
                value={text}
                onChange={setText}
                onSend={() => void handleSend()}
                sending={sending}
                accentClass={activeTheme.id === 'gold' ? 'gold' : activeTheme.id === 'jade' ? 'jade' : 'purple'}
              />
            </>
          )}
        </main>
      </div>

      {showCreateGroup && (
        <CreateGroupModal
          staffList={staffList}
          currentUserId={user.id}
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}
    </div>
  );
}

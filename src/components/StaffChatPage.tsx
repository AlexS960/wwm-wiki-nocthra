import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ArrowLeft, MessageSquare, Search, Send, UserPlus, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { canAccessStaffChat, isStaffChatRole } from '../lib/staffChat';
import type { PrivateMessage } from '../lib/pm';
import { filterPmForUser, getPmPreviewText } from '../lib/pm';
import { getDisplayName } from '../lib/displayName';
import { renderBBCode } from '../lib/bbcode';

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

export default function StaffChatPage({ onBack, onLoginClick }: StaffChatPageProps) {
  const {
    user,
    registeredUsers,
    privateMessages,
    pmLoaded,
    sendPrivateMessage,
    markPMRead,
    loadPmThread,
    getUserDisplayName,
    getRoleConfig,
    ensureAccountsLoaded,
  } = useAuth();

  const [search, setSearch] = useState('');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void ensureAccountsLoaded();
  }, [ensureAccountsLoaded]);

  const staffMembers = useMemo(
    () => registeredUsers.filter(u => isStaffChatRole(u.role) && u.id !== user?.id),
    [registeredUsers, user?.id],
  );

  const myMessages = useMemo(
    () => (user ? filterPmForUser(privateMessages, user.id) : []),
    [privateMessages, user?.id],
  );

  const chats = useMemo(() => {
    if (!user) return [];
    const staffIds = new Set(staffMembers.map(s => s.id));
    return myMessages.reduce<{ id: string; name: string; role: string; lastMsg: string; ts: number; unread: number }[]>((acc, m) => {
      const otherId = m.fromId === user.id ? m.toId : m.fromId;
      if (!staffIds.has(otherId)) return acc;
      const preview = getPmPreviewText(m, user.id);
      if (!preview && !m.deletedForAll) return acc;
      const otherName = getUserDisplayName(otherId, m.fromId === user.id ? m.toName : m.fromName);
      const other = staffMembers.find(s => s.id === otherId);
      const existing = acc.find(c => c.id === otherId);
      const line = preview || 'Сообщение удалено';
      if (existing) {
        if (m.timestamp > existing.ts) {
          existing.lastMsg = line;
          existing.ts = m.timestamp;
        }
        if (m.toId === user.id && !m.read && !m.deletedForAll) existing.unread++;
      } else {
        acc.push({
          id: otherId,
          name: otherName,
          role: other?.role || 'user',
          lastMsg: line,
          ts: m.timestamp,
          unread: m.toId === user.id && !m.read && !m.deletedForAll ? 1 : 0,
        });
      }
      return acc;
    }, []).sort((a, b) => b.ts - a.ts);
  }, [myMessages, user, staffMembers, getUserDisplayName]);

  const filteredChats = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(c => c.name.toLowerCase().includes(q));
  }, [chats, search]);

  const activeChatMsgs = useMemo(() => {
    if (!user || !activeChatId) return [];
    return myMessages
      .filter(m =>
        (m.fromId === user.id && m.toId === activeChatId) || (m.fromId === activeChatId && m.toId === user.id),
      )
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [myMessages, user, activeChatId]);

  const activePartner = staffMembers.find(s => s.id === activeChatId)
    || registeredUsers.find(u => u.id === activeChatId);

  const selectChat = useCallback((partnerId: string) => {
    setActiveChatId(partnerId);
    setMobileShowChat(true);
    setShowNewChat(false);
    setSendError(null);
    void loadPmThread(partnerId);
    void markPMRead(partnerId);
  }, [loadPmThread, markPMRead]);

  useEffect(() => {
    if (!activeChatId || !messagesScrollRef.current) return;
    messagesScrollRef.current.scrollTop = messagesScrollRef.current.scrollHeight;
  }, [activeChatMsgs.length, activeChatId]);

  const handleSend = async () => {
    if (!text.trim() || !activeChatId || sending) return;
    if (!isStaffChatRole(activePartner?.role || '')) {
      setSendError('Переписка только с участниками служебного чата');
      return;
    }
    setSending(true);
    setSendError(null);
    const err = await sendPrivateMessage(activeChatId, text.trim());
    setSending(false);
    if (err) setSendError(err);
    else {
      setText('');
      inputRef.current?.focus();
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] pt-16 md:pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <MessageSquare className="w-14 h-14 text-purple-400/50 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-white mb-2">Служебный чат</h2>
          <p className="text-ink-400 text-sm mb-6">Войдите в аккаунт для доступа к чату команды</p>
          <button type="button" onClick={onLoginClick} className="px-6 py-2.5 bg-purple-500/20 text-purple-300 rounded-lg cursor-pointer hover:bg-purple-500/30">
            Войти
          </button>
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
          <p className="text-ink-400 text-sm mb-6">
            Служебный чат доступен только для ролей: Администратор, Гильдмастер, Редактор и Модератор.
          </p>
          <button type="button" onClick={onBack} className="px-6 py-2.5 bg-gold-400/20 text-gold-400 rounded-lg cursor-pointer hover:bg-gold-400/30">
            На главную
          </button>
        </div>
      </div>
    );
  }

  const sidebarClass = mobileShowChat ? 'hidden md:flex' : 'flex';
  const mainClass = mobileShowChat ? 'flex' : 'hidden md:flex';

  return (
    <div className="h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] pt-16 md:pt-20 flex flex-col bg-ink-900/40">
      <div className="shrink-0 px-3 sm:px-4 py-2 border-b border-ink-700/40 flex items-center gap-3 bg-ink-900/80">
        <button type="button" onClick={onBack} className="p-2 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-800/50 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <MessageSquare className="w-5 h-5 text-purple-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-lg font-bold text-white truncate">Служебный чат</h1>
          <p className="text-[11px] text-ink-500 truncate">Команда · {staffMembers.length + 1} участников</p>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 max-w-7xl w-full mx-auto border-x border-ink-700/30">
        {/* Список чатов (как Telegram слева) */}
        <aside
          className={`${sidebarClass} w-full md:w-[340px] lg:w-[380px] shrink-0 flex-col border-r border-ink-700/40 bg-ink-900/60`}
        >
          <div className="p-3 border-b border-ink-700/30 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск…"
                className="w-full bg-ink-800/80 border border-ink-700/50 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/40"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowNewChat(v => !v)}
              className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 cursor-pointer shrink-0"
              title="Новый диалог"
            >
              <UserPlus className="w-5 h-5" />
            </button>
          </div>

          {showNewChat && (
            <div className="max-h-48 overflow-y-auto border-b border-ink-700/30 bg-ink-800/40">
              {staffMembers.length === 0 ? (
                <p className="text-ink-500 text-xs p-3">Нет других участников команды</p>
              ) : (
                staffMembers.map(s => {
                  const rc = getRoleConfig(s.role);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectChat(s.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-ink-700/30 cursor-pointer text-left"
                    >
                      <div className="w-9 h-9 rounded-full bg-ink-700 flex items-center justify-center text-sm font-bold shrink-0" style={{ color: rc.color }}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-white truncate">{getDisplayName(s)}</div>
                        <div className="text-[10px] truncate" style={{ color: rc.color }}>{rc.displayName}</div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          )}

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {!pmLoaded ? (
              <p className="text-ink-500 text-sm text-center py-8">Загрузка…</p>
            ) : filteredChats.length === 0 ? (
              <p className="text-ink-500 text-sm text-center py-8 px-4">
                {search ? 'Ничего не найдено' : 'Нет диалогов. Начните переписку с коллегой.'}
              </p>
            ) : (
              filteredChats.map(chat => {
                const rc = getRoleConfig(chat.role);
                const active = activeChatId === chat.id;
                return (
                  <button
                    key={chat.id}
                    type="button"
                    onClick={() => selectChat(chat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 cursor-pointer text-left border-b border-ink-800/50 transition-colors ${
                      active ? 'bg-purple-500/10' : 'hover:bg-ink-800/40'
                    }`}
                  >
                    <div className="w-11 h-11 rounded-full bg-ink-700 flex items-center justify-center text-base font-bold shrink-0" style={{ color: rc.color }}>
                      {chat.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between gap-2">
                        <span className="text-sm font-medium text-white truncate">{chat.name}</span>
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
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Область диалога */}
        <main className={`${mainClass} flex-1 flex-col min-w-0 bg-ink-900/30`}>
          {!activeChatId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageSquare className="w-16 h-16 text-ink-700 mb-4" />
              <p className="text-ink-400 text-sm">Выберите чат слева или создайте новый диалог</p>
            </div>
          ) : (
            <>
              <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-ink-700/40 bg-ink-800/50">
                <button
                  type="button"
                  className="md:hidden p-1.5 text-ink-400 hover:text-white cursor-pointer"
                  onClick={() => setMobileShowChat(false)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                {activePartner && (
                  <>
                    <div
                      className="w-10 h-10 rounded-full bg-ink-700 flex items-center justify-center font-bold shrink-0"
                      style={{ color: getRoleConfig(activePartner.role).color }}
                    >
                      {getDisplayName(activePartner).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-white font-medium truncate">{getDisplayName(activePartner)}</div>
                      <div className="text-xs truncate" style={{ color: getRoleConfig(activePartner.role).color }}>
                        {getRoleConfig(activePartner.role).displayName}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div ref={messagesScrollRef} className="flex-1 overflow-y-auto p-4 space-y-2 overscroll-contain">
                {!pmLoaded ? (
                  <p className="text-center text-ink-500 text-sm py-8">Загрузка сообщений…</p>
                ) : activeChatMsgs.length === 0 ? (
                  <p className="text-center text-ink-500 text-sm py-8">Напишите первое сообщение</p>
                ) : (
                  activeChatMsgs.map((msg: PrivateMessage) => {
                    const isSelf = msg.fromId === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[min(85%,28rem)] rounded-2xl px-3.5 py-2 text-sm ${
                            isSelf
                              ? 'bg-purple-600/35 text-purple-50 rounded-br-md'
                              : 'bg-ink-800/70 text-ink-100 rounded-bl-md'
                          } ${msg.deletedForAll ? 'opacity-75 italic' : ''}`}
                        >
                          {!isSelf && (
                            <p className="text-[10px] text-purple-300/80 mb-1">{getUserDisplayName(msg.fromId, msg.fromName)}</p>
                          )}
                          {msg.deletedForAll ? (
                            <span className="text-ink-500">Сообщение удалено</span>
                          ) : (
                            <div className="break-words">
                              {renderBBCode(msg.text, {
                                linkClassName: 'text-blue-300 underline break-all',
                                quoteClassName: 'border-l-2 border-purple-400/40 pl-2 italic text-ink-300',
                                codeClassName: 'font-mono text-xs bg-ink-900/50 px-1 rounded',
                              })}
                            </div>
                          )}
                          <div className="text-[10px] text-ink-500 text-right mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {sendError && (
                <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-crimson-400/10 border border-crimson-400/30 text-crimson-300 text-xs">
                  {sendError}
                </div>
              )}

              <div className="shrink-0 p-3 border-t border-ink-700/40 bg-ink-800/40">
                <div className="flex gap-2 max-w-3xl mx-auto">
                  <input
                    ref={inputRef}
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Сообщение…"
                    maxLength={2000}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
                    className="flex-1 bg-ink-700/50 border border-ink-600/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50"
                  />
                  <button
                    type="button"
                    onClick={() => void handleSend()}
                    disabled={!text.trim() || sending}
                    className="p-2.5 rounded-xl bg-purple-500/25 text-purple-300 hover:bg-purple-500/35 cursor-pointer disabled:opacity-40"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

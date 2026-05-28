import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { PrivateMessage } from '../lib/pm';
import { Mail, X, Send, User, ArrowLeft, Smile, Settings, Volume2, VolumeX, MoreVertical, Trash2 } from 'lucide-react';
import { getDisplayName } from '../lib/displayName';
import { playPmNotification } from '../lib/pmSound';
import {
  browserNotificationsSupported,
  getPmBrowserNotifyEnabled,
  requestNotificationPermission,
  setPmBrowserNotifyEnabled,
} from '../lib/notifications';
import {
  canDeletePmForAll,
  filterPmForUser,
  getPmPreviewText,
  isPmVisibleForUser,
} from '../lib/pm';
import { useCloseFloatPanels } from '../lib/closeFloatPanels';

interface PrivateMessagesProps { onLoginClick: () => void; }

type PmMenu = { messageId: string; x: number; y: number };
type DialogMenu = { partnerId: string; x: number; y: number };

const PM_EMOJIS = ['😀','😊','👍','❤️','🔥','⚔️','🎮','✨','😂','🙏','💪','👋'];

export default function PrivateMessages({ onLoginClick }: PrivateMessagesProps) {
  const {
    user, registeredUsers, privateMessages, unreadPMCount, sendPrivateMessage, markPMRead,
    deletePrivateMessageForMe, deletePrivateMessageForAll, loadPmThread,
    deletePmDialogForMe, deletePmDialogForAll,
    siteSettings, hasPermission, getUserDisplayName, dbSaveError, clearDbSaveError, pmLoaded,
    ensureAccountsLoaded,
  } = useAuth();
  const [sendError, setSendError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'compose' | 'chat' | 'settings'>('list');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState('');
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [pmMenu, setPmMenu] = useState<PmMenu | null>(null);
  const [dialogMenu, setDialogMenu] = useState<DialogMenu | null>(null);
  const closePanel = useCallback(() => {
    setIsOpen(false);
    setView('list');
    setActiveChatId(null);
    setPmMenu(null);
    setDialogMenu(null);
  }, []);
  useCloseFloatPanels(closePanel);
  const [localSound, setLocalSound] = useState(() => {
    try { return localStorage.getItem('wwm_pm_sound') !== 'off'; } catch { return true; }
  });
  const [browserNotify, setBrowserNotify] = useState(() => getPmBrowserNotifyEnabled());
  const [notifyPerm, setNotifyPerm] = useState<NotificationPermission | 'unsupported'>(() =>
    browserNotificationsSupported() ? Notification.permission : 'unsupported'
  );
  const prevUnreadRef = useRef(unreadPMCount);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const prevMsgCountRef = useRef(0);

  const pmSettings = siteSettings.pmSettings || { notificationSound: true, soundUrl: '' };
  const isAdmin = hasPermission('site.settings');

  const myMessages = useMemo(
    () => (user ? filterPmForUser(privateMessages, user.id) : []),
    [privateMessages, user?.id],
  );

  const chats = useMemo(() => {
    if (!user) return [];
    return myMessages.reduce<{ id: string; name: string; lastMsg: string; ts: number; unread: number }[]>((acc, m) => {
      const otherId = m.fromId === user.id ? m.toId : m.fromId;
      const preview = getPmPreviewText(m, user.id);
      if (!preview && m.deletedForAll) {
        const existing = acc.find(c => c.id === otherId);
        if (existing && m.timestamp > existing.ts) {
          existing.lastMsg = 'Сообщение удалено';
          existing.ts = m.timestamp;
        } else if (!existing) {
          acc.push({
            id: otherId,
            name: getUserDisplayName(otherId, m.fromId === user.id ? m.toName : m.fromName),
            lastMsg: 'Сообщение удалено',
            ts: m.timestamp,
            unread: 0,
          });
        }
        return acc;
      }
      if (!preview) return acc;
      const otherName = getUserDisplayName(otherId, m.fromId === user.id ? m.toName : m.fromName);
      const existing = acc.find(c => c.id === otherId);
      if (existing) {
        if (m.timestamp > existing.ts) { existing.lastMsg = preview; existing.ts = m.timestamp; }
        if (m.toId === user.id && !m.read && !m.deletedForAll) existing.unread++;
      } else {
        acc.push({
          id: otherId,
          name: otherName,
          lastMsg: preview,
          ts: m.timestamp,
          unread: m.toId === user.id && !m.read && !m.deletedForAll ? 1 : 0,
        });
      }
      return acc;
    }, []).sort((a, b) => b.ts - a.ts);
  }, [myMessages, user, getUserDisplayName]);

  const activeChatMsgs = useMemo(() => {
    if (!user || !activeChatId) return [];
    return myMessages
      .filter(m => (m.fromId === user.id && m.toId === activeChatId) || (m.fromId === activeChatId && m.toId === user.id))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [myMessages, user, activeChatId]);

  const activeChatName = activeChatId
    ? getUserDisplayName(activeChatId, chats.find(c => c.id === activeChatId)?.name || '')
    : '';

  const scrollChatToBottom = useCallback((smooth = false) => {
    const el = messagesScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, []);

  const handleMessagesScroll = () => {
    const el = messagesScrollRef.current;
    if (!el) return;
    stickToBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 72;
  };

  useEffect(() => {
    if (isOpen) void ensureAccountsLoaded();
  }, [isOpen, ensureAccountsLoaded]);

  useEffect(() => {
    if (isOpen && view === 'chat' && activeChatId) {
      stickToBottomRef.current = true;
      void loadPmThread(activeChatId);
      markPMRead(activeChatId);
      requestAnimationFrame(() => scrollChatToBottom(false));
    }
  }, [isOpen, view, activeChatId, markPMRead, scrollChatToBottom, loadPmThread]);

  useEffect(() => {
    if (view !== 'chat' || !activeChatId) return;
    const count = activeChatMsgs.length;
    const grew = count > prevMsgCountRef.current;
    prevMsgCountRef.current = count;
    if (grew && stickToBottomRef.current) {
      requestAnimationFrame(() => scrollChatToBottom(true));
    }
  }, [activeChatMsgs.length, view, activeChatId, scrollChatToBottom]);

  useEffect(() => {
    if (view === 'chat') prevMsgCountRef.current = activeChatMsgs.length;
  }, [activeChatId, view]);

  useEffect(() => {
    if (unreadPMCount > prevUnreadRef.current && (!isOpen || view !== 'chat')) {
      const soundOn = pmSettings.notificationSound && localSound;
      if (soundOn) playPmNotification(pmSettings.soundUrl);
    }
    prevUnreadRef.current = unreadPMCount;
  }, [unreadPMCount, isOpen, view, pmSettings, localSound]);

  useEffect(() => {
    if (!pmMenu) return;
    const close = () => setPmMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [pmMenu]);

  useEffect(() => {
    if (!dialogMenu) return;
    const close = () => setDialogMenu(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [dialogMenu]);

  const handleSend = async () => {
    if (!text.trim() || !activeChatId || sending) return;
    setSending(true);
    setSendError(null);
    stickToBottomRef.current = true;
    const err = await sendPrivateMessage(activeChatId, text.trim());
    setSending(false);
    if (err) setSendError(err);
    else { setText(''); setShowEmoji(false); }
  };

  const handleCompose = async () => {
    if (!text.trim() || !recipientId || sending) return;
    setSending(true);
    setSendError(null);
    const err = await sendPrivateMessage(recipientId, text.trim());
    setSending(false);
    if (err) setSendError(err);
    else { setText(''); setActiveChatId(recipientId); setView('chat'); stickToBottomRef.current = true; }
  };

  const openMessageMenu = (e: React.MouseEvent, msg: PrivateMessage) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setPmMenu({ messageId: msg.id, x: rect.left, y: rect.top });
  };

  const openDialogMenu = (e: React.MouseEvent, partnerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDialogMenu({ partnerId, x: e.clientX, y: e.clientY });
  };

  const handleDeleteForMe = async (messageId: string) => {
    setPmMenu(null);
    const err = await deletePrivateMessageForMe(messageId);
    if (err) setSendError(err);
  };

  const handleDeleteForAll = async (messageId: string) => {
    setPmMenu(null);
    const ok = window.confirm('Удалить сообщение у всех? Это удалит его у вас и у собеседника.');
    if (!ok) return;
    const err = await deletePrivateMessageForAll(messageId);
    if (err) setSendError(err);
  };

  const handleDeleteDialogForMe = async (partnerId: string) => {
    setDialogMenu(null);
    const err = await deletePmDialogForMe(partnerId);
    if (err) setSendError(err);
  };

  const handleDeleteDialogForAll = async (partnerId: string) => {
    setDialogMenu(null);
    const ok = window.confirm('Удалить весь диалог у всех? Это удалит всю переписку у вас и у собеседника.');
    if (!ok) return;
    const err = await deletePmDialogForAll(partnerId);
    if (err) setSendError(err);
  };

  const toggleLocalSound = () => {
    const next = !localSound;
    setLocalSound(next);
    try { localStorage.setItem('wwm_pm_sound', next ? 'on' : 'off'); } catch {}
    if (next && pmSettings.notificationSound) playPmNotification(pmSettings.soundUrl);
  };

  const renderMessageBody = (msg: PrivateMessage, isSelf: boolean) => {
    if (msg.deletedForAll) {
      return (
        <p className="text-ink-500 italic text-sm">
          {isSelf ? 'Вы удалили это сообщение' : 'Сообщение удалено'}
        </p>
      );
    }
    return <p className="whitespace-pre-wrap break-words">{msg.text}</p>;
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="hover-glow-btn hover-glow-purple fixed bottom-28 right-6 z-40 bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 text-purple-400 p-3.5 rounded-full shadow-lg hover:bg-purple-500/30 hover:scale-110 transition-all duration-300 cursor-pointer">
        <Mail className="w-6 h-6" />
        {unreadPMCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-crimson-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fadeIn">
            {unreadPMCount > 9 ? '9+' : unreadPMCount}
          </span>
        )}
      </button>
    );
  }

  const displayError = sendError || dbSaveError;
  const menuMsg = pmMenu ? privateMessages.find(m => m.id === pmMenu.messageId) : null;

  return (
    <div className="fixed right-2 sm:right-6 bottom-20 sm:bottom-6 z-50 w-[min(100vw-1rem,380px)] max-w-[calc(100vw-1rem)]">
      <div className="bg-ink-900 border border-purple-700/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col" style={{ height: 'min(500px, calc(100dvh - 6rem))' }}>
        <div className="flex items-center justify-between px-4 py-2.5 bg-ink-800/80 border-b border-ink-700/30 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {view !== 'list' && view !== 'settings' && (
              <button onClick={() => { setView('list'); setActiveChatId(null); setShowEmoji(false); setPmMenu(null); }} className="p-1 text-ink-400 hover:text-white cursor-pointer shrink-0"><ArrowLeft className="w-4 h-4" /></button>
            )}
            {view === 'settings' && (
              <button onClick={() => setView('list')} className="p-1 text-ink-400 hover:text-white cursor-pointer shrink-0"><ArrowLeft className="w-4 h-4" /></button>
            )}
            <Mail className="w-4 h-4 text-purple-400 shrink-0" />
            <span className="font-serif text-sm font-bold text-white truncate">
              {view === 'compose' ? 'Новое сообщение' : view === 'chat' ? activeChatName : view === 'settings' ? 'Настройки ЛС' : 'Сообщения'}
            </span>
            {view === 'list' && unreadPMCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-crimson-400/20 text-crimson-400 shrink-0">{unreadPMCount}</span>}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            {view === 'list' && (
              <>
                <button onClick={() => setView('settings')} className="p-1.5 text-ink-400 hover:text-purple-400 rounded-lg hover:bg-ink-700/50 cursor-pointer" title="Настройки"><Settings className="w-4 h-4" /></button>
                <button onClick={() => setView('compose')} className="p-1.5 text-ink-400 hover:text-purple-400 rounded-lg hover:bg-ink-700/50 cursor-pointer"><User className="w-4 h-4" /></button>
              </>
            )}
            <button onClick={() => { setIsOpen(false); setPmMenu(null); }} className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {displayError && (
          <div className="mx-3 mt-2 px-3 py-2 rounded-lg bg-crimson-400/10 border border-crimson-400/30 text-crimson-300 text-xs flex justify-between gap-2 shrink-0">
            <span>{displayError}</span>
            <button type="button" onClick={() => { setSendError(null); clearDbSaveError(); }} className="text-crimson-400 shrink-0 cursor-pointer">✕</button>
          </div>
        )}

        {view === 'chat' ? (
          <>
            <div
              ref={messagesScrollRef}
              onScroll={handleMessagesScroll}
              className="flex-1 overflow-y-auto p-3 min-h-0 overscroll-contain"
            >
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Mail className="w-10 h-10 text-ink-700 mb-3" />
                  <p className="text-ink-400 text-sm mb-3">Войдите для отправки сообщений</p>
                  <button onClick={onLoginClick} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm cursor-pointer hover:bg-purple-500/30">Войти</button>
                </div>
              ) : !pmLoaded ? (
                <p className="text-center text-ink-500 text-sm py-8">Загрузка сообщений…</p>
              ) : activeChatMsgs.length === 0 ? (
                <p className="text-center text-ink-500 text-sm py-8">Начните переписку</p>
              ) : (
                <div className="space-y-0.5">
                  {activeChatMsgs.map(msg => {
                    const isSelf = msg.fromId === user.id;
                    return (
                      <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'} group`}>
                        <button
                          type="button"
                          onContextMenu={e => openMessageMenu(e, msg)}
                          onClick={e => { if (window.innerWidth < 768) openMessageMenu(e, msg); }}
                          className={`max-w-[80%] rounded-xl px-3 py-2 text-sm text-left cursor-pointer ${isSelf ? 'bg-purple-500/20 text-purple-200 rounded-br-md' : 'bg-ink-700/50 text-ink-200 rounded-bl-md'} ${msg.deletedForAll ? 'opacity-80' : ''}`}
                        >
                          {!isSelf && <p className="text-[9px] text-purple-400/80 mb-0.5">{getUserDisplayName(msg.fromId, msg.fromName)}</p>}
                          {renderMessageBody(msg, isSelf)}
                          <div className="mt-1 flex items-center justify-end gap-1.5">
                            {isSelf && !msg.deletedForAll && (
                              <span className="inline-flex items-center gap-0.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${msg.read ? 'bg-[#D8BFD8]' : 'bg-crimson-400'}`} />
                                {msg.read && <span className="w-1.5 h-1.5 rounded-full bg-[#D8BFD8]" />}
                              </span>
                            )}
                            <span className="text-[9px] text-ink-500">
                              {new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={e => openMessageMenu(e, msg)}
                          className="self-center p-1 mx-0.5 text-ink-600 hover:text-ink-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                          aria-label="Действия"
                        >
                          <MoreVertical className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {user && (
              <div className="px-3 py-2.5 bg-ink-800/50 border-t border-ink-700/30 shrink-0 relative">
                {showEmoji && (
                  <div className="absolute bottom-full left-3 mb-2 p-2 bg-ink-900 border border-purple-700/30 rounded-xl grid grid-cols-6 gap-1 z-20">
                    {PM_EMOJIS.map(e => (
                      <button key={e} onClick={() => { setText(t => t + e); setShowEmoji(false); }}
                        className="h-8 text-lg hover:bg-ink-800 rounded cursor-pointer">{e}</button>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowEmoji(!showEmoji)}
                    className={`p-2 rounded-xl border cursor-pointer ${showEmoji ? 'bg-purple-500/20 text-purple-400 border-purple-400/40' : 'bg-ink-700/50 text-ink-400 border-ink-600/30'}`}>
                    <Smile className="w-4 h-4" />
                  </button>
                  <input value={text} onChange={e => setText(e.target.value)} placeholder="Сообщение..." maxLength={1000}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    className="flex-1 bg-ink-700/50 border border-ink-600/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50" />
                  <button onClick={handleSend} disabled={!text.trim() || sending}
                    className="p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 cursor-pointer disabled:opacity-30 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 overflow-y-auto p-3 min-h-0">
            {!user ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Mail className="w-10 h-10 text-ink-700 mb-3" />
                <p className="text-ink-400 text-sm mb-3">Войдите для отправки сообщений</p>
                <button onClick={onLoginClick} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm cursor-pointer hover:bg-purple-500/30">Войти</button>
              </div>
            ) : view === 'settings' ? (
              <div className="space-y-4">
                <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
                  <h4 className="text-white text-sm font-medium mb-3">Уведомления</h4>
                  <button onClick={toggleLocalSound}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm cursor-pointer ${localSound ? 'bg-purple-500/20 text-purple-300' : 'bg-ink-700/50 text-ink-400'}`}>
                    <span className="flex items-center gap-2">{localSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} Звук уведомлений</span>
                    <span className="text-xs">{localSound ? 'Вкл' : 'Выкл'}</span>
                  </button>
                  <button onClick={() => playPmNotification(pmSettings.soundUrl)}
                    className="mt-2 w-full py-2 rounded-lg text-xs bg-ink-700/50 text-ink-300 hover:bg-ink-600 cursor-pointer">
                    Проверить звук
                  </button>
                </div>
                {browserNotificationsSupported() && (
                  <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
                    <h4 className="text-white text-sm font-medium mb-2">Уведомления браузера</h4>
                    <p className="text-ink-500 text-[10px] mb-3">Когда вкладка свёрнута — всплывающее уведомление о новом ЛС</p>
                    <button
                      type="button"
                      onClick={async () => {
                        const next = !browserNotify;
                        if (next) {
                          const perm = await requestNotificationPermission();
                          setNotifyPerm(perm === 'unsupported' ? 'denied' : perm);
                          if (perm !== 'granted') return;
                        }
                        setBrowserNotify(next);
                        setPmBrowserNotifyEnabled(next);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer ${
                        browserNotify && notifyPerm === 'granted'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-ink-700/50 text-ink-400'
                      }`}
                    >
                      <span>Всплывающие уведомления</span>
                      <span className="text-xs">{browserNotify && notifyPerm === 'granted' ? 'Вкл' : 'Выкл'}</span>
                    </button>
                    {notifyPerm === 'denied' && (
                      <p className="text-crimson-400/80 text-[10px] mt-2">Разрешите уведомления в настройках браузера</p>
                    )}
                  </div>
                )}
                {isAdmin && <PmAdminSoundSettings />}
                <p className="text-ink-500 text-[10px]">Сообщения до 1000 символов. Удерживайте сообщение или ⋮ — удаление как в Telegram.</p>
              </div>
            ) : view === 'list' ? (
              !pmLoaded ? (
                <p className="text-center text-ink-500 text-sm py-8">Загрузка…</p>
              ) : chats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <Mail className="w-8 h-8 text-ink-700 mb-2" />
                  <p className="text-ink-500 text-xs mb-3">Нет сообщений</p>
                  <button onClick={() => setView('compose')} className="text-purple-400 text-xs hover:underline cursor-pointer">Написать первым</button>
                </div>
              ) : (
                <div className="space-y-1">
                  {chats.map(chat => (
                    <div
                      key={chat.id}
                      className="w-full text-left bg-ink-800/50 border border-ink-700/30 rounded-xl p-3 hover:border-purple-500/20 flex items-center gap-3"
                      onContextMenu={e => openDialogMenu(e, chat.id)}
                    >
                      <button
                        type="button"
                        onClick={() => { setActiveChatId(chat.id); setView('chat'); stickToBottomRef.current = true; }}
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium truncate">{chat.name}</span>
                            <span className="text-ink-500 text-[10px] shrink-0">{new Date(chat.ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p dir="ltr" className="text-ink-400 text-xs truncate text-left">{chat.lastMsg}</p>
                        </div>
                        {chat.unread > 0 && <span className="w-5 h-5 rounded-full bg-purple-400 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{chat.unread}</span>}
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-3">
                <select value={recipientId} onChange={e => setRecipientId(e.target.value)}
                  className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white cursor-pointer focus:outline-none">
                  <option value="">Выберите получателя...</option>
                  {registeredUsers.filter(u => u.id !== user.id).map(u => (
                    <option key={u.id} value={u.id}>{getDisplayName(u)}</option>
                  ))}
                </select>
                <textarea value={text} onChange={e => setText(e.target.value)} rows={4} placeholder="Сообщение..." maxLength={1000}
                  className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50 resize-none" />
                <p className="text-ink-500 text-[10px] text-right">{text.length}/1000</p>
                <button onClick={handleCompose} disabled={!recipientId || !text.trim() || sending}
                  className="w-full bg-purple-500/20 text-purple-400 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/30 cursor-pointer disabled:opacity-40">
                  <Send className="w-4 h-4 inline mr-1" />{sending ? 'Отправка…' : 'Отправить'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {pmMenu && menuMsg && user && isPmVisibleForUser(menuMsg, user.id) && (
        <div
          className="fixed z-[60] min-w-[200px] py-1 bg-ink-900 border border-ink-700/50 rounded-xl shadow-xl"
          style={{ left: Math.min(pmMenu.x, window.innerWidth - 220), top: Math.max(8, pmMenu.y - 88) }}
          onClick={e => e.stopPropagation()}
        >
          <button type="button" onClick={() => handleDeleteForMe(menuMsg.id)}
            className="w-full px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-800 flex items-center gap-2 cursor-pointer">
            <Trash2 className="w-3.5 h-3.5" /> Удалить у меня
          </button>
          {canDeletePmForAll(menuMsg, user.id) && (
            <button type="button" onClick={() => handleDeleteForAll(menuMsg.id)}
              className="w-full px-3 py-2 text-left text-sm text-crimson-300 hover:bg-ink-800 flex items-center gap-2 cursor-pointer">
              <Trash2 className="w-3.5 h-3.5" /> Удалить у всех
            </button>
          )}
        </div>
      )}

      {dialogMenu && user && view === 'list' && (
        <div
          className="fixed z-[60] min-w-[200px] py-1 bg-ink-900 border border-ink-700/50 rounded-xl shadow-xl"
          style={{ left: Math.min(dialogMenu.x, window.innerWidth - 220), top: Math.max(8, dialogMenu.y - 88) }}
          onClick={e => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => handleDeleteDialogForMe(dialogMenu.partnerId)}
            className="w-full px-3 py-2 text-left text-sm text-ink-200 hover:bg-ink-800 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Удалить
          </button>
          <button
            type="button"
            onClick={() => handleDeleteDialogForAll(dialogMenu.partnerId)}
            className="w-full px-3 py-2 text-left text-sm text-crimson-300 hover:bg-ink-800 flex items-center gap-2 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Удалить у всех
          </button>
        </div>
      )}
    </div>
  );
}

function PmAdminSoundSettings() {
  const { siteSettings, updatePmSettings } = useAuth();
  const pm = siteSettings.pmSettings || { notificationSound: true, soundUrl: '' };
  const [url, setUrl] = useState(pm.soundUrl);
  const [saved, setSaved] = useState(false);

  const save = () => {
    updatePmSettings({ soundUrl: url.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-4">
      <h4 className="text-gold-400 text-sm font-medium mb-2">Настройки сайта (админ)</h4>
      <label className="flex items-center gap-2 text-sm text-ink-300 mb-3 cursor-pointer">
        <input type="checkbox" checked={pm.notificationSound}
          onChange={e => updatePmSettings({ notificationSound: e.target.checked })}
          className="rounded" />
        Звук уведомлений ЛС для всех
      </label>
      <label className="text-ink-400 text-xs block mb-1">URL своего звука (необязательно)</label>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..."
        className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-xs text-white mb-2 focus:outline-none" />
      <button onClick={save} className="w-full py-2 rounded-lg text-xs bg-gold-400/20 text-gold-400 cursor-pointer hover:bg-gold-400/30">
        {saved ? 'Сохранено' : 'Сохранить звук'}
      </button>
    </div>
  );
}

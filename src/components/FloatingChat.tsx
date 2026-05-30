import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCloseFloatPanels } from '../lib/closeFloatPanels';
import { renderBBCode } from '../lib/bbcode';
import {
  MessageCircle, X, Send, Trash2, VolumeX, Volume2, Ban, Shield,
  AlertTriangle, Minus, Smile, Type
} from 'lucide-react';

interface FloatingChatProps {
  onLoginClick: () => void;
}

interface MenuPos { x: number; y: number; openUp: boolean; }

export default function FloatingChat({ onLoginClick }: FloatingChatProps) {
  const {
    user, chatState, sendMessage, deleteMessage, muteUser, unmuteUser,
    isUserMuted, chatBanUser, hasPermission, siteSettings, getUserDisplayName,
    ensureChatLoaded, chatLoaded,
    chatHasMore, chatLoadingMore, loadOlderChatMessages,
    searchChatMessages, clearChatSearch, chatSearchResults,
  } = useAuth();
  const [, setMuteTick] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const closePanel = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
    setActionMenu(null);
  }, []);
  useCloseFloatPanels(closePanel);
  const [text, setText] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<MenuPos | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(() => {
    try { return parseInt(localStorage.getItem('wwm_chat_last_read') || '0', 10); } catch { return 0; }
  });
  const [sendError, setSendError] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showBbcodePicker, setShowBbcodePicker] = useState(false);
  const [emojiTab, setEmojiTab] = useState<'recent' | 'faces' | 'game' | 'symbols'>('recent');
  const [recentEmojis, setRecentEmojis] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('wwm_recent_emojis') || '[]'); } catch { return []; }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatFilter, setChatFilter] = useState('');

  const isMod = hasPermission('chat.delete') || hasPermission('chat.mute');
  const canMute = hasPermission('chat.mute') || hasPermission('chat.delete');
  const canWrite = hasPermission('chat.write') && user && !isUserMuted(user.id);
  const currentMute = user ? chatState.mutedUsers.find(m => m.userId === user.id && Date.now() < m.until) : null;

  useEffect(() => {
    if (!currentMute) return;
    const iv = setInterval(() => setMuteTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [currentMute?.until]);
  const visibleMessages = (chatSearchResults ?? chatState.messages).filter(m => !m.deleted);

  const handleMessagesScroll = () => {
    const el = messagesScrollRef.current;
    if (!el || chatSearchResults) return;
    if (el.scrollTop < 40 && chatHasMore && !chatLoadingMore) {
      void loadOlderChatMessages();
    }
  };

  // Track unread: only messages from other users after last read timestamp
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setUnreadCount(0);
      const latestTs = visibleMessages.length ? Math.max(...visibleMessages.map(m => m.timestamp)) : Date.now();
      setLastReadTimestamp(latestTs);
      localStorage.setItem('wwm_chat_last_read', String(latestTs));
    } else {
      const count = visibleMessages.filter(m => m.timestamp > lastReadTimestamp && m.userId !== user?.id).length;
      setUnreadCount(count);
    }
  }, [visibleMessages, isOpen, isMinimized, lastReadTimestamp, user?.id]);

  const emojiGroups = {
    recent: recentEmojis,
    faces: ['😀','😄','😁','😂','🤣','😊','😍','😎','🤔','😢','😭','😡','😅','🥳','😴','🤯','😇','😈','🥶','🥵','🤗','😤','🤬','🤡','🫡'],
    game: ['⚔️','🛡️','💎','🎯','🏆','🎮','💬','📖','🗺️','👹','🏛️','🍳','🎣','🌙','👑','🐺','🐉','🐱','🔥','✨'],
    symbols: ['❤️','💙','💚','💛','💜','🖤','🤍','🤎','💀','👀','👏','🙌','🙏','💪','🤝','🎉','📌','🔑','⭐','✔️','❌','⚠️'],
  } as const;

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    setRecentEmojis(prev => {
      const next = [emoji, ...prev.filter(e => e !== emoji)].slice(0, 16);
      try { localStorage.setItem('wwm_recent_emojis', JSON.stringify(next)); } catch {}
      return next;
    });
    inputRef.current?.focus();
  };

  const applyBbCode = (openTag: string, closeTag: string, placeholder = 'текст') => {
    const input = inputRef.current;
    if (!input) return;
    const start = input.selectionStart ?? text.length;
    const end = input.selectionEnd ?? text.length;
    const selected = text.slice(start, end);
    const inner = selected || placeholder;
    const wrapped = `${openTag}${inner}${closeTag}`;
    const next = text.slice(0, start) + wrapped + text.slice(end);
    setText(next);
    setShowBbcodePicker(false);
    requestAnimationFrame(() => {
      input.focus();
      const selStart = start + openTag.length;
      const selEnd = selStart + inner.length;
      input.setSelectionRange(selStart, selEnd);
    });
  };

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages.length, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const handleSend = async () => {
    if (!text.trim() || !canWrite) return;
    setSendError(null);
    const err = await sendMessage(text);
    if (err) setSendError(err);
    else {
      setText('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  const formatMuteRemaining = (until: number) => {
    const mins = Math.ceil(Math.max(0, until - Date.now()) / 60000);
    return mins >= 60 ? `${Math.floor(mins / 60)}ч ${mins % 60}м` : `${mins} мин`;
  };

  const getRoleDisplay = (roleId: string) => siteSettings.roles.find(r => r.id === roleId) || { displayName: roleId, color: '#b0a696' };

  const handleOpen = () => {
    void ensureChatLoaded();
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
    const latestTs = visibleMessages.length ? Math.max(...visibleMessages.map(m => m.timestamp)) : Date.now();
    setLastReadTimestamp(latestTs);
    setShowEmojiPicker(false);
    setShowBbcodePicker(false);
  };

  // ---- Floating Button ----
  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="hover-glow-btn fixed bottom-6 left-6 z-40 bg-gold-400/20 backdrop-blur-sm border border-gold-400/40
                   text-gold-400 p-3.5 rounded-full shadow-lg hover:bg-gold-400/30 hover:scale-110
                   transition-all duration-300 cursor-pointer group"
      >
        <MessageCircle className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-crimson-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fadeIn">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    );
  }

  // ---- Chat Window ----
  return (
    <div className={`overlay-panel fixed left-4 sm:left-6 bottom-4 sm:bottom-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-72' : 'w-[340px] sm:w-[380px]'
    }`}>
      <div className="bg-ink-900/72 backdrop-blur-lg border border-gold-700/35 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
        style={{ height: isMinimized ? 'auto' : 'min(500px, 70vh)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-ink-800/65 border-b border-ink-700/35 shrink-0 cursor-pointer"
          onClick={() => isMinimized && setIsMinimized(false)}>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-gold-400" />
            <span className="font-serif text-sm font-bold text-white">Чат Nocthra</span>
            <span className="text-ink-500 text-[10px]">{visibleMessages.length}</span>
            {isMod && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">MOD</span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="px-3 pt-2 shrink-0">
              <input
                type="text"
                value={chatFilter}
                onChange={e => {
                  setChatFilter(e.target.value);
                  const v = e.target.value;
                  if (v.trim().length < 2) clearChatSearch();
                  else void searchChatMessages(v);
                }}
                placeholder="Поиск в чате…"
                className="w-full bg-ink-800/80 border border-ink-700/50 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/40"
              />
            </div>
            <div
              ref={messagesScrollRef}
              className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5"
              onScroll={handleMessagesScroll}
              onClick={() => { setActionMenu(null); setShowEmojiPicker(false); setShowBbcodePicker(false); }}
            >
              {chatLoadingMore && (
                <p className="text-center text-[10px] text-ink-500 py-1">Загрузка истории…</p>
              )}
              {!user ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <MessageCircle className="w-10 h-10 text-ink-700 mb-3" />
                  <p className="text-ink-400 text-sm mb-3">Войдите, чтобы писать</p>
                  <button onClick={onLoginClick}
                    className="px-4 py-2 bg-gold-400/20 text-gold-400 rounded-lg text-sm cursor-pointer hover:bg-gold-400/30">
                    Войти
                  </button>
                </div>
              ) : !chatLoaded ? (
                <p className="text-center text-ink-500 text-sm py-8">Загрузка чата…</p>
              ) : visibleMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <MessageCircle className="w-8 h-8 text-ink-700 mb-2" />
                  <p className="text-ink-500 text-xs">Чат пуст. Напишите первыми!</p>
                </div>
              ) : (
                visibleMessages.map(msg => {
                  const roleDisplay = getRoleDisplay(msg.userRole);
                  const isSelf = msg.userId === user.id;
                  const showModActions = isMod && !isSelf;
                  const userMuted = isUserMuted(msg.userId);

                  return (
                    <div key={msg.id}
                      className={`group relative py-1.5 px-2 rounded-lg transition-colors ${isSelf ? 'bg-gold-400/8' : 'hover:bg-ink-800/35'}`}
                      >

                      {/* Name + time row */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-xs" style={{ color: roleDisplay.color }}>{getUserDisplayName(msg.userId, msg.userName)}</span>
                        <span className="text-[8px] px-1 py-0.5 rounded" style={{ backgroundColor: roleDisplay.color + '15', color: roleDisplay.color }}>
                          {roleDisplay.displayName}
                        </span>
                        {userMuted && !isSelf && <VolumeX className="w-2.5 h-2.5 text-orange-400" />}
                        <span className="text-ink-600 text-[9px] ml-auto">{formatTime(msg.timestamp)}</span>

                        {/* Actions */}
                        {(showModActions || isSelf) && (
                          <div className="opacity-100 flex items-center">
                            {showModActions && (
                              <button onClick={(e) => {
                                e.stopPropagation();
                                if (actionMenu === msg.id) { setActionMenu(null); setMenuPos(null); return; }
                                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                const spaceBelow = window.innerHeight - rect.bottom;
                                const openUp = spaceBelow < 200;
                                setMenuPos({ x: rect.right, y: openUp ? rect.top : rect.bottom, openUp });
                                setActionMenu(msg.id);
                              }}
                                className="p-0.5 text-ink-500 hover:text-cyan-400 cursor-pointer">
                                <Shield className="w-3 h-3" />
                              </button>
                            )}
                            {isSelf && (
                              <button onClick={() => deleteMessage(msg.id)}
                                className="p-0.5 text-ink-600 hover:text-crimson-400 cursor-pointer">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Message text */}
                      <p className="text-ink-100 text-[13px] leading-snug break-words mt-0.5">
                        {renderBBCode(msg.text, {
                          linkClassName: 'text-blue-300 hover:text-blue-200 underline break-all',
                          quoteClassName: 'my-1 border-l-2 border-gold-400/40 pl-2 text-ink-200 italic',
                          codeClassName: 'px-1.5 py-0.5 rounded bg-ink-800/65 text-ink-100 font-mono text-[0.92em]',
                        })}
                      </p>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {user && (
              <div className="px-3 py-2.5 bg-ink-800/45 border-t border-ink-700/35 shrink-0 relative">
                {currentMute ? (
                  <div className="flex items-center justify-center gap-2 py-3 px-2 text-orange-400 text-xs text-center">
                    <VolumeX className="w-4 h-4 shrink-0" />
                    <span>Мут чата: {formatMuteRemaining(currentMute.until)}</span>
                  </div>
                ) : (
                  <>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-3 mb-2 w-[320px] max-w-[calc(100%-1.5rem)] bg-ink-900 border border-gold-700/30 rounded-2xl shadow-2xl p-3 z-20 animate-fadeIn">
                        <div className="flex items-center gap-1 mb-3 overflow-x-auto">
                          {[
                            { key: 'recent', label: '🕘' },
                            { key: 'faces', label: '😀' },
                            { key: 'game', label: '⚔️' },
                            { key: 'symbols', label: '✨' },
                          ].map(tab => (
                            <button
                              key={tab.key}
                              onClick={() => setEmojiTab(tab.key as typeof emojiTab)}
                              className={`px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-colors shrink-0 ${emojiTab === tab.key ? 'bg-gold-400/20 text-gold-400' : 'bg-ink-800/40 text-ink-400 hover:text-ink-200'}`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto">
                          {(emojiGroups[emojiTab].length ? emojiGroups[emojiTab] : emojiGroups.faces).map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => addEmoji(emoji)}
                              className="h-8 rounded-lg hover:bg-ink-800/60 text-lg cursor-pointer transition-colors"
                              title={emoji}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        {emojiTab === 'recent' && recentEmojis.length === 0 && (
                          <p className="text-ink-500 text-[10px] mt-2 text-center">Недавних emoji пока нет</p>
                        )}
                      </div>
                    )}
                    {showBbcodePicker && (
                      <div className="absolute bottom-full left-14 mb-2 w-[230px] max-w-[calc(100%-3rem)] bg-ink-900/95 border border-gold-700/35 rounded-xl shadow-2xl p-2.5 z-20 animate-fadeIn">
                        <p className="text-[10px] text-ink-300 mb-2 px-1">Выделите текст и выберите стиль:</p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button onClick={() => applyBbCode('[b]', '[/b]')} className="px-2 py-1.5 rounded-lg text-xs bg-ink-800/60 text-ink-200 hover:bg-gold-400/15 hover:text-gold-300 cursor-pointer">[b] Жирный</button>
                          <button onClick={() => applyBbCode('[i]', '[/i]')} className="px-2 py-1.5 rounded-lg text-xs bg-ink-800/60 text-ink-200 hover:bg-gold-400/15 hover:text-gold-300 cursor-pointer">[i] Курсив</button>
                          <button onClick={() => applyBbCode('[u]', '[/u]')} className="px-2 py-1.5 rounded-lg text-xs bg-ink-800/60 text-ink-200 hover:bg-gold-400/15 hover:text-gold-300 cursor-pointer">[u] Подчеркн.</button>
                          <button onClick={() => applyBbCode('[s]', '[/s]')} className="px-2 py-1.5 rounded-lg text-xs bg-ink-800/60 text-ink-200 hover:bg-gold-400/15 hover:text-gold-300 cursor-pointer">[s] Зачеркн.</button>
                          <button onClick={() => applyBbCode('[quote]', '[/quote]')} className="px-2 py-1.5 rounded-lg text-xs bg-ink-800/60 text-ink-200 hover:bg-gold-400/15 hover:text-gold-300 cursor-pointer">[quote]</button>
                          <button onClick={() => applyBbCode('[url]', '[/url]', 'https://')} className="px-2 py-1.5 rounded-lg text-xs bg-ink-800/60 text-ink-200 hover:bg-gold-400/15 hover:text-gold-300 cursor-pointer">[url]</button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowEmojiPicker(prev => !prev)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${showEmojiPicker ? 'bg-gold-400/20 text-gold-400 border-gold-400/40' : 'bg-ink-700/50 text-ink-400 border-ink-600/30 hover:text-gold-400 hover:border-gold-400/30'}`}
                        title="Emoji"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setShowBbcodePicker(prev => !prev);
                          setShowEmojiPicker(false);
                        }}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${showBbcodePicker ? 'bg-gold-400/20 text-gold-400 border-gold-400/40' : 'bg-ink-700/50 text-ink-400 border-ink-600/30 hover:text-gold-400 hover:border-gold-400/30'}`}
                        title="BB-коды"
                      >
                        <Type className="w-4 h-4" />
                      </button>
                      <input
                        ref={inputRef}
                        type="text"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Сообщение..."
                        maxLength={500}
                        className="flex-1 bg-ink-700/50 border border-ink-600/30 rounded-xl px-3 py-2 text-sm text-white
                                 placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                      />
                      <button onClick={handleSend} disabled={!text.trim()}
                        className="p-2 rounded-xl bg-gold-400/20 text-gold-400 hover:bg-gold-400/30 cursor-pointer
                                 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    {sendError && <p className="text-crimson-400 text-[10px] mt-1 px-1">{sendError}</p>}
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Fixed-position mod context menu */}
      {actionMenu && menuPos && (() => {
        const msg = visibleMessages.find(m => m.id === actionMenu);
        if (!msg) return null;
        const userMuted = isUserMuted(msg.userId);

        return (
          <>
            {/* Invisible backdrop to close menu */}
            <div className="fixed inset-0 z-[60]" onClick={() => { setActionMenu(null); setMenuPos(null); }} />

            <div
              className="fixed z-[61] w-48 bg-ink-900 border border-ink-700/50 rounded-xl shadow-2xl overflow-hidden animate-fadeIn"
              style={{
                right: window.innerWidth - menuPos.x + 4,
                ...(menuPos.openUp
                  ? { bottom: window.innerHeight - menuPos.y + 4 }
                  : { top: menuPos.y + 4 }),
              }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-1.5 space-y-0.5">
                <button onClick={() => { deleteMessage(msg.id); setActionMenu(null); setMenuPos(null); }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-crimson-400 hover:bg-crimson-400/10 cursor-pointer">
                  <Trash2 className="w-3 h-3" /> Удалить сообщение
                </button>
                {canMute && (
                  !userMuted ? (
                    <div className="px-2.5 py-1.5">
                      <div className="text-[10px] text-orange-400 mb-1 flex items-center gap-1"><VolumeX className="w-3 h-3" /> Замутить:</div>
                      <div className="flex gap-1">
                        {[5, 15, 30, 60].map(m => (
                          <button key={m} onClick={() => { muteUser(msg.userId, m); setActionMenu(null); setMenuPos(null); }}
                            className="flex-1 text-[9px] py-1 rounded bg-orange-400/10 text-orange-400 hover:bg-orange-400/20 cursor-pointer">{m}м</button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { unmuteUser(msg.userId); setActionMenu(null); setMenuPos(null); }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-jade-400 hover:bg-jade-400/10 cursor-pointer">
                      <Volume2 className="w-3 h-3" /> Снять мут
                    </button>
                  )
                )}
                {hasPermission('chat.ban') && (
                  <button onClick={() => { chatBanUser(msg.userId); setActionMenu(null); setMenuPos(null); }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] text-crimson-400 hover:bg-crimson-400/10 cursor-pointer">
                    <Ban className="w-3 h-3" /> Заблокировать (7 дн.)
                  </button>
                )}
              </div>
            </div>
          </>
        );
      })()}
    </div>
  );
}

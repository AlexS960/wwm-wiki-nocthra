import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, X, Send, User, ArrowLeft } from 'lucide-react';

interface PrivateMessagesProps { onLoginClick: () => void; }

export default function PrivateMessages({ onLoginClick }: PrivateMessagesProps) {
  const { user, registeredUsers, privateMessages, unreadPMCount, sendPrivateMessage, markPMRead } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'compose' | 'chat'>('list');
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [recipientId, setRecipientId] = useState('');
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && view === 'chat' && activeChatId) {
      markPMRead(activeChatId);
    }
  }, [isOpen, view, activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [privateMessages, view]);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-6 z-40 bg-purple-500/20 backdrop-blur-sm border border-purple-400/40 text-purple-400 p-3.5 rounded-full shadow-lg hover:bg-purple-500/30 hover:scale-110 transition-all duration-300 cursor-pointer">
        <Mail className="w-6 h-6" />
        {unreadPMCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-crimson-400 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-fadeIn">
            {unreadPMCount > 9 ? '9+' : unreadPMCount}
          </span>
        )}
      </button>
    );
  }

  const chats = privateMessages.reduce<{ id: string; name: string; lastMsg: string; ts: number; unread: number }[]>((acc, m) => {
    const otherId = m.fromId === user?.id ? m.toId : m.fromId;
    const otherName = m.fromId === user?.id ? m.toName : m.fromName;
    const existing = acc.find(c => c.id === otherId);
    if (existing) {
      if (m.timestamp > existing.ts) { existing.lastMsg = m.text; existing.ts = m.timestamp; }
      if (m.toId === user?.id && !m.read) existing.unread++;
    } else {
      acc.push({ id: otherId, name: otherName, lastMsg: m.text, ts: m.timestamp, unread: m.toId === user?.id && !m.read ? 1 : 0 });
    }
    return acc;
  }, []).sort((a, b) => b.ts - a.ts);

  const activeChatMsgs = activeChatId
    ? privateMessages.filter(m => (m.fromId === user?.id && m.toId === activeChatId) || (m.fromId === activeChatId && m.toId === user?.id)).sort((a, b) => a.timestamp - b.timestamp)
    : [];

  const activeChatName = chats.find(c => c.id === activeChatId)?.name || '';

  const handleSend = () => {
    if (!text.trim() || !activeChatId) return;
    sendPrivateMessage(activeChatId, activeChatName, text.trim());
    setText('');
  };

  const handleCompose = () => {
    if (!text.trim() || !recipientId) return;
    const target = registeredUsers.find(u => u.id === recipientId);
    if (!target) return;
    sendPrivateMessage(recipientId, target.name, text.trim());
    setText(''); setRecipientId(''); setView('list');
  };

  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 w-[340px] sm:w-[380px]">
      <div className="bg-ink-900 border border-purple-700/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col" style={{ height: 'min(500px, 70vh)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-ink-800/80 border-b border-ink-700/30 shrink-0">
          <div className="flex items-center gap-2">
            {view !== 'list' && (
              <button onClick={() => { setView('list'); setActiveChatId(null); }} className="p-1 text-ink-400 hover:text-white cursor-pointer"><ArrowLeft className="w-4 h-4" /></button>
            )}
            <Mail className="w-4 h-4 text-purple-400" />
            <span className="font-serif text-sm font-bold text-white">{view === 'compose' ? 'Новое сообщение' : view === 'chat' ? activeChatName : 'Сообщения'}</span>
            {view === 'list' && unreadPMCount > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-crimson-400/20 text-crimson-400">{unreadPMCount}</span>}
          </div>
          <div className="flex items-center gap-0.5">
            {view === 'list' && <button onClick={() => setView('compose')} className="p-1.5 text-ink-400 hover:text-purple-400 rounded-lg hover:bg-ink-700/50 cursor-pointer"><User className="w-4 h-4" /></button>}
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <Mail className="w-10 h-10 text-ink-700 mb-3" />
              <p className="text-ink-400 text-sm mb-3">Войдите для отправки сообщений</p>
              <button onClick={onLoginClick} className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm cursor-pointer hover:bg-purple-500/30">Войти</button>
            </div>
          ) : view === 'list' ? (
            chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <Mail className="w-8 h-8 text-ink-700 mb-2" />
                <p className="text-ink-500 text-xs">Нет сообщений</p>
              </div>
            ) : (
              <div className="space-y-1">
                {chats.map(chat => (
                  <button key={chat.id} onClick={() => { setActiveChatId(chat.id); setView('chat'); }}
                    className="w-full text-left bg-ink-800/50 border border-ink-700/30 rounded-xl p-3 hover:border-purple-500/20 cursor-pointer flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium truncate">{chat.name}</span>
                        <span className="text-ink-500 text-[10px] shrink-0">{new Date(chat.ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-ink-400 text-xs truncate">{chat.lastMsg}</p>
                    </div>
                    {chat.unread > 0 && <span className="w-5 h-5 rounded-full bg-purple-400 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{chat.unread}</span>}
                  </button>
                ))}
              </div>
            )
          ) : view === 'compose' ? (
            <div className="space-y-3">
              <select value={recipientId} onChange={e => setRecipientId(e.target.value)}
                className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white cursor-pointer focus:outline-none">
                <option value="">Выберите получателя...</option>
                {registeredUsers.filter(u => u.id !== user.id).map(u => (
                  <option key={u.id} value={u.id}>{u.name} {u.gameNickname ? `(${u.gameNickname})` : ''}</option>
                ))}
              </select>
              <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Сообщение..."
                className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50 resize-none" />
              <button onClick={handleCompose} disabled={!recipientId || !text.trim()}
                className="w-full bg-purple-500/20 text-purple-400 py-2 rounded-lg text-sm font-medium hover:bg-purple-500/30 cursor-pointer disabled:opacity-40">
                <Send className="w-4 h-4 inline mr-1" />Отправить
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {activeChatMsgs.map(msg => {
                const isSelf = msg.fromId === user.id;
                return (
                  <div key={msg.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${isSelf ? 'bg-purple-500/20 text-purple-200 rounded-br-md' : 'bg-ink-700/50 text-ink-200 rounded-bl-md'}`}>
                      <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                      <p className="text-[9px] text-ink-500 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input for chat view */}
        {view === 'chat' && user && (
          <div className="px-3 py-2.5 bg-ink-800/50 border-t border-ink-700/30 shrink-0 flex items-center gap-2">
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Сообщение..." maxLength={500}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              className="flex-1 bg-ink-700/50 border border-ink-600/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50" />
            <button onClick={handleSend} disabled={!text.trim()}
              className="p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 cursor-pointer disabled:opacity-30 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

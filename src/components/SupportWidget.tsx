import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageCircle, X, Send, HelpCircle } from 'lucide-react';

interface SupportWidgetProps { onLoginClick: () => void; }

export default function SupportWidget({ onLoginClick }: SupportWidgetProps) {
  const { user, supportTickets, createTicket, replyToTicket, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'ticket'>('list');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canManage = hasPermission('support.view_all');

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, view, activeTicketId]);

  const handleCreate = () => {
    if (!subject.trim() || !message.trim()) return;
    createTicket(subject.trim(), message.trim());
    setSubject(''); setMessage(''); setView('list');
  };

  const handleReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    replyToTicket(ticketId, replyText.trim());
    setReplyText('');
  };

  const activeTicket = supportTickets.find(t => t.id === activeTicketId);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 text-blue-400 p-3.5 rounded-full shadow-lg hover:bg-blue-500/30 hover:scale-110 transition-all duration-300 cursor-pointer">
        <HelpCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 w-[340px] sm:w-[380px]">
      <div className="bg-ink-900 border border-blue-700/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col" style={{ height: 'min(500px, 70vh)' }}>
        <div className="flex items-center justify-between px-4 py-2.5 bg-ink-800/80 border-b border-ink-700/30 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="font-serif text-sm font-bold text-white">Техподдержка</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => { setView('list'); setActiveTicketId(null); }}
              className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer"><MessageCircle className="w-4 h-4" /></button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <HelpCircle className="w-10 h-10 text-ink-700 mb-3" />
              <p className="text-ink-400 text-sm mb-3">Войдите для обращения в поддержку</p>
              <button onClick={onLoginClick} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm cursor-pointer hover:bg-blue-500/30">Войти</button>
            </div>
          ) : view === 'list' ? (
            <div className="space-y-2">
              <button onClick={() => setView('create')}
                className="w-full bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-blue-500/20 cursor-pointer">
                + Создать обращение
              </button>
              {(canManage ? supportTickets : supportTickets.filter(t => t.userId === user.id)).map(ticket => (
                <button key={ticket.id} onClick={() => { setActiveTicketId(ticket.id); setView('ticket'); }}
                  className="w-full text-left bg-ink-800/50 border border-ink-700/30 rounded-lg p-3 hover:border-blue-500/20 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium truncate">{ticket.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      ticket.status === 'open' ? 'bg-orange-400/10 text-orange-400' :
                      ticket.status === 'answered' ? 'bg-blue-400/10 text-blue-400' : 'bg-ink-700/50 text-ink-400'
                    }`}>{ticket.status === 'open' ? 'Открыт' : ticket.status === 'answered' ? 'Отвечен' : 'Закрыт'}</span>
                  </div>
                  <p className="text-ink-400 text-xs mt-1 truncate">{ticket.message}</p>
                </button>
              ))}
            </div>
          ) : view === 'create' ? (
            <div className="space-y-3">
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Тема обращения"
                className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-blue-400/50" />
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={4} placeholder="Опишите проблему..."
                className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-blue-400/50 resize-none" />
              <div className="flex gap-2">
                <button onClick={handleCreate} disabled={!subject.trim() || !message.trim()}
                  className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/30 cursor-pointer disabled:opacity-40">Отправить</button>
                <button onClick={() => setView('list')} className="px-4 bg-ink-700 text-ink-300 py-2 rounded-lg text-sm hover:bg-ink-600 cursor-pointer">Назад</button>
              </div>
            </div>
          ) : activeTicket ? (
            <div className="space-y-3">
              <button onClick={() => { setView('list'); setActiveTicketId(null); }} className="text-ink-400 hover:text-white text-xs cursor-pointer">← К списку</button>
              <h3 className="text-white font-medium">{activeTicket.subject}</h3>
              <p className="text-ink-400 text-xs">{activeTicket.message}</p>
              <div className="space-y-2 mt-3">
                {activeTicket.replies.map(r => (
                  <div key={r.id} className="bg-ink-800/50 border border-ink-700/30 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-white">{r.authorName}</span>
                      <span className="text-[9px] text-ink-500">{r.authorRole}</span>
                    </div>
                    <p className="text-ink-200 text-xs">{r.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              {activeTicket.status !== 'closed' && (
                <div className="flex gap-2">
                  <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Ответ..."
                    className="flex-1 bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-blue-400/50"
                    onKeyDown={e => { if (e.key === 'Enter') handleReply(activeTicket.id); }} />
                  <button onClick={() => handleReply(activeTicket.id)} disabled={!replyText.trim()}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 cursor-pointer disabled:opacity-40"><Send className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

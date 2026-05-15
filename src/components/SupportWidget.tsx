import { useState } from 'react';
import { useAuth, type SupportTicket } from '../context/AuthContext';
import {
  HelpCircle, X, Send, ArrowLeft, Plus, ChevronDown,
  CheckCircle, Clock, MessageCircle, Trash2, Minus
} from 'lucide-react';

interface SupportWidgetProps {
  onLoginClick: () => void;
}

export default function SupportWidget({ onLoginClick }: SupportWidgetProps) {
  const { user, supportTickets, createTicket, replyToTicket, closeTicket, deleteTicket, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Form
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');

  const canViewAll = hasPermission('support.view_all');
  const canReply = hasPermission('support.reply');
  const canClose = hasPermission('support.close');
  const canDelete = hasPermission('support.delete');
  const isStaff = canViewAll;
  const myTickets = isStaff ? supportTickets : supportTickets.filter(t => t.userId === user?.id);
  const openCount = myTickets.filter(t => t.status === 'open').length;

  const handleCreate = () => {
    if (!subject.trim() || !message.trim()) return;
    createTicket(subject.trim(), message.trim());
    setSubject(''); setMessage(''); setView('list');
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    replyToTicket(selectedTicket.id, replyText.trim());
    setReplyText('');
    // Refresh selected ticket
    const updated = supportTickets.find(t => t.id === selectedTicket.id);
    if (updated) setSelectedTicket({ ...updated });
  };

  const openTicket = (t: SupportTicket) => {
    setSelectedTicket(t); setView('detail'); setReplyText('');
  };

  const statusStyle: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    open: { label: 'Открыт', color: 'text-gold-400 bg-gold-400/10', icon: <Clock className="w-3 h-3" /> },
    answered: { label: 'Отвечен', color: 'text-jade-400 bg-jade-400/10', icon: <CheckCircle className="w-3 h-3" /> },
    closed: { label: 'Закрыт', color: 'text-ink-400 bg-ink-700/50', icon: <X className="w-3 h-3" /> },
  };

  if (!isOpen) {
    return (
      <button onClick={() => { setIsOpen(true); setIsMinimized(false); }}
        className="fixed bottom-6 right-20 z-40 bg-purple-500/20 backdrop-blur-sm border border-purple-500/40 text-purple-400 p-3.5 rounded-full shadow-lg hover:bg-purple-500/30 hover:scale-110 transition-all duration-300 cursor-pointer">
        <HelpCircle className="w-6 h-6" />
        {openCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-400 text-ink-900 text-[10px] font-bold rounded-full flex items-center justify-center">
            {openCount > 9 ? '9+' : openCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={`fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 transition-all duration-300 ${isMinimized ? 'w-72' : 'w-[360px] sm:w-[400px]'}`}>
      <div className="bg-ink-900 border border-purple-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
        style={{ height: isMinimized ? 'auto' : 'min(520px, 70vh)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-purple-950/60 border-b border-purple-500/20 shrink-0 cursor-pointer"
          onClick={() => isMinimized && setIsMinimized(false)}>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-purple-400" />
            <span className="font-serif text-sm font-bold text-white">Техподдержка</span>
            {openCount > 0 && <span className="text-[10px] bg-gold-400/20 text-gold-400 px-1.5 py-0.5 rounded-full">{openCount}</span>}
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={e => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={e => { e.stopPropagation(); setIsOpen(false); setView('list'); }} className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Not logged in */}
            {!user ? (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <HelpCircle className="w-10 h-10 text-ink-700 mb-3" />
                <p className="text-ink-400 text-sm mb-3">Войдите, чтобы создать обращение</p>
                <button onClick={onLoginClick} className="px-4 py-2 bg-gold-400/20 text-gold-400 rounded-lg text-sm cursor-pointer hover:bg-gold-400/30">Войти</button>
              </div>
            ) : view === 'new' ? (
              /* New ticket form */
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <button onClick={() => setView('list')} className="flex items-center gap-1 text-ink-400 hover:text-white text-xs cursor-pointer mb-1">
                  <ArrowLeft className="w-3 h-3" /> Назад к списку
                </button>
                <h3 className="font-serif text-base font-bold text-white">Новое обращение</h3>
                <div>
                  <label className="text-ink-400 text-xs mb-1 block">Тема *</label>
                  <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Кратко опишите проблему"
                    className="w-full bg-ink-800 border border-ink-600/30 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50" />
                </div>
                <div>
                  <label className="text-ink-400 text-xs mb-1 block">Сообщение *</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} placeholder="Опишите вашу проблему подробно..."
                    className="w-full bg-ink-800 border border-ink-600/30 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50 resize-none" />
                </div>
                <button onClick={handleCreate} disabled={!subject.trim() || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-purple-500/20 text-purple-400 border border-purple-500/40 py-2.5 rounded-xl text-sm font-medium cursor-pointer hover:bg-purple-500/30 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" /> Отправить
                </button>
              </div>
            ) : view === 'detail' && selectedTicket ? (
              /* Ticket detail */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 pt-3 pb-2 border-b border-ink-700/30 shrink-0">
                  <button onClick={() => { setView('list'); setSelectedTicket(null); }} className="flex items-center gap-1 text-ink-400 hover:text-white text-xs cursor-pointer mb-2">
                    <ArrowLeft className="w-3 h-3" /> Назад
                  </button>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif text-sm font-bold text-white truncate">{selectedTicket.subject}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-ink-500 text-[10px]">{selectedTicket.userName}</span>
                        <span className="text-ink-600 text-[10px]">{selectedTicket.createdAt}</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${statusStyle[selectedTicket.status].color}`}>
                          {statusStyle[selectedTicket.status].icon} {statusStyle[selectedTicket.status].label}
                        </span>
                      </div>
                    </div>
                    {selectedTicket.status !== 'closed' && (selectedTicket.userId === user.id || canClose) && (
                      <button onClick={() => { closeTicket(selectedTicket.id); setSelectedTicket({ ...selectedTicket, status: 'closed' }); }}
                        className="text-ink-500 hover:text-crimson-400 text-[10px] cursor-pointer shrink-0">Закрыть</button>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                  {/* Original message */}
                  <div className="bg-ink-800/50 rounded-xl p-3">
                    <div className="text-ink-500 text-[10px] mb-1">{selectedTicket.userName} · {selectedTicket.createdAt}</div>
                    <p className="text-ink-200 text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
                  </div>

                  {/* Replies */}
                  {supportTickets.find(t => t.id === selectedTicket.id)?.replies.map(r => (
                    <div key={r.id} className={`rounded-xl p-3 ${r.authorRole !== 'Странник' ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-ink-800/50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium" style={{ color: r.authorRole !== 'Странник' ? '#a882ff' : '#b0a696' }}>{r.authorName}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: r.authorRole !== 'Странник' ? 'rgba(168,130,255,0.1)' : 'rgba(176,166,150,0.1)', color: r.authorRole !== 'Странник' ? '#a882ff' : '#b0a696' }}>
                          {r.authorRole}
                        </span>
                        <span className="text-ink-600 text-[10px]">{r.createdAt}</span>
                      </div>
                      <p className="text-ink-200 text-sm whitespace-pre-wrap">{r.message}</p>
                    </div>
                  ))}
                </div>

                {/* Reply input */}
                {selectedTicket.status !== 'closed' && (selectedTicket.userId === user.id || canReply) && (
                  <div className="px-4 py-3 border-t border-ink-700/30 shrink-0">
                    <div className="flex gap-2">
                      <input value={replyText} onChange={e => setReplyText(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleReply(); }}
                        placeholder="Написать ответ..."
                        className="flex-1 bg-ink-700/50 border border-ink-600/30 rounded-xl px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/50" />
                      <button onClick={handleReply} disabled={!replyText.trim()}
                        className="p-2 rounded-xl bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Tickets list */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 pt-3 pb-2 flex items-center justify-between shrink-0">
                  <span className="text-ink-400 text-xs">{isStaff ? 'Все обращения' : 'Мои обращения'} ({myTickets.length})</span>
                  <button onClick={() => setView('new')}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium cursor-pointer hover:bg-purple-500/30 border border-purple-500/30">
                    <Plus className="w-3 h-3" /> Создать
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 pb-3 space-y-2">
                  {myTickets.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageCircle className="w-8 h-8 text-ink-700 mx-auto mb-2" />
                      <p className="text-ink-500 text-xs">Нет обращений</p>
                      <p className="text-ink-600 text-[10px] mt-1">Нажмите «Создать» если нужна помощь</p>
                    </div>
                  ) : (
                    myTickets.map(t => {
                      const st = statusStyle[t.status];
                      return (
                        <div key={t.id} onClick={() => openTicket(t)}
                          className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-3 cursor-pointer hover:border-purple-500/30 transition-colors group">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-white text-sm font-medium truncate group-hover:text-purple-300 transition-colors">{t.subject}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full ${st.color}`}>
                                  {st.icon} {st.label}
                                </span>
                                <span className="text-ink-600 text-[10px]">{t.createdAt}</span>
                                {t.replies.length > 0 && <span className="text-ink-500 text-[10px]">{t.replies.length} ответ(ов)</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {canDelete && (
                                <button onClick={e => { e.stopPropagation(); deleteTicket(t.id); }}
                                  className="p-1 text-ink-600 hover:text-crimson-400 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              )}
                              <ChevronDown className="w-4 h-4 text-ink-500" />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCloseFloatPanels } from '../lib/closeFloatPanels';
import { MessageCircle, X, Send, HelpCircle, Lock, Trash2 } from 'lucide-react';
interface SupportWidgetProps { onLoginClick: () => void; }

export default function SupportWidget({ onLoginClick }: SupportWidgetProps) {
  const {
    user, supportTickets, createTicket, replyToTicket, closeTicket, deleteTicket,
    hasPermission, getUserDisplayName, ensureSupportLoaded, supportLoaded,
  } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const closePanel = useCallback(() => {
    setIsOpen(false);
    setView('list');
    setActiveTicketId(null);
  }, []);
  useCloseFloatPanels(closePanel);
  const [view, setView] = useState<'list' | 'create' | 'ticket'>('list');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [replyText, setReplyText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const canManage = hasPermission('support.view_all');
  const canReply = hasPermission('support.reply') || canManage;
  const canClose = hasPermission('support.close') || canManage;
  const canDelete = hasPermission('support.delete');

  useEffect(() => {
    if (isOpen) void ensureSupportLoaded();
  }, [isOpen, ensureSupportLoaded]);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [isOpen, view, activeTicketId, supportTickets]);

  const handleCreate = async () => {
    if (!subject.trim() || !message.trim() || saving) return;
    setSaving(true);
    setActionError(null);
    const err = await createTicket(subject.trim(), message.trim());
    setSaving(false);
    if (err) setActionError(err);
    else { setSubject(''); setMessage(''); setView('list'); }
  };

  const handleReply = async (ticketId: string) => {
    if (!replyText.trim() || saving) return;
    setSaving(true);
    setActionError(null);
    const err = await replyToTicket(ticketId, replyText.trim());
    setSaving(false);
    if (err) setActionError(err);
    else setReplyText('');
  };

  const handleClose = async (ticketId: string) => {
    setSaving(true);
    setActionError(null);
    const err = await closeTicket(ticketId);
    setSaving(false);
    if (err) setActionError(err);
    else { setView('list'); setActiveTicketId(null); }
  };

  const handleDelete = async (ticketId: string) => {
    setSaving(true);
    setActionError(null);
    const err = await deleteTicket(ticketId);
    setSaving(false);
    if (err) setActionError(err);
    else { setConfirmDelete(false); setView('list'); setActiveTicketId(null); }
  };

  const activeTicket = supportTickets.find(t => t.id === activeTicketId);
  const ticketAuthorName = activeTicket
    ? getUserDisplayName(activeTicket.userId, activeTicket.userName)
    : '';

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="hover-glow-btn hover-glow-blue fixed bottom-6 right-6 z-40 bg-blue-500/20 backdrop-blur-sm border border-blue-400/40 text-blue-400 p-3.5 rounded-full shadow-lg hover:bg-blue-500/30 hover:scale-110 transition-all duration-300 cursor-pointer">
        <HelpCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-50 w-[340px] sm:w-[380px]">
      <div className="bg-ink-900/72 backdrop-blur-lg border border-blue-700/35 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col" style={{ height: 'min(500px, 70vh)' }}>
        <div className="flex items-center justify-between px-4 py-2.5 bg-ink-800/65 border-b border-ink-700/35 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="font-serif text-sm font-bold text-white">Техподдержка</span>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => { setView('list'); setActiveTicketId(null); setConfirmDelete(false); }}
              className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer"><MessageCircle className="w-4 h-4" /></button>
            <button onClick={() => setIsOpen(false)} className="p-1.5 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {user && !supportLoaded ? (
            <p className="text-center text-ink-500 text-sm py-8">Загрузка обращений…</p>
          ) : !user ? (
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
                <button key={ticket.id} onClick={() => { setActiveTicketId(ticket.id); setView('ticket'); setConfirmDelete(false); }}
                  className="w-full text-left bg-ink-800/45 border border-ink-700/35 rounded-lg p-3 hover:border-blue-500/20 cursor-pointer">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-white text-sm font-medium truncate">{ticket.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      ticket.status === 'open' ? 'bg-orange-400/10 text-orange-400' :
                      ticket.status === 'answered' ? 'bg-blue-400/10 text-blue-400' : 'bg-ink-700/50 text-ink-400'
                    }`}>{ticket.status === 'open' ? 'Открыт' : ticket.status === 'answered' ? 'Отвечен' : 'Закрыт'}</span>
                  </div>
                  <p className="text-ink-500 text-[10px] mt-0.5">{getUserDisplayName(ticket.userId, ticket.userName)}</p>
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
                <button onClick={handleCreate} disabled={!subject.trim() || !message.trim() || saving}
                  className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg text-sm font-medium hover:bg-blue-500/30 cursor-pointer disabled:opacity-40">
                  {saving ? 'Отправка…' : 'Отправить'}
                </button>
                <button onClick={() => setView('list')} className="px-4 bg-ink-700 text-ink-300 py-2 rounded-lg text-sm hover:bg-ink-600 cursor-pointer">Назад</button>
              </div>
            </div>
          ) : activeTicket ? (
            <div className="space-y-3">
              <button onClick={() => { setView('list'); setActiveTicketId(null); setConfirmDelete(false); }} className="text-ink-400 hover:text-white text-xs cursor-pointer">← К списку</button>
              <div>
                <h3 className="text-white font-medium">{activeTicket.subject}</h3>
                {canManage && <p className="text-ink-500 text-[10px] mt-0.5">Автор: {ticketAuthorName}</p>}
              </div>
              <div className="bg-ink-800/45 border border-ink-700/35 rounded-lg p-2">
                <p className="text-ink-200 text-xs whitespace-pre-wrap">{activeTicket.message}</p>
              </div>
              <div className="space-y-2">
                {activeTicket.replies.map(r => (
                  <div key={r.id} className="bg-ink-800/45 border border-ink-700/35 rounded-lg p-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-white">{r.authorName}</span>
                      {r.authorRole && <span className="text-[9px] text-blue-400/80">{r.authorRole}</span>}
                    </div>
                    <p className="text-ink-200 text-xs whitespace-pre-wrap">{r.message}</p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {(canClose || canDelete || activeTicket.userId === user.id) && activeTicket.status !== 'closed' && (
                <div className="flex gap-2 pt-1">
                  {(canClose || activeTicket.userId === user.id) && (
                    <button onClick={() => handleClose(activeTicket.id)} disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs bg-ink-700/80 text-ink-200 hover:bg-ink-600 cursor-pointer">
                      <Lock className="w-3.5 h-3.5" /> Закрыть тему
                    </button>
                  )}
                  {canDelete && (
                    <button onClick={() => setConfirmDelete(true)}
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs bg-crimson-400/10 text-crimson-400 hover:bg-crimson-400/20 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}

              {confirmDelete && (
                <div className="bg-crimson-400/10 border border-crimson-400/30 rounded-lg p-3 space-y-2">
                  <p className="text-ink-200 text-xs">Удалить обращение безвозвратно?</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(activeTicket.id)} disabled={saving}
                      className="flex-1 py-1.5 rounded-lg text-xs bg-crimson-400/20 text-crimson-400 cursor-pointer">Удалить</button>
                    <button onClick={() => setConfirmDelete(false)} className="flex-1 py-1.5 rounded-lg text-xs bg-ink-700 text-ink-300 cursor-pointer">Отмена</button>
                  </div>
                </div>
              )}

              {activeTicket.status === 'closed' && (
                <p className="text-ink-500 text-xs text-center py-2">Тема закрыта</p>
              )}

              {activeTicket.status !== 'closed' && canReply && (
                <div className="flex gap-2">
                  <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Ответ..."
                    className="flex-1 bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-blue-400/50"
                    onKeyDown={e => { if (e.key === 'Enter') handleReply(activeTicket.id); }} />
                  <button onClick={() => handleReply(activeTicket.id)} disabled={!replyText.trim() || saving}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 cursor-pointer disabled:opacity-40"><Send className="w-4 h-4" /></button>
                </div>
              )}

              {actionError && (
                <p className="text-crimson-400 text-xs text-center px-2">{actionError}</p>
              )}

              {activeTicket.status === 'closed' && canDelete && !confirmDelete && (
                <button onClick={() => setConfirmDelete(true)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-crimson-400 bg-crimson-400/10 hover:bg-crimson-400/20 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /> Удалить обращение
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

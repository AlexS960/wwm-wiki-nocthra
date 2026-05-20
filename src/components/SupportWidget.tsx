import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { HelpCircle, X, Send, ArrowLeft, Plus, ChevronDown, Clock, Minus } from 'lucide-react';

interface SupportWidgetProps {
  onLoginClick: () => void;
}

export default function SupportWidget({ onLoginClick }: SupportWidgetProps) {
  const { user, supportTickets, createTicket, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'list' | 'new' | 'detail'>('list');

  // Автоопрос (Polling) новых ответов в тикетах каждые 10 секунд
  useEffect(() => {
    if (!user) return;

    const fetchTicketsInterval = setInterval(() => {
      // Здесь вызывается метод рефетча данных из вашего AuthContext
      // Например: refreshSupportTickets()
      console.log('Синхронизация тикетов техподдержки...');
    }, 10000); 

    // Альтернатива на Supabase Realtime для мгновенного ответа:
    const channel = supabase
      .channel('support-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets' }, () => {
         // Код обновления контекста тикетов
      })
      .subscribe();

    return () => {
      clearInterval(fetchTicketsInterval);
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-ink-800 border border-gold-600/40 text-gold-400 rounded-full shadow-lg hover:bg-ink-700 transition-all hover:-translate-y-0.5 cursor-pointer"
      >
        <HelpCircle className="w-5 h-5 animate-spin-slow" />
        <span className="text-xs font-medium tracking-wide hidden sm:inline">Помощь</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-85 h-100 bg-ink-900/95 border border-gold-700/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleIn backdrop-blur-md">
      {/* Шапка */}
      <div className="bg-ink-800/80 px-4 py-3 border-b border-gold-700/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-gold-400" />
          <h3 className="font-serif font-bold text-gold-400 text-sm">Служба спасения Цзянху</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-ink-400 hover:text-crimson-400 transition-colors cursor-pointer">
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Контент с плавной анимацией смены экранов */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar animate-slideUp">
        {view === 'list' && (
          <div className="space-y-3">
            <button 
              onClick={() => setView('new')}
              className="w-full py-2.5 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 text-gold-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" /> Создать обращение
            </button>
            
            {/* Список тикетов */}
            <div className="space-y-2">
              {supportTickets.map(ticket => (
                <div 
                  key={ticket.id}
                  className="p-3 bg-ink-800/40 border border-ink-700/30 rounded-xl hover:border-gold-400/30 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white truncate max-w-[70%]">{ticket.subject}</h4>
                    <span className="text-[9px] bg-gold-400/10 text-gold-400 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {ticket.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'new' && (
          <div className="space-y-3 animate-scaleIn">
            <button onClick={() => setView('list')} className="text-xs text-ink-400 hover:text-gold-400 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Назад к списку
            </button>
            {/* Форма создания */}
            <input type="text" placeholder="Тема обращения" className="w-full bg-ink-900 border border-ink-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-400" />
            <textarea rows={4} placeholder="Опишите вашу проблему..." className="w-full bg-ink-900 border border-ink-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-gold-400 resize-none" />
            <button className="w-full py-2 bg-gold-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-gold-600 transition-colors">
              Отправить свиток
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
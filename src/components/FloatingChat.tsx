import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase'; // Импортируем инстанс для подписки
import {
  MessageCircle, X, Send, Trash2, VolumeX, Volume2, Ban, Shield,
  Minus, Smile
} from 'lucide-react';

interface FloatingChatProps {
  onLoginClick: () => void;
}

export default function FloatingChat({ onLoginClick }: FloatingChatProps) {
  const {
    user, chatState, sendMessage, deleteMessage, hasPermission
  } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Плавный автоскролл при появлении сообщений
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [chatState.messages, isOpen]);

  // Свежие сообщения из базы в реальном времени (Автоопрос / Realtime)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        (payload) => {
          // Здесь вызывается метод синхронизации вашего стейта, 
          // Supabase автоматически пушит новое сообщение.
          // Если у вас локальный стейт, можно подтянуть dbLoadMessages() из контекста.
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full text-white shadow-lg hover:scale-110 active:scale-95 transition-transform cursor-pointer animate-pulseGlow"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 h-96 bg-ink-900/95 border border-gold-700/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-scaleIn backdrop-blur-md">
      {/* Шапка чата */}
      <div className="bg-ink-800/80 px-4 py-3 border-b border-gold-700/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-jade-400 animate-pulse" />
          <h3 className="font-serif font-bold text-gold-400 text-sm">Чат Цзянху</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-ink-400 hover:text-crimson-400 transition-colors cursor-pointer">
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Тело чата */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {chatState.messages.map((msg) => (
          <div 
            key={msg.id} 
            className="flex flex-col animate-slideInRight"
          >
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-semibold text-gold-300">{msg.userName}</span>
              <span className="text-[10px] text-ink-500">{msg.time}</span>
            </div>
            <p className="text-sm text-ink-100 bg-ink-800/40 border border-ink-700/10 rounded-lg p-2 mt-1 max-w-[90%] break-words">
              {msg.text}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Инпут */}
      <div className="p-3 bg-ink-800/50 border-t border-gold-700/10 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Напишите послание..."
          className="flex-1 bg-ink-900 border border-ink-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-gold-400 transition-colors"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              sendMessage(text);
              setText('');
            }
          }}
        />
        <button 
          onClick={() => { if(text.trim()) { sendMessage(text); setText(''); } }}
          className="p-2 bg-gold-500/20 text-gold-400 border border-gold-400/30 rounded-xl hover:bg-gold-500 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
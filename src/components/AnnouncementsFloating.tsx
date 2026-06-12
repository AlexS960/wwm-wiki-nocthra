import { useState } from 'react';
import { Megaphone, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AnnouncementsFloating() {
  const { siteSettings, addAnnouncement, removeAnnouncement } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="admin-btn hover-glow-btn flex items-center px-3 py-2.5 rounded-full bg-ink-900/85 backdrop-blur-md border border-orange-500/35 shadow-lg hover:bg-orange-500/10 hover:border-orange-500/55 transition-all cursor-pointer group w-fit"
      >
        <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Megaphone className="w-3.5 h-3.5 text-orange-400" />
        </div>
        <span className="admin-btn-text text-orange-400 text-xs font-medium">Объявления</span>
      </button>
    );
  }

  return (
    <div className="fixed left-4 z-50 w-80 animate-fadeIn" style={{ top: 'calc(84px + 52px)' }}>
      <div className="bg-ink-900 border border-orange-500/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-ink-800/80 border-b border-ink-700/30">
          <span className="font-serif text-sm font-bold text-white flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-orange-400" /> Объявления
          </span>
          <button type="button" onClick={() => setIsOpen(false)} className="p-1 text-ink-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Текст объявления..."
              className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-400/50"
            />
            <div className="flex gap-2">
              <select
                value={type}
                onChange={e => setType(e.target.value as typeof type)}
                className="bg-ink-800 border border-ink-700/50 rounded-lg px-2 py-2 text-sm text-white cursor-pointer focus:outline-none"
              >
                <option value="info">ℹ️ Инфо</option>
                <option value="warning">⚠️ Важно</option>
                <option value="success">✅ Успех</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (text.trim()) {
                    addAnnouncement(text.trim(), type);
                    setText('');
                  }
                }}
                className="flex items-center gap-1 px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Добавить
              </button>
            </div>
          </div>
          {siteSettings.announcements.map(ann => (
            <div
              key={ann.id}
              className={`flex items-center justify-between gap-2 rounded-lg p-2.5 text-xs border ${
                ann.type === 'warning' ? 'bg-orange-500/5 border-orange-500/20 text-orange-400' :
                ann.type === 'success' ? 'bg-jade-400/5 border-jade-400/20 text-jade-400' :
                'bg-blue-500/5 border-blue-500/20 text-blue-400'
              }`}
            >
              <span className="flex-1">{ann.text}</span>
              <button
                type="button"
                onClick={() => removeAnnouncement(ann.id)}
                className="text-ink-500 hover:text-crimson-400 cursor-pointer shrink-0"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

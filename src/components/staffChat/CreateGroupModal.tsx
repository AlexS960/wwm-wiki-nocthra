import { useState } from 'react';
import { X, Users } from 'lucide-react';
import type { StaffMemberView } from './types';
import { STAFF_CHAT_THEMES } from './staffChatThemes';

interface CreateGroupModalProps {
  staffList: StaffMemberView[];
  currentUserId: string;
  onClose: () => void;
  onCreate: (title: string, themeId: string, memberIds: string[]) => Promise<string | null>;
}

export default function CreateGroupModal({ staffList, currentUserId, onClose, onCreate }: CreateGroupModalProps) {
  const [title, setTitle] = useState('');
  const [themeId, setThemeId] = useState('purple');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (selected.size < 1) {
      setError('Выберите хотя бы одного участника');
      return;
    }
    setSaving(true);
    setError(null);
    const err = await onCreate(title, themeId, [...selected]);
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="w-full max-w-md bg-ink-900 border border-purple-500/30 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700/40">
          <h2 className="font-serif text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" /> Новый групповой чат
          </h2>
          <button type="button" onClick={onClose} className="p-1 text-ink-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs text-ink-400 block mb-1">Название</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Например: Модераторы"
              className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400/50"
            />
          </div>
          <div>
            <label className="text-xs text-ink-400 block mb-2">Тема оформления</label>
            <div className="grid grid-cols-3 gap-2">
              {STAFF_CHAT_THEMES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeId(t.id)}
                  className={`px-2 py-2 rounded-lg text-xs border cursor-pointer transition-colors ${
                    themeId === t.id ? `${t.accentSoft} ${t.accentBorder} ${t.accent}` : 'border-ink-700/50 text-ink-400 hover:border-ink-600'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-ink-400 block mb-2">Участники ({selected.size})</label>
            <div className="max-h-48 overflow-y-auto space-y-1 border border-ink-700/40 rounded-lg p-2">
              {staffList.filter(s => s.id !== currentUserId).map(s => (
                <label
                  key={s.id}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ink-800/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(s.id)}
                    onChange={() => toggle(s.id)}
                    className="rounded border-ink-600"
                  />
                  <span className="text-sm text-white flex-1 truncate">{s.displayName}</span>
                  <span className="text-[10px] shrink-0" style={{ color: s.roleColor }}>{s.roleName}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-crimson-400 text-xs">{error}</p>}
        </div>
        <div className="p-4 border-t border-ink-700/40 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-ink-400 hover:bg-ink-800 cursor-pointer text-sm">
            Отмена
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSubmit()}
            className="flex-1 py-2 rounded-lg bg-purple-500/25 text-purple-300 hover:bg-purple-500/35 cursor-pointer text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Создание…' : 'Создать чат'}
          </button>
        </div>
      </div>
    </div>
  );
}

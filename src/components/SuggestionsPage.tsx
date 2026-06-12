import { useEffect, useState } from 'react';
import { ArrowLeft, Lightbulb, MessageSquarePlus, Send, Lock, Trash2, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SuggestionsPageProps {
  onBack: () => void;
  onLoginClick: () => void;
}

export default function SuggestionsPage({ onBack, onLoginClick }: SuggestionsPageProps) {
  const {
    user,
    suggestions,
    ensureSuggestionsLoaded,
    suggestionsLoaded,
    createSuggestion,
    replyToSuggestion,
    closeSuggestion,
    deleteSuggestion,
    hasPermission,
  } = useAuth();

  const [view, setView] = useState<'list' | 'create' | 'topic'>('list');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [reply, setReply] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const canModerate = hasPermission('admin.panel') || hasPermission('site.settings');

  useEffect(() => {
    void ensureSuggestionsLoaded();
  }, [ensureSuggestionsLoaded]);

  const active = suggestions.find(s => s.id === activeId);
  const sorted = [...suggestions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const handleCreate = async () => {
    if (!user) { onLoginClick(); return; }
    setSaving(true);
    setError(null);
    const err = await createSuggestion(title, body);
    setSaving(false);
    if (err) setError(err);
    else {
      setTitle('');
      setBody('');
      setView('list');
    }
  };

  const handleReply = async () => {
    if (!activeId || !reply.trim()) return;
    setSaving(true);
    setError(null);
    const err = await replyToSuggestion(activeId, reply);
    setSaving(false);
    if (err) setError(err);
    else setReply('');
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button type="button" onClick={onBack} className="flex items-center gap-2 text-ink-400 hover:text-gold-400 text-sm mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> На главную
        </button>

        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gold-300 flex items-center gap-2">
              <Lightbulb className="w-7 h-7" /> Предложения и пожелания
            </h1>
            <p className="text-ink-400 text-sm mt-2 max-w-xl">
              Предлагайте улучшения для вики и сайта. Создайте тему — другие игроки и администрация смогут обсудить идею в комментариях.
            </p>
          </div>
          {user ? (
            <button
              type="button"
              onClick={() => { setView('create'); setError(null); }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-400/15 border border-gold-400/35 text-gold-300 text-sm cursor-pointer hover:bg-gold-400/25"
            >
              <MessageSquarePlus className="w-4 h-4" /> Новая тема
            </button>
          ) : (
            <button type="button" onClick={onLoginClick} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-ink-800 border border-ink-600 text-ink-200 text-sm cursor-pointer">
              <Lock className="w-4 h-4" /> Войти, чтобы предложить
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-crimson-400/10 border border-crimson-400/30 text-crimson-300 text-sm">{error}</div>
        )}

        {view === 'create' && (
          <div className="bg-ink-900/60 border border-gold-700/30 rounded-2xl p-5 space-y-4">
            <h2 className="text-white font-medium">Новая тема</h2>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Заголовок (кратко)"
              className="w-full bg-ink-800 border border-ink-600/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50"
            />
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Опишите предложение или пожелание…"
              rows={5}
              className="w-full bg-ink-800 border border-ink-600/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50 resize-y"
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => void handleCreate()} disabled={saving} className="px-4 py-2 rounded-lg bg-gold-400/20 text-gold-300 text-sm cursor-pointer disabled:opacity-50">
                {saving ? 'Сохранение…' : 'Опубликовать'}
              </button>
              <button type="button" onClick={() => setView('list')} className="px-4 py-2 rounded-lg text-ink-400 text-sm cursor-pointer">Отмена</button>
            </div>
          </div>
        )}

        {view === 'topic' && active && (
          <div className="bg-ink-900/60 border border-gold-700/30 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-ink-700/40">
              <button type="button" onClick={() => { setView('list'); setActiveId(null); }} className="text-ink-500 text-xs mb-2 cursor-pointer hover:text-gold-400">← К списку</button>
              <h2 className="text-white font-semibold text-lg">{active.title}</h2>
              <p className="text-ink-400 text-xs mt-1">{active.userName} · {new Date(active.createdAt).toLocaleString('ru-RU')}</p>
              <p className="text-ink-200 text-sm mt-3 whitespace-pre-wrap">{active.body}</p>
              {active.status === 'closed' && (
                <span className="inline-block mt-2 text-xs text-ink-500 border border-ink-600 rounded-full px-2 py-0.5">Закрыта</span>
              )}
            </div>
            <div className="p-5 space-y-3 max-h-[40vh] overflow-y-auto scroll-area">
              {active.replies.length === 0 ? (
                <p className="text-ink-500 text-sm">Пока нет ответов</p>
              ) : (
                active.replies.map(r => (
                  <div key={r.id} className="bg-ink-800/50 rounded-lg p-3 border border-ink-700/30">
                    <div className="text-xs text-ink-500 mb-1">{r.userName} · {new Date(r.createdAt).toLocaleString('ru-RU')}</div>
                    <p className="text-sm text-ink-200 whitespace-pre-wrap">{r.message}</p>
                  </div>
                ))
              )}
            </div>
            {active.status === 'open' && user && (
              <div className="p-4 border-t border-ink-700/40 flex gap-2">
                <input
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  placeholder="Ваш комментарий…"
                  className="flex-1 bg-ink-800 border border-ink-600/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50"
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && void handleReply()}
                />
                <button type="button" onClick={() => void handleReply()} disabled={saving} className="p-2 rounded-lg bg-gold-400/20 text-gold-300 cursor-pointer disabled:opacity-50">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
            {canModerate && (
              <div className="px-4 pb-4 flex gap-2">
                {active.status === 'open' && (
                  <button type="button" onClick={() => void closeSuggestion(active.id)} className="text-xs text-ink-400 hover:text-ink-200 cursor-pointer flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Закрыть тему
                  </button>
                )}
                <button type="button" onClick={() => { if (confirm('Удалить тему?')) void deleteSuggestion(active.id).then(() => { setView('list'); setActiveId(null); }); }} className="text-xs text-crimson-400 cursor-pointer flex items-center gap-1 ml-auto">
                  <Trash2 className="w-3.5 h-3.5" /> Удалить
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'list' && (
          !suggestionsLoaded ? (
            <p className="text-ink-500 text-sm text-center py-12">Загрузка…</p>
          ) : sorted.length === 0 ? (
            <p className="text-ink-500 text-sm text-center py-12">Пока нет тем. Станьте первым!</p>
          ) : (
            <ul className="space-y-2">
              {sorted.map(s => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => { setActiveId(s.id); setView('topic'); setError(null); }}
                    className="w-full text-left p-4 rounded-xl bg-ink-900/50 border border-ink-700/40 hover:border-gold-500/30 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between gap-2">
                      <span className="text-white font-medium truncate">{s.title}</span>
                      <span className="text-[10px] text-ink-500 shrink-0">{s.replies.length} отв.</span>
                    </div>
                    <p className="text-ink-400 text-xs mt-1 line-clamp-2">{s.body}</p>
                    <p className="text-ink-500 text-[10px] mt-2">{s.userName} · {new Date(s.createdAt).toLocaleDateString('ru-RU')}{s.status === 'closed' ? ' · закрыта' : ''}</p>
                  </button>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

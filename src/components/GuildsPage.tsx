import { useEffect, useState } from 'react';
import { ArrowLeft, Shield, Users, Plus, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateGuildName } from '../lib/validation';

interface GuildsPageProps {
  onBack: () => void;
  onLoginClick: () => void;
}

export default function GuildsPage({ onBack, onLoginClick }: GuildsPageProps) {
  const { user, registeredGuilds, ensureGuildsLoaded, guildsLoaded, registerGuild } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [server, setServer] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void ensureGuildsLoaded();
  }, [ensureGuildsLoaded]);

  const handleRegister = async () => {
    if (!user) {
      onLoginClick();
      return;
    }
    const validation = validateGuildName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    const err = await registerGuild(name, description, server);
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    setSuccess(`Гильдия «${name.trim()}» зарегистрирована`);
    setName('');
    setDescription('');
    setServer('');
    setShowForm(false);
    setTimeout(() => setSuccess(null), 4000);
  };

  return (
    <div className="cv-auto min-h-screen text-ink-100 pt-16 md:pt-20">
      <div className="bg-ink-800/60 border-b border-ink-700/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-400" />
            <h1 className="font-serif text-lg font-bold text-white">Реестр гильдий</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-ink-300 text-sm sm:text-base">
            Зарегистрируйте игровую гильдию, чтобы она появилась в списке и её могли выбрать участники при регистрации и в профиле.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 bg-jade-400/10 border border-jade-400/30 rounded-xl px-4 py-3 text-jade-300 text-sm">
            <Check className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (!user) {
                onLoginClick();
                return;
              }
              setShowForm(v => !v);
              setError(null);
            }}
            className="hover-glow-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-400/15 border border-gold-400/35 text-gold-300 text-sm font-medium cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {showForm ? 'Скрыть форму' : 'Зарегистрировать гильдию'}
          </button>
        </div>

        {showForm && user && (
          <div className="bg-ink-800/55 border border-gold-400/25 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn">
            <h2 className="font-serif text-base font-bold text-gold-400">Новая гильдия</h2>
            {error && (
              <div className="flex items-center gap-2 bg-crimson-400/10 border border-crimson-400/30 rounded-lg px-3 py-2 text-crimson-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Название гильдии *</label>
              <input
                value={name}
                onChange={e => { setName(e.target.value); setError(null); }}
                placeholder="Например: Nocthra"
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
              />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Сервер <span className="text-ink-500">(необязательно)</span></label>
              <input
                value={server}
                onChange={e => setServer(e.target.value)}
                placeholder="Регион / сервер"
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
              />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Описание <span className="text-ink-500">(необязательно)</span></label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Кратко о гильдии"
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleRegister()}
              disabled={saving || !name.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold-400/20 border border-gold-400/40 text-gold-300 text-sm font-medium hover:bg-gold-400/30 cursor-pointer disabled:opacity-40"
            >
              {saving ? 'Сохранение…' : 'Зарегистрировать'}
            </button>
          </div>
        )}

        {!guildsLoaded ? (
          <p className="text-center text-ink-500 text-sm py-12">Загрузка списка…</p>
        ) : registeredGuilds.length === 0 ? (
          <div className="text-center py-16 text-ink-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Пока нет зарегистрированных гильдий</p>
            <p className="text-xs mt-1">Будьте первым — нажмите «Зарегистрировать гильдию»</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {registeredGuilds.map(g => (
              <article
                key={g.id}
                className="bg-ink-800/55 border border-ink-700/35 rounded-xl p-5 card-hover"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0">🛡️</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-lg font-bold text-white truncate">{g.name}</h3>
                    {g.server && (
                      <p className="text-ink-500 text-xs mt-0.5">Сервер: {g.server}</p>
                    )}
                    {g.description && (
                      <p className="text-ink-300 text-sm mt-2 line-clamp-3">{g.description}</p>
                    )}
                    <p className="text-ink-500 text-[10px] mt-3">
                      {g.leaderName ? `Зарегистрировал: ${g.leaderName}` : 'Зарегистрирована на сайте'}
                      {' · '}
                      {new Date(g.createdAt).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft, Shield, Users, Plus, AlertCircle, Check, ChevronRight,
  Edit3, Save, X, User as UserIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  buildLeaderOptions,
  leaderFromUser,
  leaderOptionLabel,
} from '../hooks/auth/useAuthGuilds';
import {
  canEditRegisteredGuild,
  getGuildMembers,
  getLeaderDisplayName,
  isSiteGuildmaster,
} from '../lib/guildRegistry';
import { getDisplayName } from '../lib/displayName';
import { validateGuildName } from '../lib/validation';
import type { RegisteredGuild } from '../types/site';

interface GuildsPageProps {
  onBack: () => void;
  onLoginClick: () => void;
}

export default function GuildsPage({ onBack, onLoginClick }: GuildsPageProps) {
  const {
    user,
    registeredGuilds,
    registeredUsers,
    ensureGuildsLoaded,
    ensureAccountsLoaded,
    guildsLoaded,
    accountsLoaded,
    registerGuild,
    updateRegisteredGuild,
    hasPermission,
    getRoleConfig,
    siteSettings,
  } = useAuth();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [server, setServer] = useState('');
  const [leaderUserId, setLeaderUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([ensureGuildsLoaded(), ensureAccountsLoaded()]);
  }, [ensureGuildsLoaded, ensureAccountsLoaded]);

  const leaderOptions = useMemo(
    () => buildLeaderOptions(registeredUsers, user),
    [registeredUsers, user],
  );

  useEffect(() => {
    if (user && leaderOptions.some(u => u.id === user.id)) {
      setLeaderUserId(user.id);
    } else if (leaderOptions[0]) {
      setLeaderUserId(leaderOptions[0].id);
    }
  }, [user, leaderOptions]);

  const selected = registeredGuilds.find(g => g.id === selectedId) ?? null;
  const members = selected ? getGuildMembers(selected.id, registeredUsers) : [];

  const canEdit = selected
    ? canEditRegisteredGuild(user, selected, hasPermission)
    : false;

  useEffect(() => {
    if (selected && editing) {
      setName(selected.name);
      setDescription(selected.description);
      setServer(selected.server);
    }
  }, [selected, editing]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setServer('');
    setError(null);
    if (user) setLeaderUserId(user.id);
  };

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
    const leader = leaderOptions.find(u => u.id === leaderUserId);
    if (!leader) {
      setError('Выберите гильдмастера из списка');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(null);
    const result = await registerGuild({
      name,
      description,
      server,
      ...leaderFromUser(leader),
    }, user.id);
    setSaving(false);
    if (typeof result === 'string') {
      setError(result);
      return;
    }
    setSuccess(`Гильдия «${result.name}» зарегистрирована`);
    resetForm();
    setShowForm(false);
    setSelectedId(result.id);
    setTimeout(() => setSuccess(null), 4000);
  };

  const handleSaveEdit = async () => {
    if (!selected || !canEdit) return;
    const validation = validateGuildName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setSaving(true);
    setError(null);
    const err = await updateRegisteredGuild(selected.id, {
      name,
      description,
      server,
      leaderId: selected.leaderId,
      leaderName: selected.leaderName,
      leaderGameNickname: selected.leaderGameNickname,
    });
    setSaving(false);
    if (err) setError(err);
    else {
      setEditing(false);
      setSuccess('Изменения сохранены');
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const loaded = guildsLoaded && accountsLoaded;

  return (
    <div className="cv-auto min-h-screen text-ink-100 pt-16 md:pt-20">
      <div className="bg-ink-800/60 border-b border-ink-700/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <button type="button" onClick={onBack} className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 cursor-pointer transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-gold-400" />
            <h1 className="font-serif text-lg font-bold text-white">Реестр гильдий</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-ink-300 text-sm sm:text-base">
            Зарегистрируйте игровую гильдию для сообщества. Создатель получает права «Странник» и может редактировать только свою запись в реестре.
          </p>
          <p className="text-ink-500 text-xs">
            Баннер гильдии Nocthra на главной управляется отдельной ролью «Гильдмастер» сайта.
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

        {error && !showForm && !editing && (
          <div className="flex items-center gap-2 bg-crimson-400/10 border border-crimson-400/30 rounded-xl px-4 py-3 text-crimson-300 text-sm max-w-xl mx-auto">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {showForm && user && (
          <div className="bg-ink-800/55 border border-gold-400/25 rounded-2xl p-5 sm:p-6 space-y-4 animate-fadeIn max-w-xl mx-auto">
            <h2 className="font-serif text-base font-bold text-gold-400">Новая гильдия</h2>
            {error && (
              <div className="flex items-center gap-2 bg-crimson-400/10 border border-crimson-400/30 rounded-lg px-3 py-2 text-crimson-300 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Название гильдии *</label>
              <input value={name} onChange={e => { setName(e.target.value); setError(null); }} placeholder="Например: Silver Lotus" className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Гильдмастер *</label>
              <select
                value={leaderUserId}
                onChange={e => setLeaderUserId(e.target.value)}
                className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold-400/50 cursor-pointer"
              >
                {leaderOptions.map(u => (
                  <option key={u.id} value={u.id}>{leaderOptionLabel(u)}</option>
                ))}
              </select>
              <p className="text-ink-500 text-[10px] mt-1">Выберите пользователя из списка зарегистрированных аккаунтов</p>
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Сервер <span className="text-ink-500">(необязательно)</span></label>
              <input value={server} onChange={e => setServer(e.target.value)} placeholder="Регион / сервер" className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Описание <span className="text-ink-500">(необязательно)</span></label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Кратко о гильдии" className="w-full bg-ink-900/50 border border-ink-600/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 resize-none" />
            </div>
            <button type="button" onClick={() => void handleRegister()} disabled={saving || !name.trim() || !leaderUserId} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gold-400/20 border border-gold-400/40 text-gold-300 text-sm font-medium hover:bg-gold-400/30 cursor-pointer disabled:opacity-40">
              {saving ? 'Сохранение…' : 'Зарегистрировать'}
            </button>
          </div>
        )}

        {!loaded ? (
          <p className="text-center text-ink-500 text-sm py-12">Загрузка…</p>
        ) : registeredGuilds.length === 0 ? (
          <div className="text-center py-16 text-ink-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Пока нет зарегистрированных гильдий</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[minmax(0,18rem)_1fr] gap-4 lg:gap-6">
            <div className="rounded-xl border border-ink-700/40 overflow-hidden bg-ink-900/40">
              <div className="px-3 py-2 border-b border-ink-700/40 text-xs text-ink-500 uppercase tracking-wide">
                Гильдии ({registeredGuilds.length})
              </div>
              <ul className="scroll-area max-h-[28rem] lg:max-h-[36rem]">
                {registeredGuilds.map(g => {
                  const count = getGuildMembers(g.id, registeredUsers).length;
                  const active = g.id === selectedId;
                  return (
                    <li key={g.id}>
                      <button
                        type="button"
                        onClick={() => { setSelectedId(g.id); setEditing(false); setError(null); }}
                        className={`w-full flex items-center gap-2 px-3 py-3 text-left border-b border-ink-800/50 cursor-pointer transition-colors ${
                          active ? 'bg-gold-400/10 text-gold-300' : 'text-ink-200 hover:bg-ink-800/50'
                        }`}
                      >
                        <span className="text-lg shrink-0">🛡️</span>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{g.name}</div>
                          <div className="text-[10px] text-ink-500 truncate">
                            {getLeaderDisplayName(g)} · {count} уч.
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 shrink-0 ${active ? 'text-gold-400' : 'text-ink-600'}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-xl border border-ink-700/40 bg-ink-800/40 min-h-[20rem]">
              {!selected ? (
                <div className="h-full flex items-center justify-center p-8 text-ink-500 text-sm text-center">
                  Выберите гильдию из списка слева
                </div>
              ) : (
                <div className="p-5 sm:p-6 space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-white">{selected.name}</h2>
                      {selected.server && <p className="text-ink-500 text-sm mt-1">Сервер: {selected.server}</p>}
                    </div>
                    {canEdit && !editing && (
                      <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gold-300 bg-gold-400/10 border border-gold-400/30 hover:bg-gold-400/20 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Редактировать
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <div className="space-y-3 bg-ink-900/40 rounded-xl p-4 border border-gold-400/20">
                      {error && <p className="text-crimson-300 text-sm">{error}</p>}
                      <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-ink-800 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" placeholder="Название" />
                      <input value={server} onChange={e => setServer(e.target.value)} className="w-full bg-ink-800 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" placeholder="Сервер" />
                      <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-ink-800 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50 resize-none" placeholder="Описание" />
                      <div className="flex gap-2">
                        <button type="button" onClick={() => void handleSaveEdit()} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-400/20 text-gold-300 text-sm border border-gold-400/30 cursor-pointer disabled:opacity-40">
                          <Save className="w-4 h-4" /> Сохранить
                        </button>
                        <button type="button" onClick={() => { setEditing(false); setError(null); }} className="px-4 py-2 rounded-lg bg-ink-700 text-ink-300 text-sm cursor-pointer">
                          <X className="w-4 h-4 inline" /> Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {selected.description ? (
                        <p className="text-ink-300 text-sm leading-relaxed">{selected.description}</p>
                      ) : (
                        <p className="text-ink-500 text-sm italic">Описание не указано</p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div className="bg-ink-900/35 rounded-lg px-3 py-2 border border-ink-700/30">
                          <span className="text-ink-500">Гильдмастер: </span>
                          <span className="text-gold-300">{getLeaderDisplayName(selected)}</span>
                        </div>
                        <div className="bg-ink-900/35 rounded-lg px-3 py-2 border border-ink-700/30">
                          <span className="text-ink-500">Зарегистрирована: </span>
                          <span className="text-ink-200">{new Date(selected.createdAt).toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <h3 className="text-gold-400 text-sm font-medium flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4" />
                      Участники ({members.length})
                    </h3>
                    {members.length === 0 ? (
                      <p className="text-ink-500 text-sm py-4 text-center border border-dashed border-ink-700/40 rounded-lg">
                        Пока никто не указал эту гильдию в профиле
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {members.map(m => {
                          const rc = getRoleConfig(m.role);
                          const isLeader = m.id === selected.leaderId;
                          const siteGm = isSiteGuildmaster({ ...m, email: m.email }, siteSettings.roles);
                          return (
                            <li
                              key={m.id}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border ${
                                isLeader ? 'border-gold-400/30 bg-gold-400/5' : 'border-ink-700/30 bg-ink-900/30'
                              }`}
                            >
                              {m.picture ? (
                                <img src={m.picture} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-ink-700 flex items-center justify-center shrink-0">
                                  <UserIcon className="w-4 h-4 text-ink-400" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <div className="text-sm text-white font-medium truncate">
                                  {getDisplayName(m)}
                                  {isLeader && <span className="text-gold-400 text-xs ml-1.5">· лидер</span>}
                                </div>
                              </div>
                              <span
                                className="text-[10px] px-2 py-0.5 rounded-full shrink-0"
                                style={{ backgroundColor: rc.color + '20', color: rc.color, border: `1px solid ${rc.color}40` }}
                              >
                                {siteGm ? 'Гильдмастер сайта' : rc.displayName}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

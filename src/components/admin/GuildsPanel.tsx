import { useEffect, useMemo, useState } from 'react';
import { Edit3, Save, Trash2, Shield, Users, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from './AdminShared';
import {
  buildLeaderOptions,
  leaderFromUser,
  leaderOptionLabel,
} from '../../hooks/auth/useAuthGuilds';
import { getGuildMembers, getLeaderDisplayName } from '../../lib/guildRegistry';
import { validateGuildName } from '../../lib/validation';
import type { RegisteredGuild } from '../../types/site';

function StatBox({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="font-serif text-2xl font-bold text-gold-400">{value}</div>
      <div className="text-ink-400 text-xs">{label}</div>
    </div>
  );
}

export default function GuildsPanel() {
  const {
    registeredGuilds,
    registeredUsers,
    ensureGuildsLoaded,
    ensureAccountsLoaded,
    guildsLoaded,
    updateRegisteredGuild,
    deleteRegisteredGuild,
  } = useAuth();

  const [editing, setEditing] = useState<RegisteredGuild | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftServer, setDraftServer] = useState('');
  const [draftLeaderId, setDraftLeaderId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<RegisteredGuild | null>(null);

  useEffect(() => {
    void Promise.all([ensureGuildsLoaded(), ensureAccountsLoaded()]);
  }, [ensureGuildsLoaded, ensureAccountsLoaded]);

  const leaderOptions = useMemo(
    () => buildLeaderOptions(registeredUsers, null),
    [registeredUsers],
  );

  const memberCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const u of registeredUsers) {
      if (!u.guildId) continue;
      map.set(u.guildId, (map.get(u.guildId) || 0) + 1);
    }
    return map;
  }, [registeredUsers]);

  const openEdit = (g: RegisteredGuild) => {
    setEditing(g);
    setDraftName(g.name);
    setDraftDesc(g.description);
    setDraftServer(g.server);
    setDraftLeaderId(g.leaderId);
    setError(null);
  };

  const handleSave = async () => {
    if (!editing) return;
    const validation = validateGuildName(draftName);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    const leader = registeredUsers.find(u => u.id === draftLeaderId);
    if (!leader?.gameNickname?.trim()) {
      setError('Выберите гильдмастера с игровым ником');
      return;
    }
    setSaving(true);
    setError(null);
    const err = await updateRegisteredGuild(editing.id, {
      name: draftName,
      description: draftDesc,
      server: draftServer,
      ...leaderFromUser(leader),
    });
    setSaving(false);
    if (err) setError(err);
    else setEditing(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    const err = await deleteRegisteredGuild(deleteTarget.id);
    setSaving(false);
    if (err) setError(err);
    setDeleteTarget(null);
  };

  if (!guildsLoaded) {
    return <p className="text-ink-500 text-sm py-8 text-center">Загрузка гильдий…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox label="Гильдий в реестре" value={registeredGuilds.length} icon="🛡️" />
        <StatBox
          label="Участников в гильдиях"
          value={registeredUsers.filter(u => u.guildId).length}
          icon="👥"
        />
        <StatBox
          label="Без гильдии"
          value={registeredUsers.filter(u => !u.guildId).length}
          icon="🌫️"
        />
      </div>

      {error && !editing && (
        <div className="text-crimson-300 text-sm bg-crimson-400/10 border border-crimson-400/30 rounded-lg px-3 py-2">{error}</div>
      )}

      <div className="overflow-x-auto rounded-xl border border-ink-700/40">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="bg-ink-800/80 text-ink-400 text-xs uppercase">
              <th className="py-3 px-3 font-medium">Название</th>
              <th className="py-3 px-2 font-medium">Гильдмастер</th>
              <th className="py-3 px-2 font-medium">Участники</th>
              <th className="py-3 px-2 font-medium hidden md:table-cell">Сервер</th>
              <th className="py-3 px-2 font-medium w-24" />
            </tr>
          </thead>
          <tbody>
            {registeredGuilds.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-ink-500">Нет зарегистрированных гильдий</td>
              </tr>
            ) : registeredGuilds.map(g => (
              <tr key={g.id} className="border-t border-ink-700/30 hover:bg-ink-800/30">
                <td className="py-3 px-3">
                  <div className="font-medium text-white">{g.name}</div>
                  {g.description && <div className="text-ink-500 text-xs truncate max-w-[16rem]">{g.description}</div>}
                </td>
                <td className="py-3 px-2 text-gold-300/90">{getLeaderDisplayName(g)}</td>
                <td className="py-3 px-2 text-ink-300">{memberCounts.get(g.id) || 0}</td>
                <td className="py-3 px-2 text-ink-400 hidden md:table-cell">{g.server || '—'}</td>
                <td className="py-3 px-2">
                  <div className="flex gap-1 justify-end">
                    <button
                      type="button"
                      onClick={() => openEdit(g)}
                      className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer"
                      title="Редактировать"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(g)}
                      className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer"
                      title="Удалить"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={() => setEditing(null)} aria-hidden />
          <div className="relative bg-ink-800 border border-gold-400/30 rounded-2xl w-full max-w-lg p-5 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-gold-400" /> Редактирование гильдии
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="text-ink-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {error && <p className="text-crimson-300 text-sm">{error}</p>}
            <div>
              <label className="text-ink-400 text-xs mb-1 block">Название</label>
              <input value={draftName} onChange={e => setDraftName(e.target.value)} className="w-full bg-ink-900/60 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1 block">Гильдмастер (игровой ник)</label>
              <select
                value={draftLeaderId}
                onChange={e => setDraftLeaderId(e.target.value)}
                className="w-full bg-ink-900/60 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50 cursor-pointer"
              >
                <option value="">Выберите…</option>
                {leaderOptions.map(u => (
                  <option key={u.id} value={u.id}>{leaderOptionLabel(u)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1 block">Сервер</label>
              <input value={draftServer} onChange={e => setDraftServer(e.target.value)} className="w-full bg-ink-900/60 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50" />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1 block">Описание</label>
              <textarea value={draftDesc} onChange={e => setDraftDesc(e.target.value)} rows={3} className="w-full bg-ink-900/60 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gold-400/50 resize-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gold-400/20 text-gold-300 border border-gold-400/40 py-2 rounded-lg text-sm font-medium hover:bg-gold-400/30 cursor-pointer disabled:opacity-40"
              >
                <Save className="w-4 h-4" /> {saving ? 'Сохранение…' : 'Сохранить'}
              </button>
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg bg-ink-700 text-ink-300 text-sm hover:bg-ink-600 cursor-pointer">Отмена</button>
            </div>
            <p className="text-ink-500 text-[10px]">
              Роль «Гильдмастер» на сайте (Nocthra) не меняется — здесь только реестр сторонних гильдий.
            </p>
          </div>
        </div>
      )}

      {deleteTarget && (
        <ConfirmModal
          title="Удалить гильдию?"
          message={`Гильдия «${deleteTarget.name}» будет удалена из реестра. У участников поле «Гильдия» в профиле будет сброшено.`}
          onConfirm={() => void handleDelete()}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

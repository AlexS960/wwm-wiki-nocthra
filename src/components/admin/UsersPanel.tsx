import { useState, useEffect } from 'react';
import { Users, Trash2, Ban, UserCheck, Search, MessageCircle, Copy, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { dbListAccounts, type DbAccount } from '../../lib/db';
import { generateMessengerAccessId } from '../../lib/messengerAccess';
import { StatBox, ConfirmModal } from './AdminShared';

export default function UsersPanel() {
  const {
    registeredUsers, adminSetUserRole, adminBanUser, adminDeleteUser,
    adminSetMessengerAccessId, siteSettings, getRoleConfig,
  } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [accountsList, setAccountsList] = useState<DbAccount[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    void dbListAccounts().then(setAccountsList);
  }, [registeredUsers]);

  const mergedUsers = accountsList.map(acc => {
    const reg = registeredUsers.find(u => u.id === acc.id);
    return {
      id: acc.id,
      name: acc.username,
      email: reg?.email || '',
      picture: acc.picture || reg?.picture || '',
      gameNickname: acc.game_nickname || reg?.gameNickname || '',
      role: reg?.role || acc.role,
      joinedAt: reg?.joinedAt || new Date(acc.created_at).toLocaleDateString('ru-RU'),
      lastSeen: reg?.lastSeen || '—',
      isBanned: reg?.isBanned || false,
      messengerAccessId: acc.messenger_access_id || reg?.messengerAccessId || '',
    };
  });

  let filtered = search.trim()
    ? mergedUsers.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.messengerAccessId.toLowerCase().includes(search.toLowerCase()),
    )
    : mergedUsers;
  if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);

  const handleRoleChange = (userId: string, role: string) => {
    setAccountsList(prev => prev.map(a => a.id === userId ? { ...a, role } : a));
    adminSetUserRole(userId, role);
  };

  const handleDelete = (userId: string) => {
    setAccountsList(prev => prev.filter(a => a.id !== userId));
    adminDeleteUser(userId);
    setDeleteConfirm(null);
  };

  const handleGrantMessenger = (userId: string) => {
    const accessId = generateMessengerAccessId();
    setAccountsList(prev => prev.map(a => a.id === userId ? { ...a, messenger_access_id: accessId } : a));
    adminSetMessengerAccessId(userId, accessId);
  };

  const handleRevokeMessenger = (userId: string) => {
    setAccountsList(prev => prev.map(a => a.id === userId ? { ...a, messenger_access_id: '' } : a));
    adminSetMessengerAccessId(userId, '');
  };

  const handleCopyMessengerId = async (userId: string, accessId: string) => {
    try {
      await navigator.clipboard.writeText(accessId);
      setCopiedId(userId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-ink-800/40 border border-ink-700/30 rounded-xl px-4 py-3 text-sm text-ink-300">
        <MessageCircle className="w-4 h-4 inline-block mr-2 text-gold-400 align-text-bottom" />
        Доступ к чату и ЛС выдаётся персональным идентификатором <span className="text-gold-400 font-mono">MSG-XXXXXXXX</span>.
        Без него пользователи не видят чат. Модераторы и администраторы получают доступ по роли.
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Всего" value={mergedUsers.length} icon="👤" />
        <StatBox
          label="С доступом к чату"
          value={mergedUsers.filter(u => !!u.messengerAccessId).length}
          icon="💬"
        />
        {siteSettings.roles.slice(0, 2).map(role => (
          <StatBox
            key={role.id}
            label={role.displayName}
            value={mergedUsers.filter(u => u.role === role.id).length}
            icon={role.id === 'admin' ? '👑' : '🧭'}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по имени, email или MSG-ID..."
            className="w-full bg-ink-800 border border-ink-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm text-white cursor-pointer focus:outline-none"
        >
          <option value="all">Все роли</option>
          {siteSettings.roles.map(r => (
            <option key={r.id} value={r.id}>{r.displayName}</option>
          ))}
        </select>
      </div>

      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-12 gap-2 px-4 py-3 bg-ink-900/50 text-xs text-ink-400 font-medium uppercase tracking-wider border-b border-ink-700/30">
          <div className="col-span-3">Пользователь</div>
          <div className="col-span-2">Роль</div>
          <div className="col-span-3">Доступ к чату</div>
          <div className="col-span-2">Регистрация</div>
          <div className="col-span-2 text-right">Действия</div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-ink-500">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>Нет пользователей</p>
          </div>
        ) : (
          <div className="divide-y divide-ink-700/30">
            {filtered.map(u => {
              const rc = getRoleConfig(u.role);
              const hasMessenger = !!u.messengerAccessId;
              return (
                <div key={u.id} className={`grid grid-cols-1 lg:grid-cols-12 gap-2 px-4 py-3 items-center ${u.isBanned ? 'opacity-50 bg-crimson-400/5' : ''}`}>
                  <div className="lg:col-span-3 flex items-center gap-3">
                    {u.picture ? (
                      <img src={u.picture} alt={u.name} className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center text-xs font-bold" style={{ color: rc.color }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {u.name}
                        {u.gameNickname ? <span className="text-gold-400 font-normal"> ({u.gameNickname})</span> : null}
                      </div>
                      <div className="text-ink-500 text-xs truncate">{u.email}</div>
                    </div>
                    {u.isBanned && <span className="text-crimson-400 text-[10px] bg-crimson-400/10 px-1.5 py-0.5 rounded">БАН</span>}
                  </div>

                  <div className="lg:col-span-2 flex items-center gap-2">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none"
                      style={{ backgroundColor: rc.color + '15', color: rc.color, borderColor: rc.color + '40' }}
                    >
                      {siteSettings.roles.map(r => (
                        <option key={r.id} value={r.id}>{r.displayName}</option>
                      ))}
                    </select>
                  </div>

                  <div className="lg:col-span-3 flex flex-wrap items-center gap-1.5">
                    {hasMessenger ? (
                      <>
                        <code className="text-xs text-jade-300 bg-jade-400/10 px-2 py-1 rounded font-mono">{u.messengerAccessId}</code>
                        <button
                          type="button"
                          title="Скопировать ID"
                          onClick={() => void handleCopyMessengerId(u.id, u.messengerAccessId)}
                          className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-gold-400/10 cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedId === u.id && <span className="text-[10px] text-jade-400">Скопировано</span>}
                        <button
                          type="button"
                          onClick={() => handleRevokeMessenger(u.id)}
                          className="text-[10px] px-2 py-1 rounded bg-crimson-400/10 text-crimson-300 hover:bg-crimson-400/20 cursor-pointer"
                        >
                          Отозвать
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="text-ink-500 text-xs">Нет доступа</span>
                        <button
                          type="button"
                          onClick={() => handleGrantMessenger(u.id)}
                          className="flex items-center gap-1 text-[10px] px-2 py-1 rounded bg-gold-400/10 text-gold-400 hover:bg-gold-400/20 cursor-pointer"
                        >
                          <KeyRound className="w-3 h-3" /> Выдать ID
                        </button>
                      </>
                    )}
                  </div>

                  <div className="lg:col-span-2 text-ink-400 text-xs">{u.joinedAt}</div>

                  <div className="lg:col-span-2 flex items-center gap-1 justify-end">
                    <button
                      type="button"
                      onClick={() => adminBanUser(u.id, !u.isBanned)}
                      title={u.isBanned ? 'Разбанить' : 'Забанить'}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${u.isBanned ? 'text-jade-400 hover:bg-jade-400/10' : 'text-orange-400 hover:bg-orange-400/10'}`}
                    >
                      {u.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                    <button type="button" onClick={() => setDeleteConfirm(u.id)} className="p-1.5 rounded-lg text-crimson-400 hover:bg-crimson-400/10 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <ConfirmModal
          title="Удалить пользователя?"
          message="Это действие нельзя отменить."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

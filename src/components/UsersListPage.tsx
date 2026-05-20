import { useEffect, useState } from 'react';
import { ArrowLeft, Search, Users, Circle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbListAccounts, type DbAccount } from '../lib/db';

interface UsersListPageProps {
  onBack: () => void;
}

export default function UsersListPage({ onBack }: UsersListPageProps) {
  const { registeredUsers, getRoleConfig, isUserOnline } = useAuth();
  const [accounts, setAccounts] = useState<DbAccount[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dbListAccounts().then(setAccounts);
  }, [registeredUsers]);

  const users = accounts.map(acc => {
    const reg = registeredUsers.find(u => u.id === acc.id);
    return {
      id: acc.id,
      username: acc.username,
      gameNickname: acc.game_nickname || reg?.gameNickname || '',
      picture: acc.picture || reg?.picture || '',
      role: reg?.role || acc.role,
      joinedAt: reg?.joinedAt || new Date(acc.created_at).toLocaleDateString('ru-RU'),
      online: isUserOnline(acc.id),
    };
  });

  const filtered = search.trim()
    ? users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.gameNickname.toLowerCase().includes(search.toLowerCase()) ||
        getRoleConfig(u.role).displayName.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  return (
    <div className="min-h-screen bg-ink-900 text-ink-100 pt-16 md:pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back */}
        <button onClick={onBack} className="inline-flex items-center gap-2 text-ink-400 hover:text-gold-400 transition-colors cursor-pointer mb-6">
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gold-400" /> Список пользователей
          </h1>
          <p className="text-ink-400">Все зарегистрированные пользователи сайта и их текущий статус</p>
        </div>

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по нику, игровому нику или роли..."
            className="w-full bg-ink-800 border border-ink-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
          />
        </div>

        {/* Users grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Пользователи не найдены</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(user => {
              const role = getRoleConfig(user.role);
              return (
                <div key={user.id} className="bg-ink-800/60 border border-ink-700/30 rounded-2xl p-5 card-hover">
                  <div className="flex items-start gap-4">
                    {user.picture ? (
                      <img src={user.picture} alt={user.username} className="w-14 h-14 rounded-xl object-cover border border-gold-400/20 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-ink-700 flex items-center justify-center text-lg font-bold shrink-0" style={{ color: role.color }}>
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-serif text-lg font-bold text-white truncate">
                          {user.username}
                          {user.gameNickname ? <span className="text-gold-400 font-normal"> ({user.gameNickname})</span> : null}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <Circle className={`w-2.5 h-2.5 ${user.online ? 'fill-jade-400 text-jade-400' : 'fill-ink-500 text-ink-500'}`} />
                          <span className={`text-[11px] ${user.online ? 'text-jade-400' : 'text-ink-500'}`}>{user.online ? 'Онлайн' : 'Оффлайн'}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-ink-500 text-xs">Дата регистрации:</span>
                          <span className="text-ink-300 text-sm">{user.joinedAt}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-ink-500 text-xs">Роль:</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
                            style={{
                              color: role.color,
                              backgroundColor: role.color + '15',
                              borderColor: role.color + '40',
                            }}>
                            {role.displayName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

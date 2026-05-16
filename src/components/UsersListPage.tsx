import { useEffect, useState } from 'react';
import { ArrowLeft, Search, Users, Circle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbListAccounts, type DbAccount } from '../lib/db';

interface UsersListPageProps {
  onBack: () => void;
}

interface ListedUser {
  id: string;
  username: string;
  gameNickname: string;
  picture: string;
  role: string;
  joinedAt: string;
  online: boolean;
}

export default function UsersListPage({ onBack }: UsersListPageProps) {
  const { registeredUsers, getRoleConfig, isUserOnline } = useAuth();
  const [accounts, setAccounts] = useState<DbAccount[]>([]);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<ListedUser | null>(null);

  useEffect(() => {
    dbListAccounts().then(setAccounts);
  }, [registeredUsers]);

  const users: ListedUser[] = accounts.map(acc => {
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
        <button onClick={onBack} className="inline-flex items-center gap-2 text-ink-400 hover:text-gold-400 transition-colors cursor-pointer mb-6">
          <ArrowLeft className="w-4 h-4" /> Назад
        </button>

        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gold-400" /> Список пользователей
          </h1>
          <p className="text-ink-400">Все зарегистрированные пользователи сайта и их текущий статус</p>
        </div>

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

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-500">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Пользователи не найдены</p>
          </div>
        ) : (
          <div className="bg-ink-800/60 border border-ink-700/30 rounded-2xl overflow-hidden">
            {/* Header row */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-ink-900/50 border-b border-ink-700/30 text-[11px] uppercase tracking-wider text-ink-500 font-medium">
              <div className="col-span-4">Пользователь</div>
              <div className="col-span-2">Игровой ник</div>
              <div className="col-span-2">Дата регистрации</div>
              <div className="col-span-2">Статус</div>
              <div className="col-span-2">Роль</div>
            </div>

            <div className="divide-y divide-ink-700/30">
              {filtered.map(user => {
                const role = getRoleConfig(user.role);
                return (
                  <button
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="w-full grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 text-left hover:bg-gold-400/5 transition-colors cursor-pointer"
                  >
                    {/* User */}
                    <div className="col-span-4 flex items-center gap-3 min-w-0">
                      {user.picture ? (
                        <img src={user.picture} alt={user.username} className="w-12 h-12 rounded-xl object-cover border border-gold-400/20 shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-ink-700 flex items-center justify-center text-sm font-bold shrink-0" style={{ color: role.color }}>
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-white font-medium truncate">{user.username}</div>
                        <div className="text-ink-500 text-xs md:hidden mt-0.5">Нажмите, чтобы открыть профиль</div>
                      </div>
                    </div>

                    {/* Game nick */}
                    <div className="col-span-2 text-sm text-gold-400 flex items-center md:block">
                      <span className="md:hidden text-ink-500 text-xs mr-2">Игровой ник:</span>
                      <span>{user.gameNickname || '—'}</span>
                    </div>

                    {/* Joined date */}
                    <div className="col-span-2 text-sm text-ink-300 flex items-center md:block">
                      <span className="md:hidden text-ink-500 text-xs mr-2">Дата:</span>
                      <span>{user.joinedAt}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="md:hidden text-ink-500 text-xs">Статус:</span>
                      <Circle className={`w-2.5 h-2.5 ${user.online ? 'fill-jade-400 text-jade-400' : 'fill-ink-500 text-ink-500'}`} />
                      <span className={`text-sm ${user.online ? 'text-jade-400' : 'text-ink-500'}`}>{user.online ? 'Онлайн' : 'Оффлайн'}</span>
                    </div>

                    {/* Role */}
                    <div className="col-span-2 flex items-center gap-2 md:justify-start">
                      <span className="md:hidden text-ink-500 text-xs">Роль:</span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
                        style={{ color: role.color, backgroundColor: role.color + '15', borderColor: role.color + '40' }}>
                        {role.displayName}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedUser && <UserProfileModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
    </div>
  );
}

function UserProfileModal({ user, onClose }: { user: ListedUser; onClose: () => void }) {
  const { getRoleConfig } = useAuth();
  const role = getRoleConfig(user.role);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-ink-800 border border-gold-700/30 rounded-2xl shadow-2xl overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer z-10">
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            {user.picture ? (
              <img src={user.picture} alt={user.username} className="w-20 h-20 rounded-2xl object-cover border border-gold-400/20 shrink-0" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-ink-700 flex items-center justify-center text-2xl font-bold shrink-0" style={{ color: role.color }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1 pt-1">
              <div className="text-white font-serif text-2xl font-bold break-words">{user.username}</div>
              <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{ color: role.color, backgroundColor: role.color + '15', borderColor: role.color + '40' }}>
                {role.displayName}
              </div>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-ink-400">Игровой ник:</span>
              <span className="text-gold-400 text-right break-all">{user.gameNickname || '—'}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-ink-400">Дата регистрации:</span>
              <span className="text-ink-200 text-right">{user.joinedAt}</span>
            </div>
            <div className="flex justify-between gap-3 items-center">
              <span className="text-ink-400">Статус:</span>
              <div className="flex items-center gap-2">
                <Circle className={`w-2.5 h-2.5 ${user.online ? 'fill-jade-400 text-jade-400' : 'fill-ink-500 text-ink-500'}`} />
                <span className={user.online ? 'text-jade-400' : 'text-ink-500'}>{user.online ? 'Онлайн' : 'Оффлайн'}</span>
              </div>
            </div>
            <div className="flex justify-between gap-3 items-center">
              <span className="text-ink-400">Роль:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border"
                style={{ color: role.color, backgroundColor: role.color + '15', borderColor: role.color + '40' }}>
                {role.displayName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

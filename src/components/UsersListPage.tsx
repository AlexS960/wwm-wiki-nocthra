import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, Search, Circle } from 'lucide-react';

interface UsersListPageProps { onBack: () => void; }

export default function UsersListPage({ onBack }: UsersListPageProps) {
  const { registeredUsers, isUserOnline, getRoleConfig, siteSettings, ensureAccountsLoaded, accountsLoaded } = useAuth();

  useEffect(() => { void ensureAccountsLoaded(); }, [ensureAccountsLoaded]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [onlineFilter, setOnlineFilter] = useState<string>('all');
  const [, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 10_000);
    return () => clearInterval(iv);
  }, []);

  const visibleUsers = registeredUsers;
  let filtered = visibleUsers;
  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(u => u.name.toLowerCase().includes(q) || (u.gameNickname || '').toLowerCase().includes(q));
  }
  if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);
  if (onlineFilter === 'online') filtered = filtered.filter(u => isUserOnline(u.id));
  if (onlineFilter === 'offline') filtered = filtered.filter(u => !isUserOnline(u.id));

  return (
    <div className="min-h-screen bg-ink-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-800/50 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-white flex items-center gap-3"><Users className="w-6 h-6 text-gold-400" /> Пользователи</h1>
            <p className="text-ink-400 text-sm mt-1">{filtered.length} из {visibleUsers.length} пользователей</p>
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени или нику..."
              className="w-full bg-ink-800 border border-ink-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer focus:outline-none">
            <option value="all">Все роли</option>
            {siteSettings.roles.map(r => <option key={r.id} value={r.id}>{r.displayName}</option>)}
          </select>
          <select value={onlineFilter} onChange={e => setOnlineFilter(e.target.value)}
            className="bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2.5 text-sm text-white cursor-pointer focus:outline-none">
            <option value="all">Все</option>
            <option value="online">🟢 Онлайн</option>
            <option value="offline">⚫ Оффлайн</option>
          </select>
        </div>

        {/* Table header */}
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-ink-900/50 text-xs text-ink-400 font-medium uppercase tracking-wider border-b border-ink-700/30 rounded-t-xl">
          <div className="col-span-1">Аватар</div>
          <div className="col-span-2 border-l border-ink-600/50 pl-3">Логин</div>
          <div className="col-span-2 border-l border-ink-600/50 pl-3">Игровой ник</div>
          <div className="col-span-2 border-l border-ink-600/50 pl-3">Роль</div>
          <div className="col-span-2 border-l border-ink-600/50 pl-3">Дата регистрации</div>
          <div className="col-span-2 border-l border-ink-600/50 pl-3">Последняя активность</div>
          <div className="col-span-1 text-center border-l border-ink-600/50">Статус</div>
        </div>

        {/* User rows */}
        <div className="bg-ink-800/50 border border-ink-700/30 rounded-b-xl overflow-hidden">
          <div className="divide-y divide-ink-700/30">
            {filtered.map(u => {
              const rc = getRoleConfig(u.role);
              const online = isUserOnline(u.id);
              return (
                <div key={u.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-ink-700/20 transition-colors">
                  {/* Avatar */}
                  <div className="col-span-1 flex items-center">
                    {u.picture ? <img src={u.picture} alt={u.name} className="w-9 h-9 rounded-full" /> :
                      <div className="w-9 h-9 rounded-full bg-ink-700 flex items-center justify-center text-xs font-bold" style={{ color: rc.color }}>{u.name.charAt(0).toUpperCase()}</div>}
                  </div>
                  {/* Логин */}
                  <div className="col-span-2 border-l border-ink-600/20 pl-3">
                    <span className="text-white text-sm font-medium truncate block">{u.name}</span>
                  </div>
                  {/* Игровой ник */}
                  <div className="col-span-2 border-l border-ink-600/20 pl-3">
                    <span className="text-gold-400 text-sm truncate block">{u.gameNickname || '—'}</span>
                  </div>
                  {/* Роль */}
                  <div className="col-span-2 border-l border-ink-600/20 pl-3">
                    <span className="text-xs px-2 py-1 rounded-full inline-block font-medium"
                      style={{ backgroundColor: rc.color + '15', color: rc.color }}>{rc.displayName}</span>
                  </div>
                  {/* Дата регистрации */}
                  <div className="col-span-2 border-l border-ink-600/20 pl-3">
                    <span className="text-ink-400 text-xs">{u.joinedAt}</span>
                  </div>
                  {/* Последняя активность */}
                  <div className="col-span-2 border-l border-ink-600/20 pl-3">
                    <span className="text-ink-400 text-xs">{u.lastSeen}</span>
                  </div>
                  {/* Статус */}
                  <div className="col-span-1 flex justify-center border-l border-ink-600/20">
                    <div className="flex items-center gap-1.5">
                      <Circle className={`w-2.5 h-2.5 ${online ? 'text-jade-400 fill-jade-400' : 'text-ink-600 fill-ink-600'}`} />
                      <span className={`text-[10px] ${online ? 'text-jade-400' : 'text-ink-500'}`}>{online ? 'Онлайн' : 'Оффлайн'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-ink-500">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>Пользователи не найдены</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

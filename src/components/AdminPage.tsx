import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { dbListAccounts, type DbAccount } from '../lib/db';
import {
  ArrowLeft, Users, Settings, BookOpen, ShieldAlert, Crown,
  Trash2, Ban, UserCheck, Search, Save, Plus, X, Bell,
  Edit3, AlertTriangle, Check, Eye, EyeOff, Tag, Palette, Wrench
} from 'lucide-react';

interface AdminPageProps { onBack: () => void; }

type Tab = 'users' | 'roles' | 'sections' | 'guides' | 'settings';

export default function AdminPage({ onBack }: AdminPageProps) {
  const {
    user, isAdmin, ensureWikiLoaded, ensureSupportLoaded, ensureGuideMetaLoaded,
    ensureGuidesLoaded, ensureChatLoaded, ensureAccountsLoaded,
  } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');

  useEffect(() => {
    void Promise.all([
      ensureAccountsLoaded(), ensureGuidesLoaded(), ensureChatLoaded(),
      ensureWikiLoaded(), ensureSupportLoaded(), ensureGuideMetaLoaded(),
    ]);
  }, [ensureAccountsLoaded, ensureGuidesLoaded, ensureChatLoaded, ensureWikiLoaded, ensureSupportLoaded, ensureGuideMetaLoaded]);

  if (!user || !isAdmin()) {
    return (
      <div className="min-h-screen bg-ink-900 pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-crimson-400 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold text-white mb-2">Доступ запрещён</h2>
          <p className="text-ink-400 mb-6">Эта страница доступна только администраторам.</p>
          <button onClick={onBack} className="px-6 py-2 bg-gold-400/20 text-gold-400 rounded-lg cursor-pointer hover:bg-gold-400/30">Вернуться</button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'users', label: 'Пользователи', icon: <Users className="w-4 h-4" /> },
    { id: 'roles', label: 'Роли и Звания', icon: <Tag className="w-4 h-4" /> },
    { id: 'sections', label: 'Разделы сайта', icon: <Wrench className="w-4 h-4" /> },
    { id: 'guides', label: 'Гайды', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', label: 'Настройки', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-ink-900 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-800/50 cursor-pointer"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <Crown className="w-7 h-7 text-purple-400" /> Панель Администратора
            </h1>
            <p className="text-ink-400 text-sm mt-1">Управление сайтом, пользователями и контентом</p>
          </div>
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto border-b border-ink-700/50 pb-px">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium cursor-pointer whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-gold-400 border-b-2 border-gold-400 -mb-px' : 'text-ink-400 hover:text-ink-200'
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'users' && <UsersPanel />}
        {activeTab === 'roles' && <RolesPanel />}
        {activeTab === 'sections' && <SectionsPanel />}
        {activeTab === 'guides' && <GuidesPanel />}
        {activeTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  );
}

// ======================== USERS PANEL ========================
function UsersPanel() {
  const { registeredUsers, adminSetUserRole, adminBanUser, adminDeleteUser, siteSettings, getRoleConfig } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [accountsList, setAccounts] = useState<DbAccount[]>([]);

  useEffect(() => {
    dbListAccounts().then(setAccounts);
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
    };
  });

  let filtered = search.trim()
    ? mergedUsers.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    : mergedUsers;
  if (roleFilter !== 'all') filtered = filtered.filter(u => u.role === roleFilter);

  const handleRoleChange = (userId: string, role: string) => {
    setAccounts(prev => prev.map(a => a.id === userId ? { ...a, role } : a));
    adminSetUserRole(userId, role);
  };

  const handleBanToggle = (userId: string, banned: boolean) => {
    adminBanUser(userId, banned);
  };

  const handleDelete = (userId: string) => {
    setAccounts(prev => prev.filter(a => a.id !== userId));
    adminDeleteUser(userId);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatBox label="Всего" value={mergedUsers.length} icon="👤" />
        {siteSettings.roles.map(role => (
          <StatBox key={role.id} label={role.displayName} value={mergedUsers.filter(u => u.role === role.id).length}
            icon={role.id === 'admin' ? '👑' : role.id === 'editor' ? '✏️' : '🧭'} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени или email..."
            className="w-full bg-ink-800 border border-ink-700/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm text-white cursor-pointer focus:outline-none">
          <option value="all">Все роли</option>
          {siteSettings.roles.map(r => <option key={r.id} value={r.id}>{r.displayName}</option>)}
        </select>
      </div>

      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-ink-900/50 text-xs text-ink-400 font-medium uppercase tracking-wider border-b border-ink-700/30">
          <div className="col-span-4">Пользователь</div>
          <div className="col-span-3">Роль / Звание</div>
          <div className="col-span-2">Регистрация</div>
          <div className="col-span-3 text-right">Действия</div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center text-ink-500"><Users className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>Нет пользователей</p></div>
        ) : (
          <div className="divide-y divide-ink-700/30">
            {filtered.map(u => {
              const rc = getRoleConfig(u.role);
              return (
                <div key={u.id} className={`grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 items-center ${u.isBanned ? 'opacity-50 bg-crimson-400/5' : ''}`}>
                  <div className="col-span-4 flex items-center gap-3">
                    {u.picture ? <img src={u.picture} alt={u.name} className="w-8 h-8 rounded-full" /> :
                      <div className="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center text-xs font-bold" style={{ color: rc.color }}>{u.name.charAt(0).toUpperCase()}</div>}
                    <div className="min-w-0">
                      <div className="text-white text-sm font-medium truncate">
                        {u.name}
                        {u.gameNickname ? <span className="text-gold-400 font-normal"> ({u.gameNickname})</span> : null}
                      </div>
                      <div className="text-ink-500 text-xs truncate">{u.email}</div>
                    </div>
                    {u.isBanned && <span className="text-crimson-400 text-[10px] bg-crimson-400/10 px-1.5 py-0.5 rounded">БАН</span>}
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                      className="text-xs px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none"
                      style={{ backgroundColor: rc.color + '15', color: rc.color, borderColor: rc.color + '40' }}>
                      {siteSettings.roles.map(r => <option key={r.id} value={r.id}>{r.displayName}</option>)}
                    </select>
                  </div>

                  <div className="col-span-2 text-ink-400 text-xs hidden md:block">{u.joinedAt}</div>

                  <div className="col-span-3 flex items-center gap-1 justify-end">
                    <button onClick={() => handleBanToggle(u.id, !u.isBanned)} title={u.isBanned ? 'Разбанить' : 'Забанить'}
                      className={`p-1.5 rounded-lg cursor-pointer transition-colors ${u.isBanned ? 'text-jade-400 hover:bg-jade-400/10' : 'text-orange-400 hover:bg-orange-400/10'}`}>
                      {u.isBanned ? <UserCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setDeleteConfirm(u.id)} className="p-1.5 rounded-lg text-crimson-400 hover:bg-crimson-400/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteConfirm && <ConfirmModal title="Удалить пользователя?" message="Это действие нельзя отменить."
        onConfirm={() => handleDelete(deleteConfirm)} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
}

// ======================== ROLES PANEL ========================
function RolesPanel() {
  const { siteSettings, updateRoleDisplayName, updateRoleColor, addRole, deleteRole, updateRolePermissions, registeredUsers } = useAuth();
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editPerms, setEditPerms] = useState<string[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#4abf85');
  const [newPerms, setNewPerms] = useState<string[]>(['read', 'profile', 'favorites']);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const allPermissions: { id: string; label: string; group: string }[] = [
    { id: 'read', label: 'Просмотр контента', group: 'Базовые' },
    { id: 'profile', label: 'Профиль и заметки', group: 'Базовые' },
    { id: 'favorites', label: 'Избранное', group: 'Базовые' },
    { id: 'chat.write', label: 'Писать в чат', group: 'Чат' },
    { id: 'chat.delete', label: 'Удаление сообщений', group: 'Чат' },
    { id: 'chat.mute', label: 'Мут пользователей', group: 'Чат' },
    { id: 'chat.ban', label: 'Бан в чате', group: 'Чат' },
    { id: 'support.view_all', label: 'Доступ к техподдержке', group: 'Техподдержка' },
    { id: 'support.reply', label: 'Ответы на обращения', group: 'Техподдержка' },
    { id: 'support.close', label: 'Закрытие обращений', group: 'Техподдержка' },
    { id: 'support.delete', label: 'Удаление обращений', group: 'Техподдержка' },
    { id: 'guides.create', label: 'Создание гайдов', group: 'Гайды' },
    { id: 'guides.edit', label: 'Редактирование гайдов', group: 'Гайды' },
    { id: 'guides.delete', label: 'Удаление гайдов', group: 'Гайды' },
    { id: 'guild.edit', label: 'Редактирование инфо. гильдии', group: 'Гильдия' },
    { id: 'users.manage', label: 'Управление пользователями', group: 'Администрация' },
    { id: 'users.ban', label: 'Бан / разбан', group: 'Администрация' },
    { id: 'users.roles', label: 'Назначение ролей', group: 'Администрация' },
    { id: 'site.settings', label: 'Настройки сайта', group: 'Администрация' },
    { id: 'site.announcements', label: 'Объявления', group: 'Администрация' },
    { id: 'admin.panel', label: 'Админ-панель', group: 'Администрация' },
  ];

  const permGroups = [...new Set(allPermissions.map(p => p.group))];

  const startEdit = (role: typeof siteSettings.roles[0]) => {
    setEditingRole(role.id); setEditName(role.displayName); setEditColor(role.color); setEditPerms([...role.permissions]);
  };

  const saveEdit = (roleId: string) => {
    if (!editName.trim()) return;
    updateRoleDisplayName(roleId, editName.trim());
    updateRoleColor(roleId, editColor);
    updateRolePermissions(roleId, editPerms);
    setSaved(roleId); setTimeout(() => setSaved(null), 2000); setEditingRole(null);
  };

  const toggleEditPerm = (perm: string) => {
    setEditPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };
  const toggleNewPerm = (perm: string) => {
    setNewPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  const handleAddRole = () => {
    if (!newName.trim()) return;
    addRole(newName.trim(), newColor, newPerms);
    setNewName(''); setNewColor('#4abf85'); setNewPerms(['read', 'profile', 'favorites']); setShowAddForm(false);
  };

  const isSystemRole = (id: string) => ['user', 'editor', 'admin'].includes(id);

  const presetColors = ['#b0a696', '#d4a528', '#a882ff', '#4abf85', '#e85555', '#5865F2', '#ff6b9d', '#00bcd4', '#f59e0b', '#ec4899'];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Info */}
      <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-4 flex items-start gap-3">
        <Tag className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-gold-400 font-semibold text-sm">Управление ролями и званиями</h3>
          <p className="text-ink-400 text-xs mt-1">Создавайте роли, переименовывайте, настраивайте цвета и управляйте правами доступа. Системные роли (user, editor, admin) нельзя удалить.</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-sm font-medium cursor-pointer hover:bg-gold-400/30 shrink-0">
            <Plus className="w-4 h-4" /> Новая роль
          </button>
        )}
      </div>

      {/* Add New Role Form */}
      {showAddForm && (
        <div className="bg-ink-800/70 border border-gold-400/30 rounded-xl p-5 space-y-4 animate-fadeIn">
          <h3 className="font-serif text-lg font-bold text-gold-400 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Создать новую роль
          </h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Название роли *</label>
              <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Например: Модератор"
                className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" autoFocus />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Цвет</label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 flex-wrap">
                  {presetColors.map(c => (
                    <button key={c} onClick={() => setNewColor(c)}
                      className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all ${newColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
                <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0" />
              </div>
            </div>
          </div>

          {/* Permissions selector */}
          <div>
            <label className="text-ink-400 text-xs mb-2 block">Права доступа</label>
            {permGroups.map(group => (
              <div key={group} className="mb-3">
                <div className="text-ink-500 text-[10px] uppercase tracking-wider mb-1.5">{group}</div>
                <div className="flex flex-wrap gap-1.5">
                  {allPermissions.filter(p => p.group === group).map(perm => {
                    const active = newPerms.includes(perm.id);
                    return (
                      <button key={perm.id} onClick={() => toggleNewPerm(perm.id)}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                          active ? 'bg-jade-400/15 text-jade-400 border border-jade-400/40' : 'bg-ink-700/30 text-ink-500 border border-ink-700/20 hover:text-ink-300 hover:border-ink-600'
                        }`}>
                        {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                        {perm.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-1">
            <button onClick={handleAddRole} disabled={!newName.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-gold-400/20 text-gold-400 py-2.5 rounded-lg font-medium text-sm cursor-pointer hover:bg-gold-400/30 disabled:opacity-40 disabled:cursor-not-allowed">
              <Check className="w-4 h-4" /> Создать роль
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="px-5 bg-ink-700 text-ink-300 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-ink-600">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Existing Roles */}
      <div className="space-y-4">
        {siteSettings.roles.map(role => {
          const isEditing = editingRole === role.id;
          const isSaved = saved === role.id;
          const usersWithRole = registeredUsers.filter(u => u.role === role.id).length;
          const isSystem = isSystemRole(role.id);

          return (
            <div key={role.id} className={`bg-ink-800/50 border rounded-xl overflow-hidden ${isEditing ? 'border-gold-400/40' : 'border-ink-700/30'}`}>
              {/* Role header */}
              <div className="flex items-center justify-between p-4 border-b border-ink-700/20">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: isEditing ? editColor : role.color }} />
                  {isEditing ? (
                    <input value={editName} onChange={e => setEditName(e.target.value)}
                      className="bg-ink-700 border border-ink-600 rounded-lg px-3 py-1.5 text-white text-sm font-bold focus:outline-none focus:border-gold-400/50 w-48" autoFocus />
                  ) : (
                    <div>
                      <h3 className="font-serif font-bold text-lg" style={{ color: role.color }}>{role.displayName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-ink-500 text-xs">ID: <code className="text-ink-400">{role.id}</code></span>
                        {isSystem && <span className="text-[9px] bg-ink-700/50 text-ink-400 px-1.5 py-0.5 rounded">системная</span>}
                        <span className="text-[9px] text-ink-500">{usersWithRole} польз.</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={() => saveEdit(role.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-jade-400/20 text-jade-400 text-xs font-medium cursor-pointer hover:bg-jade-400/30">
                        <Check className="w-3.5 h-3.5" /> Сохранить
                      </button>
                      <button onClick={() => setEditingRole(null)} className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-ink-700/50 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(role)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          isSaved ? 'bg-jade-400/20 text-jade-400' : 'bg-ink-700/50 text-ink-300 hover:text-gold-400 hover:bg-gold-400/10'
                        }`}>
                        {isSaved ? <><Check className="w-3.5 h-3.5" /> Сохранено</> : <><Edit3 className="w-3.5 h-3.5" /> Изменить</>}
                      </button>
                      {!isSystem && (
                        <button onClick={() => setDeleteConfirm(role.id)}
                          className="p-1.5 rounded-lg text-crimson-400 hover:bg-crimson-400/10 cursor-pointer" title="Удалить роль">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Color picker (editing) */}
              {isEditing && (
                <div className="px-4 py-3 bg-ink-900/30 border-b border-ink-700/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Palette className="w-4 h-4 text-ink-400 shrink-0" />
                    <span className="text-ink-400 text-xs shrink-0">Цвет:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {presetColors.map(c => (
                        <button key={c} onClick={() => setEditColor(c)}
                          className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${editColor === c ? 'border-white scale-125' : 'border-transparent hover:scale-110'}`}
                          style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                  </div>
                </div>
              )}

              {/* Permissions */}
              <div className="p-4">
                <h4 className="text-ink-400 text-xs font-medium uppercase tracking-wider mb-3">Права доступа</h4>
                {isEditing ? (
                  /* Editable permissions */
                  <div className="space-y-3">
                    {permGroups.map(group => (
                      <div key={group}>
                        <div className="text-ink-500 text-[10px] uppercase tracking-wider mb-1.5">{group}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {allPermissions.filter(p => p.group === group).map(perm => {
                            const active = editPerms.includes(perm.id);
                            return (
                              <button key={perm.id} onClick={() => toggleEditPerm(perm.id)}
                                className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                                  active ? 'bg-jade-400/15 text-jade-400 border border-jade-400/40' : 'bg-ink-700/30 text-ink-500 border border-ink-700/20 hover:text-ink-300'
                                }`}>
                                {active ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {perm.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Read-only permissions */
                  <div className="flex flex-wrap gap-2">
                    {allPermissions.map(perm => {
                      const has = role.permissions.includes(perm.id);
                      return (
                        <span key={perm.id} className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                          has ? 'bg-jade-400/10 text-jade-400 border border-jade-400/30' : 'bg-ink-700/30 text-ink-500 border border-ink-700/20 line-through'
                        }`}>
                          {has ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {perm.label}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmModal
          title="Удалить роль?"
          message={`Пользователи с этой ролью будут переведены в роль «${siteSettings.roles.find(r => r.id === 'user')?.displayName || 'Странник'}». Это действие нельзя отменить.`}
          onConfirm={() => { deleteRole(deleteConfirm); setDeleteConfirm(null); }}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

// ======================== SECTIONS PANEL ========================
function SectionsPanel() {
  const { siteSettings, updateSiteSettings } = useAuth();
  const [sections, setSections] = useState(siteSettings.sections || []);

  const infoSections = [
    { id: 'guides', title: 'Гайды' },
    { id: 'weapons', title: 'Оружие' },
    { id: 'builds', title: 'Билды' },
    { id: 'sects', title: 'Секты' },
    { id: 'bosses', title: 'Боссы' },
    { id: 'npcs', title: 'NPC' },
    { id: 'riddles', title: 'Загадки' },
    { id: 'innerpath', title: 'Внутренний путь' },
    { id: 'mystic', title: 'Арты' },
    { id: 'map', title: 'Карта' },
    { id: 'cooking', title: 'Готовка' },
    { id: 'tips', title: 'Советы' },
  ];

  useEffect(() => {
    const current = siteSettings.sections || [];
    const normalized = infoSections.map(sec => {
      const existing = current.find(s => s.id === sec.id);
      return existing || {
        id: sec.id,
        title: sec.title,
        maintenance: false,
        message: 'Раздел находится на технических работах. Попробуйте позже.',
      };
    });
    setSections(normalized);

    const changed =
      normalized.length !== current.length ||
      normalized.some(sec => !current.find(s => s.id === sec.id));

    if (changed) updateSiteSettings({ sections: normalized });
  }, [siteSettings.sections]);

  const saveSections = (next: typeof sections) => {
    setSections(next);
    updateSiteSettings({ sections: next });
  };

  const toggleMaintenance = (id: string) => {
    const next = sections.map(s => s.id === id ? { ...s, maintenance: !s.maintenance } : s);
    saveSections(next);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
        <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2 mb-2"><Wrench className="w-4 h-4" /> Управление разделами сайта</h3>
        <p className="text-ink-400 text-xs">Все разделы из вкладки «Информация». Для каждого можно включить или выключить технические работы.</p>
      </div>

      <div className="space-y-3">
        {sections.map(section => (
          <div key={section.id} className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="text-white font-medium">{section.title}</div>
                <div className="text-ink-500 text-xs">ID: {section.id}</div>
              </div>
              <button onClick={() => toggleMaintenance(section.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                  section.maintenance ? 'bg-orange-400/10 text-orange-400 border border-orange-400/30' : 'bg-jade-400/10 text-jade-400 border border-jade-400/30'
                }`}>
                {section.maintenance ? <><EyeOff className="w-3.5 h-3.5" /> Техработы</> : <><Eye className="w-3.5 h-3.5" /> Активен</>}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// ======================== GUIDES PANEL ========================
function GuidesPanel() {
  const { guides, deleteGuide, updateGuide } = useAuth();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatBox label="Всего гайдов" value={guides.length} icon="📖" />
        <StatBox label="Категорий" value={new Set(guides.map(g => g.category)).size} icon="📂" />
        <StatBox label="Авторов" value={new Set(guides.map(g => g.authorName)).size} icon="✍️" />
      </div>

      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-2 px-4 py-3 bg-ink-900/50 text-xs text-ink-400 font-medium uppercase tracking-wider border-b border-ink-700/30">
          <div className="col-span-1" /><div className="col-span-4">Заголовок</div><div className="col-span-2">Категория</div>
          <div className="col-span-2">Автор</div><div className="col-span-1">Дата</div><div className="col-span-2 text-right">Действия</div>
        </div>
        <div className="divide-y divide-ink-700/30">
          {guides.map(g => (
            <div key={g.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 px-4 py-3 items-center">
              <div className="col-span-1 text-xl">{g.icon}</div>
              <div className="col-span-4">
                {editId === g.id
                  ? <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="w-full bg-ink-700 border border-ink-600 rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-gold-400/50" />
                  : <div className="text-white text-sm font-medium">{g.title}</div>}
              </div>
              <div className="col-span-2">
                {editId === g.id
                  ? <select value={editCategory} onChange={e => setEditCategory(e.target.value)} className="bg-ink-700 border border-ink-600 rounded px-2 py-1 text-white text-xs cursor-pointer focus:outline-none">
                      {['Новичкам','Бой','Механики','Кооператив','PvP','Профессии','Экипировка','Прочее'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  : <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">{g.category}</span>}
              </div>
              <div className="col-span-2 text-ink-400 text-xs hidden md:block">{g.authorName}</div>
              <div className="col-span-1 text-ink-500 text-xs hidden md:block">{g.updatedAt}</div>
              <div className="col-span-2 flex items-center gap-1 justify-end">
                {editId === g.id ? (
                  <>
                    <button onClick={() => { if (editTitle.trim()) { updateGuide(g.id, { title: editTitle, category: editCategory }); setEditId(null); } }}
                      className="p-1.5 rounded-lg text-jade-400 hover:bg-jade-400/10 cursor-pointer"><Check className="w-4 h-4" /></button>
                    <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-700/50 cursor-pointer"><X className="w-4 h-4" /></button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setEditId(g.id); setEditTitle(g.title); setEditCategory(g.category); }}
                      className="p-1.5 rounded-lg text-gold-400 hover:bg-gold-400/10 cursor-pointer"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => setDeleteConfirm(g.id)} className="p-1.5 rounded-lg text-crimson-400 hover:bg-crimson-400/10 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {deleteConfirm && <ConfirmModal title="Удалить гайд?" message="Гайд будет безвозвратно удалён."
        onConfirm={() => { deleteGuide(deleteConfirm); setDeleteConfirm(null); }} onCancel={() => setDeleteConfirm(null)} />}
    </div>
  );
}

// ======================== ANNOUNCEMENTS PANEL ========================
function AnnouncementsPanel() {
  const { siteSettings, addAnnouncement, removeAnnouncement } = useAuth();
  const [newText, setNewText] = useState('');
  const [newType, setNewType] = useState<'info' | 'warning' | 'success'>('info');
  const typeStyles: Record<string, string> = {
    info: 'border-blue-400/30 bg-blue-400/5 text-blue-400',
    warning: 'border-orange-400/30 bg-orange-400/5 text-orange-400',
    success: 'border-jade-400/30 bg-jade-400/5 text-jade-400',
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 space-y-3">
        <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Новое объявление</h3>
        <input value={newText} onChange={e => setNewText(e.target.value)} placeholder="Текст объявления..."
          className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50" />
        <div className="flex gap-2">
          <select value={newType} onChange={e => setNewType(e.target.value as typeof newType)}
            className="bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white cursor-pointer focus:outline-none">
            <option value="info">ℹ️ Информация</option><option value="warning">⚠️ Предупреждение</option><option value="success">✅ Успех</option>
          </select>
          <button onClick={() => { if (newText.trim()) { addAnnouncement(newText.trim(), newType); setNewText(''); } }}
            className="px-4 py-2 bg-gold-400/20 text-gold-400 rounded-lg text-sm font-medium hover:bg-gold-400/30 cursor-pointer">Опубликовать</button>
        </div>
      </div>
      <div className="space-y-2">
        {siteSettings.announcements.length === 0
          ? <div className="text-center py-8 text-ink-500"><Bell className="w-10 h-10 mx-auto mb-2 opacity-50" /><p>Нет объявлений</p></div>
          : siteSettings.announcements.map(ann => (
            <div key={ann.id} className={`flex items-center justify-between gap-3 rounded-xl p-4 border ${typeStyles[ann.type]}`}>
              <p className="text-sm flex-1">{ann.text}</p>
              <button onClick={() => removeAnnouncement(ann.id)} className="p-1 text-ink-400 hover:text-crimson-400 cursor-pointer shrink-0"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
      </div>
    </div>
  );
}

// ======================== SETTINGS PANEL ========================
function SettingsPanel() {
  const { siteSettings, updatePmSettings, updateSiteSettings, purgeEmbeddedImagesFromDb } = useAuth();
  const pm = siteSettings.pmSettings || { notificationSound: true, soundUrl: '' };
  const [pmSoundUrl, setPmSoundUrl] = useState(pm.soundUrl);
  const [saved, setSaved] = useState(false);
  const [purging, setPurging] = useState(false);
  const [purgeMsg, setPurgeMsg] = useState<string | null>(null);

  const handleSave = () => {
    updatePmSettings({ soundUrl: pmSoundUrl.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-2xl">
      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5 space-y-4">
        <h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2"><Settings className="w-4 h-4" /> Настройки сайта</h3>
        <p className="text-ink-500 text-xs">Информация о гильдии и Discord редактируются на главной странице.</p>
        <p className="text-ink-500 text-xs mt-2">
          Скриншоты — Storage (<code className="text-gold-400/80">storage-setup.sql</code>). ЛС — таблица <code className="text-gold-400/80">pm-messages-setup.sql</code> (не JSON в site_data).
        </p>
        <button
          type="button"
          disabled={purging}
          onClick={async () => {
            if (!confirm('Удалить встроенные base64-картинки из базы? Ссылки на Storage останутся.')) return;
            setPurging(true);
            setPurgeMsg(null);
            const err = await purgeEmbeddedImagesFromDb();
            setPurging(false);
            setPurgeMsg(err ? err : 'Готово: base64 убраны из гайдов, вики, новостей и гильдии.');
          }}
          className="mt-2 w-full py-2 rounded-lg text-xs bg-ink-700/50 text-ink-300 hover:bg-ink-600 cursor-pointer disabled:opacity-50"
        >
          {purging ? 'Очистка…' : 'Очистить base64 из базы данных'}
        </button>
        {purgeMsg && <p className="text-[10px] text-ink-400 mt-1">{purgeMsg}</p>}
        <div className="pt-2 border-t border-ink-700/30">
          <h4 className="text-gold-400 text-xs font-semibold mb-2">Личные сообщения</h4>
          <label className="flex items-center gap-2 text-sm text-ink-300 mb-2 cursor-pointer">
            <input type="checkbox" checked={pm.notificationSound}
              onChange={e => updatePmSettings({ notificationSound: e.target.checked })} className="rounded" />
            Звук уведомлений ЛС
          </label>
          <label className="text-ink-400 text-xs mb-1 block">URL звука (пусто = встроенный сигнал)</label>
          <input value={pmSoundUrl} onChange={e => setPmSoundUrl(e.target.value)} placeholder="https://..."
            className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold-400/50" />
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm cursor-pointer transition-all ${saved ? 'bg-jade-400/20 text-jade-400' : 'bg-gold-400/20 text-gold-400 hover:bg-gold-400/30'}`}>
          {saved ? <><Check className="w-4 h-4" /> Сохранено</> : <><Save className="w-4 h-4" /> Сохранить</>}
        </button>
      </div>

      <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div><h3 className="text-gold-400 font-semibold text-sm flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Режим обслуживания</h3><p className="text-ink-400 text-xs mt-1">Пользователи увидят заглушку</p></div>
          <button onClick={() => updateSiteSettings({ maintenanceMode: !siteSettings.maintenanceMode })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${siteSettings.maintenanceMode ? 'bg-crimson-400/20 text-crimson-400 border border-crimson-400/40' : 'bg-ink-700/50 text-ink-300 border border-ink-600/30'}`}>
            {siteSettings.maintenanceMode ? <><EyeOff className="w-4 h-4" /> Включён</> : <><Eye className="w-4 h-4" /> Выключен</>}
          </button>
        </div>
      </div>

      <div className="bg-crimson-400/5 border border-crimson-400/20 rounded-xl p-5">
        <h3 className="text-crimson-400 font-semibold text-sm flex items-center gap-2 mb-3"><AlertTriangle className="w-4 h-4" /> Опасная зона</h3>
        <button onClick={() => { if (confirm('Сбросить все данные?')) { localStorage.clear(); window.location.reload(); } }}
          className="px-4 py-2 bg-crimson-400/10 text-crimson-400 rounded-lg text-sm hover:bg-crimson-400/20 cursor-pointer">Сбросить все данные</button>
      </div>
    </div>
  );
}

// ======================== SHARED ========================
function StatBox({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 text-center">
      <div className="text-xl mb-1">{icon}</div>
      <div className="font-serif text-2xl font-bold text-gold-400">{value}</div>
      <div className="text-ink-400 text-xs">{label}</div>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel }: { title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative bg-ink-800 border border-crimson-400/30 rounded-xl p-6 max-w-sm w-full">
        <h3 className="font-serif text-lg text-white font-bold mb-2">{title}</h3>
        <p className="text-ink-300 text-sm mb-4">{message}</p>
        <div className="flex gap-2">
          <button onClick={onConfirm} className="flex-1 bg-crimson-400/20 text-crimson-400 py-2 rounded-lg font-medium hover:bg-crimson-400/30 cursor-pointer">Подтвердить</button>
          <button onClick={onCancel} className="flex-1 bg-ink-700 text-ink-300 py-2 rounded-lg hover:bg-ink-600 cursor-pointer">Отмена</button>
        </div>
      </div>
    </div>
  );
}

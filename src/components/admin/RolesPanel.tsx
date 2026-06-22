import { useState } from 'react';
import { Tag, Plus, Check, X, Edit3, Trash2, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from './AdminShared';
import { ALL_ROLE_PERMISSIONS, PERM_GROUPS, ROLE_PRESET_COLORS, isSystemRole } from './rolePermissions';

export default function RolesPanel() {
  const { siteSettings, updateRole, addRole, deleteRole, registeredUsers, dbSaveError, clearDbSaveError } = useAuth();
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

  const startEdit = (role: typeof siteSettings.roles[0]) => {
    setEditingRole(role.id);
    setEditName(role.displayName);
    setEditColor(role.color);
    setEditPerms([...role.permissions]);
  };

  const saveEdit = (roleId: string) => {
    if (!editName.trim()) return;
    updateRole(roleId, {
      displayName: editName.trim(),
      color: editColor,
      permissions: editPerms,
    });
    setSaved(roleId);
    setTimeout(() => setSaved(null), 2000);
    setEditingRole(null);
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
    setNewName('');
    setNewColor('#4abf85');
    setNewPerms(['read', 'profile', 'favorites']);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="bg-gold-400/5 border border-gold-400/20 rounded-xl p-4 flex items-start gap-3">
        <Tag className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-gold-400 font-semibold text-sm">Управление ролями и званиями</h3>
          <p className="text-ink-400 text-xs mt-1">
            Создавайте роли, переименовывайте, настраивайте цвета и управляйте правами доступа. Системные роли (user, editor, admin) нельзя удалить.
          </p>
        </div>
        {!showAddForm && (
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gold-400/20 text-gold-400 text-sm font-medium cursor-pointer hover:bg-gold-400/30 shrink-0"
          >
            <Plus className="w-4 h-4" /> Новая роль
          </button>
        )}
      </div>

      {dbSaveError && (
        <div className="flex items-center justify-between gap-2 bg-crimson-400/10 border border-crimson-400/30 rounded-xl px-4 py-3 text-crimson-300 text-sm">
          <span>Не удалось сохранить: {dbSaveError}</span>
          <button type="button" onClick={clearDbSaveError} className="text-xs underline cursor-pointer">Закрыть</button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-ink-800/70 border border-gold-400/30 rounded-xl p-5 space-y-4 animate-fadeIn">
          <h3 className="font-serif text-lg font-bold text-gold-400 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Создать новую роль
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Название роли *</label>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Например: Модератор"
                className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50"
                autoFocus
              />
            </div>
            <div>
              <label className="text-ink-400 text-xs mb-1.5 block">Цвет</label>
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 flex-wrap">
                  {ROLE_PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewColor(c)}
                      className={`w-7 h-7 rounded-full cursor-pointer border-2 transition-all ${newColor === c ? 'border-white scale-110' : 'border-transparent hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <input type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer bg-transparent border-0" />
              </div>
            </div>
          </div>
          <PermissionPicker active={newPerms} onToggle={toggleNewPerm} />
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddRole}
              disabled={!newName.trim()}
              className="flex-1 flex items-center justify-center gap-2 bg-gold-400/20 text-gold-400 py-2.5 rounded-lg font-medium text-sm cursor-pointer hover:bg-gold-400/30 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" /> Создать роль
            </button>
            <button type="button" onClick={() => setShowAddForm(false)} className="px-5 bg-ink-700 text-ink-300 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-ink-600">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {siteSettings.roles.map(role => {
          const isEditing = editingRole === role.id;
          const isSaved = saved === role.id;
          const usersWithRole = registeredUsers.filter(u => u.role === role.id).length;

          return (
            <div key={role.id} className={`bg-ink-800/50 border rounded-xl overflow-hidden ${isEditing ? 'border-gold-400/40' : 'border-ink-700/30'}`}>
              <div className="flex items-center justify-between p-4 border-b border-ink-700/20">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full shrink-0 border border-white/20" style={{ backgroundColor: isEditing ? editColor : role.color }} />
                  {isEditing ? (
                    <input
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="bg-ink-700 border border-ink-600 rounded-lg px-3 py-1.5 text-white text-sm font-bold focus:outline-none focus:border-gold-400/50 w-48"
                      autoFocus
                    />
                  ) : (
                    <div>
                      <h3 className="font-serif font-bold text-lg" style={{ color: role.color }}>{role.displayName}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-ink-500 text-xs">ID: <code className="text-ink-400">{role.id}</code></span>
                        {isSystemRole(role.id) && <span className="text-[9px] bg-ink-700/50 text-ink-400 px-1.5 py-0.5 rounded">системная</span>}
                        <span className="text-[9px] text-ink-500">{usersWithRole} польз.</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button type="button" onClick={() => saveEdit(role.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-jade-400/20 text-jade-400 text-xs font-medium cursor-pointer hover:bg-jade-400/30">
                        <Check className="w-3.5 h-3.5" /> Сохранить
                      </button>
                      <button type="button" onClick={() => setEditingRole(null)} className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-ink-700/50 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(role)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          isSaved ? 'bg-jade-400/20 text-jade-400' : 'bg-ink-700/50 text-ink-300 hover:text-gold-400 hover:bg-gold-400/10'
                        }`}
                      >
                        {isSaved ? <><Check className="w-3.5 h-3.5" /> Сохранено</> : <><Edit3 className="w-3.5 h-3.5" /> Изменить</>}
                      </button>
                      {!isSystemRole(role.id) && (
                        <button type="button" onClick={() => setDeleteConfirm(role.id)} className="p-1.5 rounded-lg text-crimson-400 hover:bg-crimson-400/10 cursor-pointer" title="Удалить роль">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="px-4 py-3 bg-ink-900/30 border-b border-ink-700/20">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Palette className="w-4 h-4 text-ink-400 shrink-0" />
                    <span className="text-ink-400 text-xs shrink-0">Цвет:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {ROLE_PRESET_COLORS.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setEditColor(c)}
                          className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${editColor === c ? 'border-white scale-125' : 'border-transparent hover:scale-110'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <input type="color" value={editColor} onChange={e => setEditColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
                  </div>
                </div>
              )}

              <div className="p-4">
                <h4 className="text-ink-400 text-xs font-medium uppercase tracking-wider mb-3">Права доступа</h4>
                {isEditing ? (
                  <PermissionPicker active={editPerms} onToggle={toggleEditPerm} />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {ALL_ROLE_PERMISSIONS.map(perm => {
                      const has = role.permissions.includes(perm.id);
                      return (
                        <span
                          key={perm.id}
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                            has ? 'bg-jade-400/10 text-jade-400 border border-jade-400/30' : 'bg-ink-700/30 text-ink-500 border border-ink-700/20 line-through'
                          }`}
                        >
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

function PermissionPicker({ active, onToggle }: { active: string[]; onToggle: (perm: string) => void }) {
  return (
    <div className="space-y-3">
      {PERM_GROUPS.map(group => (
        <div key={group}>
          <div className="text-ink-500 text-[10px] uppercase tracking-wider mb-1.5">{group}</div>
          <div className="flex flex-wrap gap-1.5">
            {ALL_ROLE_PERMISSIONS.filter(p => p.group === group).map(perm => {
              const isActive = active.includes(perm.id);
              return (
                <button
                  key={perm.id}
                  type="button"
                  onClick={() => onToggle(perm.id)}
                  className={`inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
                    isActive ? 'bg-jade-400/15 text-jade-400 border border-jade-400/40' : 'bg-ink-700/30 text-ink-500 border border-ink-700/20 hover:text-ink-300 hover:border-ink-600'
                  }`}
                >
                  {isActive ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  {perm.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

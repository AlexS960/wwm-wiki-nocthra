import { useMemo, useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import type { StaffMemberView } from './types';
import StaffChatRoleFilter from './StaffChatRoleFilter';
import { staffRoleFilterOptions } from '../../lib/staffChat';
import type { RoleConfig } from '../../types/site';

interface StaffGroupMembersModalProps {
  roomTitle: string;
  memberIds: string[];
  staffList: StaffMemberView[];
  siteRoles: RoleConfig[];
  currentUserId: string;
  onClose: () => void;
  onAddMembers: (memberIds: string[]) => Promise<string | null>;
}

export default function StaffGroupMembersModal({
  roomTitle,
  memberIds,
  staffList,
  siteRoles,
  currentUserId,
  onClose,
  onAddMembers,
}: StaffGroupMembersModalProps) {
  const [adding, setAdding] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const members = useMemo(
    () => staffList.filter(s => memberIds.includes(s.id)),
    [staffList, memberIds],
  );

  const roleOptions = useMemo(() => staffRoleFilterOptions(staffList, siteRoles), [staffList, siteRoles]);

  const candidates = useMemo(() => {
    let list = staffList.filter(s => s.id !== currentUserId && !memberIds.includes(s.id));
    if (roleFilter !== 'all') list = list.filter(s => s.role === roleFilter);
    return list;
  }, [staffList, currentUserId, memberIds, roleFilter]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = async () => {
    if (selected.size < 1) {
      setError('Выберите участников');
      return;
    }
    setAdding(true);
    setError(null);
    const err = await onAddMembers([...selected]);
    setAdding(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="w-full max-w-md bg-ink-900 border border-purple-500/30 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700/50">
          <h3 className="font-medium text-white truncate">Участники · {roomTitle}</h3>
          <button type="button" onClick={onClose} className="p-1 text-ink-400 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-4 py-3 border-b border-ink-700/40 overflow-y-auto max-h-[140px]">
          {members.length === 0 ? (
            <p className="text-ink-500 text-sm">Нет участников</p>
          ) : (
            <ul className="space-y-2">
              {members.map(m => (
                <li key={m.id} className="flex items-center gap-2 text-sm">
                  <span className="w-8 h-8 rounded-full bg-ink-700 flex items-center justify-center text-xs font-bold shrink-0" style={{ color: m.roleColor }}>
                    {m.displayName.charAt(0)}
                  </span>
                  <span className="text-white truncate">{m.displayName}</span>
                  <span className="text-xs ml-auto shrink-0" style={{ color: m.roleColor }}>{m.roleName}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="px-4 py-2 border-b border-ink-700/40 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-sm text-ink-300">Добавить участников</span>
        </div>

        <StaffChatRoleFilter options={roleOptions} value={roleFilter} onChange={setRoleFilter} />

        <div className="flex-1 overflow-y-auto px-2 py-2 min-h-[120px]">
          {candidates.length === 0 ? (
            <p className="text-ink-500 text-sm text-center py-4">Все уже в группе</p>
          ) : (
            candidates.map(s => (
              <label key={s.id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-ink-800/50 cursor-pointer">
                <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggle(s.id)} className="accent-purple-500" />
                <span className="text-sm text-white truncate">{s.displayName}</span>
                <span className="text-xs ml-auto" style={{ color: s.roleColor }}>{s.roleName}</span>
              </label>
            ))
          )}
        </div>

        {error && <p className="px-4 text-crimson-300 text-xs">{error}</p>}

        <div className="p-4 border-t border-ink-700/50 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg border border-ink-600 text-ink-300 text-sm cursor-pointer">Закрыть</button>
          <button
            type="button"
            disabled={adding || selected.size === 0}
            onClick={() => void handleAdd()}
            className="flex-1 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm cursor-pointer disabled:opacity-50"
          >
            {adding ? 'Добавление…' : 'Добавить'}
          </button>
        </div>
      </div>
    </div>
  );
}

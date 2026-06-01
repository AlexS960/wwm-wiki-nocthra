import { Search, Users, UsersRound } from 'lucide-react';
import StaffChatRoleFilter from './StaffChatRoleFilter';
import type { StaffConversation, StaffMemberView } from './types';

function formatListTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

interface StaffChatSidebarProps {
  className: string;
  sidebarTab: 'chats' | 'team';
  onTabChange: (tab: 'chats' | 'team') => void;
  search: string;
  onSearchChange: (v: string) => void;
  onCreateGroup: () => void;
  staffCount: number;
  staffLoading: boolean;
  pmLoaded: boolean;
  roleOptions: { id: string; label: string; color: string }[];
  roleFilter: string;
  onRoleFilterChange: (v: string) => void;
  filteredTeam: StaffMemberView[];
  filteredConversations: StaffConversation[];
  activeChatKey: string | null;
  onSelectChat: (key: string) => void;
  onOpenDialogMenu: (e: React.MouseEvent, chatKey: string) => void;
  onSelectTeamMember: (partnerId: string) => void;
  dmChatKey: (id: string) => string;
}

export default function StaffChatSidebar({
  className,
  sidebarTab,
  onTabChange,
  search,
  onSearchChange,
  onCreateGroup,
  staffCount,
  staffLoading,
  pmLoaded,
  roleOptions,
  roleFilter,
  onRoleFilterChange,
  filteredTeam,
  filteredConversations,
  activeChatKey,
  onSelectChat,
  onOpenDialogMenu,
  onSelectTeamMember,
  dmChatKey,
}: StaffChatSidebarProps) {
  return (
    <aside className={className}>
      <div className="flex border-b border-ink-700/40">
        <button
          type="button"
          onClick={() => onTabChange('chats')}
          className={`flex-1 py-2.5 text-xs font-medium cursor-pointer ${sidebarTab === 'chats' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-ink-400'}`}
        >
          Чаты
        </button>
        <button
          type="button"
          onClick={() => onTabChange('team')}
          className={`flex-1 py-2.5 text-xs font-medium cursor-pointer ${sidebarTab === 'team' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-ink-400'}`}
        >
          Команда ({staffCount})
        </button>
      </div>

      <div className="p-3 border-b border-ink-700/30 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
          <input
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={sidebarTab === 'team' ? 'Поиск по имени или роли…' : 'Поиск чатов…'}
            className="w-full bg-ink-800/80 border border-ink-700/50 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-purple-400/40"
          />
        </div>
        <button
          type="button"
          onClick={onCreateGroup}
          className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500/25 cursor-pointer shrink-0"
          title="Групповой чат"
        >
          <UsersRound className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {sidebarTab === 'team' ? (
          <>
            <StaffChatRoleFilter options={roleOptions} value={roleFilter} onChange={onRoleFilterChange} />
            {staffLoading ? (
              <p className="text-ink-500 text-sm text-center py-8">Загрузка команды…</p>
            ) : filteredTeam.length === 0 ? (
              <p className="text-ink-500 text-sm text-center py-8 px-4">Никого не найдено</p>
            ) : (
              filteredTeam.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onSelectTeamMember(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 cursor-pointer text-left border-b border-ink-800/50 hover:bg-ink-800/40 ${
                    activeChatKey === dmChatKey(s.id) ? 'bg-purple-500/10' : ''
                  }`}
                >
                  <div className="w-11 h-11 rounded-full bg-ink-700 flex items-center justify-center text-base font-bold shrink-0" style={{ color: s.roleColor }}>
                    {s.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">{s.displayName}</div>
                    <div className="text-xs truncate" style={{ color: s.roleColor }}>{s.roleName}</div>
                    <div className="text-[10px] text-ink-500 truncate">@{s.username}</div>
                  </div>
                </button>
              ))
            )}
          </>
        ) : !pmLoaded && staffLoading ? (
          <p className="text-ink-500 text-sm text-center py-8">Загрузка…</p>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-ink-500 text-sm mb-3">Нет чатов. Откройте вкладку «Команда» или создайте группу.</p>
            <button type="button" onClick={() => onTabChange('team')} className="text-purple-400 text-xs cursor-pointer hover:underline">
              Список команды
            </button>
          </div>
        ) : (
          filteredConversations.map(chat => (
            <button
              key={chat.key}
              type="button"
              onClick={() => onSelectChat(chat.key)}
              onContextMenu={e => onOpenDialogMenu(e, chat.key)}
              className={`w-full flex items-center gap-3 px-3 py-3 cursor-pointer text-left border-b border-ink-800/50 transition-colors ${
                activeChatKey === chat.key ? 'bg-purple-500/10' : 'hover:bg-ink-800/40'
              }`}
            >
              <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${chat.type === 'group' ? 'bg-purple-500/20' : 'bg-ink-700'}`}>
                {chat.type === 'group' ? <Users className="w-5 h-5 text-purple-400" /> : (
                  <span className="text-base font-bold text-purple-300">{chat.title.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <span className="text-sm font-medium text-white truncate">{chat.title}</span>
                  <span className="text-[10px] text-ink-500 shrink-0">{formatListTime(chat.ts)}</span>
                </div>
                <div className="flex justify-between gap-2 mt-0.5">
                  <span className="text-xs text-ink-400 truncate">{chat.lastMsg}</span>
                  {chat.unread > 0 && (
                    <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {chat.unread > 9 ? '9+' : chat.unread}
                    </span>
                  )}
                </div>
                {chat.subtitle && <span className="text-[10px] text-ink-500">{chat.subtitle}</span>}
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}

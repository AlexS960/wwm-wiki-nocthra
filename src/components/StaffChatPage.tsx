import { ArrowLeft, MessageSquare, ShieldAlert } from 'lucide-react';
import { canAccessStaffChat, staffDmChatKey } from '../lib/staffChat';
import { useStaffChat } from '../hooks/useStaffChat';
import StaffChatSidebar from './staffChat/StaffChatSidebar';
import StaffChatThread, { getStaffChatTheme } from './staffChat/StaffChatThread';
import StaffChatDialogMenu from './staffChat/StaffChatDialogMenu';
import CreateGroupModal from './staffChat/CreateGroupModal';
import StaffGroupMembersModal from './staffChat/StaffGroupMembersModal';

interface StaffChatPageProps {
  onBack: () => void;
  onLoginClick: () => void;
}

export default function StaffChatPage({ onBack, onLoginClick }: StaffChatPageProps) {
  const chat = useStaffChat();
  const {
    user,
    siteSettings,
    staffList,
    staffLoading,
    loadError,
    pmLoaded,
    sidebarTab,
    setSidebarTab,
    search,
    setSearch,
    activeChatKey,
    mobileShowChat,
    setMobileShowChat,
    text,
    setText,
    sending,
    sendError,
    showCreateGroup,
    setShowCreateGroup,
    showMembersModal,
    setShowMembersModal,
    roleFilter,
    setRoleFilter,
    dialogMenu,
    editingGroupTitle,
    setEditingGroupTitle,
    groupTitleDraft,
    setGroupTitleDraft,
    messagesScrollRef,
    filteredConversations,
    filteredTeam,
    roleOptions,
    activeParsed,
    activeDmMsgs,
    activeGroupMsgs,
    activeRoom,
    activeConv,
    getThemeForChat,
    selectChat,
    handleSend,
    handleCreateGroup,
    handleAddMembers,
    handleDeleteGroupMessage,
    handleDeleteDialogForMe,
    handleDeleteDialogForAll,
    saveGroupTitle,
    openDialogMenu,
    groupRooms,
  } = chat;

  if (!user) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] pt-16 md:pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <MessageSquare className="w-14 h-14 text-gold-400/50 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-white mb-2">Служебный чат</h2>
          <p className="text-ink-400 text-sm mb-6">Войдите в аккаунт</p>
          <button type="button" onClick={onLoginClick} className="px-6 py-2.5 bg-gold-400/20 text-gold-300 rounded-lg cursor-pointer">Войти</button>
        </div>
      </div>
    );
  }

  if (!canAccessStaffChat(user, siteSettings.roles)) {
    return (
      <div className="min-h-[calc(100dvh-4rem)] pt-16 md:pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShieldAlert className="w-14 h-14 text-crimson-400 mx-auto mb-4" />
          <h2 className="font-serif text-xl font-bold text-white mb-2">Доступ ограничен</h2>
          <p className="text-ink-400 text-sm mb-6">Нужна роль с правом «Служебный чат» (staff.chat) в настройках ролей.</p>
          <button type="button" onClick={onBack} className="px-6 py-2.5 bg-gold-400/20 text-gold-400 rounded-lg cursor-pointer">На главную</button>
        </div>
      </div>
    );
  }

  const sidebarClass = `${mobileShowChat ? 'hidden md:flex' : 'flex'} w-full md:w-[340px] lg:w-[400px] shrink-0 flex-col border-r border-ink-700/40 bg-ink-900/60`;
  const mainClass = `${mobileShowChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0 ${getStaffChatTheme(activeChatKey ? getThemeForChat(activeChatKey) : 'purple').panelBg}`;
  const activeTheme = getStaffChatTheme(activeChatKey ? getThemeForChat(activeChatKey) : 'purple');

  return (
    <div className="staff-chat-layout h-[calc(100dvh-4rem)] md:h-[calc(100dvh-5rem)] pt-16 md:pt-20 flex flex-col bg-ink-900/40">
      <div className="shrink-0 px-3 sm:px-4 py-2 border-b border-ink-700/40 flex items-center gap-3 bg-ink-900/80">
        <button type="button" onClick={onBack} className="p-2 rounded-lg text-ink-400 hover:text-gold-400 cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <MessageSquare className="w-5 h-5 text-gold-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <h1 className="font-serif text-lg font-bold text-white truncate">Служебный чат</h1>
          <p className="text-[11px] text-ink-500">{staffList.length} в команде · {groupRooms.length} групп</p>
        </div>
      </div>

      {loadError && (
        <div className="mx-4 mt-2 px-3 py-2 rounded-lg bg-crimson-400/10 border border-crimson-400/30 text-crimson-300 text-xs">
          {loadError}
        </div>
      )}

      <div className="flex-1 flex min-h-0 max-w-7xl w-full mx-auto border-x border-ink-700/30">
        <StaffChatSidebar
          className={sidebarClass}
          sidebarTab={sidebarTab}
          onTabChange={setSidebarTab}
          search={search}
          onSearchChange={setSearch}
          onCreateGroup={() => setShowCreateGroup(true)}
          staffCount={staffList.length}
          staffLoading={staffLoading}
          pmLoaded={pmLoaded}
          roleOptions={roleOptions}
          roleFilter={roleFilter}
          onRoleFilterChange={setRoleFilter}
          filteredTeam={filteredTeam}
          filteredConversations={filteredConversations}
          activeChatKey={activeChatKey}
          onSelectChat={selectChat}
          onOpenDialogMenu={openDialogMenu}
          onSelectTeamMember={id => selectChat(staffDmChatKey(id))}
          dmChatKey={staffDmChatKey}
        />

        <StaffChatThread
          className={mainClass}
          userId={user.id}
          activeChatKey={activeChatKey}
          activeConv={activeConv}
          activeTheme={activeTheme}
          isGroup={activeParsed?.type === 'group'}
          editingGroupTitle={editingGroupTitle}
          groupTitleDraft={groupTitleDraft}
          onGroupTitleDraftChange={setGroupTitleDraft}
          onStartEditTitle={() => { setGroupTitleDraft(activeConv?.title || ''); setEditingGroupTitle(true); }}
          onSaveTitle={() => void saveGroupTitle()}
          onCancelEditTitle={() => setEditingGroupTitle(false)}
          onBackMobile={() => setMobileShowChat(false)}
          onOpenDialogMenu={e => activeChatKey && openDialogMenu(e, activeChatKey)}
          onShowMembers={() => setShowMembersModal(true)}
          messagesScrollRef={messagesScrollRef}
          dmMessages={activeDmMsgs}
          groupMessages={activeGroupMsgs}
          getUserDisplayName={chat.getUserDisplayName}
          sendError={sendError}
          text={text}
          onTextChange={setText}
          onSend={() => void handleSend()}
          sending={sending}
          onDeleteGroupMessage={activeParsed?.type === 'group' ? id => void handleDeleteGroupMessage(id).then(err => err && chat.setSendError(err)) : undefined}
        />
      </div>

      {dialogMenu && (
        <StaffChatDialogMenu
          x={dialogMenu.x}
          y={dialogMenu.y}
          onDeleteForMe={() => void handleDeleteDialogForMe(dialogMenu.chatKey)}
          onDeleteForAll={() => void handleDeleteDialogForAll(dialogMenu.chatKey)}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          staffList={staffList}
          siteRoles={siteSettings.roles}
          currentUserId={user.id}
          onClose={() => setShowCreateGroup(false)}
          onCreate={handleCreateGroup}
        />
      )}

      {showMembersModal && activeRoom && (
        <StaffGroupMembersModal
          roomTitle={activeRoom.title}
          memberIds={activeRoom.memberIds}
          staffList={staffList}
          siteRoles={siteSettings.roles}
          currentUserId={user.id}
          onClose={() => setShowMembersModal(false)}
          onAddMembers={ids => handleAddMembers(activeRoom.id, ids)}
        />
      )}
    </div>
  );
}

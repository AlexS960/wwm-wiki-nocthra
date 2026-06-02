import { ArrowLeft, Palette, Pencil, Check, X, MoreVertical, Users } from 'lucide-react';
import { renderBBCode } from '../../lib/bbcode';
import StaffChatComposer from './StaffChatComposer';
import { getStaffChatTheme, STAFF_CHAT_THEMES, type StaffChatTheme } from './staffChatThemes';
import type { StaffGroupMessage } from '../../lib/staffGroupChat';
import type { PrivateMessage } from '../../lib/pm';
import type { StaffConversation } from './types';

interface StaffChatThreadProps {
  className: string;
  userId: string;
  activeChatKey: string | null;
  activeConv: StaffConversation | undefined;
  activeTheme: StaffChatTheme;
  isGroup: boolean;
  editingGroupTitle: boolean;
  groupTitleDraft: string;
  onGroupTitleDraftChange: (v: string) => void;
  onStartEditTitle: () => void;
  onSaveTitle: () => void;
  onCancelEditTitle: () => void;
  showThemePicker: boolean;
  onToggleThemePicker: () => void;
  getThemeForChat: (key: string) => string;
  onSetTheme: (themeId: string) => void;
  onBackMobile: () => void;
  onOpenDialogMenu: (e: React.MouseEvent) => void;
  onShowMembers: () => void;
  messagesScrollRef: React.RefObject<HTMLDivElement | null>;
  dmMessages: PrivateMessage[];
  groupMessages: StaffGroupMessage[];
  getUserDisplayName: (id: string, fallback: string) => string;
  sendError: string | null;
  text: string;
  onTextChange: (v: string) => void;
  onSend: () => void;
  sending: boolean;
  onDeleteGroupMessage?: (messageId: string) => void;
}

export default function StaffChatThread({
  className,
  userId,
  activeChatKey,
  activeConv,
  activeTheme,
  isGroup,
  editingGroupTitle,
  groupTitleDraft,
  onGroupTitleDraftChange,
  onStartEditTitle,
  onSaveTitle,
  onCancelEditTitle,
  showThemePicker,
  onToggleThemePicker,
  getThemeForChat,
  onSetTheme,
  onBackMobile,
  onOpenDialogMenu,
  onShowMembers,
  messagesScrollRef,
  dmMessages,
  groupMessages,
  getUserDisplayName,
  sendError,
  text,
  onTextChange,
  onSend,
  sending,
  onDeleteGroupMessage,
}: StaffChatThreadProps) {
  const renderMessage = (
    body: string,
    isSelf: boolean,
    messageId: string,
    fromLabel?: string,
    deleted?: boolean,
  ) => (
    <div key={messageId} className={`flex ${isSelf ? 'justify-end' : 'justify-start'} group/msg`}>
      <div className={`relative max-w-[min(85%,28rem)] rounded-2xl px-3.5 py-2 text-sm ${isSelf ? activeTheme.selfBubble : activeTheme.otherBubble} ${deleted ? 'opacity-75 italic' : ''}`}>
        {!isSelf && fromLabel && <p className={`text-[10px] mb-1 ${activeTheme.accent}`}>{fromLabel}</p>}
        {deleted ? (
          <span className="text-ink-500">Сообщение удалено</span>
        ) : (
          <div className="break-words whitespace-pre-wrap">
            {renderBBCode(body, {
              linkClassName: 'text-blue-300 underline break-all',
              quoteClassName: 'border-l-2 border-purple-400/40 pl-2 italic text-ink-300',
              codeClassName: 'font-mono text-xs bg-ink-900/50 px-1 rounded',
            })}
          </div>
        )}
        {isSelf && isGroup && !deleted && onDeleteGroupMessage && (
          <button
            type="button"
            onClick={() => void onDeleteGroupMessage(messageId)}
            className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 text-[10px] text-ink-500 hover:text-crimson-300 cursor-pointer px-1"
            title="Удалить у всех"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );

  if (!activeChatKey) {
    return (
      <main className={className}>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="text-ink-400 text-sm">Выберите чат или участника команды</p>
        </div>
      </main>
    );
  }

  return (
    <main className={className}>
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-ink-700/40 bg-ink-800/50 relative">
        <button type="button" className="md:hidden p-1.5 text-ink-400 hover:text-white cursor-pointer" onClick={onBackMobile}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1 flex items-center gap-2">
          {isGroup && editingGroupTitle ? (
            <>
              <input
                value={groupTitleDraft}
                onChange={e => onGroupTitleDraftChange(e.target.value)}
                className="flex-1 bg-ink-800 border border-ink-600 rounded-lg px-2 py-1 text-sm text-white focus:outline-none focus:border-purple-400/50"
              />
              <button type="button" onClick={onSaveTitle} className="p-1 text-jade-400 cursor-pointer"><Check className="w-4 h-4" /></button>
              <button type="button" onClick={onCancelEditTitle} className="p-1 text-ink-400 cursor-pointer"><X className="w-4 h-4" /></button>
            </>
          ) : (
            <>
              <div className="min-w-0 flex-1">
                <div className="text-white font-medium truncate">{activeConv?.title || 'Чат'}</div>
                {activeConv?.subtitle && <div className="text-xs text-ink-400 truncate">{activeConv.subtitle}</div>}
              </div>
              {isGroup && (
                <>
                  <button type="button" onClick={onStartEditTitle} className="p-1.5 text-ink-400 hover:text-purple-400 cursor-pointer shrink-0" title="Изменить название">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={onShowMembers} className="p-1.5 text-ink-400 hover:text-purple-400 cursor-pointer shrink-0" title="Участники">
                    <Users className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
        <button type="button" onClick={onOpenDialogMenu} className="p-2 rounded-lg text-ink-400 hover:text-ink-200 cursor-pointer shrink-0" title="Удалить диалог">
          <MoreVertical className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onToggleThemePicker}
          className={`p-2 rounded-lg cursor-pointer shrink-0 ${activeTheme.accentSoft} ${activeTheme.accent}`}
          title="Тема чата"
        >
          <Palette className="w-4 h-4" />
        </button>
        {showThemePicker && (
          <div className="absolute right-4 top-full mt-1 z-40 p-2 bg-ink-900 border border-ink-700/50 rounded-xl shadow-xl grid grid-cols-2 gap-1 min-w-[200px]">
            {STAFF_CHAT_THEMES.map(t => (
              <button
                key={t.id}
                type="button"
                onClick={() => onSetTheme(t.id)}
                className={`px-2 py-1.5 rounded text-xs cursor-pointer ${getThemeForChat(activeChatKey) === t.id ? `${t.accentSoft} ${t.accent}` : 'text-ink-400 hover:bg-ink-800'}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={messagesScrollRef} className="scroll-area flex-1 min-h-0 p-4 space-y-2">
        {!isGroup ? (
          dmMessages.length === 0 ? (
            <p className="text-center text-ink-500 text-sm py-8">Напишите первое сообщение</p>
          ) : (
            dmMessages.map(msg => renderMessage(
              msg.text,
              msg.fromId === userId,
              msg.id,
              undefined,
              msg.deletedForAll,
            ))
          )
        ) : groupMessages.length === 0 ? (
          <p className="text-center text-ink-500 text-sm py-8">Напишите в группу</p>
        ) : (
          groupMessages.map(msg => renderMessage(
            msg.text,
            msg.fromId === userId,
            msg.id,
            msg.fromId !== userId ? getUserDisplayName(msg.fromId, msg.fromName) : undefined,
            msg.deletedForAll,
          ))
        )}
      </div>

      {sendError && (
        <div className="mx-4 mb-2 px-3 py-2 rounded-lg bg-crimson-400/10 border border-crimson-400/30 text-crimson-300 text-xs">{sendError}</div>
      )}

      <StaffChatComposer
        value={text}
        onChange={onTextChange}
        onSend={onSend}
        sending={sending}
        accentClass={activeTheme.id === 'gold' ? 'gold' : activeTheme.id === 'jade' ? 'jade' : 'purple'}
      />
    </main>
  );
}

export { getStaffChatTheme };

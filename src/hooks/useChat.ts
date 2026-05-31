import { useAuth } from '../context/AuthContext';

/** Публичный хук: чат и модерация */
export function useChat() {
  const {
    chatState,
    chatLoaded,
    chatHasMore,
    chatLoadingMore,
    chatSearchQuery,
    chatSearchResults,
    ensureChatLoaded,
    loadOlderChatMessages,
    searchChatMessages,
    clearChatSearch,
    sendMessage,
    deleteMessage,
    muteUser,
    unmuteUser,
    isUserMuted,
    chatBanUser,
  } = useAuth();
  return {
    chatState,
    chatLoaded,
    chatHasMore,
    chatLoadingMore,
    chatSearchQuery,
    chatSearchResults,
    ensureChatLoaded,
    loadOlderChatMessages,
    searchChatMessages,
    clearChatSearch,
    sendMessage,
    deleteMessage,
    muteUser,
    unmuteUser,
    isUserMuted,
    chatBanUser,
  };
}

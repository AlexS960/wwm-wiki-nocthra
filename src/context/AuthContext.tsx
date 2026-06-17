import { createContext, useContext, useEffect, useMemo, useCallback, useRef, useState, type ReactNode } from 'react';
import { mergeSiteSettingsSafe, normalizeChatState } from '../lib/normalizeState';
import { canAccessStaffChat as userCanAccessStaffChat } from '../lib/staffChat';
import { canUseMessenger as userCanUseMessenger } from '../lib/messengerAccess';
import { dbDeleteAccount, dbUpdateAccount } from '../lib/db';
import { useAuthSession } from '../hooks/useAuthSession';
import { useAuthPm } from '../hooks/useAuthPm';
import { useAuthPersist } from '../hooks/auth/useAuthPersist';
import { useNormalizedDomains } from '../hooks/auth/useNormalizedDomains';
import { useAuthGuilds } from '../hooks/auth/useAuthGuilds';
import { useAuthAccounts } from '../hooks/auth/useAuthAccounts';
import { useAuthSiteCore } from '../hooks/auth/useAuthSiteCore';
import { useAuthSiteNews } from '../hooks/auth/useAuthSiteNews';
import { useAuthGuides } from '../hooks/auth/useAuthGuides';
import { useAuthWiki } from '../hooks/auth/useAuthWiki';
import { useAuthChat } from '../hooks/auth/useAuthChat';
import { useAuthSupport } from '../hooks/auth/useAuthSupport';
import { useAuthSuggestions } from '../hooks/auth/useAuthSuggestions';
import { useAuthRealtime } from '../hooks/auth/useAuthRealtime';
import { isKnownBuild } from '../lib/buildLookup';
import {
  contentStoreUpdateGuide,
  contentStoreUpdateWiki,
  contentStoreUpdateSiteNews,
  contentStoreSyncGuideVersions,
  contentStoreUsesNormalized,
} from '../lib/contentStore';
import {
  sanitizeGuides,
  sanitizeGuideVersions,
  sanitizeGuildAvatar,
  sanitizeSiteNews,
  sanitizeWiki,
} from '../lib/siteImages';
import { getDisplayName, isOnlineByLastSeen } from '../lib/displayName';
import type { AuthContextValue, AuthState, AuthActions } from './authContextTypes';
import { useStableActions } from '../lib/createStableActions';
import { emptyNormalizedDomains } from '../hooks/auth/types';

export type { AuthContextValue, AuthState, AuthActions } from './authContextTypes';

export type { PrivateMessage } from '../lib/pm';
export type {
  GuildData,
  SiteNewsItem,
  UserRole,
  User,
  GuideArticle,
  GuideComment,
  GuideVersion,
  UserProgress,
  RegisteredUser,
  RegisteredGuild,
  PmSettings,
  RoleConfig,
  ChatMessage,
  ChatState,
  SiteSettings,
  WikiArticle,
  SupportTicket,
} from '../types/site';
export { defaultGuild } from '../types/site';

const AuthStateContext = createContext<AuthState | null>(null);
const AuthActionsContext = createContext<AuthActions | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [dbSaveError, setDbSaveError] = useState<string | null>(null);
  const normalizedRef = useRef(emptyNormalizedDomains());

  const session = useAuthSession({ setDbSaveError });
  const {
    user,
    setUser,
    progress,
    setProgress,
    loginWithPassword,
    register,
    logout,
    updateProgress,
    toggleFavoriteWeapon,
    toggleFavoriteSect,
    toggleCompletedGuide,
    addNote,
    deleteNote,
    setSelectedBuild,
    toggleSelectedBuild,
    updateUserPicture,
    updateUserGameNickname,
    updateUserGuild,
  } = session;

  const accounts = useAuthAccounts(user);
  const guildsHook = useAuthGuilds(user, accounts.refreshAccounts);

  const siteCore = useAuthSiteCore({ user, setProgress, setDbSaveError });
  const { persist, saveSite } = useAuthPersist(setDbSaveError);

  const siteNewsHook = useAuthSiteNews({ user, persist, setDbSaveError, normalizedRef });
  const guidesHook = useAuthGuides({ user, persist, setDbSaveError, normalizedRef });
  const migrateOverridesRef = useRef<(sections: string[]) => void>(() => {});
  const banPreviousRolesRef = useRef(new Map<string, string>());

  const wikiHook = useAuthWiki({
    user,
    persist,
    setDbSaveError,
    normalizedRef,
  });
  const chatHook = useAuthChat({ user, persist, normalizedRef });
  const supportHook = useAuthSupport({
    user,
    persist,
    getRoleConfig: siteCore.getRoleConfig,
    normalizedRef,
  });

  const suggestionsHook = useAuthSuggestions({ user, persist });

  const { applySiteDataKey, detectNormalizedDomains } = useNormalizedDomains(normalizedRef, {
    setGuides: guidesHook.setGuides,
    setSiteSettings: siteCore.setSiteSettings,
    setChatState: chatHook.setChatState,
    setWikiArticles: wikiHook.setWikiArticles,
    setWikiLoaded: wikiHook.setWikiLoaded,
    setSupportTickets: supportHook.setSupportTickets,
    setSupportLoaded: supportHook.setSupportLoaded,
    setSiteNews: siteNewsHook.setSiteNews,
    setGuideComments: guidesHook.setGuideComments,
    setGuideVersions: guidesHook.setGuideVersions,
    setGuideMetaLoaded: guidesHook.setGuideMetaLoaded,
    setGuild: siteCore.setGuild,
    setDiscordUrl: siteCore.setDiscordUrl,
    mergeSiteSettings: siteCore.mergeSiteSettings,
  });

  useEffect(() => {
    if (!siteCore.isLoading) void siteNewsHook.loadSiteNews();
  }, [siteCore.isLoading, siteNewsHook.loadSiteNews]);

  useEffect(() => {
    if (!siteCore.isLoading) void guildsHook.ensureGuildsLoaded();
  }, [siteCore.isLoading, guildsHook.ensureGuildsLoaded]);

  useEffect(() => {
    if (!siteCore.isLoading) void wikiHook.ensureWikiLoaded();
  }, [siteCore.isLoading, wikiHook.ensureWikiLoaded]);

  const pm = useAuthPm({
    user,
    registeredUsers: accounts.registeredUsers,
    siteRoles: siteCore.siteSettings.roles,
    isLoading: siteCore.isLoading,
    setDbSaveError,
  });

  useAuthRealtime({
    isLoading: siteCore.isLoading,
    userId: user?.id,
    applySiteDataKey,
    detectNormalizedDomains,
    refreshAccounts: accounts.refreshAccounts,
    schedulePmRefresh: pm.schedulePmRefresh,
    setGuides: g => guidesHook.setGuides(g),
    setWikiArticles: w => wikiHook.setWikiArticles(w),
    setChatState: chatHook.setChatState,
    setGuideComments: guidesHook.setGuideComments,
    setSiteNews: n => siteNewsHook.setSiteNews(n),
    setSupportTickets: supportHook.setSupportTickets,
    setGuideVersions: v => guidesHook.setGuideVersions(v),
    setProgress,
  });

  useEffect(() => {
    if (!user) return;
    accounts.pingLastSeen();
    const iv = setInterval(accounts.pingLastSeen, 120_000);
    const onVis = () => { if (document.visibilityState === 'visible') accounts.pingLastSeen(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { clearInterval(iv); document.removeEventListener('visibilitychange', onVis); };
  }, [user?.id, accounts.pingLastSeen]);

  const safeSiteSettings = useMemo(
    () => mergeSiteSettingsSafe(siteCore.siteSettings),
    [siteCore.siteSettings],
  );

  useEffect(() => {
    const id = progress.selectedBuild;
    if (!id) return;
    if (!wikiHook.wikiLoaded) return;
    if (isKnownBuild(id, wikiHook.wikiArticles)) return;
    setSelectedBuild(null);
  }, [
    progress.selectedBuild,
    wikiHook.wikiArticles,
    wikiHook.wikiLoaded,
    setSelectedBuild,
  ]);

  const deleteWikiArticle = useCallback((id: string) => {
    wikiHook.deleteWikiArticle(id);
    if (progress.selectedBuild === id) setSelectedBuild(null);
  }, [wikiHook.deleteWikiArticle, progress.selectedBuild, setSelectedBuild]);

  const safeChatState = useMemo(
    () => normalizeChatState(chatHook.chatState),
    [chatHook.chatState],
  );

  const isAdmin = useCallback(() => user?.role === 'admin', [user?.role]);
  const isEditor = useCallback(
    () => user?.role === 'admin' || user?.role === 'editor',
    [user?.role],
  );
  const canAccessAdminPanel = useCallback(() => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const rc = siteCore.getRoleConfig(user.role);
    return rc?.permissions?.includes('admin.panel') ?? false;
  }, [user, siteCore.getRoleConfig]);

  const canAccessStaffChat = useCallback(
    () => userCanAccessStaffChat(user, safeSiteSettings.roles),
    [user, safeSiteSettings.roles],
  );

  const canUseMessenger = useCallback(
    () => userCanUseMessenger(user, safeSiteSettings.roles),
    [user, safeSiteSettings.roles],
  );

  const registerGuildEntry = useCallback(async (
    input: import('../types/site').RegisteredGuildInput,
    registrarId?: string,
  ) => {
    const result = await guildsHook.registerGuild(input, registrarId ?? user?.id);
    if (typeof result === 'string') return result;
    if (user?.id === result.leaderId) updateUserGuild(result.id);
    return result;
  }, [guildsHook.registerGuild, user?.id, updateUserGuild]);

  const patchSiteSettings = (
    patch: Partial<typeof safeSiteSettings> | ((prev: typeof safeSiteSettings) => Partial<typeof safeSiteSettings>),
  ) => {
    saveSite('site_settings', prev => {
      const base = mergeSiteSettingsSafe(prev as typeof safeSiteSettings);
      const nextPatch = typeof patch === 'function' ? patch(base) : patch;
      return mergeSiteSettingsSafe({ ...base, ...nextPatch });
    }, siteCore.setSiteSettings);
  };

  migrateOverridesRef.current = (sections: string[]) => {
    if (!sections.length) return;
    patchSiteSettings(prev => {
      const next = { ...(prev.sectionOverrides || {}) };
      for (const s of sections) delete next[s];
      return { sectionOverrides: next };
    });
  };

  const purgeEmbeddedImagesFromDb = async () => {
      if (!user || user.role !== 'admin') return 'Только для администратора';
    const cleanGuides = sanitizeGuides(guidesHook.guides);
    const cleanWiki = sanitizeWiki(wikiHook.wikiArticles);
    const cleanNews = sanitizeSiteNews(siteNewsHook.siteNews);
    const cleanVersions = sanitizeGuideVersions(guidesHook.guideVersions);
    const cleanGuild = sanitizeGuildAvatar(siteCore.guild);
    guidesHook.setGuides(cleanGuides);
    wikiHook.setWikiArticles(cleanWiki);
    siteNewsHook.setSiteNews(cleanNews);
    guidesHook.setGuideVersions(cleanVersions);
    siteCore.setGuild(cleanGuild);
    const [guidesNorm, wikiNorm, newsNorm, versionsNorm] = await Promise.all([
      contentStoreUsesNormalized('guides'),
      contentStoreUsesNormalized('wiki'),
      contentStoreUsesNormalized('news'),
      contentStoreUsesNormalized('versions'),
    ]);
      const results = await Promise.all([
        guidesNorm
          ? Promise.all(cleanGuides.map(g => contentStoreUpdateGuide(g.id, g))).then(ok => ok.every(Boolean) ? null : 'Ошибка очистки гайдов')
          : persist('guides', cleanGuides),
      wikiHook.wikiLoaded
          ? (wikiNorm
            ? Promise.all(cleanWiki.map(w => contentStoreUpdateWiki(w.id, w))).then(ok => ok.every(Boolean) ? null : 'Ошибка очистки вики')
            : persist('wiki', cleanWiki))
          : Promise.resolve(null),
      newsNorm
        ? Promise.all(cleanNews.map(n => contentStoreUpdateSiteNews(n.id, n))).then(ok => ok.every(Boolean) ? null : 'Ошибка очистки новостей')
        : persist('site_news', cleanNews),
      guidesHook.guideMetaLoaded
        ? (versionsNorm
          ? contentStoreSyncGuideVersions(cleanVersions).then(r => r.error)
          : persist('guide_versions', cleanVersions))
        : Promise.resolve(null),
        persist('guild', cleanGuild),
      ]);
    return results.find(r => r) || null;
  };

  const clearDbSaveError = useCallback(() => setDbSaveError(null), []);

  const authState = useMemo<AuthState>(() => ({
    user,
    progress,
    guides: guidesHook.guides,
    guideComments: guidesHook.guideComments,
    guideVersions: guidesHook.guideVersions,
    registeredUsers: accounts.registeredUsers,
    siteSettings: safeSiteSettings,
    isLoading: siteCore.isLoading,
    wikiArticles: wikiHook.wikiArticles,
    supportTickets: supportHook.supportTickets,
    suggestions: suggestionsHook.suggestions,
    suggestionsLoaded: suggestionsHook.suggestionsLoaded,
    chatState: safeChatState,
    privateMessages: pm.privateMessages,
    unreadPMCount: pm.unreadPMCount,
    dbSaveError,
    guild: siteCore.guild,
    registeredGuilds: guildsHook.registeredGuilds,
    guildsLoaded: guildsHook.guildsLoaded,
    discordUrl: siteCore.discordUrl,
    siteNews: siteNewsHook.siteNews,
    pmLoaded: pm.pmLoaded,
    guidesLoaded: guidesHook.guidesLoaded,
    chatLoaded: chatHook.chatLoaded,
    accountsLoaded: accounts.accountsLoaded,
    wikiLoaded: wikiHook.wikiLoaded,
    supportLoaded: supportHook.supportLoaded,
    guideMetaLoaded: guidesHook.guideMetaLoaded,
    guidesHasMore: guidesHook.guidesHasMore,
    guidesTotal: guidesHook.guidesTotal,
    guidesLoading: guidesHook.guidesLoading,
    chatHasMore: chatHook.chatHasMore,
    chatLoadingMore: chatHook.chatLoadingMore,
    chatSearchQuery: chatHook.chatSearchQuery,
    chatSearchResults: chatHook.chatSearchResults,
  }), [
    user,
    progress,
    guidesHook.guides,
    guidesHook.guideComments,
    guidesHook.guideVersions,
    accounts.registeredUsers,
    safeSiteSettings,
    siteCore.isLoading,
    wikiHook.wikiArticles,
    supportHook.supportTickets,
    suggestionsHook.suggestions,
    suggestionsHook.suggestionsLoaded,
    safeChatState,
    pm.privateMessages,
    pm.unreadPMCount,
    dbSaveError,
    siteCore.guild,
    guildsHook.registeredGuilds,
    guildsHook.guildsLoaded,
    siteCore.discordUrl,
    siteNewsHook.siteNews,
    pm.pmLoaded,
    guidesHook.guidesLoaded,
    chatHook.chatLoaded,
    accounts.accountsLoaded,
    wikiHook.wikiLoaded,
    supportHook.supportLoaded,
    guidesHook.guideMetaLoaded,
    guidesHook.guidesHasMore,
    guidesHook.guidesTotal,
    guidesHook.guidesLoading,
    chatHook.chatHasMore,
    chatHook.chatLoadingMore,
    chatHook.chatSearchQuery,
    chatHook.chatSearchResults,
  ]);

  const authActions = useStableActions<AuthActions>(() => ({
    refreshAccounts: accounts.refreshAccounts,
    ensureSuggestionsLoaded: suggestionsHook.ensureSuggestionsLoaded,
    createSuggestion: suggestionsHook.createSuggestion,
    replyToSuggestion: suggestionsHook.replyToSuggestion,
    closeSuggestion: suggestionsHook.closeSuggestion,
    deleteSuggestion: suggestionsHook.deleteSuggestion,
    clearDbSaveError,
    ensureGuildsLoaded: guildsHook.ensureGuildsLoaded,
    refreshGuilds: guildsHook.refreshGuilds,
    registerGuild: registerGuildEntry,
    updateRegisteredGuild: guildsHook.updateRegisteredGuild,
    deleteRegisteredGuild: guildsHook.deleteRegisteredGuild,
    getGuildName: guildsHook.getGuildName,
    getGuildById: guildsHook.getGuildById,
    updateGuild: g => { siteCore.setGuild(g); void persist('guild', g); },
    updateDiscordUrl: url => { siteCore.setDiscordUrl(url); void persist('discord_url', url); },
    addSiteNews: siteNewsHook.addSiteNews,
    updateSiteNews: siteNewsHook.updateSiteNews,
    deleteSiteNews: siteNewsHook.deleteSiteNews,
    loginWithPassword,
    register,
    logout,
    updateProgress,
    toggleFavoriteWeapon,
    toggleFavoriteSect,
    toggleCompletedGuide,
    addNote,
    deleteNote,
    setSelectedBuild,
    toggleSelectedBuild,
    updateUserPicture,
    updateUserGameNickname,
    updateUserGuild,
    addGuide: guidesHook.addGuide,
    updateGuide: guidesHook.updateGuide,
    deleteGuide: guidesHook.deleteGuide,
    isAdmin,
    canAccessAdminPanel,
    canAccessStaffChat,
    canUseMessenger,
    isEditor,
    adminSetUserRole: (id, r) => { void dbUpdateAccount(id, { role: r }); void accounts.refreshAccounts(); },
    adminSetMessengerAccessId: (id, accessId) => {
      void dbUpdateAccount(id, { messenger_access_id: accessId });
      accounts.setRegisteredUsers(prev =>
        prev.map(u => u.id === id ? { ...u, messengerAccessId: accessId || undefined } : u),
      );
      if (user?.id === id) {
        setUser(prev => {
          if (!prev) return prev;
          const next = { ...prev, messengerAccessId: accessId || undefined };
          localStorage.setItem('wwm_user', JSON.stringify(next));
          return next;
        });
      }
    },
    adminBanUser: (id, banned) => {
      if (banned) {
        const u = accounts.registeredUsers.find(x => x.id === id);
        if (u && u.role !== 'banned') banPreviousRolesRef.current.set(id, u.role);
        void dbUpdateAccount(id, { role: 'banned' });
        accounts.setRegisteredUsers(prev =>
          prev.map(u => u.id === id ? { ...u, isBanned: true, role: 'banned' } : u),
        );
      } else {
        const restore = banPreviousRolesRef.current.get(id) || 'user';
        banPreviousRolesRef.current.delete(id);
        void dbUpdateAccount(id, { role: restore });
        accounts.setRegisteredUsers(prev =>
          prev.map(u => u.id === id ? { ...u, isBanned: false, role: restore } : u),
        );
      }
    },
    adminDeleteUser: id => { void dbDeleteAccount(id); void accounts.refreshAccounts(); },
    isUserOnline: id => {
      const u = accounts.registeredUsers.find(x => x.id === id);
      return isOnlineByLastSeen(u?.lastSeenAt);
    },
    getUserDisplayName: (id, fallback = '') => {
      const u = accounts.registeredUsers.find(x => x.id === id);
      return u ? getDisplayName(u) : fallback;
    },
    hasMessengerBadge: userId => {
      if (user?.id === userId && user.messengerAccessId?.trim()) return true;
      const u = accounts.registeredUsers.find(x => x.id === userId);
      return !!u?.messengerAccessId?.trim();
    },
    getRoleConfig: siteCore.getRoleConfig,
    hasPermission: p => {
      const rc = siteCore.getRoleConfig(user?.role || 'user');
      return rc?.permissions?.includes(p) ?? false;
    },
    updatePmSettings: s => patchSiteSettings({ pmSettings: { ...safeSiteSettings.pmSettings, ...s } }),
    purgeEmbeddedImagesFromDb,
    updateSiteSettings: u => patchSiteSettings(u),
    addAnnouncement: (text, type) => patchSiteSettings({
      announcements: [{ id: 'a' + Date.now(), text, type, active: true }, ...safeSiteSettings.announcements],
    }),
    removeAnnouncement: id => patchSiteSettings({
      announcements: safeSiteSettings.announcements.filter(x => x.id !== id),
    }),
    updateRoleDisplayName: (id, n) => patchSiteSettings({
      roles: safeSiteSettings.roles.map(r => r.id === id ? { ...r, displayName: n } : r),
    }),
    updateRoleColor: (id, c) => patchSiteSettings({
      roles: safeSiteSettings.roles.map(r => r.id === id ? { ...r, color: c } : r),
    }),
    addRole: (n, c, p) => patchSiteSettings({
      roles: [...safeSiteSettings.roles, { id: 'r' + Date.now(), displayName: n, color: c, permissions: p }],
    }),
    deleteRole: id => patchSiteSettings({
      roles: safeSiteSettings.roles.filter(r => r.id !== id),
    }),
    updateRolePermissions: (id, p) => patchSiteSettings({
      roles: safeSiteSettings.roles.map(r => r.id === id ? { ...r, permissions: p } : r),
    }),
    addWikiArticle: wikiHook.addWikiArticle,
    updateWikiArticle: wikiHook.updateWikiArticle,
    deleteWikiArticle,
    createTicket: supportHook.createTicket,
    replyToTicket: supportHook.replyToTicket,
    closeTicket: supportHook.closeTicket,
    deleteTicket: supportHook.deleteTicket,
    sendMessage: chatHook.sendMessage,
    deleteMessage: chatHook.deleteMessage,
    muteUser: chatHook.muteUser,
    unmuteUser: chatHook.unmuteUser,
    isUserMuted: chatHook.isUserMuted,
    chatBanUser: uid => { void chatHook.muteUser(uid, 60 * 24 * 7); },
    sendPrivateMessage: pm.sendPrivateMessage,
    sendStaffPrivateMessage: pm.sendStaffPrivateMessage,
    markPMRead: pm.markPMRead,
    deletePrivateMessageForMe: pm.deletePrivateMessageForMe,
    deletePrivateMessageForAll: pm.deletePrivateMessageForAll,
    deletePmDialogForMe: pm.deletePmDialogForMe,
    deletePmDialogForAll: pm.deletePmDialogForAll,
    addGuideComment: guidesHook.addGuideComment,
    deleteGuideComment: guidesHook.deleteGuideComment,
    toggleGuideCommentLike: commentId => {
      if (!user) return Promise.resolve('Войдите в аккаунт');
      return guidesHook.toggleGuideCommentLike(commentId, user.id);
    },
    toggleSiteNewsLike: newsId => {
      if (!user) return Promise.resolve('Войдите в аккаунт');
      return siteNewsHook.toggleSiteNewsLike(newsId, user.id);
    },
    getGuideVersions: guidesHook.getGuideVersions,
    restoreGuideVersion: guidesHook.restoreGuideVersion,
    loadPmThread: pm.loadPmThread,
    ensureGuidesLoaded: guidesHook.ensureGuidesLoaded,
    ensureChatLoaded: chatHook.ensureChatLoaded,
    ensureAccountsLoaded: accounts.ensureAccountsLoaded,
    ensureWikiLoaded: wikiHook.ensureWikiLoaded,
    ensureSupportLoaded: supportHook.ensureSupportLoaded,
    ensureGuideMetaLoaded: guidesHook.ensureGuideMetaLoaded,
    loadMoreGuides: guidesHook.loadMoreGuides,
    searchGuidesList: guidesHook.searchGuidesList,
    searchGuidesRemote: guidesHook.searchGuidesRemote,
    loadOlderChatMessages: chatHook.loadOlderChatMessages,
    searchChatMessages: chatHook.searchChatMessages,
    clearChatSearch: chatHook.clearChatSearch,
  }));

  return (
    <AuthStateContext.Provider value={authState}>
      <AuthActionsContext.Provider value={authActions}>
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  );
}

export function useAuthState(): AuthState {
  const state = useContext(AuthStateContext);
  if (!state) throw new Error('useAuthState');
  return state;
}

export function useAuthActions(): AuthActions {
  const actions = useContext(AuthActionsContext);
  if (!actions) throw new Error('useAuthActions');
  return actions;
}

export function useAuth(): AuthContextValue {
  return { ...useAuthState(), ...useAuthActions() };
}

import { createContext, useContext, useEffect, useMemo, useCallback, useRef, useState, type ReactNode } from 'react';
import { mergeSiteSettingsSafe, normalizeChatState } from '../lib/normalizeState';
import { canAccessStaffChat as userCanAccessStaffChat } from '../lib/staffChat';
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
import type { AuthContextValue } from './authContextTypes';
import { emptyNormalizedDomains } from '../hooks/auth/types';

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

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [dbSaveError, setDbSaveError] = useState<string | null>(null);
  const normalizedRef = useRef(emptyNormalizedDomains());

  const session = useAuthSession({ setDbSaveError });
  const {
    user,
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
  const wikiHook = useAuthWiki({ user, persist, setDbSaveError, normalizedRef });
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

  const safeChatState = useMemo(
    () => normalizeChatState(chatHook.chatState),
    [chatHook.chatState],
  );

  const isAdmin = () => user?.role === 'admin';
  const isEditor = () => user?.role === 'admin' || user?.role === 'editor';
  const canAccessAdminPanel = () => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    const rc = siteCore.getRoleConfig(user.role);
    return rc?.permissions?.includes('admin.panel') ?? false;
  };

  const canAccessStaffChat = () => userCanAccessStaffChat(user, safeSiteSettings.roles);

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

  const value: AuthContextValue = {
    user,
    progress,
    guides: guidesHook.guides,
    guideComments: guidesHook.guideComments,
    guideVersions: guidesHook.guideVersions,
    registeredUsers: accounts.registeredUsers,
    refreshAccounts: accounts.refreshAccounts,
    siteSettings: safeSiteSettings,
    isLoading: siteCore.isLoading,
    wikiArticles: wikiHook.wikiArticles,
    supportTickets: supportHook.supportTickets,
    suggestions: suggestionsHook.suggestions,
    suggestionsLoaded: suggestionsHook.suggestionsLoaded,
    ensureSuggestionsLoaded: suggestionsHook.ensureSuggestionsLoaded,
    createSuggestion: suggestionsHook.createSuggestion,
    replyToSuggestion: suggestionsHook.replyToSuggestion,
    closeSuggestion: suggestionsHook.closeSuggestion,
    deleteSuggestion: suggestionsHook.deleteSuggestion,
    chatState: safeChatState,
    privateMessages: pm.privateMessages,
    pmLoaded: pm.pmLoaded,
    loadPmThread: pm.loadPmThread,
    guidesLoaded: guidesHook.guidesLoaded,
    chatLoaded: chatHook.chatLoaded,
    accountsLoaded: accounts.accountsLoaded,
    ensureGuidesLoaded: guidesHook.ensureGuidesLoaded,
    ensureChatLoaded: chatHook.ensureChatLoaded,
    ensureAccountsLoaded: accounts.ensureAccountsLoaded,
    wikiLoaded: wikiHook.wikiLoaded,
    supportLoaded: supportHook.supportLoaded,
    guideMetaLoaded: guidesHook.guideMetaLoaded,
    ensureWikiLoaded: wikiHook.ensureWikiLoaded,
    ensureSupportLoaded: supportHook.ensureSupportLoaded,
    ensureGuideMetaLoaded: guidesHook.ensureGuideMetaLoaded,
    guild: siteCore.guild,
    registeredGuilds: guildsHook.registeredGuilds,
    guildsLoaded: guildsHook.guildsLoaded,
    ensureGuildsLoaded: guildsHook.ensureGuildsLoaded,
    refreshGuilds: guildsHook.refreshGuilds,
    registerGuild: registerGuildEntry,
    updateRegisteredGuild: guildsHook.updateRegisteredGuild,
    deleteRegisteredGuild: guildsHook.deleteRegisteredGuild,
    getGuildName: guildsHook.getGuildName,
    getGuildById: guildsHook.getGuildById,
    discordUrl: siteCore.discordUrl,
    siteNews: siteNewsHook.siteNews,
    dbSaveError,
    clearDbSaveError: () => setDbSaveError(null),
    updateGuild: g => { siteCore.setGuild(g); void persist('guild', g); },
    updateDiscordUrl: url => { siteCore.setDiscordUrl(url); void persist('discord_url', url); },
    addSiteNews: siteNewsHook.addSiteNews,
    updateSiteNews: siteNewsHook.updateSiteNews,
    deleteSiteNews: siteNewsHook.deleteSiteNews,
    unreadPMCount: pm.unreadPMCount,
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
    updateUserPicture,
    updateUserGameNickname,
    updateUserGuild,
    addGuide: guidesHook.addGuide,
    updateGuide: guidesHook.updateGuide,
    deleteGuide: guidesHook.deleteGuide,
    isAdmin,
    canAccessAdminPanel,
    canAccessStaffChat,
    isEditor,
    adminSetUserRole: (id, r) => dbUpdateAccount(id, { role: r }),
    adminBanUser: () => {},
    adminDeleteUser: id => dbDeleteAccount(id),
    isUserOnline: id => {
      const u = accounts.registeredUsers.find(x => x.id === id);
      return isOnlineByLastSeen(u?.lastSeenAt);
    },
    getUserDisplayName: (id, fallback = '') => {
      const u = accounts.registeredUsers.find(x => x.id === id);
      return u ? getDisplayName(u) : fallback;
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
    deleteWikiArticle: wikiHook.deleteWikiArticle,
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
    guidesHasMore: guidesHook.guidesHasMore,
    guidesTotal: guidesHook.guidesTotal,
    guidesLoading: guidesHook.guidesLoading,
    loadMoreGuides: guidesHook.loadMoreGuides,
    searchGuidesList: guidesHook.searchGuidesList,
    searchGuidesRemote: guidesHook.searchGuidesRemote,
    chatHasMore: chatHook.chatHasMore,
    chatLoadingMore: chatHook.chatLoadingMore,
    loadOlderChatMessages: chatHook.loadOlderChatMessages,
    searchChatMessages: chatHook.searchChatMessages,
    clearChatSearch: chatHook.clearChatSearch,
    chatSearchQuery: chatHook.chatSearchQuery,
    chatSearchResults: chatHook.chatSearchResults,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error('useAuth');
  return c;
}

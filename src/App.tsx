import { useState, useEffect, useCallback, useMemo, Suspense } from 'react';
import { AuthProvider, useAuthState, useAuthActions } from './context/AuthContext';
import HeroSection from './components/HeroSection';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';
import FloatingChat from './components/FloatingChat';
import SupportWidget from './components/SupportWidget';
import MaintenancePage from './components/MaintenancePage';
import PageShell from './components/layout/PageShell';
import AnnouncementsFloating from './components/AnnouncementsFloating';
import AnnouncementTicker from './components/AnnouncementTicker';
import DonationBlock from './components/DonationBlock';
import SiteThemeSync from './components/SiteThemeSync';
import { isHomeBlockVisible, mergeHomeBlocks } from './lib/siteConstructor';
import { ArrowUp, Crown } from 'lucide-react';
import { usePmBrowserNotifications } from './hooks/usePmBrowserNotifications';
import { useScrollThreshold } from './hooks/useScrollThreshold';
import { useOverlayDismiss } from './hooks/useOverlayDismiss';
import { usePageSeo } from './hooks/usePageSeo';
import { useClickSound } from './hooks/useClickSound';
import { clearChunkReloadFlag } from './lib/chunkError';
import { isKnownPath, pageFromPath, pathFromPage, registerCustomSectionRoutes } from './lib/appRoutes';
import { isContentSectionResolved, sanitizeSectionDefinitions } from './lib/sectionRegistry';
import { lazyWithRetry } from './lib/lazyWithRetry';
import type { NavigatePayload } from './components/Header';
import { WikiNavigationProvider } from './context/WikiNavigationContext';

const GuidesPage = lazyWithRetry(() => import('./components/GuidesPage'));
const AdminPage = lazyWithRetry(() => import('./components/AdminPage'));
const UsersListPage = lazyWithRetry(() => import('./components/UsersListPage'));
const ContentPage = lazyWithRetry(() => import('./components/ContentPage'));
const WwmWikiPage = lazyWithRetry(() => import('./components/WwmWikiPage'));
const FAQSection = lazyWithRetry(() => import('./components/FAQSection'));
const PrivateMessages = lazyWithRetry(() => import('./components/PrivateMessages'));
const StaffChatPage = lazyWithRetry(() => import('./components/StaffChatPage'));
const SuggestionsPage = lazyWithRetry(() => import('./components/SuggestionsPage'));
const GuildsPage = lazyWithRetry(() => import('./components/GuildsPage'));
const NewsBlocks = lazyWithRetry(() => import('./components/NewsBlocks'));

function PageLoader() {
  return <div className="min-h-[40vh] flex items-center justify-center text-ink-400 text-sm">Загрузка…</div>;
}

function DbErrorBanner() {
  const { dbSaveError } = useAuthState();
  const { clearDbSaveError } = useAuthActions();
  if (!dbSaveError) return null;
  return (
    <div className="fixed top-20 left-2 right-2 sm:left-auto sm:right-4 sm:max-w-md z-[110] px-4 py-3 rounded-xl bg-crimson-400/15 border border-crimson-400/40 text-crimson-200 text-sm shadow-lg flex gap-2">
      <span className="flex-1">{dbSaveError}</span>
      <button type="button" onClick={clearDbSaveError} className="text-crimson-300 hover:text-white shrink-0 cursor-pointer">✕</button>
    </div>
  );
}

function AppContent() {
  const { user, siteSettings, isLoading } = useAuthState();
  const { canAccessAdminPanel, canAccessStaffChat } = useAuthActions();
  useClickSound();

  useEffect(() => {
    clearChunkReloadFlag();
  }, []);
  const showScrollTop = useScrollThreshold(600);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<{ top: number; right: number } | null>(null);
  const [currentPage, setCurrentPage] = useState<string>(
    () => pageFromPath(window.location.pathname) || 'main',
  );
  const [pendingGuideId, setPendingGuideId] = useState<string | null>(null);
  const [pendingWikiId, setPendingWikiId] = useState<string | null>(null);

  usePageSeo(currentPage);
  usePmBrowserNotifications();

  useEffect(() => {
    registerCustomSectionRoutes(sanitizeSectionDefinitions(siteSettings.sectionDefinitions));
  }, [siteSettings.sectionDefinitions]);

  const closeLoginProfileModals = useCallback(() => {
    setShowProfileModal(false);
    setShowLoginModal(false);
  }, []);

  useOverlayDismiss(closeLoginProfileModals, true, {
    dismissOnScroll: showLoginModal || showProfileModal,
  });

  useEffect(() => {
    document.documentElement.dataset.appPage = currentPage;
    return () => {
      delete document.documentElement.dataset.appPage;
    };
  }, [currentPage]);

  useEffect(() => {
    if (isLoading) return;

    const syncFromUrl = () => {
      const pathname = window.location.pathname;
      const fromUrl = pageFromPath(pathname);
      if (fromUrl) {
        setCurrentPage(fromUrl);
        return;
      }
      if (!isKnownPath(pathname)) {
        window.history.replaceState({ page: 'main' }, '', '/');
        setCurrentPage('main');
      }
    };

    syncFromUrl();

    const onPopState = (e: PopStateEvent) => {
      const fromState = e.state?.page as string | undefined;
      const page = fromState || pageFromPath(window.location.pathname) || 'main';
      setCurrentPage(page);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [isLoading, siteSettings.sectionDefinitions]);

  const handleNavigate = useCallback((section: string, payload?: NavigatePayload) => {
    if (payload?.guideId) setPendingGuideId(payload.guideId);
    if (payload?.wikiId) setPendingWikiId(payload.wikiId);
    const page = section === 'home' ? 'main' : section;
    window.history.pushState({ page }, '', pathFromPage(page));
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: page === 'main' ? 'smooth' : 'auto' });
  }, []);

  const goBack = () => window.history.back();
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const sectionState = siteSettings.sections?.find(s => s.id === currentPage);
  const isSectionMaintenance = !!sectionState?.maintenance;

  const headerProps = useMemo(() => ({
    activeSection: currentPage === 'main' ? 'home' : currentPage,
    onNavigate: handleNavigate,
    onLoginClick: () => setShowLoginModal(true),
    onProfileClick: (anchor?: { top: number; right: number }) => {
      setProfileAnchor(anchor || null);
      setShowProfileModal(true);
    },
    showStaffChatLink: canAccessStaffChat(),
  }), [currentPage, handleNavigate, user?.role, siteSettings.roles, canAccessStaffChat]);

  const modals = (
    <>
      <DbErrorBanner />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        anchor={profileAnchor}
        onNavigate={handleNavigate}
      />
      <FloatingChat onLoginClick={() => setShowLoginModal(true)} />
      <SupportWidget onLoginClick={() => setShowLoginModal(true)} />
      <Suspense fallback={null}>
        <PrivateMessages onLoginClick={() => setShowLoginModal(true)} />
      </Suspense>
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="hover-glow-btn fixed bottom-20 right-6 z-40 bg-ink-900/90 border border-gold-400/40 text-gold-400 p-3 rounded-full shadow-lg hover:bg-gold-400/20 animate-fadeIn cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );

  const renderPage = () => {
    if (isLoading) {
      return (
        <PageShell
          headerProps={{
            activeSection: 'home',
            onNavigate: handleNavigate,
            onLoginClick: () => setShowLoginModal(true),
            onProfileClick: (anchor?: { top: number; right: number }) => {
              setProfileAnchor(anchor || null);
              setShowProfileModal(true);
            },
            showStaffChatLink: false,
          }}
          modals={null}
        >
          <PageLoader />
        </PageShell>
      );
    }

    if (siteSettings.maintenanceMode && !canAccessAdminPanel()) {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <MaintenancePage title={siteSettings.siteName || 'Сайт'} message="Сайт находится на техническом обслуживании." onBack={goBack} />
        </PageShell>
      );
    }

    if (currentPage !== 'main' && currentPage !== 'admin' && currentPage !== 'staffchat' && isSectionMaintenance && !canAccessAdminPanel()) {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <MaintenancePage
            title={sectionState?.title || 'Раздел'}
            message={sectionState?.message || 'Раздел находится на технических работах.'}
            onBack={goBack}
          />
        </PageShell>
      );
    }

    if (currentPage === 'guides') {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <GuidesPage
              onBack={goBack}
              onLoginClick={() => setShowLoginModal(true)}
              initialGuideId={pendingGuideId}
              onGuideOpened={() => setPendingGuideId(null)}
            />
          </Suspense>
        </PageShell>
      );
    }

    if (currentPage === 'admin') {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <AdminPage onBack={goBack} />
          </Suspense>
        </PageShell>
      );
    }

    if (currentPage === 'staffchat') {
      return (
        <PageShell headerProps={headerProps} modals={modals} animated={false}>
          <Suspense fallback={<PageLoader />}>
            <StaffChatPage onBack={goBack} onLoginClick={() => setShowLoginModal(true)} />
          </Suspense>
        </PageShell>
      );
    }

    if (currentPage === 'suggestions') {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <SuggestionsPage onBack={goBack} onLoginClick={() => setShowLoginModal(true)} />
          </Suspense>
        </PageShell>
      );
    }

    if (currentPage === 'guilds') {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <GuildsPage onBack={goBack} onLoginClick={() => setShowLoginModal(true)} />
          </Suspense>
        </PageShell>
      );
    }

    if (currentPage === 'faq') {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <div className="pt-16 md:pt-20"><FAQSection /></div>
          </Suspense>
        </PageShell>
      );
    }

    if (currentPage === 'users') {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <UsersListPage onBack={goBack} />
          </Suspense>
        </PageShell>
      );
    }

    if (currentPage === 'wwmwiki') {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <WwmWikiPage onNavigate={handleNavigate} />
          </Suspense>
        </PageShell>
      );
    }

    if (isContentSectionResolved(currentPage, siteSettings)) {
      return (
        <PageShell headerProps={headerProps} modals={modals}>
          <Suspense fallback={<PageLoader />}>
            <ContentPage
              pageId={currentPage}
              onBack={goBack}
              focusWikiId={pendingWikiId}
              onWikiFocused={() => setPendingWikiId(null)}
            />
          </Suspense>
        </PageShell>
      );
    }

    return <MainPage headerProps={headerProps} modals={modals} onNavigate={handleNavigate} />;
  };

  return (
    <WikiNavigationProvider
      onNavigate={handleNavigate}
      getCurrentSection={() => (currentPage === 'main' ? null : currentPage)}
    >
      {renderPage()}
    </WikiNavigationProvider>
  );
}

function MainPage({ headerProps, modals, onNavigate }: {
  headerProps: { activeSection: string; onNavigate: (s: string) => void; onLoginClick: () => void; onProfileClick: (anchor?: { top: number; right: number }) => void };
  modals: React.ReactNode;
  onNavigate: (s: string) => void;
}) {
  const { siteSettings } = useAuthState();
  const { canAccessAdminPanel } = useAuthActions();
  const activeAnnouncements = (siteSettings.announcements ?? []).filter(a => a.active);
  const homeBlocks = mergeHomeBlocks(siteSettings.homeBlocks);
  const showAnnBar = isHomeBlockVisible(siteSettings.homeBlocks, 'announcements') && activeAnnouncements.length > 0;

  return (
    <PageShell headerProps={headerProps} modals={modals} animated={false}>
      <main className="pt-16 md:pt-20">
        {homeBlocks.map(block => {
          if (!block.visible) return null;
          if (block.id === 'announcements' && showAnnBar) {
            return (
              <div key="announcements" className="announcement-bar" aria-label="Объявления">
                {activeAnnouncements.map(ann => {
                  const icon = ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️';
                  const colorClass = ann.type === 'warning' ? 'text-orange-300' : ann.type === 'success' ? 'text-jade-300' : 'text-blue-300';
                  return (
                    <div
                      key={ann.id}
                      className={`announcement-bar__item py-2 px-2 sm:px-4 rounded-full ${
                        ann.type === 'warning' ? 'border border-orange-400/40 bg-orange-500/5' :
                        ann.type === 'success' ? 'border border-jade-400/40 bg-jade-400/5' :
                        'border border-blue-400/40 bg-blue-500/5'
                      }`}
                    >
                      <AnnouncementTicker text={ann.text} icon={icon} className={`text-xs font-medium ${colorClass}`} />
                    </div>
                  );
                })}
              </div>
            );
          }
          if (block.id === 'hero') {
            return (
              <div key="hero" id="home">
                <HeroSection hasAnnouncements={showAnnBar} onNavigate={onNavigate} />
              </div>
            );
          }
          if (block.id === 'news') {
            return (
              <div key="news" className="cv-auto max-w-4xl mx-auto px-4 sm:px-6 -mt-8 md:-mt-4 mb-6">
                <Suspense fallback={<div className="h-48 rounded-2xl bg-ink-900/40 border border-gold-700/20 animate-pulse" />}>
                  <NewsBlocks />
                </Suspense>
              </div>
            );
          }
          if (block.id === 'donation') {
            return <DonationBlock key="donation" />;
          }
          return null;
        })}
        {canAccessAdminPanel() && (
          <div
            className="admin-float-cluster fixed left-4 z-[55] flex flex-col gap-2"
            style={{
              top: showAnnBar
                ? `calc(5rem + ${activeAnnouncements.length * 44}px + 12px)`
                : '5.25rem',
            }}
          >
            <button
              type="button"
              onClick={() => onNavigate('admin')}
              className="admin-btn hover-glow-btn hover-glow-purple flex items-center px-3 py-2.5 rounded-full bg-ink-900/85 backdrop-blur-md border border-purple-500/35 shadow-lg hover:bg-purple-500/10 hover:border-purple-500/55 transition-all cursor-pointer group w-fit"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Crown className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="admin-btn-text text-purple-400 text-xs font-medium max-w-[200px] opacity-100 ml-2">Панель управления</span>
            </button>
            <AnnouncementsFloating />
          </div>
        )}
      </main>
    </PageShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SiteThemeSync />
      <AppContent />
    </AuthProvider>
  );
}

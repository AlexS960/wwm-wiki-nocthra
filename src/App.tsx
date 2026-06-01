import { useState, useEffect, useCallback, useMemo, lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import HeroSection from './components/HeroSection';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';
import FloatingChat from './components/FloatingChat';
import SupportWidget from './components/SupportWidget';
import MaintenancePage from './components/MaintenancePage';
import PageShell from './components/layout/PageShell';
import AnnouncementsFloating from './components/AnnouncementsFloating';
import { ArrowUp, Crown } from 'lucide-react';
import { usePmBrowserNotifications } from './hooks/usePmBrowserNotifications';
import { useScrollThreshold } from './hooks/useScrollThreshold';
import { useOverlayDismiss } from './hooks/useOverlayDismiss';
import { isContentSection } from './data/sections';
import type { NavigatePayload } from './components/Header';

const GuidesPage = lazy(() => import('./components/GuidesPage'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const UsersListPage = lazy(() => import('./components/UsersListPage'));
const ContentPage = lazy(() => import('./components/ContentPage'));
const WwmWikiPage = lazy(() => import('./components/WwmWikiPage'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const PrivateMessages = lazy(() => import('./components/PrivateMessages'));
const StaffChatPage = lazy(() => import('./components/StaffChatPage'));

function PageLoader() {
  return <div className="min-h-[40vh] flex items-center justify-center text-ink-400 text-sm">Загрузка…</div>;
}

function DbErrorBanner() {
  const { dbSaveError, clearDbSaveError } = useAuth();
  if (!dbSaveError) return null;
  return (
    <div className="fixed top-20 left-2 right-2 sm:left-auto sm:right-4 sm:max-w-md z-[110] px-4 py-3 rounded-xl bg-crimson-400/15 border border-crimson-400/40 text-crimson-200 text-sm shadow-lg flex gap-2">
      <span className="flex-1">{dbSaveError}</span>
      <button type="button" onClick={clearDbSaveError} className="text-crimson-300 hover:text-white shrink-0 cursor-pointer">✕</button>
    </div>
  );
}

function AppContent() {
  const { user, siteSettings, canAccessAdminPanel, canAccessStaffChat, isLoading } = useAuth();
  const showScrollTop = useScrollThreshold(600);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<{ top: number; right: number } | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('main');
  const [pendingGuideId, setPendingGuideId] = useState<string | null>(null);

  usePmBrowserNotifications();

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
    window.history.replaceState({ page: 'main' }, '');
    const onPopState = (e: PopStateEvent) => {
      const page = (e.state?.page as string) || 'main';
      setCurrentPage(page);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handleNavigate = useCallback((section: string, payload?: NavigatePayload) => {
    if (payload?.guideId) setPendingGuideId(payload.guideId);
    if (section === 'home') {
      window.history.pushState({ page: 'main' }, '');
      setCurrentPage('main');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState({ page: section }, '');
    setCurrentPage(section);
    window.scrollTo({ top: 0 });
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

  const modals = (
    <>
      <DbErrorBanner />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        anchor={profileAnchor}
        onOpenAdmin={canAccessAdminPanel() ? () => { setShowProfileModal(false); handleNavigate('admin'); } : undefined}
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

  if (isContentSection(currentPage)) {
    return (
      <PageShell headerProps={headerProps} modals={modals}>
        <Suspense fallback={<PageLoader />}>
          <ContentPage pageId={currentPage} onBack={goBack} />
        </Suspense>
      </PageShell>
    );
  }

  return <MainPage headerProps={headerProps} modals={modals} onNavigate={handleNavigate} />;
}

function MainPage({ headerProps, modals, onNavigate }: {
  headerProps: { activeSection: string; onNavigate: (s: string) => void; onLoginClick: () => void; onProfileClick: (anchor?: { top: number; right: number }) => void };
  modals: React.ReactNode;
  onNavigate: (s: string) => void;
}) {
  const { canAccessAdminPanel, siteSettings } = useAuth();
  const activeAnnouncements = (siteSettings.announcements ?? []).filter(a => a.active);

  return (
    <PageShell headerProps={headerProps} modals={modals} animated={false}>
      <main className="pt-16 md:pt-20">
        {activeAnnouncements.length > 0 && (
          <div className="announcement-bar" aria-label="Объявления">
            {activeAnnouncements.map(ann => (
              <div
                key={ann.id}
                className={`announcement-bar__item overflow-hidden py-2 px-4 rounded-full ${
                  ann.type === 'warning' ? 'border border-orange-400/40 bg-orange-500/5' :
                  ann.type === 'success' ? 'border border-jade-400/40 bg-jade-400/5' :
                  'border border-blue-400/40 bg-blue-500/5'
                }`}
              >
                <div className={`animate-marquee whitespace-nowrap text-xs font-medium ${
                  ann.type === 'warning' ? 'text-orange-300' :
                  ann.type === 'success' ? 'text-jade-300' : 'text-blue-300'
                }`}>
                  <span className="mx-6">{ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️'} {ann.text}</span>
                  <span className="mx-6">{ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️'} {ann.text}</span>
                  <span className="mx-6">{ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️'} {ann.text}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div id="home"><HeroSection hasAnnouncements={activeAnnouncements.length > 0} /></div>
        {canAccessAdminPanel() && (
          <div
            className="admin-float-cluster fixed left-4 z-[55] flex flex-col gap-2"
            style={{
              top: activeAnnouncements.length > 0
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
      <AppContent />
    </AuthProvider>
  );
}

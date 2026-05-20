// В начале файла App.tsx добавьте вспомогательный компонент:
function PageWrapper({ children }: { children: React.ReactNode }) {
  return <div key={currentPage} className="page-transition">{children}</div>;
}

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FAQSection from './components/FAQSection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import ProfileModal from './components/ProfileModal';
import GuidesPage from './components/GuidesPage';
import AdminPage from './components/AdminPage';
import UsersListPage from './components/UsersListPage';
import ContentPage from './components/ContentPage';
import FloatingChat from './components/FloatingChat';
import SupportWidget from './components/SupportWidget';
import MaintenancePage from './components/MaintenancePage';
import { ArrowUp, Crown } from 'lucide-react';

const contentPages = ['weapons', 'builds', 'sects', 'bosses', 'mystic', 'map', 'cooking', 'tips', 'lifeskills'];

function AppContent() {
  const { siteSettings, isAdmin } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('main');

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (section: string) => {
    if (section === 'home') {
      setCurrentPage('main');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // All other sections open as separate pages
    setCurrentPage(section);
    window.scrollTo({ top: 0 });
  };

  const goBack = () => { setCurrentPage('main'); window.scrollTo({ top: 0 }); };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const sectionState = siteSettings.sections?.find(s => s.id === currentPage);
  const isSectionMaintenance = !!sectionState?.maintenance;

  const headerProps = {
    activeSection: currentPage === 'main' ? 'home' : currentPage,
    onNavigate: handleNavigate,
    onLoginClick: () => setShowLoginModal(true),
    onProfileClick: () => setShowProfileModal(true),
  };

  const modals = (
    <>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <FloatingChat onLoginClick={() => setShowLoginModal(true)} />
      <SupportWidget onLoginClick={() => setShowLoginModal(true)} />
      {showScrollTop && (
        <button onClick={scrollToTop}
          className="fixed bottom-20 right-6 z-40 bg-gold-400/20 backdrop-blur-sm border border-gold-400/40 text-gold-400 p-3 rounded-full shadow-lg hover:bg-gold-400/30 transition-all animate-fadeIn cursor-pointer">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );

  // ---- Maintenance placeholder for sections ----
  // Admin always bypasses maintenance pages to keep working with sections.
  if (currentPage !== 'main' && currentPage !== 'admin' && isSectionMaintenance && !isAdmin()) {
    return (
      <div className="min-h-screen bg-ink-900 text-ink-100">
        <Header {...headerProps} />
        <MaintenancePage title={sectionState?.title || 'Раздел'} message={sectionState?.message || 'Раздел находится на технических работах.'} onBack={goBack} />
        <Footer />
        {modals}
      </div>
    );
  }

  // ---- Sub-pages ----
  // Вместо:
// if (currentPage === 'guides') { return <div ...> ... </div>; }

// Используйте обёртку:
if (currentPage === 'guides') {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-ink-900 text-ink-100">
        <Header {...headerProps} />
        <GuidesPage onBack={goBack} />
        <Footer />
        {modals}
      </div>
    </PageWrapper>
  );
}

if (currentPage === 'admin') {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-ink-900 text-ink-100">
        <Header {...headerProps} />
        <AdminPage onBack={goBack} />
        <Footer />
        {modals}
      </div>
    </PageWrapper>
  );
}

if (currentPage === 'faq') {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-ink-900 text-ink-100">
        <Header {...headerProps} />
        <div className="pt-16 md:pt-20">
          <FAQSection />
        </div>
        <Footer />
        {modals}
      </div>
    </PageWrapper>
  );
}

if (currentPage === 'users') {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-ink-900 text-ink-100">
        <Header {...headerProps} />
        <UsersListPage onBack={goBack} />
        <Footer />
        {modals}
      </div>
    </PageWrapper>
  );
}

if (contentPages.includes(currentPage)) {
  return (
    <PageWrapper>
      <div className="min-h-screen bg-ink-900 text-ink-100">
        <Header {...headerProps} />
        <ContentPage pageId={currentPage} onBack={goBack} />
        <Footer />
        {modals}
      </div>
    </PageWrapper>
  );
}

// Для главной страницы (MainPage) обёртка уже не требуется, 
// так как она рендерится статично. Если хотите анимацию при загрузке сайта, 
// оберните и её:
return (
  <PageWrapper>
    <MainPage {...headerProps} modals={modals} onNavigate={handleNavigate} />
  </PageWrapper>
);

  // ---- Main Page ----
  return <MainPage {...headerProps} modals={modals} onNavigate={handleNavigate} />;
}

function MainPage({ activeSection, onNavigate, onLoginClick, onProfileClick, modals }: {
  activeSection: string; onNavigate: (s: string) => void; onLoginClick: () => void; onProfileClick: () => void;
  modals: React.ReactNode;
}) {
  const { isAdmin, siteSettings } = useAuth();
  const activeAnnouncements = siteSettings.announcements.filter(a => a.active);

  return (
    <div className="min-h-screen bg-ink-900 text-ink-100">
      <Header activeSection={activeSection} onNavigate={onNavigate} onLoginClick={onLoginClick} onProfileClick={onProfileClick} />

      <main>
        {/* Announcements — marquee ticker */}
        {activeAnnouncements.length > 0 && (
          <div className="pt-16 md:pt-20">
            {activeAnnouncements.map(ann => (
              <div key={ann.id} className={`overflow-hidden py-3 border-b ${
                ann.type === 'warning' ? 'bg-orange-500/10 border-orange-500/20' :
                ann.type === 'success' ? 'bg-jade-400/10 border-jade-400/20' :
                'bg-blue-500/10 border-blue-500/20'
              }`}>
                <div className={`animate-marquee whitespace-nowrap text-base md:text-lg font-medium ${
                  ann.type === 'warning' ? 'text-orange-400' :
                  ann.type === 'success' ? 'text-jade-400' :
                  'text-blue-400'
                }`}>
                  <span className="mx-8">
                    {ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️'} {ann.text}
                  </span>
                  <span className="mx-8">
                    {ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️'} {ann.text}
                  </span>
                  <span className="mx-8">
                    {ann.type === 'warning' ? '⚠️' : ann.type === 'success' ? '✅' : 'ℹ️'} {ann.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div id="home">
          <HeroSection />
        </div>

        {/* Floating Admin Button */}
        {isAdmin() && (
          <button
            onClick={() => onNavigate('admin')}
            className="fixed left-4 top-20 md:top-24 z-40 bg-ink-900/85 backdrop-blur-md
                     border border-purple-500/35 rounded-xl p-3 shadow-xl shadow-black/40
                     hover:bg-purple-500/10 hover:border-purple-500/55 hover:-translate-y-0.5 transition-all cursor-pointer group"
            title="Панель управления"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Crown className="w-4 h-4 text-purple-400" />
            </div>
          </button>
        )}
      </main>

      <Footer />
      {modals}
    </div>
  );
}



export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

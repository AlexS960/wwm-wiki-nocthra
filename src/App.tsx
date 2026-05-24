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
import PrivateMessages from './components/PrivateMessages';
import MaintenancePage from './components/MaintenancePage';
import { ArrowUp, Crown, Megaphone, X, Plus, Trash2 } from 'lucide-react';
import { usePmBrowserNotifications } from './hooks/usePmBrowserNotifications';
import type { NavigatePayload } from './components/Header';

const contentPages = ['weapons', 'builds', 'sects', 'bosses', 'mystic', 'map', 'cooking', 'tips', 'lifeskills'];

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
  const { siteSettings, isAdmin } = useAuth();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('main');
  const [pendingGuideId, setPendingGuideId] = useState<string | null>(null);

  usePmBrowserNotifications();

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (section: string, payload?: NavigatePayload) => {
    if (payload?.guideId) setPendingGuideId(payload.guideId);
    if (section === 'home') { setCurrentPage('main'); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setCurrentPage(section); window.scrollTo({ top: 0 });
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
      <DbErrorBanner />
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <FloatingChat onLoginClick={() => setShowLoginModal(true)} />
      <SupportWidget onLoginClick={() => setShowLoginModal(true)} />
      <PrivateMessages onLoginClick={() => setShowLoginModal(true)} />
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-20 right-6 z-40 bg-gold-400/20 backdrop-blur-sm border border-gold-400/40 text-gold-400 p-3 rounded-full shadow-lg hover:bg-gold-400/30 transition-all animate-fadeIn cursor-pointer">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );

  if (currentPage !== 'main' && currentPage !== 'admin' && isSectionMaintenance && !isAdmin()) {
    return (
      <div className="min-h-screen bg-ink-900 text-ink-100 page-enter">
        <Header {...headerProps} />
        <MaintenancePage title={sectionState?.title || 'Раздел'} message={sectionState?.message || 'Раздел находится на технических работах.'} onBack={goBack} />
        <Footer />
        {modals}
      </div>
    );
  }

  if (currentPage === 'guides') {
    return (
      <div className="min-h-screen bg-ink-900 text-ink-100 page-enter">
        <Header {...headerProps} />
        <GuidesPage
          onBack={goBack}
          onLoginClick={() => setShowLoginModal(true)}
          initialGuideId={pendingGuideId}
          onGuideOpened={() => setPendingGuideId(null)}
        />
        <Footer />
        {modals}
      </div>
    );
  }
  if (currentPage === 'admin') {
    return (<div className="min-h-screen bg-ink-900 text-ink-100 page-enter"><Header {...headerProps} /><AdminPage onBack={goBack} /><Footer />{modals}</div>);
  }
  if (currentPage === 'faq') {
    return (<div className="min-h-screen bg-ink-900 text-ink-100 page-enter"><Header {...headerProps} /><div className="pt-16 md:pt-20"><FAQSection /></div><Footer />{modals}</div>);
  }
  if (currentPage === 'users') {
    return (<div className="min-h-screen bg-ink-900 text-ink-100 page-enter"><Header {...headerProps} /><UsersListPage onBack={goBack} /><Footer />{modals}</div>);
  }
  if (contentPages.includes(currentPage)) {
    return (<div className="min-h-screen bg-ink-900 text-ink-100 page-enter"><Header {...headerProps} /><ContentPage pageId={currentPage} onBack={goBack} /><Footer />{modals}</div>);
  }

  return <MainPage headerProps={headerProps} modals={modals} onNavigate={handleNavigate} />;
}

function MainPage({ headerProps, modals, onNavigate }: {
  headerProps: { activeSection: string; onNavigate: (s: string) => void; onLoginClick: () => void; onProfileClick: () => void };
  modals: React.ReactNode; onNavigate: (s: string) => void;
}) {
  const { isAdmin, siteSettings } = useAuth();
  const activeAnnouncements = siteSettings.announcements.filter(a => a.active);

  return (
    <div className="min-h-screen bg-ink-900 text-ink-100">
      <Header {...headerProps} />
      <main className="pt-16 md:pt-20">
        {activeAnnouncements.length > 0 && (
          <div className="announcement-bar" aria-label="Объявления">
            {activeAnnouncements.map(ann => (
              <div key={ann.id} className={`announcement-bar__item overflow-hidden py-2 px-4 rounded-full backdrop-blur-md shadow-lg ${
                ann.type === 'warning' ? 'bg-orange-500/20 border border-orange-400/30' :
                ann.type === 'success' ? 'bg-jade-400/20 border border-jade-400/30' : 'bg-blue-500/20 border border-blue-400/30'
              }`}>
                <div className={`animate-marquee whitespace-nowrap text-xs font-medium ${
                  ann.type === 'warning' ? 'text-orange-300' : ann.type === 'success' ? 'text-jade-300' : 'text-blue-300'
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
        {isAdmin() && (
          <div
            className="fixed left-4 z-40 flex flex-col gap-2"
            style={{
              top: activeAnnouncements.length > 0
                ? `calc(5rem + ${activeAnnouncements.length * 44}px + 12px)`
                : '5.25rem',
            }}
          >
            <button onClick={() => onNavigate('admin')}
              className="admin-btn flex items-center px-3 py-2.5 rounded-full bg-ink-900/85 backdrop-blur-md border border-purple-500/35 shadow-lg hover:bg-purple-500/10 hover:border-purple-500/55 transition-all cursor-pointer group w-fit">
              <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Crown className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="admin-btn-text text-purple-400 text-xs font-medium">Панель управления</span>
            </button>
            <AnnouncementsFloating />
          </div>
        )}
      </main>
      <Footer />
      {modals}
    </div>
  );
}

function AnnouncementsFloating() {
  const { siteSettings, addAnnouncement, removeAnnouncement } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'success'>('info');

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="admin-btn flex items-center px-3 py-2.5 rounded-full bg-ink-900/85 backdrop-blur-md border border-orange-500/35 shadow-lg hover:bg-orange-500/10 hover:border-orange-500/55 transition-all cursor-pointer group w-fit">
        <div className="w-7 h-7 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
          <Megaphone className="w-3.5 h-3.5 text-orange-400" />
        </div>
        <span className="admin-btn-text text-orange-400 text-xs font-medium">Объявления</span>
      </button>
    );
  }

  return (
    <div className="fixed left-4 z-50 w-80 animate-fadeIn" style={{ top: 'calc(84px + 52px)' }}>
      <div className="bg-ink-900 border border-orange-500/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-ink-800/80 border-b border-ink-700/30">
          <span className="font-serif text-sm font-bold text-white flex items-center gap-2"><Megaphone className="w-4 h-4 text-orange-400" /> Объявления</span>
          <button onClick={() => setIsOpen(false)} className="p-1 text-ink-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            <input value={text} onChange={e => setText(e.target.value)} placeholder="Текст объявления..." className="w-full bg-ink-800 border border-ink-700/50 rounded-lg px-3 py-2 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-orange-400/50" />
            <div className="flex gap-2">
              <select value={type} onChange={e => setType(e.target.value as typeof type)} className="bg-ink-800 border border-ink-700/50 rounded-lg px-2 py-2 text-sm text-white cursor-pointer focus:outline-none">
                <option value="info">ℹ️ Инфо</option><option value="warning">⚠️ Важно</option><option value="success">✅ Успех</option>
              </select>
              <button onClick={() => { if (text.trim()) { addAnnouncement(text.trim(), type); setText(''); } }}
                className="flex items-center gap-1 px-3 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-xs font-medium hover:bg-orange-500/30 cursor-pointer"><Plus className="w-3.5 h-3.5" /> Добавить</button>
            </div>
          </div>
          {siteSettings.announcements.map(ann => (
            <div key={ann.id} className={`flex items-center justify-between gap-2 rounded-lg p-2.5 text-xs border ${
              ann.type === 'warning' ? 'bg-orange-500/5 border-orange-500/20 text-orange-400' :
              ann.type === 'success' ? 'bg-jade-400/5 border-jade-400/20 text-jade-400' : 'bg-blue-500/5 border-blue-500/20 text-blue-400'
            }`}>
              <span className="flex-1">{ann.text}</span>
              <button onClick={() => removeAnnouncement(ann.id)} className="text-ink-500 hover:text-crimson-400 cursor-pointer shrink-0"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (<AuthProvider><AppContent /></AuthProvider>);
}

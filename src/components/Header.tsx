import { useState, useEffect, memo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Scroll, User, LogIn, House, BookOpenText, Users, CircleHelp, MessageSquare, Lightbulb } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearch from './GlobalSearch';
import { dispatchCloseFloatPanels } from '../lib/closeFloatPanels';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useScrollThreshold } from '../hooks/useScrollThreshold';
import { WIKI_HUB_SECTIONS } from '../data/sections';

export type NavigatePayload = { guideId?: string; wikiId?: string };

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string, payload?: NavigatePayload) => void;
  onLoginClick: () => void;
  onProfileClick: (anchor?: { top: number; right: number }) => void;
  showStaffChatLink?: boolean;
}

const wikiNavItems = WIKI_HUB_SECTIONS.map(({ id, label, icon }) => ({ id, label, icon }));

function Header({ activeSection, onNavigate, onLoginClick, onProfileClick, showStaffChatLink }: HeaderProps) {
  const isScrolled = useScrollThreshold(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useBodyScrollLock(mobileOpen);

  useEffect(() => {
    document.documentElement.classList.toggle('mobile-nav-open', mobileOpen);
    return () => document.documentElement.classList.remove('mobile-nav-open');
  }, [mobileOpen]);

  const toggleMobileMenu = () => {
    setMobileOpen(prev => {
      if (!prev) dispatchCloseFloatPanels();
      return !prev;
    });
  };

  const isWikiPageActive = activeSection === 'wwmwiki' || wikiNavItems.some(i => i.id === activeSection);

  return (
    <header
      className={`site-header fixed top-0 left-0 right-0 transition-[background-color,box-shadow,border-color] duration-300 ${
        mobileOpen ? 'z-[210]' : 'z-50'
      } ${
        isScrolled
          ? 'bg-ink-900/85 md:bg-ink-900/20 md:backdrop-blur-sm shadow-lg shadow-black/20 border-b border-gold-700/20'
          : 'bg-ink-900/40 md:bg-ink-900/5 md:backdrop-blur-[1px]'
      }`}
    >
      <div className="w-full px-3 sm:px-4 lg:px-3 xl:px-4 2xl:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group cursor-pointer">
            <Scroll className="w-6 h-6 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <div className="flex flex-col">
              <span className="font-serif text-gold-400 text-lg md:text-xl font-bold leading-tight group-hover:text-gold-300 transition-colors">WWM Вики Ру</span>
              <span className="text-[10px] text-ink-300 leading-tight hidden sm:block">Where Winds Meet</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            <NavButton icon={<House className="w-4 h-4" />} label="Главная" active={activeSection === 'home'} onClick={() => onNavigate('home')} />
            <NavButton icon={<BookOpenText className="w-4 h-4" />} label="WWM-Вики Ру" active={isWikiPageActive} onClick={() => onNavigate('wwmwiki')} />
            <NavButton icon={<Users className="w-4 h-4" />} label="Список пользователей" active={activeSection === 'users'} onClick={() => onNavigate('users')} />
            <NavButton icon={<Lightbulb className="w-4 h-4" />} label="Предложения" active={activeSection === 'suggestions'} onClick={() => onNavigate('suggestions')} />
            <NavButton icon={<CircleHelp className="w-4 h-4" />} label="FAQ" active={activeSection === 'faq'} onClick={() => onNavigate('faq')} />
            {showStaffChatLink && (
              <NavButton icon={<MessageSquare className="w-4 h-4" />} label="Служебный чат" active={activeSection === 'staffchat'} onClick={() => onNavigate('staffchat')} accent="purple" />
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <GlobalSearch onNavigate={onNavigate} />
            </div>
            {user ? (
              <button
                type="button"
                data-overlay-trigger
                onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                onProfileClick({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
              }}
                className="hover-glow-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/35 hover:bg-gold-400/20 transition-colors cursor-pointer group">
                {user.picture ? <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" /> :
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center"><User className="w-3.5 h-3.5 text-gold-400" /></div>}
                <span className="hidden sm:block text-sm font-medium text-gold-400 group-hover:text-gold-300 max-w-[100px] truncate">
                  {user.gameNickname?.trim() || user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button type="button" data-overlay-trigger onClick={onLoginClick}
                className="hover-glow-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/35 hover:bg-gold-400/20 transition-colors cursor-pointer group">
                <LogIn className="w-4 h-4 text-gold-400 group-hover:text-gold-300" />
                <span className="hidden sm:block text-sm font-medium text-gold-400 group-hover:text-gold-300">Войти</span>
              </button>
            )}
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
              className="lg:hidden p-2 text-ink-200 hover:text-gold-400 transition-colors cursor-pointer relative z-[212]"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && createPortal(
        <>
          <div
            className="mobile-nav-backdrop fixed inset-0 z-[200] bg-black/80 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <nav
            id="mobile-nav-panel"
            className="mobile-nav-panel scroll-area fixed left-0 right-0 bottom-0 z-[201] lg:hidden bg-ink-900 border-t border-gold-700/25 shadow-2xl animate-fadeIn"
            style={{ top: 'var(--header-height, 4rem)' }}
          >
            <div className="w-full px-4 py-4 flex flex-col gap-1 pb-8">
              <div className="px-1 pb-2">
                <GlobalSearch onNavigate={(s, p) => { onNavigate(s, p); setMobileOpen(false); }} />
              </div>
              <MobileNavButton label="🏠 Главная" active={activeSection === 'home'} onClick={() => { onNavigate('home'); setMobileOpen(false); }} />
              <MobileNavButton label="☯️ WWM-Вики Ру" active={isWikiPageActive} onClick={() => { onNavigate('wwmwiki'); setMobileOpen(false); }} />
              <div className="h-px bg-ink-700/50 my-1" />
              <MobileNavButton label="👥 Список пользователей" active={activeSection === 'users'} onClick={() => { onNavigate('users'); setMobileOpen(false); }} />
              <MobileNavButton label="💡 Предложения" active={activeSection === 'suggestions'} onClick={() => { onNavigate('suggestions'); setMobileOpen(false); }} />
              <MobileNavButton label="❓ FAQ" active={activeSection === 'faq'} onClick={() => { onNavigate('faq'); setMobileOpen(false); }} />
              {showStaffChatLink && (
                <MobileNavButton label="💬 Служебный чат" active={activeSection === 'staffchat'} onClick={() => { onNavigate('staffchat'); setMobileOpen(false); }} />
              )}
              <div className="mt-2 pt-2 border-t border-ink-700/50">
                {user ? (
                  <button
                    type="button"
                    data-overlay-trigger
                    onClick={(e) => {
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                      onProfileClick({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
                      setMobileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gold-400/10 text-gold-400 cursor-pointer"
                  >
                    {user.picture ? <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" /> :
                      <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center"><User className="w-4 h-4 text-gold-400" /></div>}
                    <div className="text-left"><div className="font-medium">{user.name}</div><div className="text-xs text-ink-400">Открыть профиль</div></div>
                  </button>
                ) : (
                  <button
                    type="button"
                    data-overlay-trigger
                    onClick={() => { onLoginClick(); setMobileOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gold-400/10 text-gold-400 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" /><span>Войти</span>
                  </button>
                )}
              </div>
            </div>
          </nav>
        </>,
        document.body,
      )}
    </header>
  );
}

function NavButton({ icon, label, active, onClick, accent }: { icon: ReactNode; label: string; active: boolean; onClick: () => void; accent?: 'purple' }) {
  const purple = accent === 'purple';
  return (
    <button onClick={onClick} className={`hover-glow-btn px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
      active
        ? purple ? 'text-purple-300 bg-purple-500/10 border border-purple-400/30' : 'text-gold-400 bg-gold-400/10 border border-gold-400/30'
        : purple ? 'text-purple-200 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-400/20' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5 border border-transparent hover:border-gold-400/20'
    }`}>
      <span className="inline-flex items-center gap-1.5">{icon}{label}</span>
    </button>
  );
}

export default memo(Header);

function MobileNavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded-lg text-left text-sm font-medium cursor-pointer transition-colors ${
        active ? 'text-gold-400 bg-gold-400/10 border border-gold-400/20' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}

import { useState, useEffect, memo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Scroll, User, LogIn, House, Users, CircleHelp, MessageSquare, Lightbulb, Shield, BookOpen } from 'lucide-react';
import { useAuthState } from '../context/AuthContext';
import GlobalSearch from './GlobalSearch';
import { MessengerStar } from './MessengerStar';
import { dispatchCloseFloatPanels } from '../lib/closeFloatPanels';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';
import { useScrollThreshold } from '../hooks/useScrollThreshold';
import { mergeBranding } from '../lib/siteConstructor';

export type NavigatePayload = { guideId?: string; wikiId?: string };

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string, payload?: NavigatePayload) => void;
  onLoginClick: () => void;
  onProfileClick: (anchor?: { top: number; right: number }) => void;
  showStaffChatLink?: boolean;
}

function Header({ activeSection, onNavigate, onLoginClick, onProfileClick, showStaffChatLink }: HeaderProps) {
  const isScrolled = useScrollThreshold(50);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, siteSettings } = useAuthState();
  const branding = mergeBranding(siteSettings.branding);
  const isHome = activeSection === 'home';
  const isWikiHubActive = activeSection === 'wwmwiki';

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
              <span className="font-serif text-gold-400 text-lg md:text-xl font-bold leading-tight group-hover:text-gold-300 transition-colors">{branding.headerTitle}</span>
              <span className="text-[10px] text-ink-300 leading-tight hidden sm:block">{branding.headerSubtitle}</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            <NavIconButton icon={<House className="w-4 h-4" />} label="Главная" active={activeSection === 'home'} onClick={() => onNavigate('home')} />
            {!isHome && (
              <NavIconButton
                icon={<BookOpen className="w-4 h-4" />}
                label="WWM Вики"
                active={isWikiHubActive}
                onClick={() => onNavigate('wwmwiki')}
                accent="crimson"
              />
            )}
            <NavIconButton icon={<Shield className="w-4 h-4" />} label="Гильдии" active={activeSection === 'guilds'} onClick={() => onNavigate('guilds')} />
            <NavIconButton icon={<Users className="w-4 h-4" />} label="Пользователи" active={activeSection === 'users'} onClick={() => onNavigate('users')} />
            <NavIconButton icon={<Lightbulb className="w-4 h-4" />} label="Предложения" active={activeSection === 'suggestions'} onClick={() => onNavigate('suggestions')} />
            <NavIconButton icon={<CircleHelp className="w-4 h-4" />} label="FAQ" active={activeSection === 'faq'} onClick={() => onNavigate('faq')} />
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5">
              {showStaffChatLink && (
                <NavIconButton
                  icon={<MessageSquare className="w-4 h-4" />}
                  label="Служебный чат"
                  active={activeSection === 'staffchat'}
                  onClick={() => onNavigate('staffchat')}
                  accent="purple"
                />
              )}
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
                className="hover-glow-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/35 hover:bg-gold-400/20 transition-colors cursor-pointer group"
              >
                {user.picture ? <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" /> :
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center"><User className="w-3.5 h-3.5 text-gold-400" /></div>}
                <span className="hidden sm:inline-flex items-center gap-0.5 text-sm font-medium text-gold-400 group-hover:text-gold-300 max-w-[100px]">
                  <span className="truncate">{user.gameNickname?.trim() || user.name.split(' ')[0]}</span>
                  {user.messengerAccessId?.trim() && <MessengerStar className="text-[0.7em] shrink-0" />}
                </span>
              </button>
            ) : (
              <button
                type="button"
                data-overlay-trigger
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onLoginClick();
                }}
                className="hover-glow-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/35 hover:bg-gold-400/20 transition-colors cursor-pointer group"
              >
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
              <div className="px-1 pb-2 flex items-center gap-2">
                {showStaffChatLink && (
                  <button
                    type="button"
                    onClick={() => { onNavigate('staffchat'); setMobileOpen(false); }}
                    className={`p-2.5 rounded-full border cursor-pointer transition-colors ${
                      activeSection === 'staffchat'
                        ? 'text-purple-300 bg-purple-500/15 border-purple-400/40'
                        : 'text-purple-200 bg-ink-800 border-purple-500/35 hover:bg-purple-500/10'
                    }`}
                    aria-label="Служебный чат"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  <GlobalSearch onNavigate={(s, p) => { onNavigate(s, p); setMobileOpen(false); }} />
                </div>
              </div>
              <MobileNavButton label="🏠 Главная" active={activeSection === 'home'} onClick={() => { onNavigate('home'); setMobileOpen(false); }} />
              {!isHome && (
                <MobileNavButton label="📚 WWM Вики" active={isWikiHubActive} onClick={() => { onNavigate('wwmwiki'); setMobileOpen(false); }} />
              )}
              <MobileNavButton label="🛡️ Гильдии" active={activeSection === 'guilds'} onClick={() => { onNavigate('guilds'); setMobileOpen(false); }} />
              <MobileNavButton label="👥 Список пользователей" active={activeSection === 'users'} onClick={() => { onNavigate('users'); setMobileOpen(false); }} />
              <MobileNavButton label="💡 Предложения" active={activeSection === 'suggestions'} onClick={() => { onNavigate('suggestions'); setMobileOpen(false); }} />
              <MobileNavButton label="❓ FAQ" active={activeSection === 'faq'} onClick={() => { onNavigate('faq'); setMobileOpen(false); }} />
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

function NavIconButton({
  icon,
  label,
  active,
  onClick,
  accent,
}: {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: 'purple' | 'crimson';
}) {
  const purple = accent === 'purple';
  const crimson = accent === 'crimson';

  const shell = active
    ? purple
      ? 'bg-purple-500/15 border-purple-400/40 text-purple-300'
      : crimson
        ? 'bg-crimson-400/15 border-crimson-400/45 text-crimson-300'
        : 'bg-gold-400/10 border-gold-400/35 text-gold-400'
    : purple
      ? 'bg-ink-900/85 border-purple-500/35 text-purple-200 hover:bg-purple-500/10 hover:border-purple-500/55'
      : crimson
        ? 'bg-ink-900/85 border-crimson-500/35 text-crimson-300 hover:bg-crimson-400/10 hover:border-crimson-400/55'
        : 'bg-ink-900/85 border-gold-700/25 text-ink-200 hover:bg-gold-400/10 hover:border-gold-400/35 hover:text-gold-300';

  const iconBg = active
    ? purple
      ? 'bg-purple-500/20'
      : crimson
        ? 'bg-crimson-500/20'
        : 'bg-gold-400/20'
    : purple
      ? 'bg-purple-500/20'
      : crimson
        ? 'bg-crimson-500/20'
        : 'bg-gold-400/10';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`admin-btn hover-glow-btn flex items-center p-2 rounded-full backdrop-blur-md shadow-lg transition-all cursor-pointer group w-fit border ${shell}`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${iconBg}`}>
        {icon}
      </div>
      <span className={`admin-btn-text text-xs font-medium ${purple ? 'text-purple-300' : crimson ? 'text-crimson-300' : 'text-gold-300'}`}>
        {label}
      </span>
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

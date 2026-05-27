import { useState, useEffect, type ReactNode } from 'react';
import { Menu, X, Scroll, User, LogIn, House, BookOpenText, Users, CircleHelp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearch from './GlobalSearch';
import { dispatchCloseFloatPanels } from '../lib/closeFloatPanels';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export type NavigatePayload = { guideId?: string; wikiId?: string };

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string, payload?: NavigatePayload) => void;
  onLoginClick: () => void;
  onProfileClick: (anchor?: { top: number; right: number }) => void;
}

const infoItems = [
  { id: 'guides', label: 'Гайды', icon: '📖' },
  { id: 'weapons', label: 'Оружие', icon: '⚔️' },
  { id: 'builds', label: 'Билды', icon: '🛤️' },
  { id: 'sects', label: 'Секты', icon: '🏛️' },
  { id: 'bosses', label: 'Боссы', icon: '👹' },
  { id: 'npcs', label: 'NPC', icon: '👥' },
  { id: 'riddles', label: 'Загадки', icon: '🧩' },
  { id: 'innerpath', label: 'Внутренний путь', icon: '☯️' },
  { id: 'mystic', label: 'Арты', icon: '✨' },
  { id: 'cooking', label: 'Готовка', icon: '🍳' },
  { id: 'tips', label: 'Советы', icon: '💡' },
];

export default function Header({ activeSection, onNavigate, onLoginClick, onProfileClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useBodyScrollLock(mobileOpen);

  const toggleMobileMenu = () => {
    setMobileOpen(prev => {
      if (!prev) dispatchCloseFloatPanels();
      return !prev;
    });
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWikiPageActive = activeSection === 'wwmwiki' || infoItems.some(i => i.id === activeSection);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-ink-900/20 backdrop-blur-sm shadow-lg shadow-black/20 border-b border-gold-700/20'
        : 'bg-ink-900/5 backdrop-blur-[1px]'
    }`}>
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
            <NavButton icon={<CircleHelp className="w-4 h-4" />} label="FAQ" active={activeSection === 'faq'} onClick={() => onNavigate('faq')} />
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <GlobalSearch onNavigate={onNavigate} />
            </div>
            {user ? (
              <button onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                onProfileClick({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
              }}
                className="hover-glow-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/35 hover:bg-gold-400/20 transition-all cursor-pointer group">
                {user.picture ? <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" /> :
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center"><User className="w-3.5 h-3.5 text-gold-400" /></div>}
                <span className="hidden sm:block text-sm font-medium text-gold-400 group-hover:text-gold-300 max-w-[100px] truncate">
                  {user.gameNickname?.trim() || user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button onClick={onLoginClick}
                className="hover-glow-btn flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/35 hover:bg-gold-400/20 transition-all cursor-pointer group">
                <LogIn className="w-4 h-4 text-gold-400 group-hover:text-gold-300" />
                <span className="hidden sm:block text-sm font-medium text-gold-400 group-hover:text-gold-300">Войти</span>
              </button>
            )}
            <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-ink-200 hover:text-gold-400 transition-colors cursor-pointer relative z-[112]">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <nav className="fixed top-16 left-0 right-0 bottom-0 z-[101] lg:hidden bg-ink-900/98 backdrop-blur-md border-t border-gold-700/20 animate-fadeIn overflow-y-auto overscroll-contain">
          <div className="w-full px-4 py-4 flex flex-col gap-1 pb-8">
            <div className="px-4 pb-2 md:hidden">
              <GlobalSearch onNavigate={(s, p) => { onNavigate(s, p); setMobileOpen(false); }} />
            </div>
            <MobileNavButton label="🏠 Главная" active={activeSection === 'home'} onClick={() => { onNavigate('home'); setMobileOpen(false); }} />
            <MobileNavButton label="☯️ WWM-Вики Ру" active={isWikiPageActive} onClick={() => { onNavigate('wwmwiki'); setMobileOpen(false); }} />
            <div className="h-px bg-ink-700/50 my-1" />
            <MobileNavButton label="👥 Список пользователей" active={activeSection === 'users'} onClick={() => { onNavigate('users'); setMobileOpen(false); }} />
            <MobileNavButton label="❓ FAQ" active={activeSection === 'faq'} onClick={() => { onNavigate('faq'); setMobileOpen(false); }} />
            <div className="mt-2 pt-2 border-t border-ink-700/50">
              {user ? (
                <button onClick={(e) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  onProfileClick({ top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) });
                  setMobileOpen(false);
                }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gold-400/10 text-gold-400 cursor-pointer">
                  {user.picture ? <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" /> :
                    <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center"><User className="w-4 h-4 text-gold-400" /></div>}
                  <div className="text-left"><div className="font-medium">{user.name}</div><div className="text-xs text-ink-400">Открыть профиль</div></div>
                </button>
              ) : (
                <button onClick={() => { onLoginClick(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gold-400/10 text-gold-400 cursor-pointer">
                  <LogIn className="w-4 h-4" /><span>Войти</span>
                </button>
              )}
            </div>
          </div>
        </nav>
        </>
      )}
    </header>
  );
}

function NavButton({ icon, label, active, onClick }: { icon: ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`hover-glow-btn px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
      active ? 'text-gold-400 bg-gold-400/10 border border-gold-400/30' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5 border border-transparent hover:border-gold-400/20'
    }`}>
      <span className="inline-flex items-center gap-1.5">{icon}{label}</span>
    </button>
  );
}

function MobileNavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-3 rounded-lg text-left text-sm font-medium cursor-pointer ${
      active ? 'text-gold-400 bg-gold-400/10' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5'
    }`}>{label}</button>
  );
}

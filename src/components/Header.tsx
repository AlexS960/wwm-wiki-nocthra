import { useState, useEffect, useRef } from 'react';
import { Menu, X, Scroll, User, LogIn, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

const infoItems = [
  { id: 'guides', label: 'Гайды', icon: '📖' },
  { id: 'weapons', label: 'Оружие', icon: '⚔️' },
  { id: 'builds', label: 'Билды', icon: '🛤️' },
  { id: 'sects', label: 'Секты', icon: '🏛️' },
  { id: 'bosses', label: 'Боссы', icon: '👹' },
  { id: 'mystic', label: 'Арты', icon: '✨' },
  { id: 'map', label: 'Карта', icon: '🗺️' },
  { id: 'cooking', label: 'Готовка', icon: '🍳' },
  { id: 'tips', label: 'Советы', icon: '💡' },
];

export default function Header({ activeSection, onNavigate, onLoginClick, onProfileClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [infoDropdownOpen, setInfoDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInfoDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isInfoActive = infoItems.some(i => i.id === activeSection);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-ink-900/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-gold-700/30'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2 group cursor-pointer">
            <Scroll className="w-6 h-6 text-gold-400 group-hover:text-gold-300 transition-colors" />
            <div className="flex flex-col">
              <span className="font-serif text-gold-400 text-lg md:text-xl font-bold leading-tight group-hover:text-gold-300 transition-colors">WWM Wiki</span>
              <span className="text-[10px] text-ink-300 leading-tight hidden sm:block">Where Winds Meet</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            <NavButton label="Главная" active={activeSection === 'home'} onClick={() => onNavigate('home')} />
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setInfoDropdownOpen(!infoDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isInfoActive || infoDropdownOpen ? 'text-gold-400 bg-gold-400/10' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5'
                }`}>
                Информация
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${infoDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {infoDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-ink-900/98 backdrop-blur-md border border-gold-700/30 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-fadeIn z-50">
                  <div className="py-2">
                    {infoItems.map(item => (
                      <button key={item.id} onClick={() => { onNavigate(item.id); setInfoDropdownOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all cursor-pointer ${
                          activeSection === item.id ? 'text-gold-400 bg-gold-400/10' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5'
                        }`}>
                        <span className="text-base w-6 text-center">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <NavButton label="FAQ" active={activeSection === 'faq'} onClick={() => onNavigate('faq')} />
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <button onClick={onProfileClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/30 hover:bg-gold-400/20 transition-all cursor-pointer group">
                {user.picture ? <img src={user.picture} alt={user.name} className="w-6 h-6 rounded-full" /> :
                  <div className="w-6 h-6 rounded-full bg-gold-400/20 flex items-center justify-center"><User className="w-3.5 h-3.5 text-gold-400" /></div>}
                <span className="hidden sm:block text-sm font-medium text-gold-400 group-hover:text-gold-300 max-w-[100px] truncate">
                  {user.gameNickname?.trim() || user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button onClick={onLoginClick}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-400/10 border border-gold-400/30 hover:bg-gold-400/20 transition-all cursor-pointer group">
                <LogIn className="w-4 h-4 text-gold-400 group-hover:text-gold-300" />
                <span className="hidden sm:block text-sm font-medium text-gold-400 group-hover:text-gold-300">Войти</span>
              </button>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-ink-200 hover:text-gold-400 transition-colors cursor-pointer">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-ink-900/98 backdrop-blur-md border-t border-gold-700/20 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            <MobileNavButton label="🏠 Главная" active={activeSection === 'home'} onClick={() => { onNavigate('home'); setMobileOpen(false); }} />
            <div className="px-4 pt-3 pb-1 text-[10px] text-ink-500 uppercase tracking-widest font-semibold">Информация</div>
            {infoItems.map(item => (
              <MobileNavButton key={item.id} label={`${item.icon} ${item.label}`} active={activeSection === item.id} onClick={() => { onNavigate(item.id); setMobileOpen(false); }} />
            ))}
            <div className="h-px bg-ink-700/50 my-1" />
            <MobileNavButton label="❓ FAQ" active={activeSection === 'faq'} onClick={() => { onNavigate('faq'); setMobileOpen(false); }} />
            <div className="mt-2 pt-2 border-t border-ink-700/50">
              {user ? (
                <button onClick={() => { onProfileClick(); setMobileOpen(false); }}
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
      )}
    </header>
  );
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
      active ? 'text-gold-400 bg-gold-400/10' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5'
    }`}>{label}</button>
  );
}

function MobileNavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-4 py-3 rounded-lg text-left text-sm font-medium cursor-pointer ${
      active ? 'text-gold-400 bg-gold-400/10' : 'text-ink-200 hover:text-gold-300 hover:bg-white/5'
    }`}>{label}</button>
  );
}

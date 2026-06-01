import { useState, lazy, Suspense } from 'react';
import { ChevronDown, Edit3, Save, X } from 'lucide-react';
import { GuildBadgeHero } from './GuildBadge';
import { useAuth } from '../context/AuthContext';

const NewsBlocks = lazy(() => import('./NewsBlocks'));

const WWM_LOGO = '/images/wwm-logo.png';
const WWM_LOGO_FALLBACK =
  'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3564740/logo.png';

interface HeroSectionProps {
  onNavigate?: (section: string) => void;
  hasAnnouncements?: boolean;
}

export default function HeroSection({ onNavigate: _onNavigate, hasAnnouncements = false }: HeroSectionProps) {
  const { hasPermission, discordUrl, updateDiscordUrl, siteSettings, updateSiteSettings } = useAuth();
  const canEdit = hasPermission('guild.edit') || hasPermission('admin.panel');
  const [showEditor, setShowEditor] = useState(false);
  const [draft, setDraft] = useState('');
  const [showLolkaEditor, setShowLolkaEditor] = useState(false);
  const [lolkaDraft, setLolkaDraft] = useState('');
  const [saved, setSaved] = useState(false);
  const [lolkaSaved, setLolkaSaved] = useState(false);
  const lolkaUrl = (siteSettings as unknown as { lolkaUrl?: string }).lolkaUrl || 'https://lolka.su/';

  const openEditor = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraft(discordUrl);
    setShowEditor(true);
    setSaved(false);
  };

  const handleSave = () => {
    const url = draft.trim();
    if (!url) return;
    updateDiscordUrl(url);
    setSaved(true);
    setTimeout(() => { setShowEditor(false); setSaved(false); }, 800);
  };

  const handleLolkaSave = () => {
    const url = lolkaDraft.trim();
    if (!url) return;
    updateSiteSettings({ lolkaUrl: url } as never);
    setLolkaSaved(true);
    setTimeout(() => { setShowLolkaEditor(false); setLolkaSaved(false); }, 800);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className={`hero-readable relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center ${hasAnnouncements ? 'pt-6 md:pt-8' : 'pt-16 md:pt-20'}`}>
        <div className="md:animate-fadeInUp">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold text-shadow-glow mb-4 flex flex-wrap sm:flex-nowrap items-center justify-center gap-0.5 sm:gap-1 md:gap-2">
            <img
              src={WWM_LOGO}
              alt=""
              className="h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem] md:h-24 md:w-24 lg:h-28 lg:w-28 object-contain drop-shadow-[0_0_14px_rgba(212,175,55,0.4)] shrink-0 -mr-0.5 sm:-mr-1"
              onError={e => {
                const img = e.currentTarget;
                if (img.src !== WWM_LOGO_FALLBACK) img.src = WWM_LOGO_FALLBACK;
              }}
            />
            <span>
              <span className="text-white">Where Winds </span>
              <span className="text-gold-300">Meet</span>
            </span>
          </h1>
          <p className="font-serif text-xl sm:text-2xl md:text-3xl text-gold-300 text-shadow mb-2">
            Там, Где Встречаются Ветра
          </p>
          <p className="text-ink-200 text-base sm:text-lg max-w-2xl mx-auto mb-8">
            Полная русскоязычная база знаний: гайды, секты, оружие, билды и всё для освоения мира Цзянху
          </p>
        </div>

        <div className="mb-6">
          <GuildBadgeHero />
        </div>

        <div className="mb-10 md:animate-fadeInUp relative inline-flex flex-wrap justify-center gap-3" style={{ animationDelay: '0.5s' }}>
          <a href={discordUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 h-16 px-6 py-0 min-w-[18rem] rounded-xl
                       bg-[#1f245f]/72 border border-[#8ea2ff]/75 backdrop-blur-md
                       hover-glow-btn hover:bg-[#252d73]/82 hover:border-[#b8c5ff] md:hover:scale-105
                       transition-colors duration-200 group">
            <svg className="w-5 h-5 text-[#5865F2] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <div className="text-left">
              <div className="text-white font-semibold text-sm group-hover:text-white transition-colors drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]">Nocthra</div>
              <div className="text-[#d8e0ff] text-xs group-hover:text-white transition-colors">Присоединиться в Discord</div>
            </div>
          </a>
          <a href={lolkaUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 h-16 px-6 py-0 min-w-[18rem] rounded-xl
                       bg-[#53197b]/72 border border-[#d0a2ff]/70 backdrop-blur-md
                       hover-glow-btn hover-glow-purple hover:bg-[#6b239c]/82 hover:border-[#e2c4ff] md:hover:scale-105
                       transition-colors duration-200 group">
            <span className="w-5 h-5 rounded-full bg-[#a855f7]/30 text-[#e9d5ff] flex items-center justify-center text-[10px] font-bold">L</span>
            <div className="text-left">
              <div className="text-white font-semibold text-sm group-hover:text-white transition-colors drop-shadow-[0_0_6px_rgba(255,255,255,0.25)]">Lolka</div>
              <div className="text-[#f0dcff] text-xs group-hover:text-white transition-colors">Перейти на Lolka</div>
            </div>
          </a>

          {canEdit && (
            <button onClick={openEditor}
              className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-ink-800 border border-[#5865F2]/40 
                       flex items-center justify-center text-[#5865F2] hover:bg-[#5865F2]/20 
                       transition-all cursor-pointer shadow-lg" title="Изменить ссылку Discord">
              <Edit3 className="w-3 h-3" />
            </button>
          )}
          {canEdit && (
            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setLolkaDraft(lolkaUrl); setShowLolkaEditor(true); setLolkaSaved(false); }}
              className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-ink-800 border border-[#a855f7]/40 
                       flex items-center justify-center text-[#a855f7] hover:bg-[#a855f7]/20 
                       transition-all cursor-pointer shadow-lg" title="Изменить ссылку Lolka">
              <Edit3 className="w-3 h-3" />
            </button>
          )}

          {showEditor && (
            <>
              <div className="fixed inset-0 z-[69]" onClick={() => setShowEditor(false)} />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(20rem,calc(100vw-2rem))] bg-ink-900/98 backdrop-blur-md border border-[#5865F2]/30 
                           rounded-xl shadow-2xl p-4 z-[70] animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white text-sm font-medium">Ссылка Discord</span>
                  <button onClick={() => setShowEditor(false)} className="text-ink-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={draft} onChange={e => setDraft(e.target.value)} placeholder="https://discord.gg/..."
                    className="flex-1 bg-ink-800 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white 
                           placeholder:text-ink-500 focus:outline-none focus:border-[#5865F2]/50" autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setShowEditor(false); }} />
                  <button onClick={handleSave} disabled={!draft.trim()}
                    className={`p-2 rounded-lg transition-all cursor-pointer shrink-0 ${
                      saved ? 'bg-jade-400/20 text-jade-400' : 'bg-[#5865F2]/20 text-[#5865F2] hover:bg-[#5865F2]/30'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}>
                    <Save className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-ink-500 text-[10px] mt-2">Вставьте бессрочную ссылку-приглашение Discord</p>
              </div>
            </>
          )}
          {showLolkaEditor && (
            <>
              <div className="fixed inset-0 z-[69]" onClick={() => setShowLolkaEditor(false)} />
              <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(20rem,calc(100vw-2rem))] bg-ink-900/98 backdrop-blur-md border border-[#a855f7]/30 
                           rounded-xl shadow-2xl p-4 z-[70] animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white text-sm font-medium">Ссылка Lolka</span>
                  <button onClick={() => setShowLolkaEditor(false)} className="text-ink-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-2">
                  <input type="text" value={lolkaDraft} onChange={e => setLolkaDraft(e.target.value)} placeholder="https://..."
                    className="flex-1 bg-ink-800 border border-ink-600/40 rounded-lg px-3 py-2 text-sm text-white 
                           placeholder:text-ink-500 focus:outline-none focus:border-[#a855f7]/50" autoFocus
                    onKeyDown={e => { if (e.key === 'Enter') handleLolkaSave(); if (e.key === 'Escape') setShowLolkaEditor(false); }} />
                  <button onClick={handleLolkaSave} disabled={!lolkaDraft.trim()}
                    className={`p-2 rounded-lg transition-all cursor-pointer shrink-0 ${
                      lolkaSaved ? 'bg-jade-400/20 text-jade-400' : 'bg-[#a855f7]/20 text-[#a855f7] hover:bg-[#a855f7]/30'
                    } disabled:opacity-40 disabled:cursor-not-allowed`}>
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="cv-auto max-w-4xl mx-auto md:animate-fadeInUp" style={{ animationDelay: '0.7s' }}>
          <Suspense fallback={<div className="h-48 rounded-2xl bg-ink-900/40 border border-gold-700/20 animate-pulse" />}>
            <NewsBlocks />
          </Suspense>
        </div>

        <div className="mt-12 hidden md:block md:animate-float">
          <ChevronDown className="w-6 h-6 text-gold-400/60 mx-auto" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent" />
    </section>
  );
}

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import WeaponsSection from './WeaponsSection';
import BuildsSection from './BuildsSection';
import SectsSection from './SectsSection';
import BossesSection from './BossesSection';
import MysticArtsSection from './MysticArtsSection';
import CookingSection from './CookingSection';
import TipsSection from './TipsSection';
import LifeSkillsSection from './LifeSkillsSection';
import NpcSection from './NpcSection';
import RiddlesSection from './RiddlesSection';
import InnerPathSection from './InnerPathSection';
import WikiEditorBar from './wiki/WikiEditorBar';

interface ContentPageProps {
  pageId: string;
  onBack: () => void;
}

const pageTitles: Record<string, { title: string; icon: string }> = {
  weapons: { title: 'Оружие', icon: '⚔️' },
  builds: { title: 'Билды', icon: '🛤️' },
  sects: { title: 'Секты', icon: '🏛️' },
  bosses: { title: 'Боссы', icon: '👹' },
  mystic: { title: 'Мистические Арты', icon: '✨' },
  cooking: { title: 'Готовка', icon: '🍳' },
  tips: { title: 'Советы и Коды', icon: '💡' },
  lifeskills: { title: 'Жизненные Навыки', icon: '🎨' },
  npcs: { title: 'NPC', icon: '👥' },
  riddles: { title: 'Загадки', icon: '🧩' },
  innerpath: { title: 'Внутренний путь', icon: '☯️' },
};

const wikiSections = new Set(Object.keys(pageTitles));

export default function ContentPage({ pageId, onBack }: ContentPageProps) {
  const info = pageTitles[pageId];
  const { ensureWikiLoaded } = useAuth();

  useEffect(() => {
    void ensureWikiLoaded();
  }, [ensureWikiLoaded]);

  return (
    <div className="min-h-screen bg-ink-900 text-ink-100 pt-16 md:pt-20">
      <div className="bg-ink-800/60 border-b border-ink-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 cursor-pointer transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          {info && (
            <div className="flex items-center gap-2">
              <span className="text-xl">{info.icon}</span>
              <h1 className="font-serif text-lg font-bold text-white">{info.title}</h1>
            </div>
          )}
        </div>
      </div>

      {wikiSections.has(pageId) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <WikiEditorBar sectionId={pageId} />
        </div>
      )}

      {pageId === 'weapons' && <WeaponsSection />}
      {pageId === 'builds' && <BuildsSection />}
      {pageId === 'sects' && <SectsSection />}
      {pageId === 'bosses' && <BossesSection />}
      {pageId === 'mystic' && <MysticArtsSection />}
      {pageId === 'cooking' && <CookingSection />}
      {pageId === 'tips' && <TipsSection />}
      {pageId === 'lifeskills' && <LifeSkillsSection />}
      {pageId === 'npcs' && <NpcSection />}
      {pageId === 'riddles' && <RiddlesSection />}
      {pageId === 'innerpath' && <InnerPathSection />}
    </div>
  );
}

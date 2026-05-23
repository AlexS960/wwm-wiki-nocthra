import { ArrowLeft } from 'lucide-react';
import WeaponsSection from './WeaponsSection';
import BuildsSection from './BuildsSection';
import SectsSection from './SectsSection';
import BossesSection from './BossesSection';
import MysticArtsSection from './MysticArtsSection';
import InteractiveMap from './InteractiveMap';
import CookingSection from './CookingSection';
import TipsSection from './TipsSection';
import LifeSkillsSection from './LifeSkillsSection';
import WikiEditor from './WikiEditor';

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
  map: { title: 'Карта Мира', icon: '🗺️' },
  cooking: { title: 'Готовка', icon: '🍳' },
  tips: { title: 'Советы и Коды', icon: '💡' },
  lifeskills: { title: 'Жизненные Навыки', icon: '🎨' },
};

export default function ContentPage({ pageId, onBack }: ContentPageProps) {
  const info = pageTitles[pageId];

  return (
    <div className="min-h-screen bg-ink-900 text-ink-100 pt-16 md:pt-20">
      {/* Back bar */}
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

      {/* Static content */}
      {pageId === 'weapons' && <><WikiEditor sectionId="weapons" /><WeaponsSection /></>}
      {pageId === 'builds' && <><WikiEditor sectionId="builds" /><BuildsSection /></>}
      {pageId === 'sects' && <><WikiEditor sectionId="sects" /><SectsSection /></>}
      {pageId === 'bosses' && <><WikiEditor sectionId="bosses" /><BossesSection /></>}
      {pageId === 'mystic' && <><WikiEditor sectionId="mystic" /><MysticArtsSection /></>}
      {pageId === 'map' && <><WikiEditor sectionId="map" /><InteractiveMap /></>}
      {pageId === 'cooking' && <><WikiEditor sectionId="cooking" /><CookingSection /></>}
      {pageId === 'tips' && <><WikiEditor sectionId="tips" /><TipsSection /></>}
      {pageId === 'lifeskills' && <><WikiEditor sectionId="lifeskills" /><LifeSkillsSection /></>}
    </div>
  );
}

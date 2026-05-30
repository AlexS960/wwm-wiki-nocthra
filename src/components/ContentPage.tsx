import { useEffect, type ComponentType } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getSectionMeta, isContentSection } from '../data/sections';
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

const SECTION_COMPONENTS: Record<string, ComponentType> = {
  weapons: WeaponsSection,
  builds: BuildsSection,
  sects: SectsSection,
  bosses: BossesSection,
  mystic: MysticArtsSection,
  cooking: CookingSection,
  tips: TipsSection,
  lifeskills: LifeSkillsSection,
  npcs: NpcSection,
  riddles: RiddlesSection,
  innerpath: InnerPathSection,
};

export default function ContentPage({ pageId, onBack }: ContentPageProps) {
  const info = getSectionMeta(pageId);
  const { ensureWikiLoaded } = useAuth();
  const SectionComponent = SECTION_COMPONENTS[pageId];

  useEffect(() => {
    void ensureWikiLoaded();
  }, [ensureWikiLoaded]);

  if (!isContentSection(pageId) || !SectionComponent) {
    return null;
  }

  return (
    <div className="min-h-screen text-ink-100 pt-16 md:pt-20">
      <div className="bg-ink-800/60 border-b border-ink-700/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 cursor-pointer transition-colors"
          >
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <WikiEditorBar sectionId={pageId} />
      </div>

      <SectionComponent />
    </div>
  );
}

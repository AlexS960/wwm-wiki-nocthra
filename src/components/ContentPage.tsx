import { Suspense, useEffect, type ComponentType } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useAuthState, useAuthActions } from '../context/AuthContext';
import {
  getCustomSectionById,
  getSectionMetaResolved,
  isContentSectionResolved,
  isCustomSection,
} from '../lib/sectionRegistry';
import GenericSection from './GenericSection';
import WikiEditorBar from './wiki/WikiEditorBar';
import { WikiFocusProvider } from '../context/WikiFocusContext';
import { lazyWithRetry } from '../lib/lazyWithRetry';

interface ContentPageProps {
  pageId: string;
  onBack: () => void;
  focusWikiId?: string | null;
  onWikiFocused?: () => void;
}

const SECTION_COMPONENTS: Record<string, ComponentType> = {
  weapons: lazyWithRetry(() => import('./WeaponsSection')),
  builds: lazyWithRetry(() => import('./BuildsSection')),
  sects: lazyWithRetry(() => import('./SectsSection')),
  bosses: lazyWithRetry(() => import('./BossesSection')),
  mystic: lazyWithRetry(() => import('./MysticArtsSection')),
  cooking: lazyWithRetry(() => import('./CookingSection')),
  tips: lazyWithRetry(() => import('./TipsSection')),
  lifeskills: lazyWithRetry(() => import('./LifeSkillsSection')),
  npcs: lazyWithRetry(() => import('./NpcSection')),
  riddles: lazyWithRetry(() => import('./RiddlesSection')),
  innerpath: lazyWithRetry(() => import('./InnerPathSection')),
};

function SectionLoader() {
  return (
    <div className="py-16 flex items-center justify-center text-ink-400 text-sm">
      Загрузка раздела…
    </div>
  );
}

export default function ContentPage({ pageId, onBack, focusWikiId, onWikiFocused }: ContentPageProps) {
  const { siteSettings } = useAuthState();
  const { ensureWikiLoaded } = useAuthActions();
  const info = getSectionMetaResolved(pageId, siteSettings);
  const customDef = getCustomSectionById(pageId, siteSettings);
  const SectionComponent = SECTION_COMPONENTS[pageId];
  const isCustom = isCustomSection(pageId, siteSettings);

  useEffect(() => {
    void ensureWikiLoaded();
  }, [ensureWikiLoaded]);

  if (!isContentSectionResolved(pageId, siteSettings)) {
    return null;
  }

  return (
    <WikiFocusProvider focusId={focusWikiId ?? null} onFocused={onWikiFocused}>
    <div className="cv-auto min-h-screen text-ink-100 pt-16 md:pt-20 notranslate">
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

      {!isCustom && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <WikiEditorBar sectionId={pageId} />
        </div>
      )}

      {SectionComponent ? (
        <Suspense fallback={<SectionLoader />}>
          <SectionComponent />
        </Suspense>
      ) : customDef ? (
        <GenericSection definition={customDef} />
      ) : null}
    </div>
    </WikiFocusProvider>
  );
}

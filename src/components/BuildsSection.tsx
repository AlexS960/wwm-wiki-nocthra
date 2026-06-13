import { useEffect, useState } from 'react';
import { Zap, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { findBuildCardElement, resolveBuildName } from '../lib/buildLookup';
import WikiArticleCards from './wiki/WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './wiki/sectionLayout';
import SectionHeader from './ui/SectionHeader';

interface BuildsSectionProps {
  focusBuildId?: string | null;
  onBuildFocused?: () => void;
}

export default function BuildsSection({ focusBuildId, onBuildFocused }: BuildsSectionProps = {}) {
  const { user, progress, setSelectedBuild, wikiArticles } = useAuth();
  const selectedBuildName = progress.selectedBuild
    ? resolveBuildName(progress.selectedBuild, wikiArticles)
    : null;

  useEffect(() => {
    if (!focusBuildId) return;
    const timer = window.setTimeout(() => {
      const el = findBuildCardElement(focusBuildId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        onBuildFocused?.();
      }
    }, 150);
    return () => window.clearTimeout(timer);
  }, [focusBuildId, onBuildFocused]);

  return (
    <section id="builds" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="builds"
          icon="🛤️"
          title="Пути Развития (Build Paths)"
          subtitle="6 уникальных путей боя — от ближнего DPS до целителя. Выберите свой стиль"
        />
        {user && selectedBuildName && (
          <p className="text-gold-400 text-sm text-center -mt-8 mb-8">
            <Star className="w-4 h-4 inline-block mr-1 fill-current" />
            Мой билд: {selectedBuildName}
          </p>
        )}

        <div className={SECTION_ITEMS_LIST_CLASS}>
          <WikiArticleCards
            sectionId="builds"
            highlightId={focusBuildId}
            {...(user ? {
              isFavorite: (id: string) => progress.selectedBuild === id,
              onToggleFavorite: (id: string) => setSelectedBuild(progress.selectedBuild === id ? null : id),
              favoriteAddTitle: 'Выбрать как мой билд',
              favoriteRemoveTitle: 'Убрать выбор',
            } : {})}
          />
        </div>

        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 bg-ink-800/50 border border-ink-700/30 rounded-full px-5 py-3 text-sm text-ink-300">
            <Zap className="w-4 h-4 text-gold-400" />
            <span>
              {user
                ? 'Нажмите ⭐ чтобы выбрать свой билд, или раскройте карточку для деталей'
                : 'Нажмите на карточку для просмотра деталей каждого билда'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

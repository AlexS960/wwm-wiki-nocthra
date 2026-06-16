import { useMemo } from 'react';
import { useAuthState, useAuthActions } from '../context/AuthContext';
import { resolveBuildName } from '../lib/buildLookup';
import { Zap, Star } from 'lucide-react';
import SectionHeader from './ui/SectionHeader';
import SectionWikiBody from './wiki/SectionWikiBody';

export default function BuildsSection() {
  const { user, progress, wikiArticles } = useAuthState();
  const { toggleSelectedBuild } = useAuthActions();
  const selectedBuildName = progress.selectedBuild
    ? (resolveBuildName(progress.selectedBuild, wikiArticles) ?? 'Выбранный билд')
    : null;

  const wikiCardsProps = useMemo(
    () => (user ? {
      isFavorite: (id: string) => progress.selectedBuild === id,
      onToggleFavorite: toggleSelectedBuild,
      favoriteAddTitle: 'Выбрать как мой билд',
      favoriteRemoveTitle: 'Убрать выбор',
    } : undefined),
    [user, progress.selectedBuild, toggleSelectedBuild],
  );

  return (
    <section id="builds" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="builds"
          icon="🛤️"
          title="Пути Развития (Build Paths)"
          subtitle="6 уникальных путей боя — от ближнего DPS до целителя. Выберите свой стиль"
        />
        {user && progress.selectedBuild && selectedBuildName && (
          <p className="text-gold-400 text-sm text-center -mt-8 mb-8">
            <Star className="w-4 h-4 inline-block mr-1 fill-current" />
            Мой билд: {selectedBuildName}
          </p>
        )}

        <SectionWikiBody
          sectionId="builds"
          {...(wikiCardsProps ? { wikiCardsProps } : {})}
          afterCards={(
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
          )}
        />
      </div>
    </section>
  );
}

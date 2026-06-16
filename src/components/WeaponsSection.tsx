import { useAuthState, useAuthActions } from '../context/AuthContext';
import SectionHeader from './ui/SectionHeader';
import SectionWikiBody from './wiki/SectionWikiBody';

export default function WeaponsSection() {
  const { user, progress } = useAuthState();
  const { toggleFavoriteWeapon } = useAuthActions();

  return (
    <section id="weapons" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="weapons"
          icon="⚔️"
          title="Оружие"
          subtitle="Каталог оружия с характеристиками, навыками и способами получения"
        />
        <SectionWikiBody
          sectionId="weapons"
          {...(user ? {
            wikiCardsProps: {
              isFavorite: (id: string) => progress.favoriteWeapons.includes(id),
              onToggleFavorite: toggleFavoriteWeapon,
            },
          } : {})}
        />
      </div>
    </section>
  );
}

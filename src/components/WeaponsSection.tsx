import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSectionWikiArticles } from '../hooks/useSectionWikiArticles';
import WikiArticleCards from './wiki/WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './wiki/sectionLayout';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';

export default function WeaponsSection() {
  const [filterType, setFilterType] = useState<string>('all');
  const { progress, toggleFavoriteWeapon } = useAuth();
  const { filterItems } = useSectionWikiArticles('weapons');

  return (
    <section id="weapons" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="weapons"
          icon="⚔️"
          title="Оружие"
          subtitle="Каталог оружия с характеристиками, навыками и способами получения"
        />
        <SectionFilterBar
          sectionKey="weapons"
          items={filterItems}
          getCategoryId={x => x.categoryId}
          active={filterType}
          onChange={setFilterType}
        />
        <div className={SECTION_ITEMS_LIST_CLASS}>
          <WikiArticleCards
            sectionId="weapons"
            categoryFilter={filterType}
            isFavorite={id => progress.favoriteWeapons.includes(id)}
            onToggleFavorite={toggleFavoriteWeapon}
          />
        </div>
      </div>
    </section>
  );
}

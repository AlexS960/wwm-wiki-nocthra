import { useState } from 'react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './wiki/sectionLayout';
import { useSectionWikiArticles } from '../hooks/useSectionWikiArticles';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';

export default function BossesSection() {
  const [filterType, setFilterType] = useState<string>('all');
  const { filterItems } = useSectionWikiArticles('bosses');

  return (
    <section id="bosses" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="bosses"
          icon="👹"
          title="Боссы и Стратегии"
          subtitle="Полное руководство по всем боссам: локации, стратегии, награды и советы"
        />
        <SectionFilterBar
          sectionKey="bosses"
          items={filterItems}
          getCategoryId={b => b.categoryId}
          active={filterType}
          onChange={setFilterType}
        />
        <div className={SECTION_ITEMS_LIST_CLASS}>
          <WikiArticleCards sectionId="bosses" categoryFilter={filterType} />
        </div>
      </div>
    </section>
  );
}

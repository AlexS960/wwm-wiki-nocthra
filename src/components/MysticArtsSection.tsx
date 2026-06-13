import { useState } from 'react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './wiki/sectionLayout';
import { useSectionWikiArticles } from '../hooks/useSectionWikiArticles';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';

export default function MysticArtsSection() {
  const [filterElement, setFilterElement] = useState<string>('all');
  const { filterItems } = useSectionWikiArticles('mystic');

  return (
    <section id="mystic" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="mystic"
          icon="✨"
          title="Мистические Арты"
          subtitle="Мощные способности, открываемые через квесты, боссов и секты"
        />
        <SectionFilterBar
          sectionKey="mystic"
          items={filterItems}
          getCategoryId={m => m.categoryId}
          active={filterElement}
          onChange={setFilterElement}
        />
        <div className={SECTION_ITEMS_LIST_CLASS}>
          <WikiArticleCards sectionId="mystic" categoryFilter={filterElement} />
        </div>
      </div>
    </section>
  );
}

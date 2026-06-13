import { useState, type ReactNode } from 'react';
import WikiArticleCards from './WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './sectionLayout';
import { useSectionWikiArticles } from '../../hooks/useSectionWikiArticles';
import SectionFilterBar from '../ui/SectionFilterBar';

interface SectionWikiBodyProps {
  sectionId: string;
  listTitle?: string;
  beforeFilters?: ReactNode;
  afterCards?: ReactNode;
  wikiCardsProps?: Omit<
    React.ComponentProps<typeof WikiArticleCards>,
    'sectionId' | 'categoryFilter'
  >;
}

export default function SectionWikiBody({
  sectionId,
  listTitle,
  beforeFilters,
  afterCards,
  wikiCardsProps,
}: SectionWikiBodyProps) {
  const [filter, setFilter] = useState('all');
  const { filterItems } = useSectionWikiArticles(sectionId);

  return (
    <>
      {beforeFilters}
      {listTitle && (
        <h3 className="font-serif text-lg font-bold text-white mb-4">{listTitle}</h3>
      )}
      <SectionFilterBar
        sectionKey={sectionId}
        items={filterItems}
        getCategoryId={item => item.categoryId}
        active={filter}
        onChange={setFilter}
      />
      <div className={SECTION_ITEMS_LIST_CLASS}>
        <WikiArticleCards
          sectionId={sectionId}
          categoryFilter={filter}
          {...wikiCardsProps}
        />
      </div>
      {afterCards}
    </>
  );
}

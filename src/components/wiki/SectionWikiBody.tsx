import { useState, type ReactNode } from 'react';
import WikiArticleCards from './WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './sectionLayout';
import { useSectionWikiArticles } from '../../hooks/useSectionWikiArticles';
import SectionFilterBar from '../ui/SectionFilterBar';
import { SectionCategoriesScope } from '../../context/SectionCategoriesContext';

interface SectionWikiBodyProps {
  sectionId: string;
  listTitle?: string;
  beforeFilters?: ReactNode;
  afterCards?: ReactNode;
  wikiCardsProps?: Omit<
    React.ComponentProps<typeof WikiArticleCards>,
    'sectionId' | 'categoryFilter' | 'catalog'
  >;
}

function SectionWikiBodyInner({
  sectionId,
  listTitle,
  beforeFilters,
  afterCards,
  wikiCardsProps,
}: SectionWikiBodyProps) {
  const [filter, setFilter] = useState('all');
  const catalog = useSectionWikiArticles(sectionId);

  return (
    <>
      {beforeFilters}
      {listTitle && (
        <h3 className="font-serif text-lg font-bold text-white mb-4">{listTitle}</h3>
      )}
      <SectionFilterBar
        sectionKey={sectionId}
        items={catalog.filterItems}
        getCategoryId={item => item.categoryId}
        active={filter}
        onChange={setFilter}
      />
      <div className={SECTION_ITEMS_LIST_CLASS}>
        <WikiArticleCards
          sectionId={sectionId}
          categoryFilter={filter}
          catalog={catalog}
          {...wikiCardsProps}
        />
      </div>
      {afterCards}
    </>
  );
}

export default function SectionWikiBody(props: SectionWikiBodyProps) {
  return (
    <SectionCategoriesScope sectionKey={props.sectionId}>
      <SectionWikiBodyInner {...props} />
    </SectionCategoriesScope>
  );
}

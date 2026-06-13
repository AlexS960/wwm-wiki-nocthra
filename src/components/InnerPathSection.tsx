import { BookOpen, TrendingUp } from 'lucide-react';
import {
  innerPathExplainedRu,
  innerPathIntroRu,
  innerPathUpgradeRu,
  innerPathUpgradeTipsRu,
} from '../data/innerWays';
import { SECTION_ITEMS_LIST_CLASS } from './wiki/sectionLayout';
import SectionHeader from './ui/SectionHeader';
import SectionWikiBody from './wiki/SectionWikiBody';

function InfoBlock({ title, body }: { title: string; body: string }) {
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  return (
    <div className="bg-ink-800/50 border border-ink-700/30 rounded-xl overflow-hidden">
      <div className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left border-b border-ink-700/30">
        <span className="font-serif font-bold text-white text-sm sm:text-base">{title}</span>
      </div>
      <div className="px-4 pb-4 space-y-2 pt-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-ink-300 text-sm leading-relaxed whitespace-pre-wrap">{p.replace(/^####\s+/gm, '')}</p>
        ))}
      </div>
    </div>
  );
}

export default function InnerPathSection() {
  return (
    <section id="innerpath" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="innerpath"
          icon="☯️"
          title="Внутренний путь"
          subtitle={innerPathIntroRu}
        />

        <div className="mb-8">
          <h3 className="font-serif text-lg font-bold text-gold-400 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5" /> Что такое внутренние пути
          </h3>
          <div className={SECTION_ITEMS_LIST_CLASS}>
            {innerPathExplainedRu.map((block, i) => (
              <InfoBlock key={i} title={block.title} body={block.body} />
            ))}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="font-serif text-lg font-bold text-gold-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" /> Как улучшать
          </h3>
          <div className={`${SECTION_ITEMS_LIST_CLASS} mb-4`}>
            {innerPathUpgradeRu.map((block, i) => (
              <InfoBlock key={i} title={`${i + 1}. ${block.title}`} body={block.body} />
            ))}
          </div>
          <div className={SECTION_ITEMS_LIST_CLASS}>
            {innerPathUpgradeTipsRu.map((tip, i) => (
              <div key={i} className="bg-ink-800/40 border border-gold-400/15 rounded-xl p-4">
                <h4 className="text-gold-300 text-sm font-semibold mb-1">{tip.title}</h4>
                <p className="text-ink-400 text-xs leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        <SectionWikiBody
          sectionId="innerpath"
          listTitle="Список всех внутренних путей"
        />
      </div>
    </section>
  );
}

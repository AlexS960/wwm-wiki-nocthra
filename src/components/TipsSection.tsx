import { useState } from 'react';
import { Lightbulb, Code, Copy, Check } from 'lucide-react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { SECTION_ITEMS_LIST_CLASS } from './wiki/sectionLayout';
import { useSectionWikiArticles } from '../hooks/useSectionWikiArticles';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';

interface CodeItem {
  code: string;
  reward: string;
  expiry?: string;
}

const promoCodes: CodeItem[] = [
  { code: 'WWM2025', reward: '500 премиум-валюты + эксклюзивный титул', expiry: '31 декабря 2025' },
  { code: 'NOCTHRA', reward: 'Скин оружия "Лунный Клинок"', expiry: 'Постоянно' },
  { code: 'DRAGONFIRE', reward: 'Зелье опыта x5 + золото x1000', expiry: '30 июня 2025' },
  { code: 'NEWYEAR26', reward: 'Праздничный набор: костюм + фейерверки', expiry: '15 января 2026' },
];

export default function TipsSection() {
  const [filterCat, setFilterCat] = useState<string>('all');
  const [copied, setCopied] = useState<string | null>(null);
  const { filterItems } = useSectionWikiArticles('tips');

  const copyCode = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  return (
    <section id="tips" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="tips"
          icon="💡"
          title="Советы и Коды"
          subtitle="Полезные советы от опытных игроков и актуальные промокоды"
        />

        <h3 className="font-serif text-xl font-bold text-gold-400 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5" /> Советы
        </h3>
        <SectionFilterBar
          sectionKey="tips"
          items={filterItems}
          getCategoryId={t => t.categoryId}
          active={filterCat}
          onChange={setFilterCat}
        />

        <div className={`${SECTION_ITEMS_LIST_CLASS} mb-12`}>
          <WikiArticleCards sectionId="tips" categoryFilter={filterCat} />
        </div>

        <h3 className="font-serif text-xl font-bold text-gold-400 mb-4 flex items-center gap-2">
          <Code className="w-5 h-5" /> Промокоды
        </h3>
        <div className={`${SECTION_ITEMS_LIST_CLASS} max-w-3xl`}>
          {promoCodes.map(pc => (
            <div key={pc.code} className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2 gap-3">
                <code className="text-gold-400 font-mono text-lg font-bold tracking-wider">{pc.code}</code>
                <button
                  type="button"
                  onClick={() => copyCode(pc.code)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer shrink-0"
                >
                  {copied === pc.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === pc.code ? 'Скопировано' : 'Копировать'}
                </button>
              </div>
              <p className="text-ink-200 text-sm">{pc.reward}</p>
              {pc.expiry && <p className="text-ink-500 text-xs mt-1">До: {pc.expiry}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

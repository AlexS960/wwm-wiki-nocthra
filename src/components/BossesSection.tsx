import { useState } from 'react';
import WikiArticleCards from './wiki/WikiArticleCards';
import RichText, { RichInline } from './ui/RichText';
import { bosses, type Boss } from '../data/extendedData';
import { MapPin, ChevronDown, ChevronUp, Target, Gift, Lightbulb, Edit3, Trash2 } from 'lucide-react';
import { useSectionOverrides } from '../hooks/useSectionOverrides';
import { useSectionCategories } from '../hooks/useSectionCategories';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

export default function BossesSection() {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const { items, persistItems, canManage } = useSectionOverrides('bosses', bosses);
  const { categories } = useSectionCategories('bosses');
  const bossConfig = sectionEditorConfigs.bosses;
  const editingBoss = editId ? items.find(b => b.id === editId) : null;

  const filtered = filterType === 'all' ? items : items.filter(b => b.type === filterType);

  const diffColor: Record<string, string> = {
    'Лёгкая': 'text-jade-400 bg-jade-400/10',
    'Лёгкая-Средняя': 'text-jade-400 bg-jade-400/10',
    'Средняя': 'text-gold-400 bg-gold-400/10',
    'Средняя-Высокая': 'text-orange-400 bg-orange-400/10',
    'Высокая': 'text-crimson-400 bg-crimson-400/10',
    'Очень высокая': 'text-purple-400 bg-purple-400/10',
  };

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
          items={items}
          getCategoryId={b => b.type}
          active={filterType}
          onChange={setFilterType}
        />

        {/* Bosses Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(boss => (
            <div
              key={boss.id}
              onClick={() => setSelectedBoss(selectedBoss?.id === boss.id ? null : boss)}
              className={`relative bg-ink-800/60 border rounded-xl p-4 transition-all cursor-pointer ${
                selectedBoss?.id === boss.id
                  ? 'border-gold-400/40 bg-gold-400/5'
                  : 'border-ink-700/30 hover:border-gold-700/30 card-hover'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl shrink-0 leading-none">{boss.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-white">{boss.name}</h3>
                      <p className="text-ink-400 text-xs mt-0.5">{boss.nameEn}</p>
                    </div>
                    {selectedBoss?.id === boss.id ? (
                      <ChevronUp className={`w-5 h-5 text-gold-400 shrink-0 ${canManage ? 'mr-14' : ''}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 text-ink-400 shrink-0 ${canManage ? 'mr-14' : ''}`} />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${diffColor[boss.difficulty] || ''}`}>
                      {boss.difficulty}
                    </span>
                    <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">
                      Ур. {boss.level}
                    </span>
                    <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full">
                      {boss.type === 'campaign' ? '📖 Сюжет' : '🌍 Мировой'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-ink-400 text-xs mt-1.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{boss.region} — {boss.location}</span>
                  </div>
                </div>
              </div>
              {canManage && (
                <div className="absolute top-3 right-3 flex items-center gap-1 z-10" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setEditId(boss.id)} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm('Удалить карточку босса?')) return;
                      persistItems(items.filter(x => x.id !== boss.id));
                      if (selectedBoss?.id === boss.id) setSelectedBoss(null);
                    }}
                    className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Expanded Content */}
              {selectedBoss?.id === boss.id && (
                <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-4 animate-fadeIn">
                  {/* Strategy */}
                  <div>
                    <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1">
                      <Target className="w-4 h-4" /> Стратегия
                    </h4>
                    <ul className="space-y-1.5">
                      {boss.strategy.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-ink-200">
                          <span className="text-gold-400 mt-0.5">•</span>
                          <RichInline content={s} />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Rewards */}
                  <div>
                    <h4 className="text-jade-400 font-semibold text-sm mb-2 flex items-center gap-1">
                      <Gift className="w-4 h-4" /> Награды
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {boss.rewards.map((r, i) => (
                        <span key={i} className="text-xs bg-jade-400/10 text-jade-400 px-2 py-0.5 rounded-full">
                          <RichInline content={r} />
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-gold-400/5 border border-gold-400/20 rounded-lg p-3">
                    <h4 className="text-gold-400 font-semibold text-sm mb-2 flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" /> Советы
                    </h4>
                    <ul className="space-y-1">
                      {boss.tips.map((t, i) => (
                        <li key={i} className="text-sm text-ink-200">★ <RichInline content={t} /></li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
          <WikiArticleCards sectionId="bosses" categoryFilter={filterType} />
        </div>
      </div>
      {editingBoss && bossConfig && (
        <SectionEditorModal
          config={bossConfig}
          storageFolder="bosses"
          categoryOptions={categories}
          isEdit
          initial={{
            title: editingBoss.name,
            summary: `${editingBoss.region} — ${editingBoss.location}`,
            category: editingBoss.type === 'campaign' ? 'Мировой' : 'Подземелье',
            icon: editingBoss.icon,
            content: [
              '## Сложность',
              editingBoss.difficulty,
              '',
              '## Уровень',
              String(editingBoss.level),
              '',
              '## Стратегия',
              ...editingBoss.strategy.map(x => `- ${x}`),
              '',
              '## Награды',
              ...editingBoss.rewards.map(x => `- ${x}`),
              '',
              '## Советы',
              ...editingBoss.tips.map(x => `- ${x}`),
            ].join('\n'),
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const lines = values.content.split('\n').map(l => l.trim());
            const getLine = (header: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
              return idx >= 0 ? (lines[idx + 1] || '') : '';
            };
            const getList = (header: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
              if (idx < 0) return [];
              const out: string[] = [];
              for (let i = idx + 1; i < lines.length; i++) {
                const line = lines[i];
                if (!line) continue;
                if (line.startsWith('## ')) break;
                if (line.startsWith('- ')) out.push(line.slice(2).trim());
              }
              return out;
            };
            persistItems(items.map(b => (
              b.id === editingBoss.id
                ? {
                    ...b,
                    name: values.title,
                    icon: values.icon || b.icon,
                    difficulty: getLine('## Сложность') || b.difficulty,
                    level: Number(getLine('## Уровень')) || b.level,
                    strategy: getList('## Стратегия').length ? getList('## Стратегия') : b.strategy,
                    rewards: getList('## Награды').length ? getList('## Награды') : b.rewards,
                    tips: getList('## Советы').length ? getList('## Советы') : b.tips,
                  }
                : b
            )));
            setEditId(null);
          }}
          onCancel={() => setEditId(null)}
        />
      )}
    </section>
  );
}

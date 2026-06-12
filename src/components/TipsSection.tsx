import { useState } from 'react';
import { Lightbulb, Code, Copy, Check, Edit3, Trash2 } from 'lucide-react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { useSectionOverrides } from '../hooks/useSectionOverrides';
import { useSectionCategories } from '../hooks/useSectionCategories';
import SectionHeader from './ui/SectionHeader';
import SectionFilterBar from './ui/SectionFilterBar';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

interface Tip {
  id: string;
  category: 'beginner' | 'combat' | 'economy' | 'secrets';
  text: string;
}

interface CodeItem {
  code: string;
  reward: string;
  expiry?: string;
}

const tips: Tip[] = [
  { id: 't-1', category: 'beginner', text: 'Всегда собирайте всё на своём пути. Даже обычные травы могут пригодиться в готовке.' },
  { id: 't-2', category: 'beginner', text: 'Не тратьте ресурсы на улучшение низкоуровневого оружия. Сохраните их для легендарных предметов.' },
  { id: 't-3', category: 'beginner', text: 'Вступайте в гильдию как можно раньше — бонусы к опыту и доступ к гильдейским квестам.' },
  { id: 't-4', category: 'combat', text: 'Уклонение даёт i-frames (неуязвимость). Используйте это для избежания смертельных атак.' },
  { id: 't-5', category: 'combat', text: 'Комбо-система: 3 лёгкие атаки + 1 тяжёлая = мощный финишер с доп. уроном.' },
  { id: 't-6', category: 'combat', text: 'Каждый босс имеет "окно уязвимости" после определённых атак. Изучайте паттерны.' },
  { id: 't-7', category: 'economy', text: 'Рыбалка — один из самых прибыльных способов заработка на ранних этапах.' },
  { id: 't-8', category: 'economy', text: 'Не продавайте редкие материалы. Они понадобятся для крафта эндгейм-экипировки.' },
  { id: 't-9', category: 'secrets', text: 'В игре есть скрытые пещеры за водопадами. Ищите их — там часто сундуки с ценными наградами.' },
  { id: 't-10', category: 'secrets', text: 'Некоторые NPC дают секретные квесты, если поговорить с ними в определённое время суток.' },
];

const promoCodes: CodeItem[] = [
  { code: 'WWM2025', reward: '500 премиум-валюты + эксклюзивный титул', expiry: '31 декабря 2025' },
  { code: 'NOCTHRA', reward: 'Скин оружия "Лунный Клинок"', expiry: 'Постоянно' },
  { code: 'DRAGONFIRE', reward: 'Зелье опыта x5 + золото x1000', expiry: '30 июня 2025' },
  { code: 'NEWYEAR26', reward: 'Праздничный набор: костюм + фейерверки', expiry: '15 января 2026' },
];

const categoryLabels: Record<string, { label: string; icon: string }> = {
  beginner: { label: 'Новичкам', icon: '🌱' },
  combat: { label: 'Бой', icon: '⚔️' },
  economy: { label: 'Экономика', icon: '💎' },
  secrets: { label: 'Секреты', icon: '🔮' },
};

export default function TipsSection() {
  const [filterCat, setFilterCat] = useState<string>('all');
  const [copied, setCopied] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const { items: tipItems, persistItems, canManage } = useSectionOverrides('tips', tips);
  const { categories, resolveCategory } = useSectionCategories('tips');
  const tipsConfig = sectionEditorConfigs.tips;
  const editingTip = editId ? tipItems.find(t => t.id === editId) : null;

  const filteredTips = filterCat === 'all' ? tipItems : tipItems.filter(t => t.category === filterCat);

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

        {/* Tips Section */}
        <h3 className="font-serif text-xl font-bold text-gold-400 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Советы</h3>
        <SectionFilterBar
          sectionKey="tips"
          items={tipItems}
          getCategoryId={t => t.category}
          active={filterCat}
          onChange={setFilterCat}
        />

        <div className="grid md:grid-cols-2 gap-3 mb-12">
          {filteredTips.map(tip => (
            <div key={tip.id} className="relative bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 flex items-start gap-3">
              <span className="text-lg shrink-0">{resolveCategory(tip.category).icon || categoryLabels[tip.category]?.icon || '💡'}</span>
              <p className="text-ink-200 text-sm flex-1">{tip.text}</p>
              {canManage && (
                <div className="absolute top-2 right-2 flex items-center gap-1 shrink-0">
                  <button onClick={() => setEditId(tip.id)} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm('Удалить совет?')) return;
                      persistItems(tipItems.filter(x => x.id !== tip.id));
                    }}
                    className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
          <WikiArticleCards sectionId="tips" />
        </div>

        {/* Promo Codes */}
        <h3 className="font-serif text-xl font-bold text-gold-400 mb-4 flex items-center gap-2"><Code className="w-5 h-5" /> Промокоды</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {promoCodes.map(pc => (
            <div key={pc.code} className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <code className="text-gold-400 font-mono text-lg font-bold tracking-wider">{pc.code}</code>
                <button onClick={() => copyCode(pc.code)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${copied === pc.code ? 'text-jade-400 bg-jade-400/10' : 'text-ink-500 hover:text-gold-400 hover:bg-gold-400/10'}`}>
                  {copied === pc.code ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-ink-300 text-sm mb-1">{pc.reward}</p>
              {pc.expiry && <p className="text-ink-500 text-[10px]">Действует до: {pc.expiry}</p>}
            </div>
          ))}
        </div>
      </div>
      {editingTip && tipsConfig && (
        <SectionEditorModal
          config={tipsConfig}
          storageFolder="tips"
          categoryOptions={categories}
          isEdit
          initial={{
            title: resolveCategory(editingTip.category).label,
            summary: editingTip.text,
            category: editingTip.category,
            icon: resolveCategory(editingTip.category).icon || '💡',
            content: `## Совет\n${editingTip.text}`,
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const txt = values.summary || values.content.replace(/^##\s*Совет/i, '').trim();
            persistItems(tipItems.map(t => (
              t.id === editingTip.id ? { ...t, text: txt || t.text } : t
            )));
            setEditId(null);
          }}
          onCancel={() => setEditId(null)}
        />
      )}
    </section>
  );
}

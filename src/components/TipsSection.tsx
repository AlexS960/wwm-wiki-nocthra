import { useMemo, useState } from 'react';
import { Lightbulb, Code, Copy, Check, Edit3, Trash2 } from 'lucide-react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { useAuth } from '../context/AuthContext';
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
  const { isEditor, isAdmin, siteSettings, updateSiteSettings } = useAuth();
  const canManage = isEditor() || isAdmin();
  const sectionOverrides = siteSettings.sectionOverrides || {};
  const tipItems = useMemo(() => (
    Array.isArray(sectionOverrides.tips) ? (sectionOverrides.tips as typeof tips) : tips
  ), [sectionOverrides]);
  const persistItems = (next: typeof tips) => {
    updateSiteSettings({ sectionOverrides: { ...sectionOverrides, tips: next } });
  };
  const tipsConfig = sectionEditorConfigs.tips;
  const editingTip = editId ? tipItems.find(t => t.id === editId) : null;

  const filteredTips = filterCat === 'all' ? tipItems : tipItems.filter(t => t.category === filterCat);

  const copyCode = async (code: string) => {
    try { await navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 2000); } catch {}
  };

  return (
    <section id="tips" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">💡</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Советы и Коды</h2>
          <p className="text-ink-300 max-w-xl mx-auto">Полезные советы от опытных игроков и актуальные промокоды</p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {/* Tips Section */}
        <h3 className="font-serif text-xl font-bold text-gold-400 mb-4 flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Советы</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...Object.keys(categoryLabels)].map(cat => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                filterCat === cat ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
              }`}>
                {cat === 'all' ? 'Все' : categoryLabels[cat].icon + ' ' + categoryLabels[cat].label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-3 mb-12">
          {filteredTips.map(tip => (
            <div key={tip.id} className="relative bg-ink-800/50 border border-ink-700/30 rounded-xl p-4 flex items-start gap-3">
              <span className="text-lg shrink-0">{categoryLabels[tip.category].icon}</span>
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
          isEdit
          initial={{
            title: `${categoryLabels[editingTip.category].label}`,
            summary: editingTip.text,
            category: categoryLabels[editingTip.category].label,
            icon: categoryLabels[editingTip.category].icon,
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

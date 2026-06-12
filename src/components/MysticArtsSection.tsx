import { useState } from 'react';
import WikiArticleCards from './wiki/WikiArticleCards';
import { Sparkles, Zap, Shield, Heart, Wind, Edit3, Trash2 } from 'lucide-react';
import { useSectionOverrides } from '../hooks/useSectionOverrides';
import SectionHeader from './ui/SectionHeader';
import FilterPills from './ui/FilterPills';
import SectionEditorModal, { type SectionEditorValues } from './ui/SectionEditorModal';
import { sectionEditorConfigs } from '../data/sectionEditorConfig';

interface MysticArt {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  element: string;
  type: 'attack' | 'defense' | 'support' | 'movement';
  description: string;
  effect: string;
  cooldown: string;
  howToGet: string;
}

const mysticArts: MysticArt[] = [
  { id: 'ma-1', name: 'Небесный Гром', nameEn: 'Heavenly Thunder', icon: '⚡', element: 'Молния', type: 'attack', description: 'Призывает молнию с небес, поражающую всех врагов в радиусе.', effect: 'Урон 500% от силы атаки', cooldown: '60 сек', howToGet: 'Квест "Грозовое Небо"' },
  { id: 'ma-2', name: 'Щит Дракона', nameEn: 'Dragon Shield', icon: '🛡️', element: 'Земля', type: 'defense', description: 'Создаёт непробиваемый щит, поглощающий урон.', effect: 'Поглощает 3000 урона', cooldown: '90 сек', howToGet: 'Секта Нефритового Лотоса — ранг 3' },
  { id: 'ma-3', name: 'Дыхание Феникса', nameEn: 'Phoenix Breath', icon: '🔥', element: 'Огонь', type: 'support', description: 'Исцеляет союзников пламенем феникса.', effect: 'Восстанавливает 40% HP группы', cooldown: '120 сек', howToGet: 'Мировой босс "Феникс"' },
  { id: 'ma-4', name: 'Теневой Прыжок', nameEn: 'Shadow Leap', icon: '🌑', element: 'Тьма', type: 'movement', description: 'Мгновенное перемещение в указанную точку.', effect: 'Телепортация на 20 метров', cooldown: '15 сек', howToGet: 'Павильон Теней — начальный навык' },
  { id: 'ma-5', name: 'Вихрь Ветра', nameEn: 'Wind Vortex', icon: '🌀', element: 'Ветер', type: 'attack', description: 'Создаёт вихрь, затягивающий и повреждающий врагов.', effect: 'Урон 300% + контроль', cooldown: '45 сек', howToGet: 'Храм Ветров — сундук босса' },
  { id: 'ma-6', name: 'Благословение Лотоса', nameEn: 'Lotus Blessing', icon: '🪷', element: 'Вода', type: 'support', description: 'Накладывает регенерацию и увеличивает защиту.', effect: '+30% защиты, реген 5% HP/сек', cooldown: '75 сек', howToGet: 'Квест "Цветок Лотоса"' },
];

const elementColors: Record<string, string> = {
  'Молния': 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
  'Земля': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  'Огонь': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  'Тьма': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
  'Ветер': 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
  'Вода': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
};

const typeIcons: Record<string, React.ReactNode> = {
  attack: <Zap className="w-3 h-3" />,
  defense: <Shield className="w-3 h-3" />,
  support: <Heart className="w-3 h-3" />,
  movement: <Wind className="w-3 h-3" />,
};

export default function MysticArtsSection() {
  const [filterElement, setFilterElement] = useState<string>('all');
  const [editId, setEditId] = useState<string | null>(null);
  const { items, persistItems, canManage } = useSectionOverrides('mystic', mysticArts);
  const mysticConfig = sectionEditorConfigs.mystic;
  const editingItem = editId ? items.find(m => m.id === editId) : null;

  const elements = ['all', ...new Set(items.map(m => m.element))];
  const filtered = filterElement === 'all' ? items : items.filter(m => m.element === filterElement);
  const filterOptions = elements.map(el => ({ value: el, label: el === 'all' ? 'Все' : el }));

  return (
    <section id="mystic" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          sectionId="mystic"
          icon="✨"
          title="Мистические Арты"
          subtitle="Мощные способности, открываемые через квесты, боссов и секты"
        />
        <FilterPills options={filterOptions} active={filterElement} onChange={setFilterElement} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(art => (
            <div key={art.id} className="relative bg-ink-800/60 border border-ink-700/30 rounded-xl p-5 card-hover transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{art.icon}</span>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-white">{art.name}</h3>
                  <p className="text-ink-400 text-xs">{art.nameEn}</p>
                </div>
              </div>
              {canManage && (
                <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                  <button onClick={() => setEditId(art.id)} className="p-1.5 rounded-md text-gold-300 border border-gold-400/30 hover:bg-gold-400/10 cursor-pointer" title="Редактировать">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm('Удалить мистический арт?')) return;
                      persistItems(items.filter(x => x.id !== art.id));
                    }}
                    className="p-1.5 rounded-md text-crimson-300 border border-crimson-400/30 hover:bg-crimson-400/10 cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${elementColors[art.element] || ''}`}>
                  {art.element}
                </span>
                <span className="text-xs bg-ink-700/50 text-ink-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {typeIcons[art.type]} {art.type === 'attack' ? 'Атака' : art.type === 'defense' ? 'Защита' : art.type === 'support' ? 'Поддержка' : 'Движение'}
                </span>
              </div>

              <p className="text-ink-300 text-sm mb-3">{art.description}</p>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-gold-400" /><span className="text-gold-400">{art.effect}</span></div>
                <div className="flex items-center gap-2"><span className="text-ink-500">Перезарядка:</span><span className="text-ink-300">{art.cooldown}</span></div>
                <div className="flex items-center gap-2"><span className="text-ink-500">Получение:</span><span className="text-ink-300">{art.howToGet}</span></div>
              </div>
            </div>
          ))}
          <WikiArticleCards sectionId="mystic" />
        </div>
      </div>
      {editingItem && mysticConfig && (
        <SectionEditorModal
          config={mysticConfig}
          storageFolder="mystic"
          isEdit
          initial={{
            title: editingItem.name,
            summary: editingItem.description,
            category: editingItem.type,
            icon: editingItem.icon,
            content: ['## Эффект', editingItem.effect, '', '## Перезарядка', editingItem.cooldown, '', '## Как получить', editingItem.howToGet].join('\n'),
            images: [],
          }}
          onSave={(values: SectionEditorValues) => {
            const lines = values.content.split('\n').map(l => l.trim());
            const after = (header: string) => {
              const idx = lines.findIndex(l => l.toLowerCase() === header.toLowerCase());
              return idx >= 0 ? (lines[idx + 1] || '') : '';
            };
            persistItems(items.map(m => (
              m.id === editingItem.id
                ? {
                    ...m,
                    name: values.title,
                    description: values.summary || m.description,
                    icon: values.icon || m.icon,
                    type: (values.category as MysticArt['type']) || m.type,
                    effect: after('## Эффект') || m.effect,
                    cooldown: after('## Перезарядка') || m.cooldown,
                    howToGet: after('## Как получить') || m.howToGet,
                  }
                : m
            )));
            setEditId(null);
          }}
          onCancel={() => setEditId(null)}
        />
      )}
    </section>
  );
}

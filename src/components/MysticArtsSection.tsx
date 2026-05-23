import { useState } from 'react';
import { Sparkles, Zap, Shield, Heart, Wind } from 'lucide-react';

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

  const elements = ['all', ...new Set(mysticArts.map(m => m.element))];
  const filtered = filterElement === 'all' ? mysticArts : mysticArts.filter(m => m.element === filterElement);

  return (
    <section id="mystic" className="py-20 bg-ink-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">✨</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Мистические Арты</h2>
          <p className="text-ink-300 max-w-xl mx-auto">Мощные способности, открываемые через квесты, боссов и секты</p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {elements.map(el => (
            <button key={el} onClick={() => setFilterElement(el)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filterElement === el ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
              }`}>
              {el === 'all' ? 'Все' : el}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(art => (
            <div key={art.id} className="bg-ink-800/60 border border-ink-700/30 rounded-xl p-5 card-hover transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{art.icon}</span>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-white">{art.name}</h3>
                  <p className="text-ink-400 text-xs">{art.nameEn}</p>
                </div>
              </div>

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
        </div>
      </div>
    </section>
  );
}

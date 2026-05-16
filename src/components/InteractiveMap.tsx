import { useState } from 'react';
import { ExternalLink, Maximize2, Minimize2, Map, ChevronDown, Info } from 'lucide-react';

const mapSources = [
  {
    id: 'mapgenie',
    name: 'MapGenie',
    desc: 'Все коллекционные, прогресс, фильтры',
    url: 'https://mapgenie.io/where-winds-meet/maps/world',
    embedUrl: 'https://mapgenie.io/where-winds-meet/maps/world?embed=true',
    icon: '🗺️',
  },
  {
    id: 'bgone',
    name: 'BgoneGaming',
    desc: '35+ типов, оффлайн трекинг',
    url: 'https://bgonegaming.win/wherewindmeets/',
    embedUrl: 'https://bgonegaming.win/wherewindmeets/',
    icon: '🌐',
  },
  {
    id: 'community',
    name: 'Community Map',
    desc: '8000+ локаций, скриншоты',
    url: 'https://earth-revival-interactive-map.pages.dev/wherewindmeets/',
    embedUrl: 'https://earth-revival-interactive-map.pages.dev/wherewindmeets/',
    icon: '👥',
  },
];

const categories = [
  {
    group: 'Локации',
    items: [
      { icon: '🏛️', name: 'Wayfarer (Телепорты)', nameEn: 'Wayfarer' },
      { icon: '🪨', name: 'Граничные Камни', nameEn: 'Boundary Stone' },
      { icon: '🕳️', name: 'Входы в пещеры', nameEn: 'Cave Entrance' },
      { icon: '🏇', name: 'Конюшни', nameEn: 'Horse Ranch' },
      { icon: '🏪', name: 'Магазины', nameEn: 'Shop' },
      { icon: '🐱', name: 'Храм Meow Meow', nameEn: 'Meow Meow Temple' },
      { icon: '🏠', name: 'Ориентиры', nameEn: 'Landmark' },
      { icon: '⛓️', name: 'Тюрьма', nameEn: 'Prison' },
    ],
  },
  {
    group: 'Активности',
    items: [
      { icon: '🏹', name: 'Стрельба из лука', nameEn: 'Archery Competition' },
      { icon: '🔔', name: 'Колокол Демонов', nameEn: 'Bell of Demoncalm' },
      { icon: '♟️', name: 'Шахматы / Маджонг', nameEn: 'Chess / Mahjong' },
      { icon: '🎣', name: 'Рыболовный конкурс', nameEn: 'Fishing Contest' },
      { icon: '🗣️', name: 'Gift of the Gab', nameEn: 'Gift of the Gab' },
      { icon: '🤼', name: 'Борьба', nameEn: 'Wrestling' },
      { icon: '🎯', name: 'Pitch Pot', nameEn: 'Pitch Pot' },
      { icon: '💃', name: 'Представление', nameEn: 'Performance' },
      { icon: '❓', name: 'Загадки', nameEn: 'Riddle' },
      { icon: '🎆', name: 'Фейерверки', nameEn: 'Fireworks Show' },
      { icon: '💊', name: 'Исцеление болезней', nameEn: 'Heal the Illness' },
    ],
  },
  {
    group: 'Коллекционные',
    items: [
      { icon: '📦', name: 'Сундуки', nameEn: 'Chest' },
      { icon: '🐱', name: 'Коты (Cat Play)', nameEn: 'Cat' },
      { icon: '🏺', name: 'Антиквариат', nameEn: 'Antique' },
      { icon: '🐾', name: 'Сокровища Meow Meow', nameEn: "Meow Meow's Treasure" },
      { icon: '🕳️', name: 'Скрытые пути', nameEn: 'Hidden Path' },
      { icon: '🏮', name: 'Речные Фонари', nameEn: 'River Lantern Message' },
      { icon: '📖', name: 'Записи Компендиума', nameEn: 'Compendium Entry' },
    ],
  },
  {
    group: 'Квесты',
    items: [
      { icon: '⚔️', name: 'Сюжетный квест', nameEn: 'Campaign Quest' },
      { icon: '🔎', name: 'Квест исследования', nameEn: 'Exploration Quest' },
      { icon: '📜', name: 'Потерянная глава', nameEn: 'Lost Chapter Quest' },
      { icon: '❗', name: 'Квестовая встреча', nameEn: 'Quest Encounter' },
      { icon: '📋', name: 'Доска розыска', nameEn: 'Bounty Board' },
    ],
  },
  {
    group: 'Бой',
    items: [
      { icon: '💀', name: 'Мировые боссы', nameEn: 'World Boss' },
      { icon: '🏰', name: 'Аванпосты', nameEn: 'Outpost' },
      { icon: '⚔️', name: 'Martial Fellowship', nameEn: 'Martial Fellowship' },
      { icon: '🚫', name: 'Запретная Зона', nameEn: 'Restricted Zone' },
    ],
  },
  {
    group: 'Прочее',
    items: [
      { icon: '✨', name: 'Диковинки (Oddity)', nameEn: 'Oddity' },
      { icon: '🍜', name: 'Торговец едой', nameEn: 'Food Vendor' },
      { icon: '📰', name: 'Газетчик', nameEn: 'Newsboy' },
      { icon: '👤', name: 'NPC', nameEn: 'NPC' },
      { icon: '☯️', name: 'Universal Harmony', nameEn: 'Universal Harmony' },
    ],
  },
];

export default function InteractiveMap() {
  const [activeSource, setActiveSource] = useState(mapSources[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(categories.map(c => c.group)));

  const toggleGroup = (group: string) => {
    const next = new Set(expandedGroups);
    if (next.has(group)) next.delete(group);
    else next.add(group);
    setExpandedGroups(next);
  };

  return (
    <section id="map" className="py-20 bg-ink-900/80">
      <div className={`${isFullscreen ? 'fixed inset-0 z-50 bg-ink-900 p-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>

        {/* Header — hide in fullscreen */}
        {!isFullscreen && (
          <div className="text-center mb-8">
            <div className="text-gold-400 text-3xl mb-3">🗺️</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Интерактивная Карта Мира</h2>
            <p className="text-ink-300 max-w-2xl mx-auto">
              Полная карта с тысячами отметок: боссы, сундуки, коты, квесты, мини-игры и все коллекционные предметы
            </p>
            <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
          </div>
        )}

        {/* Map Container */}
        <div className={`flex ${isFullscreen ? 'h-screen' : 'h-[75vh] rounded-xl overflow-hidden border border-gold-700/30'}`}>
          
          {/* Sidebar */}
          <div className={`bg-ink-900 border-r border-ink-700/50 flex flex-col transition-all duration-300 shrink-0 ${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          } ${isFullscreen ? '' : 'hidden lg:flex'}`}>
            
            {/* Sidebar Header */}
            <div className="p-3 border-b border-ink-700/50 shrink-0">
              <h3 className="font-serif text-sm font-bold text-gold-400 flex items-center gap-2">
                <Map className="w-4 h-4" />
                Категории карты
              </h3>
              <p className="text-ink-500 text-[10px] mt-1">Используйте фильтры на встроенной карте</p>
            </div>

            {/* Categories List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {categories.map(cat => (
                <div key={cat.group}>
                  <button
                    onClick={() => toggleGroup(cat.group)}
                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs font-semibold
                             text-gold-400/80 hover:bg-ink-800/50 transition-colors cursor-pointer"
                  >
                    <span className="uppercase tracking-wider">{cat.group}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${expandedGroups.has(cat.group) ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedGroups.has(cat.group) && (
                    <div className="space-y-0.5 mb-2">
                      {cat.items.map(item => (
                        <div
                          key={item.nameEn}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs text-ink-200 
                                   hover:bg-ink-700/40 transition-colors group"
                        >
                          <span className="text-sm">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="truncate">{item.name}</div>
                            <div className="text-[9px] text-ink-500 truncate">{item.nameEn}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Sidebar footer tip */}
            <div className="p-3 border-t border-ink-700/50 shrink-0">
              <div className="flex items-start gap-2 text-[10px] text-ink-500">
                <Info className="w-3 h-3 shrink-0 mt-0.5" />
                <span>Фильтруйте метки прямо на карте. Кликните на метку для деталей.</span>
              </div>
            </div>
          </div>

          {/* Main Map Area */}
          <div className="flex-1 flex flex-col bg-ink-800 min-w-0">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between px-3 py-2 bg-ink-900/90 border-b border-ink-700/50 shrink-0 gap-2">
              {/* Sidebar toggle for fullscreen */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1.5 rounded-lg text-ink-400 hover:text-white hover:bg-ink-700/50 transition-colors cursor-pointer lg:hidden"
                style={isFullscreen ? { display: 'flex' } : undefined}
              >
                <Map className="w-4 h-4" />
              </button>

              {/* Map Source Tabs */}
              <div className="flex items-center gap-1 flex-1 overflow-x-auto min-w-0">
                {mapSources.map(source => (
                  <button
                    key={source.id}
                    onClick={() => setActiveSource(source)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeSource.id === source.id
                        ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                        : 'text-ink-400 hover:text-ink-200 hover:bg-ink-700/30'
                    }`}
                  >
                    <span>{source.icon}</span>
                    <span>{source.name}</span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={activeSource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 transition-colors"
                  title="Открыть в новой вкладке"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Выйти из полноэкранного' : 'Полноэкранный режим'}
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="flex-1 relative">
              <iframe
                key={activeSource.id}
                src={activeSource.embedUrl}
                title={`Интерактивная карта — ${activeSource.name}`}
                className="w-full h-full border-0"
                loading="lazy"
                allow="fullscreen"
                referrerPolicy="no-referrer"
              />

              {/* Loading overlay hint */}
              <div className="absolute inset-0 flex items-center justify-center bg-ink-900/80 pointer-events-none animate-fadeIn"
                   style={{ animationDuration: '0.3s' }}
                   id={`loader-${activeSource.id}`}
                   onAnimationEnd={(e) => {
                     const el = e.currentTarget;
                     setTimeout(() => { el.style.display = 'none'; }, 2000);
                   }}
              >
                <div className="text-center">
                  <div className="text-4xl mb-3 animate-float">{activeSource.icon}</div>
                  <p className="text-gold-400 font-serif font-bold">{activeSource.name}</p>
                  <p className="text-ink-400 text-xs mt-1">{activeSource.desc}</p>
                  <p className="text-ink-500 text-[10px] mt-3">Загрузка карты...</p>
                </div>
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="flex items-center justify-between px-3 py-1.5 bg-ink-900/90 border-t border-ink-700/50 shrink-0 text-[10px] text-ink-500">
              <span>Источник: {activeSource.name} · {activeSource.desc}</span>
              <span className="hidden sm:inline">Используйте колёсико мыши для зума · Перетаскивайте для перемещения</span>
            </div>
          </div>
        </div>

        {/* Bottom Links — hide in fullscreen */}
        {!isFullscreen && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {mapSources.map(source => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-ink-800/50 border border-ink-700/30 rounded-xl p-4
                         hover:border-gold-400/30 hover:bg-ink-800/70 transition-all group"
              >
                <span className="text-2xl">{source.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm group-hover:text-gold-300 transition-colors">{source.name}</div>
                  <div className="text-ink-400 text-xs">{source.desc}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-ink-500 group-hover:text-gold-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

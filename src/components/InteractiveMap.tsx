import { useState } from 'react';
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react';

const mapSources = [
  {
    id: 'game8',
    name: 'Game8',
    desc: 'Официальная интерактивная карта Where Winds Meet',
    url: 'https://game8.co/games/Where-Winds-Meet/archives/564080',
    embedUrl: 'https://game8.co/games/Where-Winds-Meet/archives/564080',
    icon: '🗺️',
  },
];

export default function InteractiveMap() {
  const [activeSource, setActiveSource] = useState(mapSources[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <section id="map" className="py-20 bg-ink-900/80">
      <div className={isFullscreen ? 'fixed inset-0 z-50 bg-ink-900 p-0' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}>
        {!isFullscreen && (
          <div className="text-center mb-8">
            <div className="text-gold-400 text-3xl mb-3">🗺️</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Интерактивная Карта Мира</h2>
            <p className="text-ink-300 max-w-2xl mx-auto">
              Интерактивная карта мира Where Winds Meet с метками регионов, боссов, квестов, мини-игр и коллекционных предметов на основе карты Game8.
            </p>
            <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
          </div>
        )}

        <div className={`${isFullscreen ? 'h-screen' : 'h-[75vh] rounded-xl overflow-hidden border border-gold-700/30'}`}>
          <div className="flex-1 flex flex-col bg-ink-800 min-w-0">
            <div className="flex items-center justify-between px-3 py-2 bg-ink-900/90 border-b border-ink-700/50 shrink-0 gap-2">
              <div className="flex items-center gap-1 flex-1 overflow-x-auto min-w-0">
                {mapSources.map(source => (
                  <button key={source.id} onClick={() => setActiveSource(source)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeSource.id === source.id ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40' : 'text-ink-400 hover:text-ink-200 hover:bg-ink-700/30'
                    }`}>
                    <span>{source.icon}</span><span>{source.name}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a href={activeSource.url} target="_blank" rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 transition-colors" title="Открыть в новой вкладке">
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg text-ink-400 hover:text-gold-400 hover:bg-ink-700/50 transition-colors cursor-pointer"
                  title={isFullscreen ? 'Выйти из полноэкранного' : 'Полноэкранный режим'}>
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex-1 relative">
              <iframe key={activeSource.id} src={`${activeSource.embedUrl}?embed=light`}
                title={`Интерактивная карта — ${activeSource.name}`}
                className="w-full h-full border-0" loading="lazy" allow="fullscreen" referrerPolicy="no-referrer" />
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 bg-ink-900/90 border-t border-ink-700/50 shrink-0 text-[10px] text-ink-500">
              <span>Источник: {activeSource.name} · {activeSource.desc}</span>
              <span className="hidden sm:inline">Все фильтры и кнопки категорий доступны внутри карты MapGenie</span>
            </div>
          </div>
        </div>

        {!isFullscreen && (
          <div className="mt-6 grid sm:grid-cols-3 gap-3">
            {mapSources.map(source => (
              <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 bg-ink-800/50 border border-ink-700/30 rounded-xl p-4
                         hover:border-gold-400/30 hover:bg-ink-800/70 transition-all group">
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

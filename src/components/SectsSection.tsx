import { useState } from 'react';
import { sects } from '../data/gameData';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import WikiArticleCards from './wiki/WikiArticleCards';

export default function SectsSection() {
  const [expandedSect, setExpandedSect] = useState<string | null>(null);

  return (
    <section id="sects" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">🏛️</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Секты и Фракции</h2>
          <p className="text-ink-300 max-w-xl mx-auto">Игровые секты со своими уникальными способностями, оружием и стилем</p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sects.map(sect => (
            <div key={sect.id} onClick={() => setExpandedSect(expandedSect === sect.id ? null : sect.id)}
              className={`bg-ink-800/60 border rounded-xl p-5 transition-all cursor-pointer ${expandedSect === sect.id ? 'border-gold-400/40' : 'border-ink-700/30 hover:border-gold-700/30 card-hover'}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{sect.icon}</span>
                <div className="flex-1">
                  <h3 className="font-serif font-bold text-white">{sect.name}</h3>
                  <p className="text-ink-400 text-xs">{sect.nameEn}</p>
                </div>
                {expandedSect === sect.id ? <ChevronUp className="w-5 h-5 text-gold-400" /> : <ChevronDown className="w-5 h-5 text-ink-400" />}
              </div>
              <p className="text-ink-300 text-sm mb-3">{sect.description}</p>
              <div className="flex items-center gap-2 text-xs text-ink-400 mb-2">
                <span className="text-purple-400">{sect.theme}</span>
              </div>
              <div className="text-sm text-purple-400 font-medium mb-1">Оружие: {sect.weapon}</div>
              <p className="text-xs text-ink-400 mt-1">{sect.howToJoin}</p>
              {expandedSect === sect.id && (
                <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-3 animate-fadeIn">
                  <div>
                    <h4 className="text-jade-400 font-semibold text-sm mb-1 flex items-center gap-1"><Check className="w-3 h-3" /> Преимущества</h4>
                    <ul className="space-y-1">{sect.benefits.map((b, i) => <li key={i} className="text-sm text-ink-200 flex items-start gap-2"><span className="text-jade-400">•</span>{b}</li>)}</ul>
                  </div>
                  <div>
                    <h4 className="text-gold-400 font-semibold text-sm mb-1">📜 Правила</h4>
                    <ul className="space-y-1">{sect.rules.map((r, i) => <li key={i} className="text-sm text-ink-200 flex items-start gap-2"><span className="text-gold-400">•</span>{r}</li>)}</ul>
                  </div>
                </div>
              )}
            </div>
          ))}
          <WikiArticleCards sectionId="sects" />
        </div>
      </div>
    </section>
  );
}

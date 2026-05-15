import { beginnerTips, redeemCodes, pvpModes } from '../data/extendedData';
import { Copy, Check, Zap, Shield, Gift, Gamepad2 } from 'lucide-react';
import { useState } from 'react';

export default function TipsSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'tips' | 'codes' | 'pvp'>('tips');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const importanceColor: Record<string, string> = {
    critical: 'border-crimson-400/40 bg-crimson-400/5',
    important: 'border-gold-400/40 bg-gold-400/5',
    useful: 'border-ink-600/40 bg-ink-700/30',
  };

  const importanceBadge: Record<string, { text: string; color: string }> = {
    critical: { text: 'Критично', color: 'text-crimson-400 bg-crimson-400/10' },
    important: { text: 'Важно', color: 'text-gold-400 bg-gold-400/10' },
    useful: { text: 'Полезно', color: 'text-ink-300 bg-ink-700/50' },
  };

  return (
    <section id="tips" className="py-20 bg-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-gold-400 text-3xl mb-3">💡</div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">Советы, Коды и PvP</h2>
          <p className="text-ink-300 max-w-xl mx-auto">
            Важнейшие советы для новичков, актуальные промокоды и руководство по PvP
          </p>
          <div className="mt-4 h-px max-w-xs mx-auto bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-8">
          {[
            { id: 'tips', label: 'Советы', icon: Zap },
            { id: 'codes', label: 'Промокоды', icon: Gift },
            { id: 'pvp', label: 'PvP Режимы', icon: Gamepad2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/40'
                  : 'bg-ink-800/50 text-ink-300 border border-ink-700/30 hover:text-gold-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tips Tab */}
        {activeTab === 'tips' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {beginnerTips.map(tip => (
              <div
                key={tip.id}
                className={`border rounded-xl p-4 ${importanceColor[tip.importance]}`}
              >
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-2xl">{tip.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif font-bold text-white text-sm">{tip.title}</h3>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${importanceBadge[tip.importance].color}`}>
                      {importanceBadge[tip.importance].text}
                    </span>
                  </div>
                </div>
                <p className="text-ink-200 text-sm leading-relaxed">{tip.content}</p>
                <div className="mt-2 text-xs text-ink-400">{tip.category}</div>
              </div>
            ))}
          </div>
        )}

        {/* Codes Tab */}
        {activeTab === 'codes' && (
          <div className="animate-fadeIn">
            <div className="bg-ink-800/50 border border-gold-400/20 rounded-xl p-5 mb-6">
              <h3 className="font-serif text-lg font-bold text-gold-400 mb-3">Как активировать коды</h3>
              <ol className="space-y-2 text-sm text-ink-200">
                <li className="flex gap-2"><span className="text-gold-400">1.</span> Откройте меню паузы (ESC)</li>
                <li className="flex gap-2"><span className="text-gold-400">2.</span> Нажмите на иконку шестерёнки (Настройки)</li>
                <li className="flex gap-2"><span className="text-gold-400">3.</span> Перейдите на вкладку «Other»</li>
                <li className="flex gap-2"><span className="text-gold-400">4.</span> Нажмите «Exchange Code»</li>
                <li className="flex gap-2"><span className="text-gold-400">5.</span> Введите код и подтвердите</li>
              </ol>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              {redeemCodes.map(code => (
                <div
                  key={code.code}
                  className={`bg-ink-800/60 border rounded-xl p-4 ${
                    code.status === 'active' ? 'border-jade-400/30' : 
                    code.status === 'expired' ? 'border-crimson-400/30 opacity-60' : 'border-ink-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <code className="font-mono text-gold-400 font-bold text-sm">{code.code}</code>
                    <button
                      onClick={() => copyCode(code.code)}
                      className="p-1.5 rounded-lg bg-ink-700/50 hover:bg-gold-400/20 transition-colors cursor-pointer"
                    >
                      {copiedCode === code.code ? (
                        <Check className="w-4 h-4 text-jade-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-ink-400" />
                      )}
                    </button>
                  </div>
                  <p className="text-ink-200 text-sm">{code.rewards}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      code.status === 'active' ? 'bg-jade-400/10 text-jade-400' :
                      code.status === 'expired' ? 'bg-crimson-400/10 text-crimson-400' :
                      'bg-ink-700/50 text-ink-400'
                    }`}>
                      {code.status === 'active' ? '✓ Активен' : 
                       code.status === 'expired' ? '✗ Истёк' : '? Неизвестно'}
                    </span>
                    <span className="text-xs text-ink-500">{code.addedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PvP Tab */}
        {activeTab === 'pvp' && (
          <div className="grid md:grid-cols-3 gap-5 animate-fadeIn">
            {pvpModes.map(mode => (
              <div
                key={mode.id}
                className="bg-ink-800/60 border border-ink-700/30 rounded-xl p-5 card-hover"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{mode.icon}</span>
                  <div>
                    <h3 className="font-serif font-bold text-white">{mode.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-ink-400">{mode.type}</span>
                      <span className="text-xs bg-gold-400/10 text-gold-400 px-2 py-0.5 rounded-full">
                        Ур. {mode.unlockLevel}+
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-ink-200 text-sm mb-4">{mode.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-gold-400 font-semibold text-xs mb-2 flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Правила
                    </h4>
                    <ul className="space-y-1">
                      {mode.rules.slice(0, 3).map((r, i) => (
                        <li key={i} className="text-xs text-ink-300">• {r}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-jade-400/5 border border-jade-400/20 rounded-lg p-2">
                    <h4 className="text-jade-400 font-semibold text-xs mb-1">Советы</h4>
                    <ul className="space-y-0.5">
                      {mode.tips.slice(0, 2).map((t, i) => (
                        <li key={i} className="text-xs text-ink-200">★ {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

import { useState, useEffect } from 'react';
import { X, Users, Trophy, Swords, Calendar, ExternalLink, Edit3, Save, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface GuildData {
  name: string;
  subtitle: string;
  motto: string;
  description: string;
  discordUrl: string;
  info: { label: string; value: string }[];
  activities: string[];
}

const defaultGuild: GuildData = {
  name: 'NOCTHRA',
  subtitle: 'Гильдия Where Winds Meet',
  motto: '«Во тьме мы обретаем силу»',
  description: 'Nocthra — русскоязычная гильдия в Where Winds Meet, объединяющая странников Цзянху. Мы помогаем новичкам, проходим рейды, участвуем в PvP и развиваем сообщество.',
  discordUrl: 'https://discord.gg/nocthra',
  info: [
    { label: 'Сообщество', value: 'Русскоязычное' },
    { label: 'Активности', value: 'PvE, PvP, Рейды' },
    { label: 'Уровень', value: 'Все уровни' },
    { label: 'Основание', value: '2025' },
  ],
  activities: [
    'Совместное прохождение рейдов и подземелий',
    'Помощь новичкам с билдами и экипировкой',
    'PvP-турниры и дуэли между участниками',
    'Обмен знаниями, гайды и стратегии',
    'Ведение этой Базы Знаний для сообщества',
  ],
};

function loadGuild(): GuildData {
  try {
    const saved = localStorage.getItem('wwm_guild') || sessionStorage.getItem('wwm_guild');
    if (saved) return JSON.parse(saved);
  } catch {}
  return defaultGuild;
}
function saveGuild(data: GuildData) {
  const serialized = JSON.stringify(data);
  localStorage.setItem('wwm_guild', serialized);
  sessionStorage.setItem('wwm_guild', serialized);
}

const infoIcons = [
  <Users key="u" className="w-4 h-4 text-purple-400" />,
  <Swords key="s" className="w-4 h-4 text-purple-400" />,
  <Trophy key="t" className="w-4 h-4 text-purple-400" />,
  <Calendar key="c" className="w-4 h-4 text-purple-400" />,
];

// ======================== POPUP ========================
function GuildInfoPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { hasPermission } = useAuth();
  const canEditGuild = hasPermission('guild.edit');
  const [guild, setGuild] = useState<GuildData>(loadGuild);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GuildData>(guild);

  useEffect(() => { setGuild(loadGuild()); }, [isOpen]);

  const startEdit = () => { setDraft({ ...guild }); setEditing(true); };
  const cancelEdit = () => setEditing(false);
  const handleSave = () => { saveGuild(draft); setGuild(draft); setEditing(false); };

  const updateDraftInfo = (idx: number, field: 'label' | 'value', val: string) => {
    setDraft(prev => ({ ...prev, info: prev.info.map((item, i) => i === idx ? { ...item, [field]: val } : item) }));
  };
  const addDraftInfo = () => setDraft(prev => ({ ...prev, info: [...prev.info, { label: 'Новое', value: '' }] }));
  const removeDraftInfo = (idx: number) => setDraft(prev => ({ ...prev, info: prev.info.filter((_, i) => i !== idx) }));

  const updateDraftActivity = (idx: number, val: string) => {
    setDraft(prev => ({ ...prev, activities: prev.activities.map((a, i) => i === idx ? val : a) }));
  };
  const addDraftActivity = () => setDraft(prev => ({ ...prev, activities: [...prev.activities, ''] }));
  const removeDraftActivity = (idx: number) => setDraft(prev => ({ ...prev, activities: prev.activities.filter((_, i) => i !== idx) }));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col">
        <div className="h-1 guild-border-flow shrink-0" />

        <div className="bg-ink-800 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="relative px-5 pt-4 pb-3 text-center border-b border-purple-500/20 shrink-0">
            <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
              {canEditGuild && !editing && (
                <button onClick={startEdit} className="p-2 text-purple-400 hover:text-white transition-colors rounded-lg hover:bg-purple-500/20 cursor-pointer">
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button onClick={onClose} className="p-2 text-ink-400 hover:text-white transition-colors rounded-lg hover:bg-ink-700/50 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-900/40 flex items-center justify-center mx-auto mb-2 border-2 border-purple-400/30 guild-glow">
              <span className="text-2xl">🌙</span>
            </div>

            {editing ? (
              <input value={draft.name} onChange={e => setDraft(prev => ({ ...prev, name: e.target.value }))}
                className="bg-ink-700 border border-purple-500/30 rounded-lg px-3 py-1.5 text-center font-serif text-xl font-bold text-white w-full focus:outline-none focus:border-purple-400/60" />
            ) : (
              <h2 className="font-serif text-2xl font-bold tracking-wider guild-text-shimmer mb-0.5">{guild.name}</h2>
            )}

            {editing ? (
              <input value={draft.subtitle} onChange={e => setDraft(prev => ({ ...prev, subtitle: e.target.value }))}
                className="bg-ink-700 border border-ink-600/30 rounded-lg px-3 py-1 text-center text-xs text-purple-300 w-full mt-1 focus:outline-none focus:border-purple-400/60" />
            ) : (
              <p className="text-purple-300/60 text-xs tracking-widest uppercase">{guild.subtitle}</p>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3 overflow-y-auto">
            {/* Motto */}
            {editing ? (
              <input value={draft.motto} onChange={e => setDraft(prev => ({ ...prev, motto: e.target.value }))}
                className="w-full bg-ink-700 border border-ink-600/30 rounded-lg px-3 py-2 text-sm text-purple-300 text-center italic focus:outline-none focus:border-purple-400/60" />
            ) : (
              <p className="text-ink-200 text-sm leading-relaxed text-center">
                <span className="font-serif text-purple-300 italic">{guild.motto}</span>
              </p>
            )}

            {/* Description */}
            {editing ? (
              <textarea value={draft.description} onChange={e => setDraft(prev => ({ ...prev, description: e.target.value }))} rows={3}
                className="w-full bg-ink-700 border border-ink-600/30 rounded-lg px-3 py-2 text-xs text-ink-200 focus:outline-none focus:border-purple-400/60 resize-none" />
            ) : (
              <p className="text-ink-300 text-xs leading-relaxed">{guild.description}</p>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-2">
              {(editing ? draft : guild).info.map((item, i) => (
                editing ? (
                  <div key={i} className="bg-ink-700/30 rounded-lg p-2 space-y-1 relative">
                    <button onClick={() => removeDraftInfo(i)} className="absolute top-1 right-1 text-ink-500 hover:text-crimson-400 cursor-pointer p-0.5">
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <input value={item.label} onChange={e => updateDraftInfo(i, 'label', e.target.value)}
                      className="w-full bg-ink-800/50 border border-ink-600/20 rounded px-2 py-0.5 text-[10px] text-ink-400 focus:outline-none" placeholder="Лейбл" />
                    <input value={item.value} onChange={e => updateDraftInfo(i, 'value', e.target.value)}
                      className="w-full bg-ink-800/50 border border-ink-600/20 rounded px-2 py-0.5 text-xs text-white focus:outline-none" placeholder="Значение" />
                  </div>
                ) : (
                  <div key={i} className="bg-ink-700/30 rounded-lg p-2.5 flex items-center gap-2.5">
                    {infoIcons[i % infoIcons.length]}
                    <div>
                      <div className="text-ink-400 text-[10px] uppercase tracking-wider">{item.label}</div>
                      <div className="text-white text-xs font-medium">{item.value}</div>
                    </div>
                  </div>
                )
              ))}
              {editing && (
                <button onClick={addDraftInfo}
                  className="flex items-center justify-center gap-1 bg-ink-700/20 border border-dashed border-ink-600/30 rounded-lg p-2 text-ink-500 hover:text-purple-400 hover:border-purple-400/40 cursor-pointer text-xs">
                  <Plus className="w-3 h-3" /> Добавить
                </button>
              )}
            </div>

            {/* Activities */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-3">
              <h3 className="text-purple-300 font-semibold text-xs mb-2">Чем мы занимаемся</h3>
              {editing ? (
                <div className="space-y-1.5">
                  {draft.activities.map((a, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-purple-400 shrink-0">✦</span>
                      <input value={a} onChange={e => updateDraftActivity(i, e.target.value)}
                        className="flex-1 bg-ink-800/50 border border-ink-600/20 rounded px-2 py-1 text-xs text-ink-200 focus:outline-none" />
                      <button onClick={() => removeDraftActivity(i)} className="text-ink-500 hover:text-crimson-400 cursor-pointer p-0.5">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button onClick={addDraftActivity}
                    className="flex items-center gap-1 text-ink-500 hover:text-purple-400 cursor-pointer text-[10px] mt-1">
                    <Plus className="w-3 h-3" /> Добавить пункт
                  </button>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {guild.activities.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ink-200">
                      <span className="text-purple-400 mt-0.5 shrink-0">✦</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Discord */}
            {editing ? (
              <div>
                <label className="text-ink-400 text-[10px] mb-1 block">Discord URL</label>
                <input value={draft.discordUrl} onChange={e => setDraft(prev => ({ ...prev, discordUrl: e.target.value }))}
                  className="w-full bg-ink-700 border border-ink-600/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400/60" />
              </div>
            ) : (
              <a href={guild.discordUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-xl bg-[#5865F2]/20 border border-[#5865F2]/40 hover:bg-[#5865F2]/30 hover:border-[#5865F2]/60 transition-all duration-300 group">
                <svg className="w-5 h-5 text-[#5865F2] group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <div className="text-left">
                  <div className="text-white font-semibold text-sm">Присоединиться к {guild.name}</div>
                  <div className="text-[#5865F2]/70 text-xs flex items-center gap-1">Открыть Discord <ExternalLink className="w-3 h-3" /></div>
                </div>
              </a>
            )}

            {/* Save / Cancel buttons */}
            {editing && (
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 text-purple-400 border border-purple-500/40 py-2.5 rounded-xl font-medium text-sm cursor-pointer hover:bg-purple-500/30">
                  <Save className="w-4 h-4" /> Сохранить
                </button>
                <button onClick={cancelEdit}
                  className="px-5 bg-ink-700 text-ink-300 py-2.5 rounded-xl text-sm cursor-pointer hover:bg-ink-600">
                  Отмена
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================== HERO BADGE ========================
export function GuildBadgeHero() {
  const [showInfo, setShowInfo] = useState(false);
  const [guild, setGuild] = useState<GuildData>(defaultGuild);
  useEffect(() => { setGuild(loadGuild()); }, []);

  return (
    <>
      <div className="relative inline-block animate-fadeInUp cursor-pointer" style={{ animationDelay: '0.6s' }} onClick={() => setShowInfo(true)}>
        <div className="relative px-8 py-4 sm:px-12 sm:py-5 group">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400/50 rounded-tl-sm" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-400/50 rounded-tr-sm" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-400/50 rounded-bl-sm" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400/50 rounded-br-sm" />
          <div className="absolute top-0 left-8 right-8 h-px guild-border-flow" />
          <div className="absolute bottom-0 left-8 right-8 h-px guild-border-flow" />
          <span className="absolute top-1 left-2 text-purple-300 text-[8px] star-twinkle-1">✦</span>
          <span className="absolute top-1 right-2 text-purple-300 text-[8px] star-twinkle-2">✦</span>
          <span className="absolute bottom-1 left-2 text-purple-300 text-[8px] star-twinkle-3">✦</span>
          <span className="absolute bottom-1 right-2 text-purple-300 text-[8px] star-twinkle-4">✦</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/0 via-purple-900/20 to-purple-900/0 rounded-lg group-hover:via-purple-900/40 transition-all duration-500" />
          <div className="relative guild-glow">
            <p className="text-center text-purple-300/70 text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-1 group-hover:text-purple-200/90 transition-colors duration-300">
              — База знаний принадлежит гильдии —
            </p>
            <h2 className="text-center font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider guild-text-shimmer">
              {guild.name}
            </h2>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-px w-8 sm:w-12 bg-gradient-to-r from-transparent to-purple-400/50" />
              <span className="text-purple-400/80 text-xs sm:text-sm">🌙</span>
              <div className="h-px w-8 sm:w-12 bg-gradient-to-l from-transparent to-purple-400/50" />
            </div>
            <p className="text-center text-purple-400/0 group-hover:text-purple-400/60 text-[10px] mt-2 transition-all duration-300 tracking-wider">
              нажмите, чтобы узнать больше
            </p>
          </div>
        </div>
      </div>
      <GuildInfoPopup isOpen={showInfo} onClose={() => { setShowInfo(false); setGuild(loadGuild()); }} />
    </>
  );
}

export function GuildBadgeCompact() {
  const [guild] = useState<GuildData>(loadGuild);
  return (
    <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-900/30 via-purple-800/20 to-purple-900/30 border border-purple-500/20">
      <div className="absolute inset-0 rounded-full bg-purple-500/5 guild-glow" />
      <span className="relative text-purple-300/60 text-xs">🌙</span>
      <span className="relative text-purple-300/70 text-xs tracking-wide">Гильдия</span>
      <span className="relative font-serif font-bold text-sm tracking-wider guild-text-shimmer">{guild.name}</span>
    </div>
  );
}

export function GuildBadgeFooter() {
  const [showInfo, setShowInfo] = useState(false);
  const [guild, setGuild] = useState<GuildData>(defaultGuild);
  useEffect(() => { setGuild(loadGuild()); }, []);

  return (
    <>
      <div className="relative mt-8 pt-8 border-t border-purple-500/10">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none" />
        <div className="relative text-center cursor-pointer group" onClick={() => setShowInfo(true)}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-purple-400/30" />
            <div className="flex gap-1.5">
              <span className="text-purple-400/40 text-[6px] star-twinkle-1">✦</span>
              <span className="text-purple-400/60 text-[8px] star-twinkle-2">✧</span>
              <span className="text-purple-400/40 text-[6px] star-twinkle-3">✦</span>
            </div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-purple-400/30" />
          </div>
          <p className="text-purple-300/50 text-xs tracking-[0.2em] uppercase mb-1 group-hover:text-purple-300/80 transition-colors duration-300">
            База знаний принадлежит гильдии
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest guild-text-shimmer guild-glow">{guild.name}</h3>
          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-purple-400/30" />
            <span className="text-purple-400/50 text-sm">🌙</span>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-purple-400/30" />
          </div>
          <p className="text-purple-400/30 text-[10px] tracking-widest uppercase mt-3 group-hover:text-purple-400/60 transition-colors duration-300">
            {guild.motto ? `✦ ${guild.motto.replace(/[«»]/g, '')} ✦` : ''}
          </p>
          <p className="text-purple-400/0 group-hover:text-purple-400/50 text-[10px] mt-1 transition-all duration-300">
            нажмите, чтобы узнать о гильдии
          </p>
        </div>
      </div>
      <GuildInfoPopup isOpen={showInfo} onClose={() => { setShowInfo(false); setGuild(loadGuild()); }} />
    </>
  );
}

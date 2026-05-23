import { useState, useEffect } from 'react';
import { X, Edit3, Save, Users, Swords, Trophy, Calendar, Sparkles } from 'lucide-react';
import { useAuth, type GuildData } from '../context/AuthContext';

const INFO_ICONS = [Users, Swords, Trophy, Calendar];

function GuildBanner({ guildName, onClick }: { guildName: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="guild-banner relative w-full max-w-xl mx-auto block cursor-pointer group text-left"
    >
      <div className="guild-banner-bg absolute inset-0 rounded-2xl overflow-hidden">
        <img src="/images/hero-bg.jpg" alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-950/85 via-violet-950/75 to-purple-950/90" />
      </div>

      <div className="relative px-6 sm:px-10 py-8 sm:py-10">
        <span className="guild-corner guild-corner-tl" aria-hidden />
        <span className="guild-corner guild-corner-tr" aria-hidden />
        <span className="guild-corner guild-corner-bl" aria-hidden />
        <span className="guild-corner guild-corner-br" aria-hidden />

        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-px w-8 sm:w-12 bg-purple-400/40" />
          <p className="text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.35em] uppercase text-purple-200/80 text-center">
            База знаний принадлежит гильдии
          </p>
          <span className="h-px w-8 sm:w-12 bg-purple-400/40" />
        </div>

        <h2 className="text-center font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-[0.15em] guild-text-shimmer group-hover:scale-[1.02] transition-transform duration-300">
          {guildName}
        </h2>

        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="h-px w-10 bg-purple-400/35" />
          <span className="text-xl text-amber-300/90 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">🌙</span>
          <span className="h-px w-10 bg-purple-400/35" />
        </div>
      </div>
    </button>
  );
}

function GuildInfoPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { guild, updateGuild, hasPermission } = useAuth();
  const canEditGuild = hasPermission('guild.edit');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GuildData>(guild);

  useEffect(() => {
    setDraft(guild);
    if (!isOpen) setEditing(false);
  }, [guild, isOpen]);

  const handleSave = () => {
    updateGuild(draft);
    setEditing(false);
  };

  const updateInfo = (index: number, field: 'label' | 'value', val: string) => {
    const info = [...draft.info];
    info[index] = { ...info[index], [field]: val };
    setDraft({ ...draft, info });
  };

  const updateActivity = (index: number, val: string) => {
    const activities = [...draft.activities];
    activities[index] = val;
    setDraft({ ...draft, activities });
  };

  if (!isOpen) return null;

  const g = editing ? draft : guild;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col bg-[#1a1410]">
        <div className="h-1 guild-border-flow shrink-0" />

        <div className="relative shrink-0">
          <div className="relative h-32 sm:h-40 bg-gradient-to-br from-purple-900 via-violet-700 to-purple-950 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(168,130,255,0.35),transparent_70%)]" />
            {g.avatar ? (
              <img src={g.avatar} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
            ) : null}
            <span className="relative text-6xl sm:text-7xl drop-shadow-[0_0_24px_rgba(251,191,36,0.6)]">🌙</span>
          </div>
          <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
            {canEditGuild && !editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="p-2 text-purple-200 hover:text-white rounded-lg hover:bg-purple-500/25 cursor-pointer"
                title="Редактировать"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            <button type="button" onClick={onClose} className="p-2 text-purple-200/70 hover:text-white rounded-lg hover:bg-purple-500/20 cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="text-center">
            {editing ? (
              <input
                value={draft.name}
                onChange={e => setDraft({ ...draft, name: e.target.value })}
                className="w-full bg-ink-800 border border-purple-500/30 rounded-lg px-3 py-2 text-center font-serif text-2xl font-bold text-white"
              />
            ) : (
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-purple-100 tracking-wider">{g.name}</h2>
            )}
            {editing ? (
              <input
                value={draft.subtitle}
                onChange={e => setDraft({ ...draft, subtitle: e.target.value })}
                className="w-full mt-2 bg-ink-800 border border-purple-500/20 rounded-lg px-3 py-1 text-center text-[10px] tracking-[0.2em] uppercase text-purple-300/80"
              />
            ) : (
              <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-purple-300/70 mt-1">{g.subtitle}</p>
            )}
            {editing ? (
              <input
                value={draft.motto}
                onChange={e => setDraft({ ...draft, motto: e.target.value })}
                className="w-full mt-2 bg-ink-800 border border-purple-500/20 rounded-lg px-3 py-1.5 text-center text-sm italic text-purple-200/90"
              />
            ) : (
              <p className="text-purple-200/80 text-sm italic mt-2 font-serif">{g.motto}</p>
            )}
          </div>

          {editing ? (
            <textarea
              value={draft.description}
              onChange={e => setDraft({ ...draft, description: e.target.value })}
              rows={3}
              className="w-full bg-ink-800 border border-purple-500/20 rounded-xl px-3 py-2 text-sm text-ink-200"
            />
          ) : (
            <p className="text-ink-300 text-sm text-center leading-relaxed">{g.description}</p>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            {g.info.map((item, i) => {
              const Icon = INFO_ICONS[i % INFO_ICONS.length];
              return (
                <div key={i} className="bg-purple-950/40 border border-purple-500/15 rounded-xl p-3 flex gap-2.5">
                  <Icon className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    {editing ? (
                      <>
                        <input
                          value={draft.info[i]?.label || ''}
                          onChange={e => updateInfo(i, 'label', e.target.value)}
                          className="w-full bg-transparent text-[9px] uppercase tracking-wider text-ink-500 mb-0.5"
                        />
                        <input
                          value={draft.info[i]?.value || ''}
                          onChange={e => updateInfo(i, 'value', e.target.value)}
                          className="w-full bg-ink-800/80 border border-purple-500/20 rounded px-1.5 py-0.5 text-xs text-purple-100 font-semibold"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-[9px] uppercase tracking-wider text-ink-500">{item.label}</p>
                        <p className="text-sm font-semibold text-purple-100">{item.value}</p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border border-purple-500/25 rounded-xl p-4 bg-purple-950/30">
            <h3 className="text-center font-serif font-bold text-purple-300 text-sm mb-3">Чем мы занимаемся</h3>
            <ul className="space-y-2">
              {(editing ? draft.activities : g.activities).map((act, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-300">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  {editing ? (
                    <input
                      value={draft.activities[i] || ''}
                      onChange={e => updateActivity(i, e.target.value)}
                      className="flex-1 bg-ink-800/80 border border-purple-500/20 rounded px-2 py-1 text-xs"
                    />
                  ) : (
                    <span>{act}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {editing && (
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 py-2.5 rounded-xl font-medium cursor-pointer hover:bg-purple-500/30"
              >
                <Save className="w-4 h-4" /> Сохранить
              </button>
              <button
                type="button"
                onClick={() => { setDraft(guild); setEditing(false); }}
                className="px-5 bg-ink-700 text-ink-300 py-2.5 rounded-xl cursor-pointer hover:bg-ink-600"
              >
                Отмена
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function GuildBadgeHero() {
  const { guild } = useAuth();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <div className="animate-fadeInUp">
        <GuildBanner guildName={guild.name} onClick={() => setShowInfo(true)} />
      </div>
      <GuildInfoPopup isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}

export function GuildBadgeCompact() {
  const { guild } = useAuth();
  return (
    <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/20">
      <span className="text-purple-300/60 text-xs">🌙</span>
      <span className="font-serif font-bold text-sm tracking-wider guild-text-shimmer">{guild.name}</span>
    </div>
  );
}

export function GuildBadgeFooter() {
  const { guild } = useAuth();
  const [showInfo, setShowInfo] = useState(false);
  return (
    <>
      <div className="relative mt-8 pt-8 border-t border-purple-500/10">
        <GuildBanner guildName={guild.name} onClick={() => setShowInfo(true)} />
        <p className="text-center text-purple-400/35 text-[10px] tracking-widest uppercase mt-3">{guild.motto}</p>
      </div>
      <GuildInfoPopup isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}

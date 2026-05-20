import { useState, useEffect, useRef } from 'react';
import { X, Edit3, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dbSaveSiteData } from '../lib/db';

interface GuildData {
  name: string; subtitle: string; motto: string; description: string; avatar: string;
  info: { label: string; value: string }[]; activities: string[];
}

const defaultGuild: GuildData = {
  name: 'NOCTHRA', subtitle: 'Гильдия Where Winds Meet', motto: '«Во тьме мы обретаем силу»',
  description: 'Nocthra — русскоязычная гильдия.', avatar: '',
  info: [{ label: 'Сообщество', value: 'Русскоязычное' }, { label: 'Активности', value: 'PvE, PvP, Рейды' }],
  activities: ['Совместное прохождение рейдов', 'Помощь новичкам'],
};

function loadGuild(): GuildData {
  try { const saved = localStorage.getItem('wwm_guild'); return saved ? JSON.parse(saved) : defaultGuild; } catch { return defaultGuild; }
}

function GuildInfoPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { hasPermission } = useAuth();
  const canEditGuild = hasPermission('guild.edit');
  const [guild, setGuild] = useState<GuildData>(loadGuild);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<GuildData>(guild);

  useEffect(() => { setGuild(loadGuild()); }, [isOpen]);

  const handleSave = () => {
    dbSaveSiteData('guild', draft);
    localStorage.setItem('wwm_guild', JSON.stringify(draft));
    setGuild(draft); setEditing(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl border border-purple-500/30 flex flex-col bg-ink-800">
        <div className="h-1 guild-border-flow shrink-0" />
        <div className="relative px-4 pt-4 pb-4 text-center border-b border-purple-500/20 shrink-0">
          <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
            {canEditGuild && !editing && <button onClick={() => setEditing(true)} className="p-2 text-purple-400 hover:text-white rounded-lg hover:bg-purple-500/20 cursor-pointer"><Edit3 className="w-4 h-4" /></button>}
            <button onClick={onClose} className="p-2 text-ink-400 hover:text-white rounded-lg hover:bg-ink-700/50 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
          <div className="relative w-full h-28 sm:h-36 mb-3 rounded-2xl overflow-hidden border border-purple-400/25 group/avatar">
            {(editing ? draft.avatar : guild.avatar) ? <img src={editing ? draft.avatar : guild.avatar} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-purple-900 flex items-center justify-center"><span className="text-5xl">🌙</span></div>}
          </div>
          {editing ? (
            <input value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} className="bg-ink-700 border border-purple-500/30 rounded-lg px-3 py-1.5 text-center font-serif text-xl font-bold text-white w-full" />
          ) : (
            <h2 className="font-serif text-2xl font-bold text-white mb-0.5">{guild.name}</h2>
          )}
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          {editing && (
            <div className="flex gap-2 pt-1">
              <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 text-purple-400 border border-purple-500/40 py-2.5 rounded-xl font-medium cursor-pointer hover:bg-purple-500/30"><Save className="w-4 h-4" /> Сохранить</button>
              <button onClick={() => setEditing(false)} className="px-5 bg-ink-700 text-ink-300 py-2.5 rounded-xl cursor-pointer hover:bg-ink-600">Отмена</button>
            </div>
          )}
          <p className="text-ink-200 text-sm italic text-center">{editing ? <input value={draft.motto} onChange={e=>setDraft({...draft, motto:e.target.value})} className="w-full bg-ink-700 p-1" /> : guild.motto}</p>
          <p className="text-ink-300 text-xs">{editing ? <textarea value={draft.description} onChange={e=>setDraft({...draft, description:e.target.value})} className="w-full bg-ink-700 p-1" /> : guild.description}</p>
        </div>
      </div>
    </div>
  );
}

export function GuildBadgeHero() {
  const [showInfo, setShowInfo] = useState(false);
  const [guild] = useState<GuildData>(loadGuild);
  return (
    <>
      <div className="relative inline-block animate-fadeInUp cursor-pointer" onClick={() => setShowInfo(true)}>
        <div className="relative px-8 py-4 group">
          <div className="relative guild-glow">
            <p className="text-center text-purple-300/70 text-[10px] tracking-[0.3em] uppercase mb-1">— База знаний гильдии —</p>
            <h2 className="text-center font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider guild-text-shimmer">{guild.name}</h2>
          </div>
        </div>
      </div>
      <GuildInfoPopup isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </>
  );
}

export function GuildBadgeCompact() {
  const [guild] = useState<GuildData>(loadGuild);
  return (
    <div className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-900/30 border border-purple-500/20">
      <span className="relative text-purple-300/60 text-xs">🌙</span>
      <span className="relative font-serif font-bold text-sm tracking-wider guild-text-shimmer">{guild.name}</span>
    </div>
  );
}

export function GuildBadgeFooter() {
  const [guild] = useState<GuildData>(loadGuild);
  return (
    <div className="relative mt-8 pt-8 border-t border-purple-500/10">
      <div className="relative w-full rounded-3xl overflow-hidden border border-purple-500/20 bg-purple-950/70 p-8 text-center">
        <p className="text-purple-300/55 text-xs tracking-[0.2em] uppercase mb-1">База знаний принадлежит гильдии</p>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-widest guild-text-shimmer">{guild.name}</h3>
        <p className="text-purple-400/35 text-[10px] tracking-widest uppercase mt-3">{guild.motto}</p>
      </div>
    </div>
  );
}

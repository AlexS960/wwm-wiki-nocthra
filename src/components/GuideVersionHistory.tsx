import { useState } from 'react';
import { History, RotateCcw, ChevronDown } from 'lucide-react';
import { useAuth, type GuideVersion } from '../context/AuthContext';

interface GuideVersionHistoryProps {
  guideId: string;
  canRestore: boolean;
}

export default function GuideVersionHistory({ guideId, canRestore }: GuideVersionHistoryProps) {
  const { getGuideVersions, restoreGuideVersion } = useAuth();
  const [open, setOpen] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);

  const versions = getGuideVersions(guideId);
  if (versions.length === 0) return null;

  const handleRestore = async (v: GuideVersion) => {
    if (!confirm(`Восстановить версию от ${new Date(v.savedAt).toLocaleString('ru-RU')}? Текущая версия будет сохранена в истории.`)) return;
    setRestoring(v.id);
    await restoreGuideVersion(guideId, v.id);
    setRestoring(null);
  };

  return (
    <div className="mt-6 bg-ink-800/30 border border-ink-700/25 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-ink-800/50"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-ink-300">
          <History className="w-4 h-4 text-gold-400" />
          История версий ({versions.length})
        </span>
        <ChevronDown className={`w-4 h-4 text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <ul className="border-t border-ink-700/25 divide-y divide-ink-700/20 max-h-48 overflow-y-auto">
          {versions.map(v => (
            <li key={v.id} className="px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-white truncate">{v.title}</p>
                <p className="text-[10px] text-ink-500">
                  {new Date(v.savedAt).toLocaleString('ru-RU')} · {v.savedBy}
                </p>
              </div>
              {canRestore && (
                <button
                  type="button"
                  disabled={restoring === v.id}
                  onClick={() => handleRestore(v)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-gold-400 border border-gold-500/30 hover:bg-gold-400/10 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <RotateCcw className="w-3 h-3" />
                  {restoring === v.id ? '…' : 'Восстановить'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { X, MapPin, MessageCircle, User, Bot, Sparkles } from 'lucide-react';
import AppModal from './ui/AppModal';
import type { AiNpc } from '../data/aiNpcs';
import { aiChatGlobalTips } from '../data/aiNpcs';

interface NpcDetailModalProps {
  npc: AiNpc | null;
  onClose: () => void;
}

function DialogueBubble({
  line,
  npcName,
}: {
  line: AiNpc['dialogues'][0];
  npcName: string;
}) {
  if (line.role === 'system') {
    return (
      <div className="flex justify-center py-1">
        <p className="text-[11px] text-jade-300/90 bg-jade-400/10 border border-jade-400/25 rounded-full px-3 py-1 text-center max-w-[95%]">
          {line.textRu || line.textEn}
        </p>
      </div>
    );
  }

  if (line.role === 'player') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[88%] rounded-2xl rounded-br-md px-3.5 py-2.5 bg-blue-600/25 border border-blue-500/35 shadow-sm">
          <p className="text-[10px] uppercase tracking-wide text-blue-300/90 mb-1 flex items-center gap-1 justify-end">
            <User className="w-3 h-3" /> Игрок
          </p>
          <p className="text-sm text-white leading-relaxed font-medium">{line.textEn}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[88%] rounded-2xl rounded-bl-md px-3.5 py-2.5 bg-ink-800/90 border border-gold-600/25 shadow-sm">
        <p className="text-[10px] uppercase tracking-wide text-gold-400/90 mb-1 flex items-center gap-1">
          <Bot className="w-3 h-3" /> {npcName}
        </p>
        <p className="text-sm text-ink-100 leading-relaxed">{line.textEn}</p>
      </div>
    </div>
  );
}

export default function NpcDetailModal({ npc, onClose }: NpcDetailModalProps) {
  if (!npc) return null;

  return (
    <AppModal open onClose={onClose} layer="top" className="max-w-2xl w-full">
      <div className="bg-ink-800 border border-gold-700/30 rounded-2xl max-h-[88vh] overflow-y-auto relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-lg text-ink-400 hover:text-white hover:bg-ink-700/60 cursor-pointer z-10"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-5 sm:p-6 pr-12">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl shrink-0">{npc.icon}</span>
            <div className="min-w-0">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">{npc.nameRu}</h2>
              <p className="text-ink-500 text-sm mt-0.5">{npc.nameEn}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
                  {npc.regionLabelRu}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-400/25">
                  AI-чат
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="bg-ink-900/50 rounded-xl p-4 border border-ink-700/40">
              <h3 className="text-gold-400 font-medium flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" /> Локация
              </h3>
              <p className="text-white font-medium">{npc.locationTitle}</p>
              <p className="text-ink-400 text-xs mt-0.5">{npc.subregion}</p>
              <p className="text-ink-300 mt-2 leading-relaxed">{npc.locationDetail}</p>
            </div>

            {npc.befriendGuide && (
              <div className="bg-ink-900/50 rounded-xl p-4 border border-gold-700/25">
                <h3 className="text-gold-400 font-medium mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Как подружиться
                </h3>
                <p className="text-ink-300 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
                  {npc.befriendGuide}
                </p>
              </div>
            )}

            {npc.dialogues.length > 0 && (
              <div className="bg-ink-950/50 rounded-xl border border-ink-600/40 overflow-hidden">
                <div className="px-4 py-3 border-b border-ink-700/40 bg-ink-900/60">
                  <h3 className="text-ink-100 font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-gold-400" />
                    Пример успешного диалога
                  </h3>
                </div>
                <div className="p-3 sm:p-4 space-y-3 max-h-[min(55vh,420px)] overflow-y-auto">
                  {npc.dialogues.map((line, i) => (
                    <DialogueBubble key={i} line={line} npcName={npc.nameRu} />
                  ))}
                </div>
              </div>
            )}

            <details className="bg-ink-900/40 rounded-xl border border-ink-700/30">
              <summary className="px-4 py-2.5 text-ink-400 text-xs cursor-pointer hover:text-gold-300">
                Советы по AI-чату
              </summary>
              <ul className="px-4 pb-3 space-y-2">
                {aiChatGlobalTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-ink-400 text-xs">
                    <span className="text-gold-500 shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </div>
      </div>
    </AppModal>
  );
}

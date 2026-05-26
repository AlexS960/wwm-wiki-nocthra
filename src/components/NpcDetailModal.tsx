import { X, MapPin, MessageCircle, User, Bot } from 'lucide-react';
import AppModal from './ui/AppModal';
import type { AiNpc } from '../data/aiNpcs';
import { aiChatGlobalTips } from '../data/aiNpcs';

interface NpcDetailModalProps {
  npc: AiNpc | null;
  onClose: () => void;
}

function RoleLabel({ role }: { role: AiNpc['dialogues'][0]['role'] }) {
  if (role === 'player') {
    return (
      <span className="text-[10px] uppercase tracking-wide text-blue-300 flex items-center gap-1">
        <User className="w-3 h-3" /> Игрок
      </span>
    );
  }
  if (role === 'system') {
    return (
      <span className="text-[10px] uppercase tracking-wide text-jade-400">Система</span>
    );
  }
  return (
    <span className="text-[10px] uppercase tracking-wide text-gold-400 flex items-center gap-1">
      <Bot className="w-3 h-3" /> NPC
    </span>
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
                {npc.isCustom && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-jade-400/10 text-jade-300 border border-jade-400/25">
                    Wiki
                  </span>
                )}
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
                <h3 className="text-gold-400 font-medium mb-2">Как подружиться</h3>
                <p className="text-ink-300 leading-relaxed whitespace-pre-wrap">{npc.befriendGuide}</p>
              </div>
            )}

            <div className="bg-ink-900/50 rounded-xl p-4 border border-gold-700/25">
              <h3 className="text-gold-400 font-medium flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4" /> Советы по AI-чату
              </h3>
              <ul className="space-y-2">
                {aiChatGlobalTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-ink-300">
                    <span className="text-gold-500 shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {npc.dialogues.length > 0 && (
              <div className="bg-ink-900/50 rounded-xl p-4 border border-ink-600/30">
                <h3 className="text-ink-100 font-medium mb-3">Пример диалога</h3>
                <div className="space-y-3 max-h-[min(50vh,320px)] overflow-y-auto pr-1">
                  {npc.dialogues.map((line, i) => (
                    <div
                      key={i}
                      className={`rounded-lg px-3 py-2 ${
                        line.role === 'player'
                          ? 'bg-blue-500/10 border border-blue-500/20 ml-4'
                          : line.role === 'system'
                            ? 'bg-jade-400/10 border border-jade-400/20 text-center'
                            : 'bg-ink-800/80 border border-ink-600/30 mr-4'
                      }`}
                    >
                      <RoleLabel role={line.role} />
                      <p className="text-ink-200 mt-1 leading-relaxed">{line.textRu || line.textEn}</p>
                      {line.textRu !== line.textEn && line.textEn && (
                        <p className="text-ink-500 text-xs mt-1 italic">{line.textEn}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppModal>
  );
}

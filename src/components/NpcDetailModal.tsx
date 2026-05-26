import { X, MapPin, MessageCircle, Lightbulb } from 'lucide-react';
import AppModal from './ui/AppModal';
import type { AiNpc } from '../data/aiNpcs';
import { aiChatGlobalTips } from '../data/aiNpcs';

interface NpcDetailModalProps {
  npc: AiNpc | null;
  onClose: () => void;
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
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">{npc.nameEn}</h2>
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

            <div className="bg-ink-900/50 rounded-xl p-4 border border-gold-700/25">
              <h3 className="text-gold-400 font-medium flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4" /> AI-чат и дружба
              </h3>
              <p className="text-ink-300 mb-3 leading-relaxed">
                Персонаж из списка интерактивных NPC Where Winds Meet (Jianghu Friends / Old Friends).
                Подойдите к NPC с золотой меткой на карте → выберите «Подружиться» → общайтесь в AI-чате.
              </p>
              <ul className="space-y-2">
                {aiChatGlobalTips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-ink-300">
                    <span className="text-gold-500 shrink-0 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {npc.dialogHints && npc.dialogHints.length > 0 && (
              <div className="bg-jade-400/5 rounded-xl p-4 border border-jade-400/20">
                <h3 className="text-jade-400 font-medium flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" /> Советы по диалогу с {npc.nameEn}
                </h3>
                <ul className="space-y-2">
                  {npc.dialogHints.map((hint, i) => (
                    <li key={i} className="flex items-start gap-2 text-ink-200 text-sm">
                      <span className="text-jade-400 shrink-0">→</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-ink-900/50 rounded-xl p-4 border border-ink-600/30">
              <h3 className="text-ink-200 font-medium mb-2 text-sm">Примеры реплик для AI-чата</h3>
              <p className="text-ink-500 text-xs mb-3">
                Точные ответы NPC генерируются ИИ в игре; ниже — типовые фразы, с которых удобно начать (адаптируйте под подсказку над чатом):
              </p>
              <div className="flex flex-col gap-2">
                {[
                  `Здравствуйте, ${npc.nameEn}. Расскажите, что вас беспокоит?`,
                  'Я готов помочь — чем могу быть полезен?',
                  'Простите за беспокойство. Можете поделиться своей историей?',
                  'Давайте поговорим спокойно — что для вас сейчас важнее всего?',
                ].map((line, i) => (
                  <blockquote
                    key={i}
                    className="text-ink-300 text-sm pl-3 border-l-2 border-gold-500/40 italic"
                  >
                    «{line}»
                  </blockquote>
                ))}
              </div>
            </div>

            <p className="text-ink-500 text-[10px] pt-1">
              Данные локаций: Game8 — List of All AI NPCs (обновление wiki, май 2026).
            </p>
          </div>
        </div>
      </div>
    </AppModal>
  );
}

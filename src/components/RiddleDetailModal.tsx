import { X, MapPin, Lightbulb, Coins, Brain } from 'lucide-react';
import AppModal from './ui/AppModal';
import type { RiddleClue, RiddleMaster } from '../data/riddles';
import { riddleHowToSteps, riddleEconomyTip } from '../data/riddles';

type Props =
  | { kind: 'master'; item: RiddleMaster; onClose: () => void }
  | { kind: 'clue'; item: RiddleClue; onClose: () => void };

export default function RiddleDetailModal(props: Props) {
  const { onClose } = props;

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

        {props.kind === 'master' ? (
          <MasterBody master={props.item} />
        ) : (
          <ClueBody clue={props.item} />
        )}
      </div>
    </AppModal>
  );
}

function MasterBody({ master }: { master: RiddleMaster }) {
  return (
    <div className="p-5 sm:p-6 pr-12">
      <div className="flex items-start gap-4 mb-4">
        <span className="text-4xl shrink-0">{master.icon || '🧩'}</span>
        <div className="min-w-0">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">{master.nameRu}</h2>
          <p className="text-ink-500 text-sm mt-0.5">{master.nameEn}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-400/10 text-gold-400 border border-gold-400/30">
              {master.regionLabelRu}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-jade-500/15 text-jade-300 border border-jade-400/25">
              Загадочник
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-xl bg-ink-900/60 border border-ink-700/40 px-3 py-2.5 flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400 shrink-0" />
          <div>
            <p className="text-[10px] text-ink-500 uppercase">Интеллект</p>
            <p className="text-sm text-white font-medium">×{master.intelligence}</p>
          </div>
        </div>
        <div className="rounded-xl bg-ink-900/60 border border-ink-700/40 px-3 py-2.5 flex items-center gap-2">
          <Coins className="w-4 h-4 text-gold-400 shrink-0" />
          <div>
            <p className="text-[10px] text-ink-500 uppercase">Попытка</p>
            <p className="text-sm text-white font-medium">{master.commerceCost} монет</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-ink-700/40 bg-ink-900/40 p-4 mb-4">
        <h3 className="text-sm font-medium text-gold-400 flex items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" /> Локация
        </h3>
        <p className="text-sm text-white">{master.locationTitle}</p>
        <p className="text-xs text-ink-400 mt-1">{master.subregion}</p>
        {master.locationDetail && (
          <p className="text-xs text-ink-300 mt-3 leading-relaxed">{master.locationDetail}</p>
        )}
      </div>

      <HowToBlock />
    </div>
  );
}

function ClueBody({ clue }: { clue: RiddleClue }) {
  return (
    <div className="p-5 sm:p-6 pr-12">
      <div className="mb-4">
        <span className="text-[10px] uppercase tracking-wide text-jade-400">Подсказка NPC</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1 capitalize">
          {clue.clueEn}
        </h2>
        {clue.isCustom && (
          <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-jade-400/10 text-jade-300 border border-jade-400/30">
            Добавлено в вики
          </span>
        )}
      </div>

      <div className="rounded-xl border border-gold-700/25 bg-ink-900/50 p-4 mb-4">
        <h3 className="text-sm font-medium text-gold-400 mb-3 flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          Возможные ответы
          <span className="text-ink-500 font-normal">({clue.answers.length})</span>
        </h3>
        <ul className="space-y-2">
          {clue.answers.map((ans, i) => (
            <li
              key={`${ans}-${i}`}
              className={`text-sm px-3 py-2 rounded-lg border ${
                i === 0
                  ? 'bg-gold-400/10 border-gold-400/30 text-gold-100 font-medium'
                  : 'bg-ink-800/60 border-ink-700/40 text-ink-200'
              }`}
            >
              {i === 0 && (
                <span className="text-[10px] text-gold-500 block mb-0.5">Чаще всего</span>
              )}
              {ans}
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-ink-500 mt-3 leading-relaxed">
          Ответ вводите на английском, как в игре. Список собран из отчётов игроков — NPC может принять любой из вариантов.
        </p>
      </div>

      <HowToBlock compact />
    </div>
  );
}

function HowToBlock({ compact }: { compact?: boolean }) {
  if (compact) {
    return (
      <p className="text-xs text-ink-500 border-t border-ink-700/30 pt-3">
        {riddleEconomyTip}
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-ink-700/40 bg-ink-900/30 p-4">
      <h3 className="text-sm font-medium text-white mb-3">Как играть</h3>
      <ol className="space-y-3">
        {riddleHowToSteps.map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-jade-500/20 text-jade-300 text-xs flex items-center justify-center font-bold">
              {i + 1}
            </span>
            <div>
              <p className="text-xs font-medium text-ink-200">{step.title}</p>
              <p className="text-xs text-ink-400 mt-0.5 leading-relaxed">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-[10px] text-ink-500 mt-3 leading-relaxed">{riddleEconomyTip}</p>
    </div>
  );
}

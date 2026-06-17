import { useState, useRef } from 'react';
import { Smile, Type, Send, Bold, Italic, Underline, Strikethrough, Quote, Link2 } from 'lucide-react';

const EMOJI_GROUPS = {
  faces: ['😀', '😄', '😁', '😂', '🤣', '😊', '😍', '😎', '🤔', '😢', '😭', '😡', '🥳', '😴', '🤯', '😇'],
  gestures: ['👍', '👎', '👏', '🙌', '🙏', '💪', '🤝', '✌️', '🤞', '👋', '🫡', '❤️', '💙', '💚', '🔥', '⭐'],
  game: ['⚔️', '🛡️', '💎', '🎯', '🏆', '🎮', '📖', '🗺️', '👹', '🏛️', '🌙', '👑', '🐉', '✨', '📌', '✅'],
} as const;

export interface StaffChatComposerProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  sending?: boolean;
  maxLength?: number;
  placeholder?: string;
  accentClass?: string;
}

export default function StaffChatComposer({
  value,
  onChange,
  onSend,
  sending = false,
  maxLength = 2000,
  placeholder = 'Сообщение…',
  accentClass = 'purple',
}: StaffChatComposerProps) {
  const [showEmoji, setShowEmoji] = useState(false);
  const [showBbcode, setShowBbcode] = useState(false);
  const [emojiTab, setEmojiTab] = useState<keyof typeof EMOJI_GROUPS>('faces');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const accentBtn = accentClass === 'gold'
    ? 'bg-gold-500/20 text-gold-400 border-gold-400/40'
    : accentClass === 'jade'
      ? 'bg-jade-500/20 text-jade-400 border-jade-400/40'
      : 'bg-gold-500/20 text-gold-400 border-gold-400/40';

  const applyBbCode = (openTag: string, closeTag: string, placeholderText = 'текст') => {
    const el = inputRef.current;
    if (!el) return;
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const inner = selected || placeholderText;
    const wrapped = `${openTag}${inner}${closeTag}`;
    const next = value.slice(0, start) + wrapped + value.slice(end);
    onChange(next);
    setShowBbcode(false);
    requestAnimationFrame(() => {
      el.focus();
      const selStart = start + openTag.length;
      const selEnd = selStart + inner.length;
      el.setSelectionRange(selStart, selEnd);
    });
  };

  const addEmoji = (emoji: string) => {
    onChange(value + emoji);
    inputRef.current?.focus();
  };

  const bbButtons: { label: string; icon: React.ReactNode; open: string; close: string; ph?: string }[] = [
    { label: 'Жирный', icon: <Bold className="w-3.5 h-3.5" />, open: '[b]', close: '[/b]' },
    { label: 'Курсив', icon: <Italic className="w-3.5 h-3.5" />, open: '[i]', close: '[/i]' },
    { label: 'Подчёрк.', icon: <Underline className="w-3.5 h-3.5" />, open: '[u]', close: '[/u]' },
    { label: 'Зачёрк.', icon: <Strikethrough className="w-3.5 h-3.5" />, open: '[s]', close: '[/s]' },
    { label: 'Цитата', icon: <Quote className="w-3.5 h-3.5" />, open: '[quote]', close: '[/quote]' },
    { label: 'Ссылка', icon: <Link2 className="w-3.5 h-3.5" />, open: '[url]', close: '[/url]', ph: 'https://' },
  ];

  return (
    <div className="shrink-0 p-3 border-t border-ink-700/40 bg-ink-800/40 relative">
      {showEmoji && (
        <div className="absolute bottom-full left-3 right-3 mb-2 p-2 bg-ink-900 border border-ink-700/50 rounded-xl shadow-2xl z-30">
          <div className="flex gap-1 mb-2">
            {(Object.keys(EMOJI_GROUPS) as (keyof typeof EMOJI_GROUPS)[]).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setEmojiTab(tab)}
                className={`px-2 py-1 rounded text-[10px] cursor-pointer ${
                  emojiTab === tab ? accentBtn : 'text-ink-400 hover:bg-ink-800'
                }`}
              >
                {tab === 'faces' ? '😀' : tab === 'gestures' ? '👍' : '⚔️'}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-8 gap-0.5 max-h-32 overflow-y-auto">
            {EMOJI_GROUPS[emojiTab].map(e => (
              <button
                key={e}
                type="button"
                onClick={() => addEmoji(e)}
                className="h-8 text-lg hover:bg-ink-800 rounded cursor-pointer"
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
      {showBbcode && (
        <div className="absolute bottom-full left-3 right-3 mb-2 p-3 bg-ink-900/98 border border-ink-700/50 rounded-xl shadow-2xl z-30">
          <p className="text-[10px] text-ink-400 mb-2">Выделите текст в поле ввода или вставьте шаблон:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {bbButtons.map(b => (
              <button
                key={b.label}
                type="button"
                onClick={() => applyBbCode(b.open, b.close, b.ph)}
                className="flex items-center gap-1.5 px-2 py-2 rounded-lg text-xs bg-ink-800/80 text-ink-200 hover:bg-ink-700 cursor-pointer"
              >
                {b.icon}
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2 max-w-3xl mx-auto">
        <textarea
          ref={inputRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={2}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          className="w-full resize-none bg-ink-700/50 border border-ink-600/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 min-h-[44px] max-h-32"
        />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setShowEmoji(!showEmoji); setShowBbcode(false); }}
            className={`p-2 rounded-xl border cursor-pointer ${showEmoji ? accentBtn : 'bg-ink-700/50 text-ink-400 border-ink-600/30'}`}
            title="Эмодзи"
          >
            <Smile className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => { setShowBbcode(!showBbcode); setShowEmoji(false); }}
            className={`p-2 rounded-xl border cursor-pointer ${showBbcode ? accentBtn : 'bg-ink-700/50 text-ink-400 border-ink-600/30'}`}
            title="Форматирование"
          >
            <Type className="w-4 h-4" />
          </button>
          <span className="text-[10px] text-ink-600 flex-1 hidden sm:block">Enter — отправить · Shift+Enter — новая строка</span>
          <button
            type="button"
            onClick={onSend}
            disabled={!value.trim() || sending}
            className={`p-2.5 rounded-xl cursor-pointer disabled:opacity-40 ${accentBtn} hover:opacity-90`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

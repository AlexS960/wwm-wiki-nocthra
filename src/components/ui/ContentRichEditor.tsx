import { useRef } from 'react';
import ContentFormatToolbar from './ContentFormatToolbar';

interface ContentRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
  /** Выделенная рамка для модального редактора */
  emphasized?: boolean;
}

/** Поле «Содержимое» с панелью форматирования сверху. */
export default function ContentRichEditor({
  value,
  onChange,
  rows = 10,
  placeholder,
  className = '',
  emphasized = false,
}: ContentRichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const shell = emphasized
    ? 'rounded-xl border-2 border-gold-500/40 overflow-hidden bg-ink-900/60 shadow-[inset_0_0_0_1px_rgba(var(--accent-rgb),0.08)] focus-within:border-gold-400/55'
    : 'rounded-xl border border-ink-600/50 overflow-hidden bg-ink-900/40 focus-within:border-gold-400/40';

  return (
    <div className={`flex flex-col ${shell} ${className}`}>
      <ContentFormatToolbar value={value} onChange={onChange} textareaRef={textareaRef} />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 text-white text-sm placeholder:text-ink-500 focus:outline-none resize-y leading-relaxed border-0 rounded-none ${
          emphasized
            ? 'bg-ink-900/90 min-h-[160px] focus:ring-1 focus:ring-gold-400/30 border-t border-ink-700/50'
            : 'bg-ink-900/80 min-h-[140px]'
        }`}
      />
    </div>
  );
}

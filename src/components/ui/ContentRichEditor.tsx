import { useRef } from 'react';
import ContentFormatToolbar from './ContentFormatToolbar';

interface ContentRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

/** Поле «Содержимое» с панелью форматирования сверху. */
export default function ContentRichEditor({
  value,
  onChange,
  rows = 10,
  placeholder,
  className = '',
}: ContentRichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={`rounded-xl border border-ink-600/50 overflow-hidden bg-ink-900/40 focus-within:border-gold-400/40 ${className}`}>
      <ContentFormatToolbar value={value} onChange={onChange} textareaRef={textareaRef} />
      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-ink-900/80 px-4 py-3 text-white text-sm placeholder:text-ink-500 focus:outline-none resize-y leading-relaxed min-h-[140px] border-0 rounded-none"
      />
    </div>
  );
}

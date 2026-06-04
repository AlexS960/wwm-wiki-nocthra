import { useCallback, useRef, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Palette,
} from 'lucide-react';
import {
  EDITOR_TEXT_COLORS,
  FORMAT_HELP,
  insertAtCursor,
  prefixCurrentLine,
  stripLineAlign,
  wrapSelection,
} from '../../lib/contentFormatEditor';

interface ContentRichEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  className?: string;
}

function ToolbarBtn({
  title,
  onClick,
  active,
  children,
}: {
  title: string;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
        active
          ? 'bg-gold-400/20 border-gold-400/50 text-gold-300'
          : 'bg-ink-900/80 border-ink-600/40 text-ink-300 hover:border-gold-500/40 hover:text-gold-300'
      }`}
    >
      {children}
    </button>
  );
}

export default function ContentRichEditor({
  value,
  onChange,
  rows = 10,
  placeholder,
  className = '',
}: ContentRichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showColors, setShowColors] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const apply = useCallback(
    (fn: (v: string, start: number, end: number) => { value: string; cursor: number }) => {
      const el = textareaRef.current;
      if (!el) return;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const { value: next, cursor } = fn(value, start, end);
      onChange(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(cursor, cursor);
      });
    },
    [value, onChange],
  );

  const wrap = (open: string, close: string, placeholder = 'текст') => {
    apply((v, s, e) => wrapSelection(v, s, e, open, close, placeholder));
  };

  const insert = (text: string) => {
    apply((v, s, e) => insertAtCursor(v, s, e, text));
  };

  const alignLine = (align: 'left' | 'center' | 'right') => {
    const el = textareaRef.current;
    if (!el) return;
    const cursor = el.selectionStart;
    const result = align === 'left'
      ? stripLineAlign(value, cursor)
      : prefixCurrentLine(value, cursor, `>>${align} `);
    onChange(result.value);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(result.cursor, result.cursor);
    });
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-1 p-2 rounded-xl bg-ink-900/60 border border-ink-600/40">
        <ToolbarBtn title="Заголовок (##)" onClick={() => insert('## ')}>
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Жирный" onClick={() => wrap('[b]', '[/b]')}>
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Курсив" onClick={() => wrap('[i]', '[/i]')}>
          <Italic className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-6 bg-ink-600/50 mx-0.5" aria-hidden />

        <ToolbarBtn title="Маркированный список" onClick={() => insert('\n- ')}>
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Нумерованный список" onClick={() => insert('\n1. ')}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-6 bg-ink-600/50 mx-0.5" aria-hidden />

        <ToolbarBtn title="По левому краю" onClick={() => alignLine('left')}>
          <AlignLeft className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="По центру" onClick={() => alignLine('center')}>
          <AlignCenter className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="По правому краю" onClick={() => alignLine('right')}>
          <AlignRight className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-6 bg-ink-600/50 mx-0.5" aria-hidden />

        <div className="relative">
          <ToolbarBtn title="Цвет текста" onClick={() => setShowColors(v => !v)} active={showColors}>
            <Palette className="w-4 h-4" />
          </ToolbarBtn>
          {showColors && (
            <div className="absolute left-0 top-full mt-1 z-20 p-2 rounded-xl bg-ink-800 border border-gold-500/30 shadow-xl flex flex-wrap gap-1 min-w-[140px]">
              {EDITOR_TEXT_COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  title={c.label}
                  onClick={() => {
                    wrap(`[color=${c.tag}]`, '[/color]');
                    setShowColors(false);
                  }}
                  className="px-2 py-1 rounded-lg text-xs border border-ink-600/50 hover:border-gold-400/50 cursor-pointer"
                  style={{
                    color: c.tag === 'gold' ? '#d4a528' : c.tag === 'jade' ? '#4ade80' : c.tag === 'crimson' ? '#f87171' : c.tag === 'blue' ? '#93c5fd' : c.tag === 'white' ? '#fff' : '#9ca3af',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowHelp(h => !h)}
          className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-ink-400 border border-ink-600/40 hover:text-gold-300 cursor-pointer"
        >
          Подсказка
          <ChevronDown className={`w-3 h-3 transition-transform ${showHelp ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showHelp && (
        <ul className="text-[10px] text-ink-500 space-y-0.5 px-2 py-1.5 rounded-lg bg-ink-900/40 border border-ink-700/30 font-mono">
          {FORMAT_HELP.map(h => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}

      <textarea
        ref={textareaRef}
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full bg-ink-900/80 border border-ink-600/50 rounded-xl px-4 py-3 text-white text-sm placeholder:text-ink-500 focus:outline-none focus:border-gold-400/50 resize-y leading-relaxed min-h-[120px]"
      />
    </div>
  );
}

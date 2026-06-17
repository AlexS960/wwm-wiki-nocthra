import { useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Heading2,
  Italic,
  Link,
  List,
  ListOrdered,
  Palette,
  Strikethrough,
  Type,
  Underline,
} from 'lucide-react';
import {
  EDITOR_TEXT_COLORS,
  FORMAT_HELP,
  insertAtCursor,
  prefixCurrentLine,
  stripLineAlign,
  wrapInlineTag,
  wrapSelection,
  type InlinePairTag,
} from '../../lib/contentFormatEditor';

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
          : 'bg-ink-800/90 border-ink-600/40 text-ink-300 hover:border-gold-500/40 hover:text-gold-300'
      }`}
    >
      {children}
    </button>
  );
}

export interface ContentFormatToolbarProps {
  value: string;
  onChange: (value: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

/** Панель кнопок форматирования — ставится над полем «Содержимое». */
export default function ContentFormatToolbar({ value, onChange, textareaRef }: ContentFormatToolbarProps) {
  const [showColors, setShowColors] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const apply = (fn: (v: string, start: number, end: number) => { value: string; selectionStart: number; selectionEnd: number }) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const { value: next, selectionStart, selectionEnd } = fn(value, start, end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  const wrapPair = (tag: InlinePairTag, placeholder = 'текст') => {
    apply((v, s, e) => wrapInlineTag(v, s, e, tag, placeholder));
  };

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
    <div className="border-b border-gold-500/30 bg-gradient-to-r from-gold-900/25 via-ink-900/80 to-ink-900/80 shrink-0">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-gold-500/15">
        <Type className="w-4 h-4 text-gold-400 shrink-0" />
        <span className="text-xs font-semibold text-gold-300">Панель форматирования</span>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 p-2.5 min-h-[44px]">
        <ToolbarBtn title="Заголовок (##)" onClick={() => insert('## ')}>
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Жирный" onClick={() => wrapPair('b')}>
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Курсив" onClick={() => wrapPair('i')}>
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Подчёркнутый" onClick={() => wrapPair('u')}>
          <Underline className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Зачёркнутый" onClick={() => wrapPair('s')}>
          <Strikethrough className="w-4 h-4" />
        </ToolbarBtn>

        <span className="w-px h-6 bg-ink-600/50 mx-0.5" aria-hidden />

        <ToolbarBtn title="Ссылка" onClick={() => wrap('[url=https://]', '[/url]', 'текст ссылки')}>
          <Link className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn title="Код" onClick={() => wrap('[code]', '[/code]', 'код')}>
          <Code className="w-4 h-4" />
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
            <div className="absolute left-0 top-full mt-1 z-30 p-2 rounded-xl bg-ink-800 border border-gold-500/30 shadow-xl flex flex-wrap gap-1 min-w-[140px]">
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
                    color: c.tag === 'gold' ? 'var(--color-gold-400)' : c.tag === 'jade' ? '#4ade80' : c.tag === 'crimson' ? '#f87171' : c.tag === 'blue' ? '#93c5fd' : c.tag === 'white' ? '#fff' : '#9ca3af',
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
        <ul className="text-[10px] text-ink-500 space-y-0.5 px-3 pb-2 font-mono border-t border-ink-700/30">
          {FORMAT_HELP.map(h => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

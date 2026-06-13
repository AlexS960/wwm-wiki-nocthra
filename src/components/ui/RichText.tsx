import { renderBBCode } from '../../lib/bbcode';
import { renderWikiContent } from '../../lib/wikiContent';
import { asText } from '../../lib/asText';

type RichTextVariant = 'compact' | 'preview' | 'normal';

const variantStyles: Record<RichTextVariant, string> = {
  compact:
    'text-ink-300 text-xs leading-relaxed space-y-1 [&_p]:text-ink-300 [&_p]:text-xs [&_p]:leading-relaxed [&_h4]:text-gold-400 [&_h4]:text-xs [&_h4]:font-semibold [&_h4]:mt-2 [&_h4]:first:mt-0 [&_h4]:mb-1 [&_ul]:space-y-1 [&_li]:text-xs [&_ol]:space-y-1',
  preview:
    'text-ink-400 text-xs leading-relaxed line-clamp-2 overflow-hidden [&_p]:inline [&_p]:text-ink-400 [&_h4]:hidden [&_h5]:hidden [&_ul]:hidden [&_ol]:hidden [&_.h-2]:hidden [&_br]:hidden',
  normal:
    'text-ink-200 text-sm leading-relaxed space-y-2 [&_p]:text-ink-200 [&_p]:text-sm [&_h4]:text-gold-400 [&_h4]:text-sm [&_h4]:font-semibold',
};

export default function RichText({
  content,
  variant = 'compact',
  className = '',
}: {
  content: string;
  variant?: RichTextVariant;
  className?: string;
}) {
  const text = asText(content);
  if (!text.trim()) return null;
  return (
    <div className={`${variantStyles[variant]} ${className}`.trim()}>
      {renderWikiContent(text)}
    </div>
  );
}

/** Однострочный фрагмент с BB-кодом (списки, подписи). */
export function RichInline({ content, className = '' }: { content: string; className?: string }) {
  const text = asText(content);
  if (!text.trim()) return null;
  return <span className={className}>{renderBBCode(text)}</span>;
}

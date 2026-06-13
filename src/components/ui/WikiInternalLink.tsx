import type { ReactNode } from 'react';
import { useWikiNavigation } from '../../context/WikiNavigationContext';
import { parseWikiCardLink } from '../../lib/wikiLinks';

const DEFAULT_CLASS = 'text-gold-300 hover:text-gold-200 underline underline-offset-2 cursor-pointer';

export default function WikiInternalLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const nav = useWikiNavigation();
  const parsed = parseWikiCardLink(href);

  if (!parsed || !nav) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className || 'text-blue-300 hover:text-blue-200 underline break-all'}
        onClick={onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation();
        onClick?.();
        if (parsed.sectionId) {
          nav.navigateToCard(parsed.sectionId, parsed.articleId);
        } else {
          nav.navigateByHref(href);
        }
      }}
      className={className || DEFAULT_CLASS}
    >
      {children}
    </button>
  );
}

import type { ElementType, ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessengerStar } from './MessengerStar';

interface UserNameWithBadgeProps {
  userId: string;
  fallback?: string;
  className?: string;
  nameClassName?: string;
  starClassName?: string;
  as?: ElementType;
  children?: ReactNode;
}

export function UserNameWithBadge({
  userId,
  fallback,
  className,
  nameClassName,
  starClassName,
  as: Tag = 'span',
  children,
}: UserNameWithBadgeProps) {
  const { getUserDisplayName, hasMessengerBadge } = useAuth();
  const name = children ?? getUserDisplayName(userId, fallback);

  return (
    <Tag className={`inline-flex items-center gap-0.5 max-w-full min-w-0 ${className ?? ''}`}>
      <span className={`truncate ${nameClassName ?? ''}`}>{name}</span>
      {hasMessengerBadge(userId) && (
        <MessengerStar className={`shrink-0 text-[0.85em] ${starClassName ?? ''}`} />
      )}
    </Tag>
  );
}

import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

export type ModalLayer = 'default' | 'elevated' | 'top';

const Z: Record<ModalLayer, string> = {
  default: 'z-[80]',
  elevated: 'z-[90]',
  top: 'z-[100]',
};

interface AppModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  layer?: ModalLayer;
  /** На мобильных — почти на весь экран снизу */
  mobileSheet?: boolean;
  className?: string;
}

export default function AppModal({
  open,
  onClose,
  children,
  layer = 'default',
  mobileSheet = true,
  className = '',
}: AppModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className={`fixed inset-0 ${Z[layer]} flex p-0 sm:p-4 ${
        mobileSheet ? 'items-end sm:items-center justify-center' : 'items-center justify-center'
      } animate-fadeIn`}
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        className={`relative w-full flex flex-col max-h-[100dvh] sm:max-h-[90vh] ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}

import type { ReactNode } from 'react';
import Header, { type NavigatePayload } from '../Header';
import Footer from '../Footer';

export interface PageShellHeaderProps {
  activeSection: string;
  onNavigate: (section: string, payload?: NavigatePayload) => void;
  onLoginClick: () => void;
  onProfileClick: (anchor?: { top: number; right: number }) => void;
}

interface PageShellProps {
  headerProps: PageShellHeaderProps;
  children: ReactNode;
  modals?: ReactNode;
  animated?: boolean;
}

export default function PageShell({ headerProps, children, modals, animated = true }: PageShellProps) {
  return (
    <div className={`min-h-screen text-ink-100${animated ? ' page-enter' : ''}`}>
      <Header {...headerProps} />
      {children}
      <Footer />
      {modals}
    </div>
  );
}

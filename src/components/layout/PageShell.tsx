import { memo, type ReactNode } from 'react';
import Header from '../Header';
import Footer from '../Footer';

export type PageShellHeaderProps = {
  activeSection: string;
  onNavigate: (section: string, payload?: import('../Header').NavigatePayload) => void;
  onLoginClick: () => void;
  onProfileClick: (anchor?: { top: number; right: number }) => void;
  showStaffChatLink?: boolean;
};

interface PageShellProps {
  headerProps: PageShellHeaderProps;
  children: ReactNode;
  modals?: ReactNode;
  animated?: boolean;
}

function PageShell({ headerProps, children, modals, animated = true }: PageShellProps) {
  return (
    <div className={`min-h-screen text-ink-100${animated ? ' page-enter' : ''}`}>
      <Header {...headerProps} />
      {children}
      <Footer />
      {modals}
    </div>
  );
}

export default memo(PageShell);

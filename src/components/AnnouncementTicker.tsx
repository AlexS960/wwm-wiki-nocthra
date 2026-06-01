interface AnnouncementTickerProps {
  text: string;
  icon: string;
  className?: string;
}

/** Бегущая строка: 2 копии + translate3d (легче для Mali и др. слабых GPU). */
export default function AnnouncementTicker({ text, icon, className = '' }: AnnouncementTickerProps) {
  const line = `${icon} ${text}`;

  return (
    <div className={`announcement-ticker ${className}`.trim()}>
      <div className="announcement-ticker__viewport" aria-hidden>
        <div className="announcement-ticker__track">
          <span className="announcement-ticker__segment">{line}</span>
          <span className="announcement-ticker__segment" aria-hidden>{line}</span>
        </div>
      </div>
      <span className="sr-only">{line}</span>
    </div>
  );
}

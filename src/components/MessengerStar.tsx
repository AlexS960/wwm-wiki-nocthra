interface MessengerStarProps {
  className?: string;
}

/** Красная звезда — у пользователей с персональным доступом к чату (MSG-ID). */
export function MessengerStar({ className = '' }: MessengerStarProps) {
  return (
    <span
      className={`inline-block text-crimson-400 leading-none select-none ${className}`}
      title="Привилегированный доступ к чату"
      aria-label="Привилегированный доступ"
    >
      ★
    </span>
  );
}

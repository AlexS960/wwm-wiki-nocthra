import { useEffect, useRef } from 'react';
import { useAuthState, useAuthActions } from '../context/AuthContext';
import { getPmBrowserNotifyEnabled, showPmNotification } from '../lib/notifications';

/** Показывает браузерные уведомления при новых входящих ЛС */
export function usePmBrowserNotifications() {
  const { user, privateMessages } = useAuthState();
  const { canUseMessenger } = useAuthActions();
  const seenRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user || !canUseMessenger()) {
      seenRef.current.clear();
      initializedRef.current = false;
      return;
    }

    const incoming = privateMessages.filter(m => m.toId === user.id);

    if (!initializedRef.current) {
      incoming.forEach(m => seenRef.current.add(m.id));
      initializedRef.current = true;
      return;
    }

    if (!getPmBrowserNotifyEnabled()) return;

    for (const m of incoming) {
      if (seenRef.current.has(m.id)) continue;
      seenRef.current.add(m.id);
      if (!m.read && !m.deletedForAll) {
        showPmNotification(m.fromName, m.deletedForAll ? 'Сообщение удалено' : m.text);
      }
    }
  }, [user, privateMessages, canUseMessenger]);
}

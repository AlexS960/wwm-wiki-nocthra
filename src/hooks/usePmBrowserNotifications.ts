import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPmBrowserNotifyEnabled, showPmNotification } from '../lib/notifications';

/** Показывает браузерные уведомления при новых входящих ЛС */
export function usePmBrowserNotifications() {
  const { user, privateMessages } = useAuth();
  const seenRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!user) {
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
      if (!m.read) {
        showPmNotification(m.fromName, m.text);
      }
    }
  }, [user, privateMessages]);
}

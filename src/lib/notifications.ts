const PM_PREF_KEY = 'wwm_pm_browser_notify';

export function getPmBrowserNotifyEnabled(): boolean {
  try {
    return localStorage.getItem(PM_PREF_KEY) === 'on';
  } catch {
    return false;
  }
}

export function setPmBrowserNotifyEnabled(on: boolean) {
  try {
    localStorage.setItem(PM_PREF_KEY, on ? 'on' : 'off');
  } catch {}
}

export function browserNotificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!browserNotificationsSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return Notification.requestPermission();
}

export function showPmNotification(fromName: string, text: string) {
  if (!browserNotificationsSupported()) return;
  if (Notification.permission !== 'granted') return;
  if (!getPmBrowserNotifyEnabled()) return;
  if (document.visibilityState === 'visible') return;

  const body = text.length > 120 ? text.slice(0, 117) + '…' : text;
  try {
    const n = new Notification(`Сообщение от ${fromName}`, {
      body,
      icon: '/favicon.ico',
      tag: 'wwm-pm',
    });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    /* ignore */
  }
}

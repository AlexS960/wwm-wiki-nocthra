import { useEffect } from 'react';
import { useAuthState } from '../context/AuthContext';
import { applyUserAccent, resolveAccentForUser, saveGuestAccent } from '../lib/userAccent';
import type { UserAccentColor } from '../lib/userThemePalette';

/** Синхронизирует акцентный цвет: user_progress (авториз.) или localStorage (гости). */
export default function UserAccentSync() {
  const { user, progress } = useAuthState();

  useEffect(() => {
    const accent = resolveAccentForUser(progress.accentColor, !!user);
    applyUserAccent(accent);
  }, [user, progress.accentColor]);

  return null;
}

export function setUserAccentPreference(
  color: UserAccentColor,
  updateProgress: (u: { accentColor: UserAccentColor }) => void,
  isLoggedIn: boolean,
): void {
  saveGuestAccent(color);
  applyUserAccent(color);
  if (isLoggedIn) updateProgress({ accentColor: color });
}

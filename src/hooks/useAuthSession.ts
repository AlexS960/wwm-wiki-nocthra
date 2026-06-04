import { useState, useCallback, useEffect } from 'react';
import {
  dbGetAccountByUsername,
  dbGetAccountById,
  dbCreateAccount,
  dbUpdateAccount,
  dbLoadProgress,
  dbSaveProgress,
} from '../lib/db';
import { verifyPassword, hashPassword, isPasswordHashed } from '../lib/password';
import { sanitizePictureField } from '../lib/siteImages';
import type { User, UserProgress } from '../types/site';
import { defaultUserProgress } from '../context/authContextTypes';

function loadStoredUser(): User | null {
  try {
    const stored = localStorage.getItem('wwm_user');
    return stored ? JSON.parse(stored) as User : null;
  } catch {
    return null;
  }
}

interface UseAuthSessionOptions {
  setDbSaveError: (error: string | null) => void;
}

export function useAuthSession({ setDbSaveError }: UseAuthSessionOptions) {
  const [user, setUser] = useState<User | null>(loadStoredUser);
  const [progress, setProgress] = useState<UserProgress>(defaultUserProgress);

  useEffect(() => {
    if (!user?.id) return;
    let active = true;
    void (async () => {
      const acc = await dbGetAccountById(user.id);
      if (!active || !acc) return;
      const refreshed: User = {
        id: acc.id,
        email: '',
        name: acc.username,
        picture: acc.picture || '',
        gameNickname: acc.game_nickname || '',
        role: acc.role,
      };
      setUser(prev => {
        if (!prev || prev.id !== refreshed.id) return prev;
        if (
          prev.role === refreshed.role
          && prev.name === refreshed.name
          && prev.picture === refreshed.picture
          && prev.gameNickname === refreshed.gameNickname
        ) {
          return prev;
        }
        localStorage.setItem('wwm_user', JSON.stringify(refreshed));
        return refreshed;
      });
    })();
    return () => { active = false; };
  }, [user?.id]);

  const loginWithPassword = useCallback(async (username: string, password: string, remember: boolean) => {
    const acc = await dbGetAccountByUsername(username);
    if (!acc) return 'Неверный логин или пароль';
    const ok = await verifyPassword(password, acc.password_hash);
    if (!ok) return 'Неверный логин или пароль';
    if (!isPasswordHashed(acc.password_hash)) {
      const hashed = await hashPassword(password);
      void dbUpdateAccount(acc.id, { password_hash: hashed });
    }
    const nextUser: User = {
      id: acc.id,
      email: '',
      name: acc.username,
      picture: acc.picture || '',
      gameNickname: acc.game_nickname || '',
      role: acc.role,
    };
    setUser(nextUser);
    if (remember) localStorage.setItem('wwm_user', JSON.stringify(nextUser));
    void dbUpdateAccount(acc.id, { last_seen: new Date().toISOString() });
    const loadedProgress = await dbLoadProgress(acc.id);
    if (loadedProgress) setProgress(loadedProgress as UserProgress);
    return null;
  }, []);

  const register = useCallback(async (username: string, password: string, gameNickname = '') => {
    const existing = await dbGetAccountByUsername(username);
    if (existing) return 'Такой логин уже занят';
    const res = await dbCreateAccount(username, password, gameNickname);
    if ('error' in res) return res.error;
    const nextUser: User = {
      id: res.id,
      email: '',
      name: res.username,
      picture: '',
      gameNickname: res.game_nickname || '',
      role: 'user',
    };
    setUser(nextUser);
    localStorage.setItem('wwm_user', JSON.stringify(nextUser));
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('wwm_user');
  }, []);

  const updateProgress = useCallback((updates: Partial<UserProgress>) => {
    setProgress(prev => {
      const next = { ...prev, ...updates };
      if (user) void dbSaveProgress(user.id, next);
      return next;
    });
  }, [user?.id]);

  const toggleFavoriteWeapon = useCallback((id: string) => {
    setProgress(prev => {
      const next = {
        ...prev,
        favoriteWeapons: prev.favoriteWeapons.includes(id)
          ? prev.favoriteWeapons.filter(x => x !== id)
          : [...prev.favoriteWeapons, id],
      };
      if (user) void dbSaveProgress(user.id, next);
      return next;
    });
  }, [user?.id]);

  const toggleFavoriteSect = useCallback((id: string) => {
    setProgress(prev => {
      const next = {
        ...prev,
        favoriteSects: prev.favoriteSects.includes(id)
          ? prev.favoriteSects.filter(x => x !== id)
          : [...prev.favoriteSects, id],
      };
      if (user) void dbSaveProgress(user.id, next);
      return next;
    });
  }, [user?.id]);

  const toggleCompletedGuide = useCallback((id: string) => {
    setProgress(prev => {
      const next = {
        ...prev,
        completedGuides: prev.completedGuides.includes(id)
          ? prev.completedGuides.filter(x => x !== id)
          : [...prev.completedGuides, id],
      };
      if (user) void dbSaveProgress(user.id, next);
      return next;
    });
  }, [user?.id]);

  const addNote = useCallback((title: string, content: string) => {
    setProgress(prev => {
      const next = {
        ...prev,
        notes: [{ id: 'n' + Date.now(), title, content, date: new Date().toLocaleDateString() }, ...prev.notes],
      };
      if (user) void dbSaveProgress(user.id, next);
      return next;
    });
  }, [user?.id]);

  const deleteNote = useCallback((id: string) => {
    setProgress(prev => {
      const next = { ...prev, notes: prev.notes.filter(x => x.id !== id) };
      if (user) void dbSaveProgress(user.id, next);
      return next;
    });
  }, [user?.id]);

  const setSelectedBuild = useCallback((id: string | null) => {
    updateProgress({ selectedBuild: id });
  }, [updateProgress]);

  const updateUserPicture = useCallback((picture: string) => {
    if (!user) return;
    const clean = sanitizePictureField(picture);
    if (picture.trim() && !clean) {
      setDbSaveError('Аватар: используйте ссылку https://… или загрузку в Storage, не base64.');
      return;
    }
    setUser({ ...user, picture: clean });
    void dbUpdateAccount(user.id, { picture: clean });
  }, [user, setDbSaveError]);

  const updateUserGameNickname = useCallback((nickname: string) => {
    if (!user) return;
    setUser({ ...user, gameNickname: nickname });
    void dbUpdateAccount(user.id, { game_nickname: nickname });
  }, [user]);

  return {
    user,
    setUser,
    progress,
    setProgress,
    loginWithPassword,
    register,
    logout,
    updateProgress,
    toggleFavoriteWeapon,
    toggleFavoriteSect,
    toggleCompletedGuide,
    addNote,
    deleteNote,
    setSelectedBuild,
    updateUserPicture,
    updateUserGameNickname,
  };
}

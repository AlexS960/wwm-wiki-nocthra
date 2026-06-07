import { useCallback } from 'react';
import { dbSaveSiteData } from '../../lib/db';
import { sanitizeSiteDataPayload } from '../../lib/siteImages';

export function useAuthPersist(setDbSaveError: (msg: string | null) => void) {
  const persist = useCallback(async (key: string, data: unknown) => {
    const payload = sanitizeSiteDataPayload(key, data);
    const { error } = await dbSaveSiteData(key, payload);
    if (error) {
      console.error(`Не удалось сохранить «${key}»:`, error);
      setDbSaveError(error);
      return error;
    }
    return null;
  }, [setDbSaveError]);

  const saveSite = useCallback(<T,>(
    key: string,
    updater: (prev: T) => T,
    setter: (v: T) => void,
  ) => {
    setter((prev: T) => {
      const next = updater(prev);
      void persist(key, next);
      return next;
    });
  }, [persist]);

  return { persist, saveSite };
}

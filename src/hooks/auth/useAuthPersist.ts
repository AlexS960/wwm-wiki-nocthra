import { useCallback } from 'react';
import { dbSaveSiteData } from '../../lib/db';
import { sanitizeSiteDataPayload } from '../../lib/siteImages';
import { logger } from '../../lib/logger';

export function useAuthPersist(setDbSaveError: (msg: string | null) => void) {
  const persist = useCallback(async (key: string, data: unknown) => {
    const payload = sanitizeSiteDataPayload(key, data);
    const { error } = await dbSaveSiteData(key, payload);
    if (error) {
      logger.error(`Failed to save site data: ${key}`, 'persist', error);
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

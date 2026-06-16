/**
 * Hook for exporting and importing user settings
 */

import { useCallback } from 'react';
import { useAuthState, useAuthActions } from '../context/AuthContext';
import { logger } from '../lib/logger';

interface UserSettingsExport {
  version: string;
  exportDate: string;
  userId: string;
  progress: {
    completedGuides: string[];
    favoriteWeapons: string[];
    favoriteSects: string[];
    visitedRegions: string[];
    notes: Array<{ id: string; title: string; content: string; date: string }>;
    selectedBuild: string | null;
  };
}

export function useUserSettings() {
  const { user, progress } = useAuthState();
  const { updateProgress } = useAuthActions();

  const exportSettings = useCallback((): string | null => {
    if (!user) {
      logger.error('Cannot export settings: user not logged in', 'useUserSettings');
      return null;
    }

    try {
      const exportData: UserSettingsExport = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        userId: user.id,
        progress: {
          completedGuides: progress.completedGuides,
          favoriteWeapons: progress.favoriteWeapons,
          favoriteSects: progress.favoriteSects,
          visitedRegions: progress.visitedRegions,
          notes: progress.notes,
          selectedBuild: progress.selectedBuild,
        },
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `wwm-settings-${user.id}-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('Settings exported successfully', 'useUserSettings', { userId: user.id });
      return jsonString;
    } catch (error) {
      logger.error('Failed to export settings', 'useUserSettings', error);
      return null;
    }
  }, [user, progress]);

  const importSettings = useCallback(async (file: File): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'Войдите в аккаунт для импорта настроек' };
    }

    try {
      const text = await file.text();
      const data = JSON.parse(text) as UserSettingsExport;

      // Validate import data structure
      if (!data.version || !data.progress) {
        return { success: false, message: 'Некорректный файл настроек' };
      }

      // Import progress data
      updateProgress({
        completedGuides: data.progress.completedGuides || [],
        favoriteWeapons: data.progress.favoriteWeapons || [],
        favoriteSects: data.progress.favoriteSects || [],
        visitedRegions: data.progress.visitedRegions || [],
        notes: data.progress.notes || [],
        selectedBuild: data.progress.selectedBuild,
      });

      logger.info('Settings imported successfully', 'useUserSettings', { 
        userId: user.id, 
        importedUserId: data.userId 
      });

      return { success: true, message: 'Настройки успешно импортированы' };
    } catch (error) {
      logger.error('Failed to import settings', 'useUserSettings', error);
      return { success: false, message: 'Ошибка при чтении файла настроек' };
    }
  }, [user, updateProgress]);

  const resetSettings = useCallback((): { success: boolean; message: string } => {
    if (!user) {
      return { success: false, message: 'Войдите в аккаунт для сброса настроек' };
    }

    try {
      updateProgress({
        completedGuides: [],
        favoriteWeapons: [],
        favoriteSects: [],
        visitedRegions: [],
        notes: [],
        selectedBuild: null,
      });

      logger.info('Settings reset successfully', 'useUserSettings', { userId: user.id });
      return { success: true, message: 'Настройки сброшены' };
    } catch (error) {
      logger.error('Failed to reset settings', 'useUserSettings', error);
      return { success: false, message: 'Ошибка при сбросе настроек' };
    }
  }, [user, updateProgress]);

  return {
    exportSettings,
    importSettings,
    resetSettings,
    canExport: !!user,
  };
}


import { AppSettings, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEY = 'daily_water_ping_settings';

export const storageService = {
  saveSettings: (settings: AppSettings): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  },
  
  loadSettings: (): AppSettings => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    try {
      return JSON.parse(saved);
    } catch {
      return DEFAULT_SETTINGS;
    }
  }
};

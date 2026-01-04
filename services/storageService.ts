import { AppSettings, DEFAULT_SETTINGS } from '../types';

const STORAGE_KEY = 'daily_water_ping_settings';

export const storageService = {
  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  },
  
  loadSettings: (): AppSettings => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULT_SETTINGS;
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load settings from localStorage', e);
      return DEFAULT_SETTINGS;
    }
  }
};
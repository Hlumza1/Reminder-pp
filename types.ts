
export type IntervalMinutes = 30 | 45 | 60 | 90;

export interface AppSettings {
  wakeTime: string; // "HH:mm"
  sleepTime: string; // "HH:mm"
  interval: IntervalMinutes;
  isEnabled: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  wakeTime: '08:00',
  sleepTime: '22:00',
  interval: 60,
  isEnabled: false
};

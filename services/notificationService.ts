
import { AppSettings } from '../types';

export const notificationService = {
  requestPermission: async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notification');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  },

  sendPing: () => {
    if (Notification.permission === 'granted') {
      new Notification('Drink water 💧', {
        body: 'Time for your scheduled hydration ping.',
        icon: 'https://cdn-icons-png.flaticon.com/512/3105/3105807.png'
      });
    }
  },

  isWithinRange: (settings: AppSettings): boolean => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [wakeH, wakeM] = settings.wakeTime.split(':').map(Number);
    const [sleepH, sleepM] = settings.sleepTime.split(':').map(Number);

    const wakeTotal = wakeH * 60 + wakeM;
    const sleepTotal = sleepH * 60 + sleepM;

    // Handle ranges that cross midnight (e.g., wake at 22:00, sleep at 06:00)
    if (wakeTotal <= sleepTotal) {
      return currentMinutes >= wakeTotal && currentMinutes <= sleepTotal;
    } else {
      // Overnight range
      return currentMinutes >= wakeTotal || currentMinutes <= sleepTotal;
    }
  }
};

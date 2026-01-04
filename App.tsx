import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppSettings, IntervalMinutes } from './types';
import { storageService } from './services/storageService';
import { notificationService } from './services/notificationService';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(() => storageService.loadSettings());
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [isMounted, setIsMounted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updateSettings = (updates: Partial<AppSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const checkAndPing = useCallback(() => {
    if (!settings.isEnabled) return;
    if (notificationService.isWithinRange(settings)) {
      notificationService.sendPing();
    }
  }, [settings]);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    if (settings.isEnabled) {
      const intervalMs = settings.interval * 60 * 1000;
      timerRef.current = setInterval(checkAndPing, intervalMs);
      checkAndPing();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [settings.isEnabled, settings.interval, checkAndPing]);

  const handleToggle = async () => {
    if (!settings.isEnabled) {
      const granted = await notificationService.requestPermission();
      setPermissionStatus(typeof Notification !== 'undefined' ? Notification.permission : 'denied');
      if (!granted) {
        return;
      }
    }
    updateSettings({ isEnabled: !settings.isEnabled });
  };

  if (!isMounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-6 py-12 max-w-md mx-auto">
      <header className="w-full mb-12 text-center">
        <h1 className="text-3xl font-light tracking-tight text-gray-900 mb-2">Daily Water Ping</h1>
        <p className="text-sm text-gray-400 font-normal">Pure and simple hydration reminders.</p>
      </header>

      <div className="w-full mb-12 flex flex-col items-center">
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-16 w-32 items-center rounded-full transition-colors duration-300 focus:outline-none ${
            settings.isEnabled ? 'bg-blue-500' : 'bg-gray-100'
          }`}
        >
          <span
            className={`inline-block h-12 w-12 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
              settings.isEnabled ? 'translate-x-[72px]' : 'translate-x-2'
            }`}
          />
        </button>
        <span className="mt-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          {settings.isEnabled ? 'Reminders Active' : 'Reminders Paused'}
        </span>
      </div>

      <div className="w-full space-y-10">
        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Activity Window</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Wake up</label>
              <input
                type="time"
                value={settings.wakeTime}
                onChange={(e) => updateSettings({ wakeTime: e.target.value })}
                className="bg-gray-50 border-none rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-500 mb-1">Sleep</label>
              <input
                type="time"
                value={settings.sleepTime}
                onChange={(e) => updateSettings({ sleepTime: e.target.value })}
                className="bg-gray-50 border-none rounded-xl p-3 text-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              />
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Reminder Frequency</h2>
          <div className="grid grid-cols-4 gap-2">
            {[30, 45, 60, 90].map((mins) => (
              <button
                key={mins}
                onClick={() => updateSettings({ interval: mins as IntervalMinutes })}
                className={`py-4 rounded-xl text-sm font-medium transition-all ${
                  settings.interval === mins
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </section>
      </div>

      {permissionStatus === 'denied' && (
        <div className="mt-12 p-4 bg-red-50 rounded-xl text-center w-full">
          <p className="text-xs text-red-600">
            Notifications are blocked. Please enable them in your browser settings to receive pings.
          </p>
        </div>
      )}

      <footer className="mt-auto pt-12 text-center">
        <p className="text-[10px] text-gray-300 uppercase tracking-widest leading-loose">
          Privacy focused • No data collection<br/>
          Settings stored locally
        </p>
      </footer>
    </div>
  );
};

export default App;
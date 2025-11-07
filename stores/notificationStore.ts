// Notification Settings Store
// Manages user notification preferences

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettings {
  enabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: { hour: number; minute: number };
  patternAlertsEnabled: boolean;
  milestoneAlertsEnabled: boolean;
  nudgesEnabled: boolean;
  dailyReminderId: string | null;
}

interface NotificationState {
  settings: NotificationSettings;
  permissionGranted: boolean;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  setPermissionGranted: (granted: boolean) => void;
  setDailyReminderId: (id: string | null) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      settings: {
        enabled: true,
        dailyReminderEnabled: true,
        dailyReminderTime: { hour: 8, minute: 0 }, // 8 AM default
        patternAlertsEnabled: true,
        milestoneAlertsEnabled: true,
        nudgesEnabled: true,
        dailyReminderId: null,
      },
      permissionGranted: false,
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      setPermissionGranted: (granted) => set({ permissionGranted: granted }),
      setDailyReminderId: (id) =>
        set((state) => ({
          settings: { ...state.settings, dailyReminderId: id },
        })),
    }),
    {
      name: '@hormoiq:notifications',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


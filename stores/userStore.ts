// User Store - Manages user profile and app settings
// Following .cursorrules: Single store per domain, actions colocated with state

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, AppSettings } from '../types';

interface UserState {
  // State
  profile: UserProfile | null;
  settings: AppSettings;
  isOnboarded: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  updateSettings: (updates: Partial<AppSettings>) => void;
  completeOnboarding: () => void;
  resetUser: () => void;
}

const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  darkMode: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Initial state
      profile: null,
      settings: defaultSettings,
      isOnboarded: false,

      // Set user profile (typically during onboarding)
      setProfile: (profile) => {
        set({ profile });
      },

      // Update profile fields
      updateProfile: (updates) => {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        }));
      },

      // Update app settings
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },

      // Mark onboarding as complete
      completeOnboarding: () => {
        set({ isOnboarded: true });
      },

      // Reset all user data (for testing/logout)
      resetUser: () => {
        set({
          profile: null,
          settings: defaultSettings,
          isOnboarded: false,
        });
      },
    }),
    {
      name: 'hormoiq-user', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


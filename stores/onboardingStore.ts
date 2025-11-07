// Onboarding State Store
// Tracks whether user has completed onboarding

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingState {
  isOnboarded: boolean;
  completedAt: Date | null;
  markOnboarded: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboarded: false,
      completedAt: null,
      markOnboarded: () =>
        set({
          isOnboarded: true,
          completedAt: new Date(),
        }),
      reset: () =>
        set({
          isOnboarded: false,
          completedAt: null,
        }),
    }),
    {
      name: '@hormoiq:onboarding',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);


// Test Store - Manages all hormone test data
// Following .cursorrules: Single store per domain, actions colocated with state

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Test, HormoneType, ContextTags } from '../types';
import { syncTestToSupabase } from '../services/syncService';
import { supabase } from '../lib/supabase';

interface TestState {
  // State
  tests: Test[];
  isLoading: boolean;
  error: string | null;
  isSyncing: boolean;
  lastSyncTime: Date | null;

  // Actions
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  deleteTest: (id: string) => void;
  updateTest: (id: string, updates: Partial<Test>) => void;
  getTestsByHormone: (hormoneType: HormoneType) => Test[];
  getRecentTests: (count: number) => Test[];
  getTestsInDateRange: (startDate: Date, endDate: Date) => Test[];
  clearAllTests: () => void;
  syncWithSupabase: () => Promise<void>;
}

export const useTestStore = create<TestState>()(
  persist(
    (set, get) => ({
      // Initial state
      tests: [],
      isLoading: false,
      error: null,
      isSyncing: false,
      lastSyncTime: null,

      // Add a new test (optimistic UI - save immediately, sync in background)
      addTest: (test) => {
        const newTest: Test = {
          ...test,
          id: generateId(),
          createdAt: new Date(),
        };

        set((state) => ({
          tests: [newTest, ...state.tests], // Add to beginning (newest first)
          error: null,
        }));

        // Background sync to Supabase (fire and forget)
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user?.id) {
            syncTestToSupabase(newTest, session.user.id).catch(err => 
              console.error('Background sync failed:', err)
            );
          }
        });
      },

      // Delete a test
      deleteTest: (id) => {
        set((state) => ({
          tests: state.tests.filter((test) => test.id !== id),
        }));
      },

      // Update an existing test
      updateTest: (id, updates) => {
        set((state) => ({
          tests: state.tests.map((test) =>
            test.id === id ? { ...test, ...updates } : test
          ),
        }));
      },

      // Get all tests for a specific hormone
      getTestsByHormone: (hormoneType) => {
        return get().tests.filter((test) => test.hormoneType === hormoneType);
      },

      // Get N most recent tests
      getRecentTests: (count) => {
        return get()
          .tests.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, count);
      },

      // Get tests within a date range
      getTestsInDateRange: (startDate, endDate) => {
        return get().tests.filter((test) => {
          const testDate = new Date(test.timestamp);
          return testDate >= startDate && testDate <= endDate;
        });
      },

      // Clear all tests (for testing/debugging)
      clearAllTests: () => {
        set({ tests: [], error: null });
      },

      // Manual sync with Supabase (for pull-to-refresh or initial load)
      syncWithSupabase: async () => {
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user?.id) {
          console.log('No user session, skipping sync');
          return;
        }

        set({ isSyncing: true, error: null });

        try {
          const { fetchTestsFromSupabase, syncAllTestsToSupabase } = await import('../services/syncService');
          const userId = session.data.session.user.id;

          // Fetch remote tests
          const remoteTests = await fetchTestsFromSupabase(userId);
          const localTests = get().tests;

          // Merge logic: Keep local tests, add any remote tests not in local
          const localIds = new Set(localTests.map(t => t.id));
          const newRemoteTests = remoteTests.filter(t => !localIds.has(t.id));

          // Sync any local tests that aren't on remote yet
          const remoteIds = new Set(remoteTests.map(t => t.id));
          const unsyncedLocalTests = localTests.filter(t => !remoteIds.has(t.id));
          
          if (unsyncedLocalTests.length > 0) {
            await syncAllTestsToSupabase(unsyncedLocalTests, userId);
          }

          // Update state with merged tests
          if (newRemoteTests.length > 0) {
            set((state) => ({
              tests: [...state.tests, ...newRemoteTests].sort(
                (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
              ),
              isSyncing: false,
              lastSyncTime: new Date(),
            }));
          } else {
            set({ isSyncing: false, lastSyncTime: new Date() });
          }
        } catch (error) {
          console.error('Sync error:', error);
          set({
            isSyncing: false,
            error: error instanceof Error ? error.message : 'Sync failed',
          });
        }
      },
    }),
    {
      name: 'hormoiq-tests', // AsyncStorage key
      storage: createJSONStorage(() => AsyncStorage),
      // Serialize dates properly
      partialize: (state) => ({ tests: state.tests }),
    }
  )
);

// Helper function to generate unique IDs
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}


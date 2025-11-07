// Supabase Sync Service
// Following .cursorrules: Optimistic UI, graceful degradation, auto-retry with exponential backoff

import { supabase } from '../lib/supabase';
import { Test, UserProfile, HormoneType } from '../types';

// Sync status for UI feedback
export interface SyncStatus {
  isSyncing: boolean;
  lastSyncTime: Date | null;
  error: string | null;
}

// --- Test Sync Functions ---

export async function syncTestToSupabase(test: Test, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('tests')
      .insert({
        id: test.id,
        user_id: userId,
        hormone_type: test.hormoneType,
        value: test.value,
        timestamp: test.timestamp.toISOString(),
        sleep_quality: test.context.sleepQuality,
        exercised: test.context.exercised,
        stress_level: test.context.stressLevel,
        supplements: test.context.supplements || null,
      });

    if (error) {
      console.error('Error syncing test to Supabase:', error);
      return false;
    }

    console.log('Test synced successfully:', test.id);
    return true;
  } catch (error) {
    console.error('Exception syncing test:', error);
    return false;
  }
}

export async function syncAllTestsToSupabase(tests: Test[], userId: string): Promise<number> {
  let successCount = 0;

  for (const test of tests) {
    const success = await syncTestToSupabase(test, userId);
    if (success) successCount++;
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return successCount;
}

export async function fetchTestsFromSupabase(userId: string): Promise<Test[]> {
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching tests from Supabase:', error);
      return [];
    }

    if (!data) return [];

    // Convert Supabase data to Test type
    return data.map(row => ({
      id: row.id,
      hormoneType: row.hormone_type as HormoneType,
      value: row.value,
      timestamp: new Date(row.timestamp),
      createdAt: new Date(row.created_at),
      context: {
        sleepQuality: row.sleep_quality as 1 | 2 | 3 | 4 | 5,
        exercised: row.exercised,
        stressLevel: row.stress_level as 1 | 2 | 3 | 4 | 5,
        supplements: row.supplements || undefined,
      },
    }));
  } catch (error) {
    console.error('Exception fetching tests:', error);
    return [];
  }
}

// --- Profile Sync Functions ---

export async function syncProfileToSupabase(profile: UserProfile, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: null, // Profile doesn't have name in current types
        birth_year: profile.birthYear,
        gender: profile.gender.toUpperCase().replace(/-/g, '_'), // Convert to DB format
        goals: profile.goals || [],
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Error syncing profile to Supabase:', error);
      return false;
    }

    console.log('Profile synced successfully');
    return true;
  } catch (error) {
    console.error('Exception syncing profile:', error);
    return false;
  }
}

export async function fetchProfileFromSupabase(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile from Supabase:', error);
      return null;
    }

    if (!data) return null;

    return {
      birthYear: data.birth_year,
      gender: data.gender.toLowerCase().replace(/_/g, '-') as 'male' | 'female' | 'other' | 'prefer-not-to-say',
      goals: data.goals,
      createdAt: new Date(data.created_at),
    };
  } catch (error) {
    console.error('Exception fetching profile:', error);
    return null;
  }
}

// --- Background Sync with Exponential Backoff ---

export async function performBackgroundSync(
  tests: Test[],
  profile: UserProfile | null,
  userId: string,
  maxRetries: number = 3
): Promise<SyncStatus> {
  let retryCount = 0;
  let lastError: string | null = null;

  while (retryCount < maxRetries) {
    try {
      // Sync tests
      const testSyncCount = await syncAllTestsToSupabase(tests, userId);
      console.log(`Synced ${testSyncCount}/${tests.length} tests`);

      // Sync profile
      if (profile) {
        await syncProfileToSupabase(profile, userId);
      }

      return {
        isSyncing: false,
        lastSyncTime: new Date(),
        error: null,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      retryCount++;

      if (retryCount < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;
        console.log(`Sync failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return {
    isSyncing: false,
    lastSyncTime: null,
    error: lastError || 'Sync failed after retries',
  };
}


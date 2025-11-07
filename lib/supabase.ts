// Supabase Client Configuration
// Following .cursorrules: Graceful degradation, optimistic UI

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types (to be expanded as schema evolves)
export interface Database {
  public: {
    Tables: {
      tests: {
        Row: {
          id: string;
          user_id: string;
          hormone_type: 'CORTISOL' | 'TESTOSTERONE' | 'DHEA';
          value: number;
          timestamp: string;
          sleep_quality: number;
          exercised: boolean;
          stress_level: number;
          supplements: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          hormone_type: 'CORTISOL' | 'TESTOSTERONE' | 'DHEA';
          value: number;
          timestamp: string;
          sleep_quality: number;
          exercised: boolean;
          stress_level: number;
          supplements?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          hormone_type?: 'CORTISOL' | 'TESTOSTERONE' | 'DHEA';
          value?: number;
          timestamp?: string;
          sleep_quality?: number;
          exercised?: boolean;
          stress_level?: number;
          supplements?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          name: string | null;
          birth_year: number;
          gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
          goals: string[]; // Array of Goal enum values
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          birth_year: number;
          gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
          goals: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          birth_year?: number;
          gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
          goals?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}


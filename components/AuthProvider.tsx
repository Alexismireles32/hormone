// Authentication Provider
// Following .cursorrules: Graceful degradation, optimistic UI

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '../lib/supabase';
import { useTestStore } from '../stores/testStore';
import { useUserStore } from '../stores/userStore';
import { useOnboardingStore } from '../stores/onboardingStore';
import LoadingScreen from './LoadingScreen';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signInAnonymously: async () => {},
  signOut: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [navigationReady, setNavigationReady] = useState(false);
  const syncWithSupabase = useTestStore((state) => state.syncWithSupabase);
  const isOnboarded = useOnboardingStore((state) => state.isOnboarded);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // If we have a session, trigger initial sync
      if (session) {
        syncWithSupabase();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Sync on sign in
      if (session) {
        syncWithSupabase();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle onboarding redirect
  useEffect(() => {
    if (isLoading) return;
    
    // Mark navigation as ready after first check
    if (!navigationReady) {
      setNavigationReady(true);
    }

    const inOnboarding = segments[0] === 'onboarding';

    console.log('🔍 Auth Check:', { isOnboarded, inOnboarding, segments });

    if (!isOnboarded && !inOnboarding) {
      // Not onboarded and not in onboarding flow -> redirect
      console.log('➡️ Redirecting to onboarding...');
      setTimeout(() => {
        router.replace('/onboarding/welcome');
      }, 100);
    } else if (isOnboarded && inOnboarding) {
      // Already onboarded but still in onboarding flow -> go to app
      console.log('➡️ Redirecting to main app...');
      router.replace('/');
    }
  }, [isOnboarded, segments, isLoading, navigationReady]);

  const signInAnonymously = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      
      // Trigger initial sync after anonymous sign-in
      if (data.session) {
        await syncWithSupabase();
      }
    } catch (error) {
      console.error('Error signing in anonymously:', error);
      alert('Failed to sign in. You can still use the app locally.');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user,
    signInAnonymously,
    signOut,
    isLoading,
  };

  // Show loading screen while checking onboarding status
  if (isLoading || !navigationReady) {
    return (
      <AuthContext.Provider value={value}>
        <LoadingScreen />
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


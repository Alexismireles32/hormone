// Default Profile Setup
// For MVP, we'll use a default profile if none exists
// In production, this would be part of onboarding

import { UserProfile } from '../types';

/**
 * Get or create a default profile
 * For MVP: Use default values if no profile exists
 * TODO: Replace with proper onboarding flow
 */
export function getDefaultProfile(): UserProfile {
  const currentYear = new Date().getFullYear();
  
  return {
    birthYear: currentYear - 30, // Default to 30 years old
    gender: 'male',
    goals: ['energy', 'fitness'],
    createdAt: new Date(),
  };
}


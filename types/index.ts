// Core type definitions for HormoIQ
// Following .cursorrules: Strict TypeScript, no any types

/**
 * Hormone types supported by the app
 */
export enum HormoneType {
  CORTISOL = 'cortisol',
  TESTOSTERONE = 'testosterone',
  DHEA = 'dhea',
}

/**
 * Context tags captured with each test
 * These enable pattern recognition and correlation analysis
 */
export interface ContextTags {
  sleepQuality: 1 | 2 | 3 | 4 | 5; // 1 = poor, 5 = excellent
  exercised: boolean;
  stressLevel: 1 | 2 | 3 | 4 | 5; // 1 = low, 5 = very high
  supplements?: string; // Free text, comma-separated
}

/**
 * A single hormone test entry
 * This is the core data structure - everything depends on this
 */
export interface Test {
  id: string; // UUID
  hormoneType: HormoneType;
  value: number; // The actual test result (e.g., 14.5 ng/mL)
  timestamp: Date; // When the test was taken
  context: ContextTags;
  createdAt: Date; // When it was logged in the app
}

/**
 * User profile information
 * Used for BioAge calculation and personalized ranges
 */
export interface UserProfile {
  birthYear: number; // For age calculation
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  goals?: string[]; // e.g., ['energy', 'fitness', 'sleep']
  createdAt: Date;
}

/**
 * App settings and preferences
 */
export interface AppSettings {
  notificationsEnabled: boolean;
  reminderTime?: string; // HH:MM format
  darkMode: boolean;
}

/**
 * ReadyScore calculation result
 */
export interface ReadyScore {
  score: number; // 0-100
  label: 'Ready' | 'Good' | 'Moderate' | 'Recovering';
  color: 'green' | 'yellow' | 'orange' | 'red';
  lastUpdated: Date;
  confidence: 'low' | 'medium' | 'high';
}

/**
 * BioAge calculation result
 */
export interface BioAge {
  biologicalAge: number;
  chronologicalAge: number;
  difference: number; // negative = younger, positive = older
  confidence: 'low' | 'medium' | 'high';
  basedOnTests: number; // How many tests were used
  lastUpdated: Date;
}

/**
 * Status of a hormone level
 */
export enum HormoneStatus {
  OPTIMAL = 'optimal',
  BORDERLINE = 'borderline',
  NEEDS_ATTENTION = 'needs-attention',
}

/**
 * Trend direction for hormone levels
 */
export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
}

/**
 * Hormone analysis result
 * Used in Track tab to show status of each hormone
 */
export interface HormoneAnalysis {
  hormoneType: HormoneType;
  latestValue: number;
  latestTimestamp: Date;
  status: HormoneStatus;
  trend: TrendDirection;
  averageValue: number;
  testCount: number;
}

/**
 * Detected pattern in user data
 * Used for intelligence/insights
 */
export interface Pattern {
  id: string;
  type: 'correlation' | 'anomaly' | 'trend' | 'cycle';
  description: string;
  confidence: 'low' | 'medium' | 'high';
  discoveredAt: Date;
  relatedTests: string[]; // Test IDs
}

/**
 * AI chat message
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}


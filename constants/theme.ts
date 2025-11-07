// Design System Constants
// Following .cursorrules: Consistent spacing, no hard-coded values, color variables

/**
 * Color Palette
 * Primary colors for trust and science, status colors for feedback
 */
export const Colors = {
  // Primary
  primary: '#2563EB', // Blue - trust, science
  primaryLight: '#60A5FA',
  primaryDark: '#1E40AF',

  // Status Colors
  success: '#10B981', // Green - optimal
  warning: '#F59E0B', // Orange - attention
  error: '#EF4444', // Red - concern
  info: '#3B82F6', // Blue - information

  // Neutral Colors
  textPrimary: '#1A1A1A', // Near black
  textSecondary: '#6B7280', // Gray
  textTertiary: '#9CA3AF', // Light gray
  background: '#FFFFFF', // White
  surface: '#F9FAFB', // Light gray
  border: '#E5E7EB', // Medium gray
  borderLight: '#F3F4F6',

  // Hormone-Specific Colors (for charts and cards)
  cortisol: '#3B82F6', // Blue
  testosterone: '#EF4444', // Red
  dhea: '#F97316', // Orange

  // ReadyScore Colors
  scoreGreen: '#10B981', // 80-100
  scoreYellow: '#F59E0B', // 60-79
  scoreOrange: '#FB923C', // 40-59
  scoreRed: '#EF4444', // 0-39

  // Semantic Colors
  black: '#000000',
  white: '#FFFFFF',
} as const;

/**
 * Spacing System
 * Based on 4px unit - .cursorrules requirement
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

/**
 * Border Radius
 * Following .cursorrules: 8px inputs, 12px buttons, 16px cards
 */
export const BorderRadius = {
  input: 8,
  button: 12,
  card: 16,
  pill: 20, // Fully rounded badges/pills
  circle: 9999,
} as const;

/**
 * Typography
 * System fonts with size scale
 */
export const Typography = {
  // Font Sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 48,
  hero: 72,

  // Font Weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,

  // Line Heights
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

/**
 * Shadow Definitions
 * For cards and elevated elements
 */
export const Shadows = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // Android
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5, // Android
  },
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1, // Android
  },
} as const;

/**
 * Touch Target Sizes
 * Minimum 44x44 per .cursorrules
 */
export const TouchTarget = {
  minimum: 44,
  small: 36,
  medium: 44,
  large: 56,
} as const;

/**
 * Animation Durations (in milliseconds)
 */
export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/**
 * Z-Index Scale
 * For layering elements properly
 */
export const ZIndex = {
  base: 0,
  dropdown: 10,
  modal: 100,
  toast: 1000,
} as const;

/**
 * Hormone Type Display Names
 */
export const HormoneNames = {
  cortisol: 'Cortisol',
  testosterone: 'Testosterone',
  dhea: 'DHEA',
} as const;

/**
 * Hormone Units
 */
export const HormoneUnits = {
  cortisol: 'ng/mL',
  testosterone: 'ng/dL',
  dhea: 'ng/dL',
} as const;


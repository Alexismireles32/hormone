// Haptic Feedback Utilities
// Following .cursorrules: Light tap for selections, Medium for saves, Heavy for milestones

import * as Haptics from 'expo-haptics';

/**
 * Light tap for selections and toggles
 */
export function lightTap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Medium tap for saves and confirmations
 */
export function mediumTap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * Heavy tap for milestones and important events
 */
export function heavyTap() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
}

/**
 * Success pattern for completions
 */
export function successPattern() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/**
 * Error pattern for failures
 */
export function errorPattern() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}

/**
 * Warning pattern for cautions
 */
export function warningPattern() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}


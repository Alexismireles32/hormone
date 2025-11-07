// Notification Permission Request
// Following .cursorrules: Ask after first value, show clear benefit

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useNotificationStore } from '../../stores/notificationStore';
import Button from '../../components/Button';
import { mediumTap, lightTap } from '../../utils/haptics';
import {
  requestNotificationPermissions,
  scheduleDailyReminder,
} from '../../services/notificationService';

export default function NotificationPermission() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const setPermissionGranted = useNotificationStore((state) => state.setPermissionGranted);
  const setDailyReminderId = useNotificationStore((state) => state.setDailyReminderId);
  const dailyReminderTime = useNotificationStore((state) => state.settings.dailyReminderTime);

  const handleEnable = async () => {
    setIsLoading(true);
    mediumTap();

    const { granted } = await requestNotificationPermissions();
    setPermissionGranted(granted);

    if (granted) {
      // Schedule daily reminder at user's preferred time (default 8 AM)
      const id = await scheduleDailyReminder(
        dailyReminderTime.hour,
        dailyReminderTime.minute
      );
      if (id) {
        setDailyReminderId(id);
      }
    }

    setIsLoading(false);
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    lightTap();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Stay on Track</Text>
        <Text style={styles.subtitle}>
          Get reminders to test and discover new patterns
        </Text>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⏰</Text>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Daily Reminders</Text>
              <Text style={styles.benefitDescription}>
                We'll remind you at the best time to test
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💡</Text>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Pattern Alerts</Text>
              <Text style={styles.benefitDescription}>
                Get notified when we discover something interesting
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>🎉</Text>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Milestone Celebrations</Text>
              <Text style={styles.benefitDescription}>
                Celebrate when your BioAge improves or you hit streaks
              </Text>
            </View>
          </View>
        </View>

        {/* Note */}
        <Text style={styles.note}>
          You can customize or disable notifications anytime in settings
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Enable Notifications"
          onPress={handleEnable}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />
        <Button
          title="Maybe Later"
          onPress={handleSkip}
          variant="outline"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  icon: {
    fontSize: 80,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
    lineHeight: Typography.normal * Typography.base,
  },
  benefitsContainer: {
    marginBottom: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.md,
  },
  benefitIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  benefitDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.normal * Typography.sm,
  },
  note: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
});


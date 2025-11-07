// Celebration Screen - Instant Gratification
// Following .cursorrules: Celebrate wins enthusiastically, haptics

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, HormoneNames, HormoneUnits } from '../../constants/theme';
import { HormoneType } from '../../types';
import { useOnboardingStore } from '../../stores/onboardingStore';
import Button from '../../components/Button';
import Confetti from '../../components/Confetti';
import { successPattern } from '../../utils/haptics';

export default function Celebration() {
  const router = useRouter();
  const markOnboarded = useOnboardingStore((state) => state.markOnboarded);
  const params = useLocalSearchParams<{
    hormoneType: HormoneType;
    value: string;
  }>();

  const value = parseFloat(params.value);

  useEffect(() => {
    // Success haptic feedback
    successPattern();
    // Mark onboarding as complete
    markOnboarded();
  }, []);

  // Simple insight based on value
  const getInsight = () => {
    if (params.hormoneType === HormoneType.CORTISOL) {
      if (value >= 10 && value <= 20) {
        return "✅ This looks optimal for a morning reading! You're in a healthy range.";
      } else if (value > 20) {
        return "Your cortisol is a bit elevated. This could be normal stress response - we'll track trends to understand your patterns.";
      } else {
        return "Your cortisol is on the lower side. We'll monitor this and look for patterns over time.";
      }
    }
    return "Great first test! We'll learn more about your patterns as you add more data.";
  };

  const handleContinue = () => {
    // After celebration, ask for notification permission
    router.push('/onboarding/notifications');
  };

  return (
    <View style={styles.container}>
      <Confetti />
      
      <View style={styles.content}>
        {/* Big Celebration */}
        <View style={styles.celebration}>
          <Text style={styles.checkmark}>✅</Text>
          <Text style={styles.title}>Amazing!</Text>
          <Text style={styles.subtitle}>You just logged your first test</Text>
        </View>

        {/* Test Result */}
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Your {HormoneNames[params.hormoneType]}</Text>
          <View style={styles.resultValueContainer}>
            <Text style={styles.resultValue}>{value}</Text>
            <Text style={styles.resultUnit}>{HormoneUnits[params.hormoneType]}</Text>
          </View>
        </View>

        {/* Insight */}
        <View style={styles.insightCard}>
          <Text style={styles.insightText}>{getInsight()}</Text>
        </View>

        {/* Badge */}
        <View style={styles.badgeCard}>
          <Text style={styles.badgeEmoji}>🎉</Text>
          <Text style={styles.badgeTitle}>First Test Badge Unlocked!</Text>
          <Text style={styles.badgeDescription}>
            This is the start of your optimization journey
          </Text>
        </View>

        {/* Next Steps */}
        <View style={styles.nextSteps}>
          <Text style={styles.nextStepsTitle}>What's Next?</Text>
          <Text style={styles.nextStepsItem}>📊 Check your ReadyScore on the Home tab</Text>
          <Text style={styles.nextStepsItem}>📈 Track trends as you add more tests</Text>
          <Text style={styles.nextStepsItem}>🤖 Ask the AI coach anything</Text>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.buttonContainer}>
        <Button
          title="Explore HormoIQ"
          onPress={handleContinue}
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
  celebration: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  checkmark: {
    fontSize: 100,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.display,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
  },
  resultCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resultLabel: {
    fontSize: Typography.base,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  resultValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  resultValue: {
    fontSize: Typography.hero,
    fontWeight: Typography.bold,
    color: Colors.white,
  },
  resultUnit: {
    fontSize: Typography.xl,
    color: Colors.white,
  },
  insightCard: {
    backgroundColor: Colors.success + '20',
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  insightText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.normal * Typography.base,
    textAlign: 'center',
  },
  badgeCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  badgeEmoji: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  badgeTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  badgeDescription: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  nextSteps: {
    marginBottom: Spacing.xl,
  },
  nextStepsTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  nextStepsItem: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: Typography.normal * Typography.base,
  },
  buttonContainer: {
    padding: Spacing.xl,
  },
});


// Test Confirmation Screen
// Following PRD: Immediate insight, save to store (optimistic UI)
// Following .cursorrules: Celebrate wins, make it delightful

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { HormoneType } from '../../types';
import { useTestStore } from '../../stores/testStore';
import { Colors, Spacing, Typography, HormoneNames, HormoneUnits } from '../../constants/theme';
import { successPattern } from '../../utils/haptics';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function TestConfirmation() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    hormoneType: HormoneType;
    value: string;
    sleepQuality: string;
    exercised: string;
    stressLevel: string;
    supplements: string;
  }>();

  const addTest = useTestStore((state) => state.addTest);
  const tests = useTestStore((state) => state.tests);

  // Save test on mount (optimistic UI)
  useEffect(() => {
    const test = {
      hormoneType: params.hormoneType,
      value: parseFloat(params.value),
      timestamp: new Date(),
      context: {
        sleepQuality: parseInt(params.sleepQuality) as 1 | 2 | 3 | 4 | 5,
        exercised: params.exercised === 'true',
        stressLevel: parseInt(params.stressLevel) as 1 | 2 | 3 | 4 | 5,
        supplements: params.supplements || undefined,
      },
    };
    
    addTest(test);
    successPattern(); // Haptic feedback for successful save
  }, []);

  // Generate immediate insight
  function getInsight(): string {
    const value = parseFloat(params.value);
    const hormoneType = params.hormoneType;
    const hour = new Date().getHours();

    // Simple contextual insights (will be more sophisticated with intelligence layer)
    if (hormoneType === HormoneType.CORTISOL) {
      if (hour >= 6 && hour < 12) {
        if (value >= 12 && value <= 20) {
          return '✅ Your morning cortisol is in the optimal range';
        } else if (value < 12) {
          return '💡 Your cortisol is a bit low for morning. Consider sleep quality and stress management.';
        } else {
          return '⚠️ Your cortisol is elevated. This could indicate stress or excitement.';
        }
      } else {
        return '📊 Evening cortisol noted. Best tested in the morning for accurate baselines.';
      }
    }

    if (hormoneType === HormoneType.TESTOSTERONE) {
      if (value >= 300 && value <= 1000) {
        return '✅ Your testosterone is within normal range';
      } else if (value < 300) {
        return '💡 Your testosterone is on the lower side. Consider discussing with your doctor.';
      } else {
        return '📈 Your testosterone is high. This may be normal for athletes or indicate other factors.';
      }
    }

    return `✅ Your ${HormoneNames[hormoneType]} level has been recorded`;
  }

  function handleViewTrack() {
    router.push('/track');
  }

  function handleTestAnother() {
    router.push('/test');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Success Icon */}
        <View style={styles.successIcon}>
          <Text style={styles.successIconText}>✓</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Test Saved!</Text>
        <Text style={styles.subtitle}>
          Your {HormoneNames[params.hormoneType]} level has been recorded
        </Text>

        {/* Test Summary Card */}
        <Card variant="elevated" padding="lg">
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hormone</Text>
            <Text style={styles.summaryValue}>
              {HormoneNames[params.hormoneType]}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Value</Text>
            <Text style={[styles.summaryValue, styles.valueHighlight]}>
              {params.value} {HormoneUnits[params.hormoneType]}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time</Text>
            <Text style={styles.summaryValue}>
              {new Date().toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </View>

          {/* Context Summary */}
          <View style={styles.contextRow}>
            <View style={styles.contextPill}>
              <Text style={styles.contextText}>
                Sleep: {'★'.repeat(parseInt(params.sleepQuality))}
              </Text>
            </View>
            {params.exercised === 'true' && (
              <View style={styles.contextPill}>
                <Text style={styles.contextText}>💪 Exercised</Text>
              </View>
            )}
            <View style={styles.contextPill}>
              <Text style={styles.contextText}>
                Stress: {params.stressLevel}/5
              </Text>
            </View>
          </View>
        </Card>

        {/* Insight */}
        <View style={styles.insightBox}>
          <Text style={styles.insightText}>{getInsight()}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.statsText}>
            Total tests: {tests.length}
          </Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.footer}>
        <Button
          title="View Track"
          onPress={handleViewTrack}
          variant="primary"
          fullWidth
          size="large"
        />
        <View style={{ height: Spacing.md }} />
        <Button
          title="Test Another"
          onPress={handleTestAnother}
          variant="outline"
          fullWidth
          size="large"
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
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  successIconText: {
    fontSize: 48,
    color: Colors.white,
    fontWeight: Typography.bold,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  summaryLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  valueHighlight: {
    fontSize: Typography.xl,
    color: Colors.primary,
  },
  contextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  contextPill: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  contextText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  insightBox: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  insightText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.normal * Typography.base,
  },
  stats: {
    marginTop: Spacing.lg,
  },
  statsText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
});


// Track Tab - View all tests and trends
// Following PRD: Grouped test list, charts, empty states
// Following .cursorrules: Helpful empty states, educational content

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Test, HormoneType } from '../types';
import { useTestStore } from '../stores/testStore';
import { useUserStore } from '../stores/userStore';
import { Colors, Spacing, Typography, HormoneNames, HormoneUnits } from '../constants/theme';
import { groupTestsByDate, formatTestDate } from '../utils/dateUtils';
import { calculateBioAge } from '../utils/bioAge';
import { getDefaultProfile } from '../utils/defaultProfile';
import Card from '../components/Card';
import Button from '../components/Button';
import HormoneChart from '../components/HormoneChart';
import BioAgeCard from '../components/BioAgeCard';

export default function Track() {
  const router = useRouter();
  const tests = useTestStore((state) => state.tests);
  const profile = useUserStore((state) => state.profile);
  const setProfile = useUserStore((state) => state.setProfile);

  // Create default profile if none exists (for MVP)
  React.useEffect(() => {
    if (!profile) {
      setProfile(getDefaultProfile());
    }
  }, [profile, setProfile]);

  // Group tests by date
  const groupedTests = groupTestsByDate(tests);

  // Empty state
  if (tests.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No tests yet</Text>
          <Text style={styles.emptyText}>
            Your hormone tests will appear here.{'\n'}
            Start by logging your first test!
          </Text>
          <View style={styles.emptyAction}>
            <Button
              title="Take Your First Test"
              onPress={() => router.push('/test')}
              size="large"
            />
          </View>
        </View>
      </View>
    );
  }

  // Calculate BioAge if we have profile and tests
  const bioAge = profile ? calculateBioAge(tests, profile.birthYear) : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Tests</Text>
        <Text style={styles.subtitle}>{tests.length} total tests</Text>
      </View>

      {/* BioAge Card - Show if we have profile and at least 3 tests */}
      {bioAge && tests.length >= 3 && (
        <View style={styles.bioAgeSection}>
          <BioAgeCard bioAge={bioAge} />
        </View>
      )}

      {/* Charts - Show if we have multiple tests */}
      {tests.length >= 2 && (
        <View style={styles.chartsSection}>
          <HormoneChart tests={tests} hormoneType={HormoneType.CORTISOL} />
          <HormoneChart tests={tests} hormoneType={HormoneType.TESTOSTERONE} />
          <HormoneChart tests={tests} hormoneType={HormoneType.DHEA} />
        </View>
      )}

      {/* Today */}
      {groupedTests.today.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today</Text>
          {groupedTests.today.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </View>
      )}

      {/* Yesterday */}
      {groupedTests.yesterday.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yesterday</Text>
          {groupedTests.yesterday.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </View>
      )}

      {/* This Week */}
      {groupedTests.thisWeek.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          {groupedTests.thisWeek.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </View>
      )}

      {/* Older */}
      {groupedTests.older.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Older</Text>
          {groupedTests.older.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// Individual test card component
function TestCard({ test }: { test: Test }) {
  const hormoneColor = Colors[test.hormoneType];

  return (
    <Card variant="default" padding="md">
      <View style={styles.testCard}>
        {/* Hormone indicator */}
        <View
          style={[
            styles.hormoneIndicator,
            { backgroundColor: hormoneColor + '20' },
          ]}
        >
          <Text style={[styles.hormoneIndicatorText, { color: hormoneColor }]}>
            {HormoneNames[test.hormoneType].charAt(0)}
          </Text>
        </View>

        {/* Test info */}
        <View style={styles.testInfo}>
          <View style={styles.testHeader}>
            <Text style={styles.hormoneName}>
              {HormoneNames[test.hormoneType]}
            </Text>
            <Text style={styles.testValue}>
              {test.value} {HormoneUnits[test.hormoneType]}
            </Text>
          </View>

          <Text style={styles.testTime}>{formatTestDate(test.timestamp)}</Text>

          {/* Context pills */}
          <View style={styles.contextRow}>
            <View style={styles.contextPill}>
              <Text style={styles.contextText}>
                Sleep: {'★'.repeat(test.context.sleepQuality)}
              </Text>
            </View>
            {test.context.exercised && (
              <View style={styles.contextPill}>
                <Text style={styles.contextText}>💪 Exercise</Text>
              </View>
            )}
            <View style={styles.contextPill}>
              <Text style={styles.contextText}>
                Stress: {test.context.stressLevel}/5
              </Text>
            </View>
          </View>

          {test.context.supplements && (
            <Text style={styles.supplements} numberOfLines={1}>
              📋 {test.context.supplements}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  bioAgeSection: {
    marginBottom: Spacing.xl,
  },
  chartsSection: {
    marginBottom: Spacing.xxl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  testCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  hormoneIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  hormoneIndicatorText: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
  },
  testInfo: {
    flex: 1,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  hormoneName: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  testValue: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.primary,
  },
  testTime: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  contextRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  contextPill: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
  },
  contextText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  supplements: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.normal * Typography.base,
    marginBottom: Spacing.xl,
  },
  emptyAction: {
    width: '100%',
    maxWidth: 300,
  },
});

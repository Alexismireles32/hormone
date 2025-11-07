// Home Tab - ReadyScore Display
// Following PRD: Daily ritual, habit driver, personalized protocols
// Following .cursorrules: Make it delightful, celebrate wins

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTestStore } from '../stores/testStore';
import { Colors, Spacing, Typography } from '../constants/theme';
import { calculateReadyScore, getProtocolRecommendations } from '../utils/readyScore';
import { formatRelativeTime } from '../utils/dateUtils';
import CircularProgress from '../components/CircularProgress';
import Card from '../components/Card';
import Button from '../components/Button';

export default function Home() {
  const router = useRouter();
  const tests = useTestStore((state) => state.tests);

  // Calculate ReadyScore
  const readyScore = useMemo(() => calculateReadyScore(tests), [tests]);
  const protocols = useMemo(() => getProtocolRecommendations(readyScore.score), [readyScore.score]);

  // Empty state - no tests yet
  if (tests.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🚀</Text>
          <Text style={styles.emptyTitle}>Welcome to HormoIQ</Text>
          <Text style={styles.emptyText}>
            Your personal hormone optimization platform.{'\n\n'}
            Start by logging your first test to see your ReadyScore!
          </Text>
          <View style={styles.emptyAction}>
            <Button
              title="Take Your First Test"
              onPress={() => router.push('/test')}
              size="large"
              fullWidth
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Your ReadyScore</Text>
        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        })}</Text>
      </View>

      {/* ReadyScore Circle */}
      <View style={styles.scoreSection}>
        <CircularProgress
          score={readyScore.score}
          size={220}
          strokeWidth={16}
          color={readyScore.color}
        />
        <View style={styles.scoreInfo}>
          <Text style={[styles.scoreLabel, { color: Colors[`score${readyScore.color.charAt(0).toUpperCase() + readyScore.color.slice(1)}` as keyof typeof Colors] }]}>
            {readyScore.label}
          </Text>
          <Text style={styles.scoreSubtext}>
            Updated {formatRelativeTime(readyScore.lastUpdated)}
          </Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceText}>
              {readyScore.confidence === 'high' ? '✅ High' : 
               readyScore.confidence === 'medium' ? '🟡 Medium' : 
               '🔴 Low'} confidence
            </Text>
          </View>
        </View>
      </View>

      {/* Protocol Section */}
      <Card variant="elevated" padding="lg">
        <Text style={styles.protocolTitle}>Your Protocol for Today</Text>
        <Text style={styles.protocolSubtitle}>
          Personalized recommendations based on your biology
        </Text>
        <View style={styles.protocolList}>
          {protocols.map((protocol, index) => (
            <View key={index} style={styles.protocolItem}>
              <Text style={styles.protocolText}>{protocol}</Text>
            </View>
          ))}
        </View>
      </Card>

      {/* Quick Actions */}
      <View style={styles.actions}>
        <Button
          title="Take Test Now"
          onPress={() => router.push('/test')}
          variant="primary"
          fullWidth
          size="large"
        />
        <View style={{ height: Spacing.md }} />
        <View style={styles.actionRow}>
          <View style={{ flex: 1, marginRight: Spacing.sm }}>
            <Button
              title="View Track"
              onPress={() => router.push('/track')}
              variant="outline"
              size="medium"
            />
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <Button
              title="Ask AI"
              onPress={() => router.push('/ask')}
              variant="outline"
              size="medium"
            />
          </View>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{tests.length}</Text>
          <Text style={styles.statLabel}>Total Tests</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {tests.filter(t => {
              const testDate = new Date(t.timestamp);
              const today = new Date();
              return testDate.toDateString() === today.toDateString();
            }).length}
          </Text>
          <Text style={styles.statLabel}>Today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {tests.filter(t => {
              const now = Date.now();
              const weekAgo = now - (7 * 24 * 60 * 60 * 1000);
              return new Date(t.timestamp).getTime() >= weekAgo;
            }).length}
          </Text>
          <Text style={styles.statLabel}>This Week</Text>
        </View>
      </View>
    </ScrollView>
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
  greeting: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  scoreInfo: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  scoreLabel: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
    marginBottom: Spacing.xs,
  },
  scoreSubtext: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  confidenceBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  confidenceText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  protocolTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  protocolSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  protocolList: {
    gap: Spacing.md,
  },
  protocolItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  protocolText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    lineHeight: Typography.normal * Typography.base,
  },
  actions: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  actionRow: {
    flexDirection: 'row',
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.bold,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },

  // Empty state
  emptyContent: {
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
    textAlign: 'center',
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

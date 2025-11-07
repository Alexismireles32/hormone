// Hormone Trend Chart Component
// Following .cursorrules: Animate draw-in, color-code by hormone

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Test, HormoneType } from '../types';
import { Colors, Spacing, Typography, HormoneNames } from '../constants/theme';
import { formatChartDate } from '../utils/dateUtils';

interface HormoneChartProps {
  tests: Test[];
  hormoneType: HormoneType;
}

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - Spacing.md * 4; // Account for padding

export default function HormoneChart({ tests, hormoneType }: HormoneChartProps) {
  // Filter and sort tests by hormone type
  const hormoneTests = tests
    .filter((t) => t.hormoneType === hormoneType)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .slice(-7); // Last 7 tests

  if (hormoneTests.length === 0) {
    return (
      <View style={styles.emptyChart}>
        <Text style={styles.emptyText}>
          No {HormoneNames[hormoneType]} tests yet
        </Text>
      </View>
    );
  }

  // Prepare data for chart
  const chartData = hormoneTests.map((test, index) => ({
    x: index + 1,
    y: test.value,
    label: formatChartDate(test.timestamp),
  }));

  const hormoneColor = Colors[hormoneType];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{HormoneNames[hormoneType]} Trend</Text>
      <Text style={styles.subtitle}>Last {hormoneTests.length} tests</Text>
      
      {/* Simple placeholder chart for now - Victory Native has compatibility issues */}
      <View style={styles.chartPlaceholder}>
        <View style={styles.chartLine}>
          {chartData.map((point, index) => (
            <View key={index} style={styles.chartPoint}>
              <View style={[styles.chartDot, { backgroundColor: hormoneColor }]} />
              <Text style={styles.chartLabel}>{point.y}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.chartNote}>
          Values: {chartData.map(d => d.y).join(' → ')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  chartPlaceholder: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.lg,
    minHeight: 150,
  },
  chartLine: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: Spacing.md,
  },
  chartPoint: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  chartDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  chartLabel: {
    fontSize: Typography.sm,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  chartNote: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  emptyChart: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  emptyText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
});


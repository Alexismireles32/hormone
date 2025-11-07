// BioAge Card Component
// Following PRD: Large number display, comparison, confidence

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BioAge } from '../types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../constants/theme';
import Card from './Card';

interface BioAgeCardProps {
  bioAge: BioAge;
  onInfoPress?: () => void;
}

export default function BioAgeCard({ bioAge, onInfoPress }: BioAgeCardProps) {
  const isYounger = bioAge.difference > 0;
  const ageColor = isYounger ? Colors.success : bioAge.difference < 0 ? Colors.warning : Colors.textPrimary;

  return (
    <Card variant="elevated" padding="lg">
      <View style={styles.header}>
        <Text style={styles.title}>Your BioAge</Text>
        {onInfoPress && (
          <TouchableOpacity onPress={onInfoPress} style={styles.infoButton}>
            <Text style={styles.infoIcon}>ⓘ</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {/* Main BioAge Number */}
        <View style={styles.mainAge}>
          <Text style={[styles.bioAgeNumber, { color: ageColor }]}>
            {bioAge.biologicalAge}
          </Text>
          <Text style={styles.yearsLabel}>years</Text>
        </View>

        {/* Comparison */}
        <View style={styles.comparison}>
          <Text style={styles.comparisonLabel}>Your chronological age</Text>
          <Text style={styles.chronologicalAge}>{bioAge.chronologicalAge}</Text>
        </View>

        {/* Difference */}
        {bioAge.difference !== 0 && (
          <View style={[styles.badge, { backgroundColor: ageColor + '15' }]}>
            <Text style={[styles.badgeText, { color: ageColor }]}>
              {isYounger ? '🎉 ' : '⚠️ '}
              You're {Math.abs(bioAge.difference)} year{Math.abs(bioAge.difference) !== 1 ? 's' : ''}{' '}
              {isYounger ? 'younger' : 'older'} biologically
            </Text>
          </View>
        )}

        {/* Confidence */}
        <View style={styles.footer}>
          <Text style={styles.confidenceText}>
            Based on {bioAge.basedOnTests} test{bioAge.basedOnTests !== 1 ? 's' : ''}
          </Text>
          <View style={styles.confidenceBadge}>
            <Text style={styles.confidenceLabel}>
              {bioAge.confidence === 'high' ? '✅ High' : 
               bioAge.confidence === 'medium' ? '🟡 Medium' : 
               '🔴 Low'} confidence
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
  },
  infoButton: {
    padding: Spacing.xs,
  },
  infoIcon: {
    fontSize: Typography.xl,
    color: Colors.textSecondary,
  },
  content: {
    alignItems: 'center',
  },
  mainAge: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  bioAgeNumber: {
    fontSize: 72,
    fontWeight: Typography.bold,
    lineHeight: 80,
  },
  yearsLabel: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  comparison: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  comparisonLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  chronologicalAge: {
    fontSize: Typography.xxl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  badge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.button,
    marginBottom: Spacing.lg,
  },
  badgeText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    width: '100%',
  },
  confidenceText: {
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
  confidenceLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
});


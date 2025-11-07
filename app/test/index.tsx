// Test Tab - Hormone Selection Screen
// Following PRD: Smart pre-selection based on time of day
// Following .cursorrules: Include empty states, make it functional first

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { HormoneType } from '../../types';
import { Colors, Spacing, Typography, HormoneNames } from '../../constants/theme';
import { useTestStore } from '../../stores/testStore';
import Card from '../../components/Card';
import Button from '../../components/Button';

export default function TestSelection() {
  const router = useRouter();
  const tests = useTestStore((state) => state.tests);
  const [selectedHormone, setSelectedHormone] = useState<HormoneType | null>(
    getSmartDefault()
  );

  // Smart default based on time of day
  function getSmartDefault(): HormoneType {
    const hour = new Date().getHours();
    
    // Morning (6 AM - 12 PM): Cortisol is best to test
    if (hour >= 6 && hour < 12) {
      return HormoneType.CORTISOL;
    }
    
    // Afternoon/Evening: Testosterone
    return HormoneType.TESTOSTERONE;
  }

  function getLastTestTime(hormoneType: HormoneType): string {
    const hormoneTests = tests.filter((t) => t.hormoneType === hormoneType);
    if (hormoneTests.length === 0) return 'Never tested';
    
    const lastTest = hormoneTests[0]; // Already sorted newest first
    const hoursAgo = Math.floor(
      (Date.now() - new Date(lastTest.timestamp).getTime()) / (1000 * 60 * 60)
    );
    
    if (hoursAgo < 1) return 'Less than 1 hour ago';
    if (hoursAgo < 24) return `${hoursAgo} hours ago`;
    const daysAgo = Math.floor(hoursAgo / 24);
    return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
  }

  function handleContinue() {
    if (!selectedHormone) return;
    
    // Navigate to input form with selected hormone
    router.push({
      pathname: '/test/input',
      params: { hormoneType: selectedHormone },
    });
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>What are you testing?</Text>
          <Text style={styles.subtitle}>
            Select the hormone you want to log
          </Text>
        </View>

        <View style={styles.hormoneCards}>
          {/* Cortisol Card */}
          <Card
            onPress={() => setSelectedHormone(HormoneType.CORTISOL)}
            variant={selectedHormone === HormoneType.CORTISOL ? 'elevated' : 'default'}
          >
            <View style={styles.hormoneCard}>
              <View
                style={[
                  styles.hormoneIcon,
                  { backgroundColor: Colors.cortisol + '20' },
                ]}
              >
                <Text style={[styles.hormoneIconText, { color: Colors.cortisol }]}>
                  C
                </Text>
              </View>
              <View style={styles.hormoneInfo}>
                <Text style={styles.hormoneName}>{HormoneNames.cortisol}</Text>
                <Text style={styles.lastTested}>
                  Last tested: {getLastTestTime(HormoneType.CORTISOL)}
                </Text>
              </View>
              {selectedHormone === HormoneType.CORTISOL && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          </Card>

          {/* Testosterone Card */}
          <Card
            onPress={() => setSelectedHormone(HormoneType.TESTOSTERONE)}
            variant={selectedHormone === HormoneType.TESTOSTERONE ? 'elevated' : 'default'}
          >
            <View style={styles.hormoneCard}>
              <View
                style={[
                  styles.hormoneIcon,
                  { backgroundColor: Colors.testosterone + '20' },
                ]}
              >
                <Text style={[styles.hormoneIconText, { color: Colors.testosterone }]}>
                  T
                </Text>
              </View>
              <View style={styles.hormoneInfo}>
                <Text style={styles.hormoneName}>{HormoneNames.testosterone}</Text>
                <Text style={styles.lastTested}>
                  Last tested: {getLastTestTime(HormoneType.TESTOSTERONE)}
                </Text>
              </View>
              {selectedHormone === HormoneType.TESTOSTERONE && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          </Card>

          {/* DHEA Card */}
          <Card
            onPress={() => setSelectedHormone(HormoneType.DHEA)}
            variant={selectedHormone === HormoneType.DHEA ? 'elevated' : 'default'}
          >
            <View style={styles.hormoneCard}>
              <View
                style={[
                  styles.hormoneIcon,
                  { backgroundColor: Colors.dhea + '20' },
                ]}
              >
                <Text style={[styles.hormoneIconText, { color: Colors.dhea }]}>
                  D
                </Text>
              </View>
              <View style={styles.hormoneInfo}>
                <Text style={styles.hormoneName}>{HormoneNames.dhea}</Text>
                <Text style={styles.lastTested}>
                  Last tested: {getLastTestTime(HormoneType.DHEA)}
                </Text>
              </View>
              {selectedHormone === HormoneType.DHEA && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </View>
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedHormone}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.xl,
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
  },
  hormoneCards: {
    gap: Spacing.md,
  },
  hormoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  hormoneIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  hormoneIconText: {
    fontSize: Typography.xxl,
    fontWeight: Typography.bold,
  },
  hormoneInfo: {
    flex: 1,
  },
  hormoneName: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  lastTested: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: Colors.white,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
});


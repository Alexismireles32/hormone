// Welcome Screen - First impression
// Following .cursorrules: Fast, delightful, clear value prop

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import Button from '../../components/Button';
import { lightTap } from '../../utils/haptics';

export default function Welcome() {
  const router = useRouter();

  const handleGetStarted = () => {
    lightTap();
    router.push('/onboarding/profile');
  };

  const handleSkip = () => {
    lightTap();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.logo}>⚡️</Text>
          <Text style={styles.appName}>HormoIQ</Text>
          <Text style={styles.tagline}>Your Personal Hormone Coach</Text>
        </View>

        {/* Value Proposition */}
        <View style={styles.valueSection}>
          <View style={styles.valueItem}>
            <Text style={styles.valueIcon}>🧪</Text>
            <Text style={styles.valueTitle}>Track Hormones</Text>
            <Text style={styles.valueDescription}>
              Log cortisol, testosterone, DHEA with context
            </Text>
          </View>

          <View style={styles.valueItem}>
            <Text style={styles.valueIcon}>🧠</Text>
            <Text style={styles.valueTitle}>Get Smart Insights</Text>
            <Text style={styles.valueDescription}>
              AI discovers patterns and correlations in your data
            </Text>
          </View>

          <View style={styles.valueItem}>
            <Text style={styles.valueIcon}>📈</Text>
            <Text style={styles.valueTitle}>Optimize Biology</Text>
            <Text style={styles.valueDescription}>
              Learn what works for YOUR unique body
            </Text>
          </View>
        </View>

        {/* Social Proof */}
        <Text style={styles.socialProof}>
          Join thousands optimizing their hormones
        </Text>
      </View>

      {/* CTA Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          fullWidth
        />
        <Button
          title="I'll explore first"
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
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl * 2,
  },
  logo: {
    fontSize: 80,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: Typography.display,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  tagline: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
  },
  valueSection: {
    marginBottom: Spacing.xxl,
  },
  valueItem: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  valueIcon: {
    fontSize: 48,
    marginBottom: Spacing.sm,
  },
  valueTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  valueDescription: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.normal * Typography.base,
  },
  socialProof: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonContainer: {
    padding: Spacing.xl,
    gap: Spacing.md,
  },
});


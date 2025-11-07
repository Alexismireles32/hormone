// First Test Experience - Simplified for instant gratification
// Following .cursorrules: No context tags, just value + time

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius, HormoneNames, HormoneUnits } from '../../constants/theme';
import { HormoneType } from '../../types';
import { useTestStore } from '../../stores/testStore';
import Button from '../../components/Button';
import { mediumTap } from '../../utils/haptics';

export default function FirstTest() {
  const router = useRouter();
  const addTest = useTestStore((state) => state.addTest);
  
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Pre-select Cortisol (easiest to understand)
  const hormoneType = HormoneType.CORTISOL;

  const handleSave = () => {
    const numValue = parseFloat(value);

    if (isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid number');
      return;
    }

    if (numValue > 100) {
      setError('This seems unusually high. Double check?');
      return;
    }

    mediumTap();

    // Save test with default context (skip context tags for first test)
    const test = {
      hormoneType,
      value: numValue,
      timestamp: new Date(),
      context: {
        sleepQuality: 3 as 1 | 2 | 3 | 4 | 5, // Default
        exercised: false,
        stressLevel: 3 as 1 | 2 | 3 | 4 | 5, // Default
      },
    };

    addTest(test);
    
    // Go to celebration
    router.push({
      pathname: '/onboarding/celebration',
      params: {
        hormoneType,
        value: numValue.toString(),
      },
    });
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Take Your First Test</Text>
        <Text style={styles.subtitle}>
          We'll start with cortisol - your body's stress hormone
        </Text>
      </View>

      {/* Hormone Info */}
      <View style={styles.infoCard}>
        <Text style={styles.infoEmoji}>🧪</Text>
        <Text style={styles.infoTitle}>Cortisol</Text>
        <Text style={styles.infoDescription}>
          Measured in {HormoneUnits[hormoneType]}. Normal range is typically 5-25 ng/mL, depending on time of day.
        </Text>
      </View>

      {/* Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What's your cortisol level?</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="15.2"
            keyboardType="decimal-pad"
            value={value}
            onChangeText={(text) => {
              setValue(text);
              setError('');
            }}
            autoFocus
          />
          <Text style={styles.unit}>{HormoneUnits[hormoneType]}</Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Helper Text */}
      <View style={styles.helperCard}>
        <Text style={styles.helperTitle}>💡 Pro Tip</Text>
        <Text style={styles.helperText}>
          Context tags (like sleep quality and exercise) make insights better, but you can add those later. Let's just get your first test logged!
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Save My First Test"
          onPress={handleSave}
          disabled={!value}
          fullWidth
        />
        <Button
          title="I'll do this later"
          onPress={handleSkip}
          variant="outline"
          fullWidth
        />
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
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    marginBottom: Spacing.xxl,
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
    lineHeight: Typography.normal * Typography.base,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.card,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xxl,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  infoEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  infoTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoDescription: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.normal * Typography.base,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.input,
    padding: Spacing.lg,
    fontSize: Typography.xxxl,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.border,
    textAlign: 'center',
    fontWeight: Typography.bold,
  },
  unit: {
    fontSize: Typography.lg,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
  helperCard: {
    backgroundColor: Colors.primaryLight + '20',
    borderRadius: BorderRadius.card,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  helperTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  helperText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    lineHeight: Typography.normal * Typography.sm,
  },
  buttonContainer: {
    gap: Spacing.md,
  },
});


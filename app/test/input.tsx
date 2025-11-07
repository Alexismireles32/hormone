// Test Input Form
// Following PRD: Validation, context tags, smart defaults
// Following .cursorrules: Optimistic UI, validate ranges

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { HormoneType } from '../../types';
import { Colors, Spacing, Typography, BorderRadius, HormoneNames, HormoneUnits } from '../../constants/theme';
import { useTestStore } from '../../stores/testStore';
import { getSmartDefaults } from '../../utils/intelligence';
import Button from '../../components/Button';

export default function TestInput() {
  const router = useRouter();
  const params = useLocalSearchParams<{ hormoneType: HormoneType }>();
  const hormoneType = params.hormoneType;
  const tests = useTestStore((state) => state.tests);

  // Get smart defaults based on history
  const smartDefaults = React.useMemo(() => getSmartDefaults(tests), [tests]);

  const [value, setValue] = useState('');
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(smartDefaults.sleepQuality);
  const [exercised, setExercised] = useState(smartDefaults.exercised);
  const [stressLevel, setStressLevel] = useState<1 | 2 | 3 | 4 | 5>(smartDefaults.stressLevel);
  const [supplements, setSupplements] = useState('');
  const [error, setError] = useState('');

  function validateValue(): boolean {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue <= 0) {
      setError('Please enter a valid positive number');
      return false;
    }
    
    // Basic range validation (could be more sophisticated)
    if (numValue > 10000) {
      setError('Value seems unusually high. Please double-check.');
      return false;
    }
    
    setError('');
    return true;
  }

  function handleContinue() {
    if (!validateValue()) return;
    
    // Navigate to confirmation with all data
    router.push({
      pathname: '/test/confirm',
      params: {
        hormoneType,
        value,
        sleepQuality: sleepQuality.toString(),
        exercised: exercised.toString(),
        stressLevel: stressLevel.toString(),
        supplements,
      },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>
            {HormoneNames[hormoneType]} Test
          </Text>
          <Text style={styles.subtitle}>
            Enter your test result and context
          </Text>
        </View>

        {/* Value Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Test Value ({HormoneUnits[hormoneType]})
          </Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            value={value}
            onChangeText={(text) => {
              setValue(text);
              setError('');
            }}
            placeholder="Enter value"
            keyboardType="decimal-pad"
            autoFocus
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
        </View>

        {/* Sleep Quality */}
        <View style={styles.section}>
          <Text style={styles.label}>Sleep Quality (Last Night)</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setSleepQuality(star as 1 | 2 | 3 | 4 | 5)}
                style={styles.star}
              >
                <Text
                  style={[
                    styles.starText,
                    sleepQuality >= star && styles.starTextActive,
                  ]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helperText}>
            {sleepQuality <= 2
              ? 'Poor sleep'
              : sleepQuality === 3
              ? 'Average sleep'
              : 'Good sleep'}
          </Text>
        </View>

        {/* Exercise */}
        <View style={styles.section}>
          <View style={styles.switchRow}>
            <View style={styles.switchLabel}>
              <Text style={styles.label}>Exercised Today</Text>
              <Text style={styles.helperText}>Did you work out today?</Text>
            </View>
            <Switch
              value={exercised}
              onValueChange={setExercised}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Stress Level */}
        <View style={styles.section}>
          <Text style={styles.label}>Stress Level (Today)</Text>
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setStressLevel(level as 1 | 2 | 3 | 4 | 5)}
                style={[
                  styles.stressButton,
                  stressLevel === level && styles.stressButtonActive,
                ]}
              >
                <Text
                  style={[
                    styles.stressButtonText,
                    stressLevel === level && styles.stressButtonTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.helperText}>
            {stressLevel <= 2
              ? 'Low stress'
              : stressLevel === 3
              ? 'Moderate stress'
              : 'High stress'}
          </Text>
        </View>

        {/* Supplements (Optional) */}
        <View style={styles.section}>
          <Text style={styles.label}>Supplements (Optional)</Text>
          <TextInput
            style={styles.input}
            value={supplements}
            onChangeText={setSupplements}
            placeholder="e.g., Vitamin D, Zinc, Ashwagandha"
            multiline
            numberOfLines={2}
          />
          <Text style={styles.helperText}>
            Separate multiple supplements with commas
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!value}
          fullWidth
          size="large"
        />
      </View>
    </KeyboardAvoidingView>
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
  section: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.input,
    padding: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
  helperText: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
    marginTop: Spacing.xs,
  },
  starRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  star: {
    padding: Spacing.sm,
  },
  starText: {
    fontSize: Typography.xxxl,
    color: Colors.border,
  },
  starTextActive: {
    color: Colors.warning,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
  },
  stressButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  stressButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stressButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textSecondary,
  },
  stressButtonTextActive: {
    color: Colors.white,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
});


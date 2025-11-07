// Profile Collection - Minimal friction
// Following .cursorrules: Only essential data, skip options

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useUserStore } from '../../stores/userStore';
import Button from '../../components/Button';
import { lightTap, mediumTap } from '../../utils/haptics';

export default function ProfileSetup() {
  const router = useRouter();
  const setProfile = useUserStore((state) => state.setProfile);

  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | 'prefer-not-to-say' | null>(null);
  const [goal, setGoal] = useState<string | null>(null);

  const currentYear = new Date().getFullYear();
  const age = birthYear ? currentYear - parseInt(birthYear) : null;

  const goals = [
    { id: 'energy', label: 'More Energy', emoji: '⚡' },
    { id: 'fitness', label: 'Fitness', emoji: '💪' },
    { id: 'sleep', label: 'Better Sleep', emoji: '😴' },
    { id: 'stress', label: 'Less Stress', emoji: '🧘' },
    { id: 'health', label: 'General Health', emoji: '🎯' },
  ];

  const handleContinue = () => {
    mediumTap();
    
    // Save profile
    const profileData = {
      birthYear: parseInt(birthYear) || 1990,
      gender: gender || 'prefer-not-to-say',
      goals: goal ? [goal] : ['health'],
      createdAt: new Date(),
    };
    
    setProfile(profileData);
    router.push('/onboarding/first-test');
  };

  const handleSkip = () => {
    lightTap();
    // Save default profile
    setProfile({
      birthYear: 1990,
      gender: 'prefer-not-to-say',
      goals: ['health'],
      createdAt: new Date(),
    });
    router.push('/onboarding/first-test');
  };

  const isValid = birthYear && parseInt(birthYear) >= 1920 && parseInt(birthYear) <= currentYear;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Quick Setup</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>
      </View>

      {/* Birth Year */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>What's your birth year?</Text>
        <Text style={styles.helper}>Used for BioAge calculation</Text>
        <TextInput
          style={styles.input}
          placeholder="1990"
          keyboardType="number-pad"
          value={birthYear}
          onChangeText={setBirthYear}
          maxLength={4}
        />
        {age && age > 0 && age < 120 && (
          <Text style={styles.ageDisplay}>You're {age} years old</Text>
        )}
      </View>

      {/* Gender */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Gender (Optional)</Text>
        <Text style={styles.helper}>For personalized hormone ranges</Text>
        <View style={styles.optionGrid}>
          {(['male', 'female', 'other', 'prefer-not-to-say'] as const).map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                gender === option && styles.optionButtonSelected,
              ]}
              onPress={() => {
                lightTap();
                setGender(option);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  gender === option && styles.optionTextSelected,
                ]}
              >
                {option === 'male' ? 'Male' : option === 'female' ? 'Female' : option === 'other' ? 'Other' : 'Prefer not to say'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Goal */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Main Goal (Optional)</Text>
        <Text style={styles.helper}>What brought you here?</Text>
        <View style={styles.goalGrid}>
          {goals.map((g) => (
            <TouchableOpacity
              key={g.id}
              style={[
                styles.goalButton,
                goal === g.id && styles.goalButtonSelected,
              ]}
              onPress={() => {
                lightTap();
                setGoal(g.id);
              }}
            >
              <Text style={styles.goalEmoji}>{g.emoji}</Text>
              <Text
                style={[
                  styles.goalText,
                  goal === g.id && styles.goalTextSelected,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!isValid}
          fullWidth
        />
        <Button
          title="Skip for now"
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
  },
  inputGroup: {
    marginBottom: Spacing.xxl,
  },
  label: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  helper: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.input,
    padding: Spacing.md,
    fontSize: Typography.xl,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.border,
    textAlign: 'center',
    fontWeight: Typography.semibold,
  },
  ageDisplay: {
    fontSize: Typography.base,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    fontWeight: Typography.medium,
  },
  optionGrid: {
    gap: Spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.button,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    textAlign: 'center',
    fontWeight: Typography.medium,
  },
  optionTextSelected: {
    color: Colors.white,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  goalButton: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.button,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    width: '48%',
    alignItems: 'center',
  },
  goalButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  goalEmoji: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  goalText: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  goalTextSelected: {
    color: Colors.white,
  },
  buttonContainer: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
});


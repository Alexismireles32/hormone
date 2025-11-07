// Reusable Card Component
// Following .cursorrules: 16px border radius for cards

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '../constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated';
  padding?: keyof typeof Spacing;
}

export default function Card({
  children,
  onPress,
  variant = 'default',
  padding = 'md',
}: CardProps) {
  const cardStyle = [
    styles.base,
    styles[variant],
    { padding: Spacing[padding] },
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.card,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  default: {
    ...Shadows.subtle,
  },
  elevated: {
    ...Shadows.card,
  },
});


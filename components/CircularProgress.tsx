// Circular Progress Ring Component
// Following .cursorrules: Animate fills, use React Native SVG

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Colors, Typography } from '../constants/theme';

interface CircularProgressProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color: 'green' | 'yellow' | 'orange' | 'red';
}

export default function CircularProgress({
  score,
  size = 200,
  strokeWidth = 12,
  color,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const strokeDashoffset = circumference - progress;

  // Get color based on score
  const strokeColor = Colors[`score${color.charAt(0).toUpperCase() + color.slice(1)}` as keyof typeof Colors];

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.borderLight}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* Score text in center */}
      <View style={styles.scoreContainer}>
        <Text style={[styles.scoreText, { color: strokeColor }]}>{score}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: Typography.hero,
    fontWeight: Typography.bold,
  },
});


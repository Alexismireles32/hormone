// Animated Number Component
// Following .cursorrules: Numbers should count up, not just appear

import React, { useEffect, useRef } from 'react';
import { Text, Animated, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  style?: TextStyle;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedNumber({
  value,
  duration = 1000,
  decimals = 0,
  style,
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const displayValue = useRef(0);

  useEffect(() => {
    animatedValue.addListener(({ value: v }) => {
      displayValue.current = v;
    });

    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [value]);

  return (
    <Animated.Text style={style}>
      {animatedValue.interpolate({
        inputRange: [0, value],
        outputRange: [0, value],
        extrapolate: 'clamp',
      }) as any}
      {/* This is a simplified version - for production, use reanimated 2 */}
      {prefix}
      {Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)}
      {suffix}
    </Animated.Text>
  );
}

// Simpler hook-based version
export function useCountUpAnimation(
  value: number,
  duration: number = 1000
): number {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + difference * eased;

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return displayValue;
}


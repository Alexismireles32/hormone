// Confetti Animation Component
// Following .cursorrules: Delightful micro-interactions

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ConfettiProps {
  count?: number;
  duration?: number;
}

export default function Confetti({ count = 50, duration = 3000 }: ConfettiProps) {
  const confettiPieces = useRef(
    Array.from({ length: count }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-50),
      rotate: new Animated.Value(0),
      color: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'][
        Math.floor(Math.random() * 6)
      ],
    }))
  ).current;

  useEffect(() => {
    confettiPieces.forEach((piece, index) => {
      const delay = Math.random() * 500;
      const fallDuration = duration + Math.random() * 1000;

      Animated.parallel([
        Animated.timing(piece.y, {
          toValue: height + 100,
          duration: fallDuration,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotate, {
          toValue: 360 * 3,
          duration: fallDuration,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  confetti: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});


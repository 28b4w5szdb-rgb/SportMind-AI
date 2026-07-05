import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export function TypingIndicator() {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        ])
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 150);
    const a3 = animate(dot3, 300);
    a1.start();
    a2.start();
    a3.start();
    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [dot1, dot2, dot3]);

  return (
    <View style={[styles.row, { flexDirection: flexRow(true), marginBottom: theme.spacing.md }]}>
      <LinearGradient
        colors={['#0066FF', '#0D9488']}
        style={[styles.avatar, { borderRadius: theme.borderRadius.lg }]}
      >
        <Ionicons name="sparkles" size={16} color="#FFF" />
      </LinearGradient>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius['2xl'],
            borderWidth: 1,
            marginHorizontal: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
          },
        ]}
      >
        <View style={[styles.dots, { flexDirection: flexRow(true) }]}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: dot,
                  marginHorizontal: 3,
                },
              ]}
            />
          ))}
        </View>
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
          {isRTL ? 'المدرب يكتب…' : 'Coach is typing…'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'flex-end' },
  avatar: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  bubble: {},
  dots: { alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

/**
 * SportMind AI — Skeleton loading placeholder with brand shimmer.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '@/src/core/theme';
import { brandMotion } from '@/src/core/theme/brand';
import { useDirection } from '@/src/providers/DirectionProvider';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const theme = useTheme();
  const { isRTL } = useDirection();
  const shimmer = useSharedValue(isRTL ? 1 : 0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(isRTL ? 0 : 1, {
        duration: brandMotion.skeletonShimmerMs,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, [isRTL, shimmer]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (shimmer.value - 0.5) * 120 }],
  }));

  return (
    <View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.colors.backgroundTertiary,
          overflow: 'hidden',
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmerStyle]}>
        <LinearGradient
          colors={[
            'transparent',
            theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.65)',
            'transparent',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

interface SkeletonCardProps {
  lines?: number;
  style?: ViewStyle;
}

export function SkeletonCard({ lines = 3, style }: SkeletonCardProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        {
          padding: theme.spacing.md,
          borderRadius: theme.borderRadius['2xl'],
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
          marginBottom: theme.spacing.md,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.md }}>
        <Skeleton width={48} height={48} borderRadius={12} />
        <View style={{ flex: 1, marginStart: theme.spacing.md }}>
          <Skeleton width="70%" height={14} style={{ marginBottom: 8 }} />
          <Skeleton width="45%" height={12} />
        </View>
      </View>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={i === lines - 1 ? '60%' : '100%'} height={12} style={{ marginBottom: 8 }} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {},
});

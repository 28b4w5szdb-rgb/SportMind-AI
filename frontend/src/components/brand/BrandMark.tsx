/**
 * SportMind AI — Brand Mark (icon only)
 * Canonical logo mark: gradient tile + fitness icon.
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/src/core/theme';
import { brandGradients } from '@/src/core/theme/brand';

export type BrandMarkSize = 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<BrandMarkSize, { box: number; icon: number; radius: number }> = {
  sm: { box: 40, icon: 20, radius: 12 },
  md: { box: 56, icon: 28, radius: 16 },
  lg: { box: 72, icon: 36, radius: 20 },
  xl: { box: 96, icon: 48, radius: 28 },
};

interface BrandMarkProps {
  size?: BrandMarkSize;
  style?: ViewStyle;
  accessibilityLabel?: string;
}

export function BrandMark({ size = 'md', style, accessibilityLabel = 'SportMind AI' }: BrandMarkProps) {
  const theme = useTheme();
  const dims = SIZES[size];
  const gradient = theme.isDark ? brandGradients.primaryDark : brandGradients.primary;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[styles.wrap, style]}
    >
      <LinearGradient
        colors={[...gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.mark,
          {
            width: dims.box,
            height: dims.box,
            borderRadius: dims.radius,
            ...theme.shadows.md,
          },
        ]}
      >
        <Ionicons name="fitness" size={dims.icon} color="#FFFFFF" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

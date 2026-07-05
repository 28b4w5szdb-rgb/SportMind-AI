/**
 * SportMind AI - Premium Card Component
 * Flexible card with glassmorphism, gradients, and multiple variants
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/src/core/theme';

export type CardVariant =
  | 'elevated'
  | 'outlined'
  | 'filled'
  | 'ghost'
  | 'gradient'
  | 'glass';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
  borderRadius?: keyof typeof import('@/src/core/theme/spacing').borderRadius;
  style?: ViewStyle;
  gradientColors?: string[];
  gradientHorizontal?: boolean;
}

const paddingMap: Record<CardPadding, number> = {
  none: 0,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export function Card({
  children,
  variant = 'elevated',
  padding = 'md',
  borderRadius = 'xl',
  style,
  gradientColors,
  gradientHorizontal = false,
}: CardProps) {
  const theme = useTheme();

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surface,
          ...theme.shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.backgroundSecondary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
      case 'gradient':
        return {
          backgroundColor: 'transparent',
        };
      case 'glass':
        return {
          backgroundColor: theme.colors.surface + 'CC',
          borderWidth: 1,
          borderColor: theme.colors.border + '40',
          ...theme.shadows.sm,
        };
      default:
        return {
          backgroundColor: theme.colors.surface,
        };
    }
  };

  const containerStyles: ViewStyle[] = [
    styles.base,
    {
      borderRadius: theme.borderRadius[borderRadius],
      padding: paddingMap[padding],
    },
    getVariantStyles(),
  ];

  // Gradient variant wrapper
  if (variant === 'gradient' && (gradientColors || theme.gradients)) {
    const colors = gradientColors || ['#0066FF', '#0D9488'];
    return (
      <View style={[containerStyles, style, { overflow: 'hidden', padding: 0 }]}>
        <LinearGradient
          colors={colors}
          start={gradientHorizontal ? { x: 0, y: 0.5 } : { x: 0, y: 0 }}
          end={gradientHorizontal ? { x: 1, y: 0.5 } : { x: 0, y: 1 }}
          style={{ padding: paddingMap[padding], borderRadius: theme.borderRadius[borderRadius] }}
        >
          {children}
        </LinearGradient>
      </View>
    );
  }

  return <View style={[containerStyles, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

// Subcomponents for structured cards
export function CardHeader({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[{ marginBottom: 12 }, style]}>{children}</View>;
}

export function CardContent({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[style]}>{children}</View>;
}

export function CardFooter({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[{ marginTop: 12 }, style]}>{children}</View>;
}

export function CardDivider({ style }: { style?: ViewStyle }) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          height: 1,
          backgroundColor: theme.colors.border,
          marginVertical: 12,
        },
        style,
      ]}
    />
  );
}

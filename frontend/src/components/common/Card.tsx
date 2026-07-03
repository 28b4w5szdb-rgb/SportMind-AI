/**
 * SportMind AI - Card Component
 * Reusable card with glassmorphism effect
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/src/core/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof import('@/src/core/theme').spacing;
  style?: ViewStyle;
}

export function Card({ children, variant = 'elevated', padding = 'md', style }: CardProps) {
  const theme = useTheme();
  
  const cardStyles: ViewStyle[] = [
    styles.base,
    {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
    },
  ];
  
  // Apply padding
  cardStyles.push({ padding: theme.spacing[padding] });
  
  // Variant styles
  if (variant === 'elevated') {
    cardStyles.push(theme.shadows.md);
  } else if (variant === 'outlined') {
    cardStyles.push({
      borderWidth: 1,
      borderColor: theme.colors.border,
    });
  } else if (variant === 'filled') {
    cardStyles.push({
      backgroundColor: theme.colors.backgroundSecondary,
    });
  }
  
  return <View style={[cardStyles, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});

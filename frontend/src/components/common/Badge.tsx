/**
 * SportMind AI - Badge Component
 * Status badges and labels
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/src/core/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', style }: BadgeProps) {
  const theme = useTheme();
  
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: theme.colors.success + '20', text: theme.colors.success };
      case 'warning':
        return { bg: theme.colors.warning + '20', text: theme.colors.warning };
      case 'error':
        return { bg: theme.colors.error + '20', text: theme.colors.error };
      case 'info':
        return { bg: theme.colors.info + '20', text: theme.colors.info };
      default:
        return { bg: theme.colors.backgroundTertiary, text: theme.colors.textSecondary };
    }
  };
  
  const colors = getColors();
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
        },
        style,
      ]}
    >
      <Text style={[theme.typography.caption, { color: colors.text, fontWeight: '600' }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});

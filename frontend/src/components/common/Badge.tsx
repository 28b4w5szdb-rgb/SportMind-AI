/**
 * SportMind AI - Badge Component
 * Status badges and labels
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme, useTypography } from '@/src/core/theme';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** Custom accent when variant alone is insufficient (e.g. trend pills). */
  toneColor?: string;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'neutral', toneColor, style }: BadgeProps) {
  const theme = useTheme();
  const type = useTypography();
  const bgAlpha = theme.isDark ? '30' : '20';

  const getColors = () => {
    if (toneColor) {
      return { bg: toneColor + bgAlpha, text: toneColor };
    }
    switch (variant) {
      case 'success':
        return { bg: theme.colors.success + bgAlpha, text: theme.colors.success };
      case 'warning':
        return { bg: theme.colors.warning + bgAlpha, text: theme.colors.warning };
      case 'error':
        return { bg: theme.colors.error + bgAlpha, text: theme.colors.error };
      case 'info':
        return { bg: theme.colors.info + bgAlpha, text: theme.colors.info };
      default:
        return { bg: theme.colors.backgroundTertiary, text: theme.colors.textSecondary };
    }
  };

  const colors = getColors();

  return (
    <View
      accessibilityRole="text"
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderRadius: theme.borderRadius[theme.tokens.radius.badge],
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[1],
          minHeight: theme.layout.buttonHeightSm,
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={[type.captionBold, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
  },
});

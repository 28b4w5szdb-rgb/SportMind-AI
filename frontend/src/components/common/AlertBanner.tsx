/**
 * SportMind AI — Alert Banner
 * Unified feedback surface for success, error, warning, and info states.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export type AlertBannerVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertBannerProps {
  message: string;
  variant?: AlertBannerVariant;
  visible?: boolean;
}

const ICONS: Record<AlertBannerVariant, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle',
  error: 'alert-circle',
  warning: 'warning',
  info: 'information-circle',
};

export function AlertBanner({ message, variant = 'info', visible = true }: AlertBannerProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  if (!visible) return null;

  const accent =
    variant === 'success'
      ? theme.colors.success
      : variant === 'error'
        ? theme.colors.error
        : variant === 'warning'
          ? theme.colors.warning
          : theme.colors.info;

  const bgAlpha = theme.isDark ? '28' : '18';
  const borderAlpha = theme.isDark ? '55' : '40';

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: accent + bgAlpha,
          borderColor: accent + borderAlpha,
          borderRadius: theme.borderRadius[theme.tokens.radius.banner],
          flexDirection: flexRow(true),
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          marginBottom: theme.spacing[4],
        },
      ]}
    >
      <Ionicons name={ICONS[variant]} size={20} color={accent} accessibilityElementsHidden />
      <Text
        style={[
          type.bodySm,
          {
            color: accent,
            flex: 1,
            marginHorizontal: theme.spacing[2],
            textAlign: textAlign('start'),
          },
        ]}
      >
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    borderWidth: 1,
  },
});

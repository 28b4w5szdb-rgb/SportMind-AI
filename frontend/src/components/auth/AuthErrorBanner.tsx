/**
 * Auth error banner — maps i18n error keys to user-facing messages.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export interface AuthErrorBannerProps {
  errorKey: string | null;
}

export function AuthErrorBanner({ errorKey }: AuthErrorBannerProps) {
  const theme = useTheme();
  const { flexRow } = useDirection();
  const { t } = useTranslation();

  if (!errorKey) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          flexDirection: flexRow(true),
          backgroundColor: theme.colors.error + '12',
          borderColor: theme.colors.error + '40',
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      accessibilityRole="alert"
    >
      <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
      <Text
        style={[
          theme.typography.bodySm,
          { color: theme.colors.error, flex: 1, marginStart: theme.spacing.sm },
        ]}
      >
        {t(errorKey, { defaultValue: t('auth.errors.generic') })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
});

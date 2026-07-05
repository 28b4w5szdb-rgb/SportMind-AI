/**
 * Success banner for auth flows (e.g. reset email sent).
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export interface AuthSuccessBannerProps {
  message: string;
}

export function AuthSuccessBanner({ message }: AuthSuccessBannerProps) {
  const theme = useTheme();
  const { flexRow } = useDirection();

  return (
    <View
      style={[
        styles.banner,
        {
          flexDirection: flexRow(true),
          backgroundColor: theme.colors.success + '12',
          borderColor: theme.colors.success + '40',
          borderRadius: theme.borderRadius.lg,
        },
      ]}
      accessibilityRole="text"
    >
      <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
      <Text
        style={[
          theme.typography.bodySm,
          { color: theme.colors.success, flex: 1, marginStart: theme.spacing.sm },
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
    padding: 12,
    marginBottom: 16,
  },
});

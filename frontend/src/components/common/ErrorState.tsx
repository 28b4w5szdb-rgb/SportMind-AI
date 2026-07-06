/**
 * SportMind AI — Error State Component
 * Consistent empty/error feedback with optional recovery action.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useTypography } from '@/src/core/theme';
import { Button } from './Button';

interface ErrorStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'alert-circle-outline',
}: ErrorStateProps) {
  const theme = useTheme();
  const type = useTypography();
  const { tokens } = theme;

  return (
    <View
      style={[styles.container, { padding: theme.spacing[8] }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.colors.error + (theme.isDark ? '28' : '14'),
            borderRadius: theme.borderRadius.full,
          },
        ]}
      >
        <Ionicons name={icon} size={44} color={theme.colors.error} />
      </View>
      <Text
        style={[
          type.h3,
          {
            color: theme.colors.text,
            textAlign: 'center',
            marginTop: theme.spacing[6],
          },
        ]}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={[
            type.body,
            {
              color: theme.colors.textSecondary,
              textAlign: 'center',
              marginTop: theme.spacing[2],
            },
          ]}
        >
          {description}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="outline"
          style={{ marginTop: theme.spacing[6], minWidth: tokens.interaction.minTouchTarget * 3 }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * SportMind AI — Success State Component
 * Full-screen or inline success feedback aligned with EmptyState / ErrorState.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { Button } from './Button';

interface SuccessStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function SuccessState({
  title,
  description,
  actionLabel,
  onAction,
  icon = 'checkmark-circle-outline',
}: SuccessStateProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <View
      style={[styles.container, { padding: theme.spacing[8] }]}
      accessibilityRole="summary"
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme.colors.success + (theme.isDark ? '28' : '14'),
            borderRadius: theme.borderRadius.full,
          },
        ]}
      >
        <Ionicons name={icon} size={44} color={theme.colors.success} />
      </View>
      <Text
        style={[
          type.h3,
          {
            color: theme.colors.text,
            textAlign: textAlign('center'),
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
              textAlign: textAlign('center'),
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
          variant="success"
          style={{ marginTop: theme.spacing[6], minWidth: theme.tokens.interaction.minTouchTarget * 3 }}
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

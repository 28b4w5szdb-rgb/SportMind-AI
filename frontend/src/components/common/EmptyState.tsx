/**
 * SportMind AI - Empty State Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, useTypography } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  const theme = useTheme();
  const type = useTypography();

  return (
    <View
      style={[styles.container, { padding: theme.spacing[8] }]}
      accessibilityRole="summary"
    >
      {icon && (
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: theme.colors.backgroundTertiary,
              borderRadius: theme.borderRadius.full,
            },
          ]}
        >
          <Ionicons name={icon} size={44} color={theme.colors.textTertiary} />
        </View>
      )}
      <Text
        style={[
          type.h3,
          { color: theme.colors.text, textAlign: 'center', marginTop: theme.spacing[6] },
        ]}
      >
        {title}
      </Text>
      {description && (
        <Text
          style={[
            type.body,
            { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing[2] },
          ]}
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: theme.spacing[6] }} />
      )}
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

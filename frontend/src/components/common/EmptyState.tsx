/**
 * SportMind AI - Empty State Component
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/src/core/theme';
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
  
  return (
    <View style={styles.container}>
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
          <Ionicons name={icon} size={48} color={theme.colors.textTertiary} />
        </View>
      )}
      <Text style={[theme.typography.h3, { color: theme.colors.text, textAlign: 'center', marginTop: theme.spacing.lg }]}>
        {title}
      </Text>
      {description && (
        <Text
          style={[
            theme.typography.body,
            { color: theme.colors.textSecondary, textAlign: 'center', marginTop: theme.spacing.sm },
          ]}
        >
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button title={actionLabel} onPress={onAction} style={{ marginTop: theme.spacing.lg }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  iconContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

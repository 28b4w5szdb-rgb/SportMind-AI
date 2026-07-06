import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, actionLabel, onAction }: SectionHeaderProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { tokens } = theme;

  return (
    <View style={[styles.row, { flexDirection: flexRow(true), marginBottom: theme.spacing[4] }]}>
      <Text
        style={[type.h4, { color: theme.colors.text, flex: 1, textAlign: textAlign('start') }]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {actionLabel && onAction ? (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={tokens.interaction.activeOpacity}
          hitSlop={tokens.interaction.hitSlop}
          style={{ minHeight: tokens.interaction.minTouchTarget, justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[type.label, { color: theme.colors.primary }]}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', justifyContent: 'space-between' },
});

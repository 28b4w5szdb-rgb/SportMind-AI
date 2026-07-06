import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export type SectionHeaderVariant = 'default' | 'overline';
export type SectionHeaderTitleSize = 'h4' | 'h5' | 'label';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
  variant?: SectionHeaderVariant;
  titleSize?: SectionHeaderTitleSize;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  action,
  variant = 'default',
  titleSize = 'h4',
  style,
}: SectionHeaderProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { tokens } = theme;

  const titleTypo =
    variant === 'overline'
      ? type.label
      : titleSize === 'h5'
        ? type.h5
        : titleSize === 'label'
          ? type.label
          : type.h4;

  const titleColor =
    variant === 'overline' || titleSize === 'label'
      ? theme.colors.textTertiary
      : theme.colors.text;

  return (
    <View
      style={[
        styles.row,
        {
          flexDirection: flexRow(true),
          marginBottom: theme.spacing[4],
        },
        style,
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={[
            titleTypo,
            {
              color: titleColor,
              textAlign: textAlign('start'),
              letterSpacing: variant === 'overline' ? 1 : undefined,
            },
          ]}
          accessibilityRole="header"
        >
          {variant === 'overline' ? title.toUpperCase() : title}
        </Text>
        {subtitle ? (
          <Text
            style={[
              type.caption,
              {
                color: theme.colors.textSecondary,
                marginTop: theme.spacing[1],
                textAlign: textAlign('start'),
              },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
      {!action && actionLabel && onAction ? (
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

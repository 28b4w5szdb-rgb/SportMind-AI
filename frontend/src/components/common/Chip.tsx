/**
 * SportMind AI — Chip Component
 * Selectable / static pill for filters, tags, and segmented choices.
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

export type ChipSize = 'sm' | 'md';
export type ChipVariant = 'soft' | 'solid';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  size?: ChipSize;
  variant?: ChipVariant;
  /** Accent for solid variant (selected fill / unselected icon). Defaults to primary. */
  color?: string;
  style?: ViewStyle;
}

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  disabled = false,
  size = 'md',
  variant = 'soft',
  color,
  style,
}: ChipProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow } = useDirection();
  const { tokens } = theme;

  const accent = color ?? theme.colors.primary;
  const isInteractive = Boolean(onPress) && !disabled;
  const radius = theme.borderRadius[tokens.radius.chip];
  const minHeight = size === 'sm' ? theme.layout.buttonHeightSm : theme.layout.buttonHeightMd;

  let backgroundColor: string;
  let borderColor: string;
  let textColor: string;
  let iconColor: string;

  if (variant === 'solid') {
    if (selected) {
      backgroundColor = accent;
      borderColor = accent;
      textColor = '#FFFFFF';
      iconColor = '#FFFFFF';
    } else {
      backgroundColor = theme.colors.surface;
      borderColor = theme.colors.border;
      textColor = theme.colors.text;
      iconColor = accent;
    }
  } else if (selected) {
    backgroundColor = accent + (theme.isDark ? '35' : '18');
    borderColor = accent;
    textColor = accent;
    iconColor = accent;
  } else {
    backgroundColor = theme.colors.backgroundSecondary;
    borderColor = theme.colors.border;
    textColor = theme.colors.textSecondary;
    iconColor = theme.colors.textSecondary;
  }

  const content = (
    <>
      {icon ? (
        <Ionicons
          name={icon}
          size={size === 'sm' ? 14 : 16}
          color={iconColor}
          style={{ marginEnd: theme.spacing[1] }}
        />
      ) : null}
      <Text style={[size === 'sm' ? type.captionBold : type.bodySm, { color: textColor }]}>{label}</Text>
    </>
  );

  const containerStyle = [
    styles.base,
    {
      flexDirection: flexRow(true),
      minHeight,
      borderRadius: radius,
      paddingHorizontal: size === 'sm' ? theme.spacing[3] : theme.spacing[4],
      paddingVertical: size === 'sm' ? theme.spacing[1] : theme.spacing[2],
      backgroundColor,
      borderColor,
      borderWidth: 1,
      opacity: disabled ? tokens.interaction.disabledOpacity : 1,
    },
    style,
  ];

  if (!isInteractive) {
    return <View style={containerStyle}>{content}</View>;
  }

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={tokens.interaction.activeOpacity}
      hitSlop={tokens.interaction.hitSlop}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
  },
});

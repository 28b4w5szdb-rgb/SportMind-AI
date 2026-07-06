/**
 * SportMind AI — Brand Logo (mark + wordmark)
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { BrandMark, BrandMarkSize } from './BrandMark';

interface BrandLogoProps {
  size?: BrandMarkSize;
  showWordmark?: boolean;
  showTagline?: boolean;
  tagline?: string;
  align?: 'center' | 'start';
  style?: ViewStyle;
}

export function BrandLogo({
  size = 'lg',
  showWordmark = true,
  showTagline = false,
  tagline,
  align = 'center',
  style,
}: BrandLogoProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <View
      style={[
        styles.container,
        { alignItems: align === 'center' ? 'center' : 'flex-start' },
        style,
      ]}
    >
      <BrandMark size={size} />
      {showWordmark ? (
        <Text
          style={[
            type.h3,
            {
              color: theme.colors.text,
              textAlign: textAlign(align === 'center' ? 'center' : 'start'),
              marginTop: theme.spacing.md,
            },
          ]}
        >
          SportMind{' '}
          <Text style={{ color: theme.colors.primary }}>AI</Text>
        </Text>
      ) : null}
      {showTagline && tagline ? (
        <Text
          style={[
            type.bodySm,
            {
              color: theme.colors.textSecondary,
              textAlign: textAlign(align === 'center' ? 'center' : 'start'),
              marginTop: theme.spacing.sm,
              lineHeight: 22,
              maxWidth: 320,
            },
          ]}
        >
          {tagline}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

/**
 * SportMind AI - Header Component
 * Reusable header for screens
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme, useTypography } from '@/src/core/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useDirection } from '@/src/providers/DirectionProvider';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export function Header({ title, subtitle, showBack = false, rightAction }: HeaderProps) {
  const theme = useTheme();
  const type = useTypography();
  const router = useRouter();
  const { flexRow, backIcon } = useDirection();
  const { tokens, layout } = theme;

  const iconButtonStyle = {
    width: layout.minTouchTarget,
    height: layout.minTouchTarget,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <View
      style={[
        styles.container,
        {
          minHeight: layout.headerHeight,
          flexDirection: flexRow(true),
          paddingHorizontal: theme.spacing[4],
          borderBottomWidth: tokens.border.hairline,
          borderBottomColor: theme.colors.border,
          backgroundColor: theme.colors.background,
        },
      ]}
    >
      <View style={[styles.side, { width: layout.minTouchTarget }]}>
        {showBack && (
          <TouchableOpacity
            onPress={() => router.back()}
            style={iconButtonStyle}
            hitSlop={tokens.interaction.hitSlop}
            activeOpacity={tokens.interaction.activeOpacity}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name={backIcon()} size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.center}>
        <Text
          style={[type.h3, { color: theme.colors.text }]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[type.caption, { color: theme.colors.textSecondary }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={[styles.side, { width: layout.minTouchTarget, alignItems: 'flex-end' }]}>
        {rightAction && (
          <TouchableOpacity
            onPress={rightAction.onPress}
            style={iconButtonStyle}
            hitSlop={tokens.interaction.hitSlop}
            activeOpacity={tokens.interaction.activeOpacity}
            accessibilityRole="button"
          >
            <Ionicons name={rightAction.icon} size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  side: {
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
});

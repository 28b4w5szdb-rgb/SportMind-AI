import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface SuccessBannerProps {
  message: string;
  visible: boolean;
}

export function SuccessBanner({ message, visible }: SuccessBannerProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  if (!visible) return null;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.success + '18',
          borderColor: theme.colors.success + '40',
          borderRadius: theme.borderRadius.lg,
          flexDirection: flexRow(true),
        },
      ]}
    >
      <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
      <Text style={[type.bodySm, { color: theme.colors.success, flex: 1, marginHorizontal: 8, textAlign: textAlign('start') }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
});

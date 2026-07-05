import React from 'react';
import { View, Text } from 'react-native';

import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface WorkspaceSectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function WorkspaceSectionHeader({ title, subtitle, action }: WorkspaceSectionHeaderProps) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View
      style={{
        flexDirection: flexRow(true),
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.lg,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{title}</Text>
        {subtitle ? (
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

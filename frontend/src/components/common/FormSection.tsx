import React from 'react';
import { Text } from 'react-native';

import { Card } from '@/src/components/common/Card';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function FormSection({ title, subtitle, children }: FormSectionProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <Card
      variant="elevated"
      padding="lg"
      style={{
        marginBottom: theme.spacing[6],
      }}
    >
      <Text
        style={[
          type.h5,
          {
            color: theme.colors.text,
            textAlign: textAlign('start'),
            marginBottom: subtitle ? theme.spacing[1] : theme.spacing[4],
          },
        ]}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {subtitle ? (
        <Text
          style={[
            type.caption,
            {
              color: theme.colors.textSecondary,
              textAlign: textAlign('start'),
              marginBottom: theme.spacing[4],
            },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}
      {children}
    </Card>
  );
}

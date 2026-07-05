import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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
    <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, ...theme.shadows.sm }}>
      <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start'), marginBottom: subtitle ? 4 : theme.spacing.md }]}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start'), marginBottom: theme.spacing.md }]}>
          {subtitle}
        </Text>
      ) : null}
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({});

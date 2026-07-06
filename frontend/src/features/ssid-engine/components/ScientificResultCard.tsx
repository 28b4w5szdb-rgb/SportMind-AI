import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/src/components/common/Card';
import type { SsidInterpretation } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface ScientificResultCardProps {
  interpretation: SsidInterpretation;
  titleKey?: string;
}

export function ScientificResultCard({ interpretation, titleKey }: ScientificResultCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const heading = titleKey ? t(titleKey) : t(`ssid.metricLabels.${interpretation.metricId}`);

  return (
    <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: theme.spacing.sm }}>
        <Ionicons name="flask" size={22} color={theme.colors.primary} />
        <Text style={[type.h5, { color: theme.colors.text, marginStart: theme.spacing.sm, textAlign: textAlign('start'), flex: 1 }]}>
          {heading}
        </Text>
      </View>
      <Text style={[type.displaySmall, { color: theme.colors.primary, textAlign: textAlign('start') }]}>
        {interpretation.result} {interpretation.unit}
      </Text>
      <View
        style={{
          alignSelf: textAlign('start') === 'right' ? 'flex-end' : 'flex-start',
          marginTop: theme.spacing.sm,
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: 4,
          borderRadius: theme.borderRadius.full,
          backgroundColor: theme.colors.primary + '18',
        }}
      >
        <Text style={[type.caption, { color: theme.colors.primary, fontWeight: '600' }]}>{t(interpretation.classificationKey)}</Text>
      </View>
    </Card>
  );
}

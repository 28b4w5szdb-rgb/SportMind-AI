import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@/src/components/common/FormSection';
import { Badge } from '@/src/components/common/Badge';
import type { TestDefinition } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface TestReferencePanelProps {
  definition: TestDefinition;
}

export function TestReferencePanel({ definition }: TestReferencePanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const ref = definition.referenceValues;

  const rows = [
    { key: 'elite', value: ref.elite, variant: 'success' as const },
    { key: 'good', value: ref.good, variant: 'info' as const },
    { key: 'average', value: ref.average, variant: 'warning' as const },
  ];

  return (
    <FormSection title={t('testingCenter.referenceTitle')} subtitle={t('testingCenter.referenceSubtitle')}>
      {rows.map((row) => (
        <View
          key={row.key}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Badge label={t(`testingCenter.levels.${row.key}`)} variant={row.variant} />
          <Text style={[type.body, { color: theme.colors.text }]}>
            {row.value} {definition.unit}
          </Text>
        </View>
      ))}
      <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {ref.lowerIsBetter ? t('testingCenter.lowerIsBetter') : t('testingCenter.higherIsBetter')}
      </Text>
    </FormSection>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@/src/components/common/FormSection';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import {
  AGE_BANDS,
  COMPETITION_LEVELS,
  SPORT_PROFILES,
} from '@/src/features/testing-science';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface DemographicContextCardProps {
  test: MockPerformanceTest;
}

export function DemographicContextCard({ test }: DemographicContextCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const context = test.demographicContext;
  if (!context) return null;

  const ageLabel = t(AGE_BANDS.find((b) => b.id === context.ageBandId)?.labelKey ?? `testingScience.age.${context.ageBandId}`);
  const genderLabel = t(`testingScience.gender.${context.gender}`);
  const sportLabel = t(SPORT_PROFILES[context.sport].labelKey);
  const levelLabel = t(COMPETITION_LEVELS[context.level].labelKey);

  const rows = [
    { label: t('testingCenter.demographic.ageGroup'), value: ageLabel },
    { label: t('testingCenter.demographic.gender'), value: genderLabel },
    { label: t('testingCenter.demographic.sport'), value: sportLabel },
    { label: t('testingCenter.demographic.competitionLevel'), value: levelLabel },
  ];

  return (
    <FormSection title={t('testingCenter.demographic.contextTitle')} subtitle={t('testingCenter.demographic.contextSubtitle')}>
      {rows.map((row) => (
        <View
          key={row.label}
          style={{
            flexDirection: flexRow(true),
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          }}
        >
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{row.label}</Text>
          <Text style={[type.bodySm, { color: theme.colors.text, textAlign: textAlign('end') }]}>{row.value}</Text>
        </View>
      ))}
      {test.referenceProfile ? (
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
          {t('testingCenter.demographic.referenceProfileUsed', {
            age: ageLabel,
            gender: genderLabel,
            sport: sportLabel,
            level: levelLabel,
          })}
        </Text>
      ) : null}
      {test.ssid ? (
        <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
          {t('ssid.ui.scientificReference')}: {t(test.ssid.scientificReferenceKey)}
        </Text>
      ) : null}
    </FormSection>
  );
}

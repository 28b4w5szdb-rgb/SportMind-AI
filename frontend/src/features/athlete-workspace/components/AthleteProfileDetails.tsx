import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { MockAthlete } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface AthleteProfileDetailsProps {
  athlete: MockAthlete;
}

export function AthleteProfileDetails({ athlete }: AthleteProfileDetailsProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  const rows = [
    { label: t('features.athletes.fields.jerseyNumber'), value: athlete.jersey_number ?? '—' },
    { label: t('features.athletes.fields.height'), value: athlete.height_cm ? `${athlete.height_cm} cm` : '—' },
    { label: t('features.athletes.fields.weight'), value: athlete.weight_kg ? `${athlete.weight_kg} kg` : '—' },
    { label: t('features.athletes.fields.dateOfBirth'), value: athlete.date_of_birth ?? '—' },
    { label: t('features.athletes.fields.nationality'), value: athlete.nationality ?? '—' },
    { label: t('features.athletes.fields.status'), value: t(`features.athletes.status.${athlete.status}`) },
  ];

  return (
    <View style={{ marginBottom: theme.spacing.xl }}>
      <WorkspaceSectionHeader title={t('athleteWorkspace.profileDetails')} />
      <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl }}>
        {rows.map((row, index) => (
          <View
            key={row.label}
            style={{
              flexDirection: flexRow(true),
              paddingVertical: 12,
              borderBottomWidth: index < rows.length - 1 ? 1 : 0,
              borderBottomColor: theme.colors.border,
              justifyContent: 'space-between',
            }}
          >
            <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{row.label}</Text>
            <Text style={[type.body, { color: theme.colors.text }]}>{String(row.value)}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

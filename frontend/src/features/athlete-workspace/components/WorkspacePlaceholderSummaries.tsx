import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { MockAthlete } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface WorkspacePlaceholderSummariesProps {
  athlete: MockAthlete;
}

interface SummaryCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  titleKey: string;
  bodyKey: string;
}

function SummaryCard({ icon, color, titleKey, bodyKey }: SummaryCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl, marginBottom: theme.spacing.sm }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start', gap: theme.spacing.sm }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: `${color}18`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={18} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]}>{t(titleKey)}</Text>
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t(bodyKey)}</Text>
        </View>
      </View>
    </Card>
  );
}

export function WorkspacePlaceholderSummaries({ athlete }: WorkspacePlaceholderSummariesProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  const medicalBody =
    athlete.status === 'injured'
      ? 'athleteWorkspace.summaries.medicalInjured'
      : athlete.status === 'rest'
        ? 'athleteWorkspace.summaries.medicalRest'
        : 'athleteWorkspace.summaries.medicalClear';

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader title={t('athleteWorkspace.summariesTitle')} subtitle={t('athleteWorkspace.summariesSubtitle')} />
      <SummaryCard icon="medkit-outline" color="#EF4444" titleKey="athleteWorkspace.summaries.medical" bodyKey={medicalBody} />
      <SummaryCard icon="bed-outline" color="#10B981" titleKey="athleteWorkspace.summaries.recovery" bodyKey="athleteWorkspace.summaries.recoveryBody" />
      <SummaryCard icon="clipboard-outline" color="#0066FF" titleKey="athleteWorkspace.summaries.coachNotes" bodyKey="athleteWorkspace.summaries.coachNotesBody" />
      <SummaryCard icon="sparkles-outline" color="#8B5CF6" titleKey="athleteWorkspace.summaries.aiNotes" bodyKey="athleteWorkspace.summaries.aiNotesBody" />
    </View>
  );
}

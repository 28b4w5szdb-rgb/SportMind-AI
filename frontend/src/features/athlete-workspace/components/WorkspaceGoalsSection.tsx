import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { AthleteGoal } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface WorkspaceGoalsSectionProps {
  goals: AthleteGoal[];
}

export function WorkspaceGoalsSection({ goals }: WorkspaceGoalsSectionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader title={t('athleteWorkspace.goalsTitle')} subtitle={t('athleteWorkspace.goalsSubtitle')} />
      <View style={{ gap: theme.spacing.sm }}>
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.progress / goal.target) * 100));
          const barColor = pct >= 85 ? theme.colors.success : pct >= 60 ? theme.colors.primary : theme.colors.warning;

          return (
            <Card key={goal.id} variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
              <View style={{ flexDirection: flexRow(true), justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', flex: 1, textAlign: textAlign('start') }]}>
                  {t(goal.titleKey)}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary }]}>
                  {goal.progress}/{goal.target}
                </Text>
              </View>
              <View style={{ height: 8, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' }}>
                <View style={{ width: `${pct}%`, height: 8, backgroundColor: barColor, borderRadius: 4 }} />
              </View>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 6, textAlign: textAlign('start') }]}>
                {t('athleteWorkspace.goalsProgress', { percent: pct })}
              </Text>
            </Card>
          );
        })}
      </View>
    </View>
  );
}

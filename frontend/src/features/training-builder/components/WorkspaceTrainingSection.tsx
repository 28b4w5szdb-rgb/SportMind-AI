import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { TrainingBuilderSnapshot } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from '@/src/features/athlete-workspace/components/WorkspaceSectionHeader';

interface WorkspaceTrainingSectionProps {
  athleteId: string;
  snapshot: TrainingBuilderSnapshot;
}

export function WorkspaceTrainingSection({ athleteId, snapshot }: WorkspaceTrainingSectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { todaySession, nextSession, load, progressPercent, plan } = snapshot;

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader
        title={t('trainingBuilder.workspaceTitle')}
        subtitle={t('trainingBuilder.workspaceSubtitle')}
        action={
          <TouchableOpacity onPress={() => router.push(APP_ROUTES.trainingBuilder(athleteId))}>
            <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '600' }]}>{t('trainingBuilder.open')}</Text>
          </TouchableOpacity>
        }
      />

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Ionicons name="today" size={16} color={theme.colors.primary} />
            <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.todaysTraining')}</Text>
          </View>
          <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]} numberOfLines={2}>
            {todaySession ? t(todaySession.titleKey) : t('trainingBuilder.restDay')}
          </Text>
          {todaySession ? (
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
              {todaySession.duration_min} min · {todaySession.session_load} AU
            </Text>
          ) : null}
        </Card>

        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.weeklyPlan')}</Text>
          <Text style={[type.h5, { color: theme.colors.text, marginTop: 4 }]}>{load.weeklyLoad} AU</Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary }]}>{t('trainingBuilder.acwr')}: {load.acwr.toFixed(2)}</Text>
        </Card>
      </View>

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.nextSession')}</Text>
          <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', marginTop: 4, textAlign: textAlign('start') }]} numberOfLines={2}>
            {nextSession ? t(nextSession.titleKey) : plan ? t('trainingBuilder.planComplete') : t('trainingBuilder.noPlanShort')}
          </Text>
          {nextSession ? (
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>{nextSession.date}</Text>
          ) : null}
        </Card>

        <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.trainingProgress')}</Text>
          <View style={{ height: 6, backgroundColor: theme.colors.border, borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
            <View style={{ width: `${progressPercent}%`, height: 6, backgroundColor: theme.colors.primary }} />
          </View>
          <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4 }]}>{progressPercent}%</Text>
        </Card>
      </View>
    </View>
  );
}

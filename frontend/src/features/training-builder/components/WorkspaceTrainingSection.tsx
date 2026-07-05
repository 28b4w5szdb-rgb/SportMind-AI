import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { TrainingBuilderSnapshot } from '../types';
import { sessionDisplayTitle } from '../utils/sessionDisplay';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from '@/src/features/athlete-workspace/components/WorkspaceSectionHeader';

interface WorkspaceTrainingSectionProps {
  athleteId: string;
  snapshot: TrainingBuilderSnapshot;
}

function statusColor(status: string): string {
  if (status === 'completed') return '#10B981';
  if (status === 'modified') return '#F97316';
  if (status === 'skipped') return '#64748B';
  return '#0066FF';
}

export function WorkspaceTrainingSection({ athleteId, snapshot }: WorkspaceTrainingSectionProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { todaySession, nextSession, load, compliance, progressPercent, plan } = snapshot;
  const locale = i18n.language.startsWith('ar') ? 'ar' : 'en';

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
            {todaySession ? sessionDisplayTitle(todaySession, locale) : t('trainingBuilder.restDay')}
          </Text>
          {todaySession ? (
            <>
              <Text style={[type.caption, { color: statusColor(todaySession.status), marginTop: 4, fontWeight: '600' }]}>
                {t(`trainingBuilder.execution.status.${todaySession.status}`)}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2 }]}>
                {load.sessionLoad} / {load.sessionPlannedLoad} AU
              </Text>
            </>
          ) : null}
        </Card>

        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.complianceTitle')}</Text>
          <Text style={[type.h5, { color: theme.colors.text, marginTop: 4 }]}>{compliance.compliancePercent}%</Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary }]}>
            {compliance.completed}/{compliance.planned} {t('trainingBuilder.completedShort')}
          </Text>
        </Card>
      </View>

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.actualVsPlanned')}</Text>
          <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', marginTop: 4 }]}>
            {load.weeklyActualLoad} / {load.weeklyPlannedLoad} AU
          </Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 2 }]}>
            {t('trainingBuilder.acwr')}: {load.acwr.toFixed(2)}
          </Text>
        </Card>

        <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('trainingBuilder.nextSession')}</Text>
          <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', marginTop: 4, textAlign: textAlign('start') }]} numberOfLines={2}>
            {nextSession ? sessionDisplayTitle(nextSession, locale) : plan ? t('trainingBuilder.planComplete') : t('trainingBuilder.noPlanShort')}
          </Text>
          {todaySession && todaySession.status === 'planned' ? (
            <TouchableOpacity onPress={() => router.push(APP_ROUTES.logTrainingSession(todaySession.id, athleteId))} style={{ marginTop: 8 }}>
              <Text style={[type.caption, { color: theme.colors.primary, fontWeight: '600' }]}>{t('trainingBuilder.execution.logToday')}</Text>
            </TouchableOpacity>
          ) : null}
        </Card>
      </View>
    </View>
  );
}

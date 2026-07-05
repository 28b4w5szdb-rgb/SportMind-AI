import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { DailyCheckIn } from '@/src/data/mock/types';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { buildRecoverySummary } from '@/src/features/recovery/recoveryEngine';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface WorkspaceCheckInStripProps {
  athleteId: string;
  checkIn?: DailyCheckIn;
}

export function WorkspaceCheckInStrip({ athleteId, checkIn }: WorkspaceCheckInStripProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader
        title={t('athleteWorkspace.checkInTitle')}
        subtitle={t('athleteWorkspace.checkInSubtitle')}
        action={
          <TouchableOpacity onPress={() => router.push(APP_ROUTES.dailyCheckIn(athleteId))}>
            <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '600' }]}>{t('athleteWorkspace.checkInCta')}</Text>
          </TouchableOpacity>
        }
      />
      <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
        {checkIn ? (
          <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.md }}>
            <View style={{ flex: 1, minWidth: 160 }}>
              <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('athleteWorkspace.latestCheckIn')}</Text>
              <Text style={[type.body, { color: theme.colors.text, fontWeight: '600', marginTop: 4, textAlign: textAlign('start') }]}>
                {checkIn.date}
              </Text>
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4, textAlign: textAlign('start') }]}>
                {t('dailyCheckIn.fields.sleepDuration')}: {checkIn.sleep_duration_hours}h · {t('dailyCheckIn.fields.fatigue')}: {checkIn.fatigue}/10
              </Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="heart-circle" size={28} color={theme.colors.success} />
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4 }]}>
                {buildRecoverySummary(checkIn).recoveryScore}/100
              </Text>
            </View>
          </View>
        ) : (
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t('athleteWorkspace.noCheckIn')}</Text>
        )}
      </Card>
    </View>
  );
}

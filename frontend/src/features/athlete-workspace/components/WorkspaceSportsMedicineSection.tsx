import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import type { SportsMedicineSnapshot } from '@/src/features/sports-medicine/types';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { InjuryAlertsBanner } from '@/src/features/sports-medicine/components/InjuryAlertsBanner';
import { RTP_PHASES } from '@/src/features/sports-medicine/registry/rtpPhases';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { WorkspaceSectionHeader } from './WorkspaceSectionHeader';

interface WorkspaceSportsMedicineSectionProps {
  athleteId: string;
  snapshot: SportsMedicineSnapshot;
}

function riskColor(score: number): string {
  if (score >= 65) return '#EF4444';
  if (score >= 50) return '#F97316';
  return '#10B981';
}

export function WorkspaceSportsMedicineSection({ athleteId, snapshot }: WorkspaceSportsMedicineSectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const { profile, primaryInjury, rtpProgress } = snapshot;

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <WorkspaceSectionHeader
        title={t('sportsMedicine.workspaceTitle')}
        subtitle={t('sportsMedicine.workspaceSubtitle')}
        action={
          <TouchableOpacity onPress={() => router.push(APP_ROUTES.sportsMedicine(athleteId))}>
            <Text style={[type.bodySm, { color: theme.colors.primary, fontWeight: '600' }]}>{t('sportsMedicine.open')}</Text>
          </TouchableOpacity>
        }
      />

      <InjuryAlertsBanner alerts={profile.alerts.slice(0, 2)} />

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.sm }}>
        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.medicalSummary')}</Text>
          <Text style={[type.bodySm, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>
            {profile.activeInjuries.length > 0
              ? t('sportsMedicine.medicalActive', { count: profile.activeInjuries.length })
              : t('sportsMedicine.medicalClear')}
          </Text>
        </Card>
        <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.injuryRiskCard')}</Text>
          <Text style={[type.h5, { color: riskColor(profile.regional.overall), marginTop: 4 }]}>{profile.regional.overall}%</Text>
          <Text style={[type.caption, { color: theme.colors.textTertiary }]}>{t('sportsMedicine.overallRisk')}</Text>
        </Card>
      </View>

      {primaryInjury ? (
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
          <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl, borderLeftWidth: 3, borderLeftColor: theme.colors.error }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Ionicons name="medkit" size={16} color={theme.colors.error} />
              <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.activeInjuryCard')}</Text>
            </View>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>
              {t(`sportsMedicine.regions.${primaryInjury.body_region}`)}
            </Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
              {t(`sportsMedicine.status.${primaryInjury.status}`)} · {t('sportsMedicine.pain')}: {primaryInjury.pain_level}/10
            </Text>
          </Card>
          <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 150, borderRadius: theme.borderRadius.xl }}>
            <Text style={[type.caption, { color: theme.colors.textSecondary }]}>{t('sportsMedicine.rtpCard')}</Text>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', marginTop: 4, textAlign: textAlign('start') }]}>
              {t(RTP_PHASES.find((p) => p.id === primaryInjury.rtp_phase)?.labelKey ?? 'sportsMedicine.rtp.phase1')}
            </Text>
            <View style={{ height: 6, backgroundColor: theme.colors.border, borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
              <View style={{ width: `${rtpProgress}%`, height: 6, backgroundColor: theme.colors.primary }} />
            </View>
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4 }]}>{rtpProgress}%</Text>
          </Card>
        </View>
      ) : null}
    </View>
  );
}

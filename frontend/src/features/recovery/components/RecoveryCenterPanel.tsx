import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { ProgressRingChart } from '@/src/components/charts';
import type { DailyCheckIn } from '@/src/data/mock/types';
import type { WearableDailySnapshot } from '@/src/features/wearables';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { buildRecoverySummary } from '../recoveryEngine';

interface RecoveryCenterPanelProps {
  checkIn?: DailyCheckIn;
  wearableSnapshot?: WearableDailySnapshot | null;
  compact?: boolean;
}

function MetricTile({ icon, label, value, color }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; color: string }) {
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card variant="filled" padding="md" style={{ flex: 1, minWidth: 140, borderRadius: theme.borderRadius.xl }}>
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 6 }}>
        <Ionicons name={icon} size={16} color={color} />
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 6 }]}>{label}</Text>
      </View>
      <Text style={[type.body, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{value}</Text>
    </Card>
  );
}

export function RecoveryCenterPanel({ checkIn, wearableSnapshot, compact = false }: RecoveryCenterPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  if (!checkIn && !wearableSnapshot?.hrv && !wearableSnapshot?.sleepDurationHours) {
    return (
      <Card variant="outlined" padding="lg" style={{ borderRadius: theme.borderRadius.xl }}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('recovery.empty')}</Text>
      </Card>
    );
  }

  const summary = checkIn ? buildRecoverySummary(checkIn) : null;
  const wearableRecoveryBoost = wearableSnapshot?.recoveryScore
    ? Math.round((wearableSnapshot.recoveryScore - 55) * 0.25)
    : 0;
  const recoveryScore = summary
    ? clamp(summary.recoveryScore + wearableRecoveryBoost)
    : wearableSnapshot?.recoveryScore ?? clamp(55 + wearableRecoveryBoost);
  const scoreColor = recoveryScore >= 70 ? theme.colors.success : recoveryScore >= 50 ? theme.colors.primary : theme.colors.warning;
  const readinessImpact = summary
    ? summary.readinessImpact + (wearableSnapshot?.readinessImpact ?? 0)
    : wearableSnapshot?.readinessImpact ?? 0;
  const impactPrefix = readinessImpact >= 0 ? '+' : '';

  function clamp(n: number) {
    return Math.max(0, Math.min(100, Math.round(n)));
  }

  if (!checkIn && wearableSnapshot) {
    return (
      <View style={{ gap: theme.spacing.md }}>
        <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden', ...theme.shadows.md }}>
          <LinearGradient colors={[`${scoreColor}18`, theme.colors.surface]} style={{ padding: theme.spacing.lg }}>
            <Text style={[type.overline, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{t('wearables.recoveryWearableTitle')}</Text>
            <Text style={[type.h5, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>{recoveryScore}/100</Text>
          </LinearGradient>
        </Card>
        <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {wearableSnapshot.sleepDurationHours !== undefined ? (
            <MetricTile icon="moon" label={t('recovery.sleep')} value={`${wearableSnapshot.sleepDurationHours}h`} color="#6366F1" />
          ) : null}
          {wearableSnapshot.hrv !== undefined ? (
            <MetricTile icon="pulse" label={t('wearables.metric.hrv')} value={`${wearableSnapshot.hrv} ms`} color="#8B5CF6" />
          ) : null}
          {wearableSnapshot.restingHeartRate !== undefined ? (
            <MetricTile icon="heart" label={t('wearables.metric.resting_heart_rate')} value={`${wearableSnapshot.restingHeartRate} bpm`} color="#EF4444" />
          ) : null}
        </View>
      </View>
    );
  }

  if (!summary) return null;

  return (
    <View style={{ gap: theme.spacing.md }}>
      <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden', ...theme.shadows.md }}>
        <LinearGradient colors={[`${scoreColor}18`, theme.colors.surface]} style={{ padding: theme.spacing.lg }}>
          <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
            <ProgressRingChart value={recoveryScore} max={100} size={compact ? 90 : 110} color={scoreColor} trackColor={theme.colors.border}>
              <Text style={[type.h5, { color: theme.colors.text }]}>{recoveryScore}</Text>
            </ProgressRingChart>
            <View style={{ flex: 1, marginStart: theme.spacing.lg }}>
              <Text style={[type.overline, { color: theme.colors.textSecondary, letterSpacing: 1.2, textAlign: textAlign('start') }]}>
                {t('recovery.dailyScore')}
              </Text>
              <Text style={[type.h5, { color: theme.colors.text, marginTop: 4, textAlign: textAlign('start') }]}>{t('recovery.scoreLabel')}</Text>
              <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
                {t('recovery.readinessImpact', { value: `${impactPrefix}${readinessImpact}` })}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Card>

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
        <MetricTile icon="moon" label={t('recovery.sleep')} value={`${summary.sleepHours}h · ${summary.sleepQuality}/10`} color="#6366F1" />
        <MetricTile icon="battery-half" label={t('recovery.fatigue')} value={`${summary.fatigue}/10`} color="#F97316" />
        <MetricTile icon="body" label={t('recovery.soreness')} value={`${summary.soreness}/10`} color="#EF4444" />
        <MetricTile icon="water" label={t('recovery.hydration')} value={`${summary.hydrationLiters.toFixed(1)} L`} color="#0EA5E9" />
        {wearableSnapshot?.hrv !== undefined ? (
          <MetricTile icon="pulse" label={t('wearables.metric.hrv')} value={`${wearableSnapshot.hrv} ms`} color="#8B5CF6" />
        ) : null}
        {wearableSnapshot?.restingHeartRate !== undefined ? (
          <MetricTile icon="heart" label={t('wearables.metric.resting_heart_rate')} value={`${wearableSnapshot.restingHeartRate} bpm`} color="#EF4444" />
        ) : null}
      </View>

      {summary.recommendations.length > 0 ? (
        <View style={{ gap: theme.spacing.sm }}>
          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('recovery.recommendationsTitle')}</Text>
          {summary.recommendations.map((rec) => (
            <Card key={rec.id} variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
              <View style={{ flexDirection: flexRow(true), alignItems: 'flex-start', gap: theme.spacing.sm }}>
                <Ionicons
                  name={rec.priority === 'high' ? 'alert-circle' : 'information-circle'}
                  size={18}
                  color={rec.priority === 'high' ? theme.colors.error : theme.colors.primary}
                />
                <View style={{ flex: 1 }}>
                  <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', textAlign: textAlign('start') }]}>{t(rec.titleKey)}</Text>
                  <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{t(rec.bodyKey)}</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      ) : (
        <Card variant="filled" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
          <Text style={[type.bodySm, { color: theme.colors.success, textAlign: textAlign('start') }]}>{t('recovery.allGood')}</Text>
        </Card>
      )}
    </View>
  );
}

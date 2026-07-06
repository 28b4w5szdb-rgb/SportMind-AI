import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import type { WearableDailySnapshot, WearableMetricType } from '../types';
import { getProviderById } from '../registry/providerRegistry';
import { getMockDeviceMeta } from '../utils/mockDeviceMeta';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface DeviceHealthCardProps {
  snapshot: WearableDailySnapshot;
  athleteId: string;
}

function snapshotHasMetric(snapshot: WearableDailySnapshot, metric: WearableMetricType): boolean {
  switch (metric) {
    case 'resting_heart_rate':
      return snapshot.restingHeartRate !== undefined;
    case 'heart_rate':
      return snapshot.heartRateAvg !== undefined || snapshot.restingHeartRate !== undefined;
    case 'hrv':
      return snapshot.hrv !== undefined;
    case 'sleep_duration':
    case 'sleep_quality':
      return snapshot.sleepDurationHours !== undefined;
    case 'steps':
      return snapshot.steps !== undefined;
    case 'calories':
      return snapshot.calories !== undefined;
    case 'distance':
      return snapshot.distanceKm !== undefined;
    case 'gps_summary':
    case 'training_duration':
      return snapshot.trainingDurationMin !== undefined;
    case 'training_load':
      return snapshot.trainingLoad !== undefined;
    case 'spo2':
      return snapshot.spo2 !== undefined;
    case 'body_temperature':
      return snapshot.bodyTemperature !== undefined;
    case 'recovery_score':
      return snapshot.recoveryScore !== undefined;
    default:
      return false;
  }
}

export function DeviceHealthCard({ snapshot, athleteId }: DeviceHealthCardProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const primary = snapshot.primaryProviderId ? getProviderById(snapshot.primaryProviderId) : null;
  const connected = snapshot.connections.filter((c) => c.status !== 'not_connected');
  const active = connected[0];
  const meta = active ? getMockDeviceMeta(active.provider_id, athleteId, true) : null;

  const missingMetrics = primary
    ? primary.supportedMetrics.filter((m) => !snapshotHasMetric(snapshot, m)).slice(0, 4)
    : [];

  const warnings: string[] = [];
  if (meta?.connectionQuality === 'weak') warnings.push(t('wearables.deviceHealth.weakSignal'));
  if (meta && meta.batteryPercent < 20) warnings.push(t('wearables.deviceHealth.lowBattery'));
  if (missingMetrics.length > 2) warnings.push(t('wearables.deviceHealth.missingData'));

  const rows = [
    { label: t('wearables.deviceHealth.connectionQuality'), value: meta ? t(`wearables.connectionQuality.${meta.connectionQuality}`) : t('wearables.connectionQuality.offline'), icon: 'wifi' as const },
    { label: t('wearables.signalStrength'), value: meta ? `${meta.signalStrength}%` : '—', icon: 'cellular' as const },
    { label: t('wearables.battery'), value: meta ? `${meta.batteryPercent}%` : '—', icon: 'battery-half' as const },
    {
      label: t('wearables.deviceHealth.lastSuccessfulSync'),
      value: snapshot.lastSyncAt
        ? new Date(snapshot.lastSyncAt).toLocaleString(isRTL ? 'ar' : 'en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '—',
      icon: 'time' as const,
    },
  ];

  return (
    <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden' }}>
      <LinearGradient colors={['#0066FF10', '#0D948808']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: theme.spacing.md }}>
        <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start'), marginBottom: theme.spacing.md }]}>
          {t('wearables.deviceHealth.title')}
        </Text>

        {rows.map((row) => (
          <View key={row.label} style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: theme.spacing.sm }}>
            <Ionicons name={row.icon} size={18} color={theme.colors.primary} />
            <Text style={[type.bodySm, { color: theme.colors.textSecondary, flex: 1, marginHorizontal: theme.spacing.sm, textAlign: textAlign('start') }]}>{row.label}</Text>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600' }]}>{row.value}</Text>
          </View>
        ))}

        {missingMetrics.length > 0 ? (
          <View style={{ marginTop: theme.spacing.sm }}>
            <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start'), marginBottom: 6 }]}>{t('wearables.deviceHealth.missingMetrics')}</Text>
            <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 6 }}>
              {missingMetrics.map((m) => (
                <Badge key={m} label={t(`wearables.metric.${m}`)} variant="neutral" />
              ))}
            </View>
          </View>
        ) : null}

        {warnings.length > 0 ? (
          <View style={{ marginTop: theme.spacing.md, padding: theme.spacing.sm, borderRadius: theme.borderRadius.lg, backgroundColor: theme.colors.warning + '15' }}>
            <Text style={[type.caption, { color: theme.colors.warning, fontWeight: '700', textAlign: textAlign('start') }]}>{t('wearables.deviceHealth.warnings')}</Text>
            {warnings.map((w) => (
              <Text key={w} style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>• {w}</Text>
            ))}
          </View>
        ) : (
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 6, marginTop: theme.spacing.md }}>
            <Ionicons name="shield-checkmark" size={16} color={theme.colors.success} />
            <Text style={[type.caption, { color: theme.colors.success, textAlign: textAlign('start') }]}>{t('wearables.deviceHealth.allGood')}</Text>
          </View>
        )}
      </LinearGradient>
    </Card>
  );
}

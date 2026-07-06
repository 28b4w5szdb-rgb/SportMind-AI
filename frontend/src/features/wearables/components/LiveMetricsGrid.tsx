import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import type { WearableDailySnapshot } from '../types';
import { getMockReadinessScore, getMockRespiratoryRate, getMockStressScore } from '../utils/mockDeviceMeta';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface LiveMetricsGridProps {
  snapshot: WearableDailySnapshot;
  athleteId: string;
}

interface MetricTile {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  value: string;
  color: string;
}

export function LiveMetricsGrid({ snapshot, athleteId }: LiveMetricsGridProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const seed = athleteId.length * 7;
  const stress = getMockStressScore(snapshot.recoveryScore, seed);
  const respiratory = getMockRespiratoryRate(seed);
  const readiness = getMockReadinessScore(snapshot.recoveryScore, snapshot.readinessImpact);

  const tiles: MetricTile[] = [
    { id: 'hr', icon: 'heart', labelKey: 'wearables.live.heartRate', value: snapshot.heartRateAvg ? `${snapshot.heartRateAvg} bpm` : snapshot.restingHeartRate ? `${snapshot.restingHeartRate} bpm` : '—', color: '#EF4444' },
    { id: 'hrv', icon: 'pulse', labelKey: 'wearables.live.hrv', value: snapshot.hrv ? `${snapshot.hrv} ms` : '—', color: '#8B5CF6' },
    { id: 'sleep', icon: 'moon', labelKey: 'wearables.live.sleep', value: snapshot.sleepDurationHours ? `${snapshot.sleepDurationHours}h` : '—', color: '#6366F1' },
    { id: 'recovery', icon: 'refresh', labelKey: 'wearables.live.recovery', value: snapshot.recoveryScore !== undefined ? `${snapshot.recoveryScore}%` : '—', color: '#10B981' },
    { id: 'readiness', icon: 'flash', labelKey: 'wearables.live.readiness', value: `${readiness}%`, color: '#0066FF' },
    { id: 'stress', icon: 'thunderstorm', labelKey: 'wearables.live.stress', value: `${stress}%`, color: '#F97316' },
    { id: 'resp', icon: 'leaf', labelKey: 'wearables.live.respiratoryRate', value: `${respiratory} br/min`, color: '#0EA5E9' },
    { id: 'steps', icon: 'footsteps', labelKey: 'wearables.live.steps', value: snapshot.steps?.toLocaleString(isRTL ? 'ar' : 'en') ?? '—', color: '#14B8A6' },
    { id: 'calories', icon: 'flame', labelKey: 'wearables.live.calories', value: snapshot.calories ? `${snapshot.calories}` : '—', color: '#F59E0B' },
    { id: 'spo2', icon: 'water', labelKey: 'wearables.live.spo2', value: snapshot.spo2 ? `${snapshot.spo2}%` : '—', color: '#3B82F6' },
    { id: 'skin', icon: 'thermometer', labelKey: 'wearables.live.skinTemp', value: snapshot.bodyTemperature ? `${snapshot.bodyTemperature}°C` : '—', color: '#EC4899' },
    { id: 'load', icon: 'barbell', labelKey: 'wearables.live.trainingLoad', value: snapshot.trainingLoad ? `${snapshot.trainingLoad} AU` : '—', color: '#64748B' },
    { id: 'distance', icon: 'navigate', labelKey: 'wearables.live.distance', value: snapshot.distanceKm ? `${snapshot.distanceKm} km` : '—', color: '#0D9488' },
    { id: 'gps', icon: 'map', labelKey: 'wearables.live.gpsActivity', value: snapshot.trainingDurationMin ? `${snapshot.trainingDurationMin} min` : '—', color: '#0066FF' },
  ];

  return (
    <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm }}>
      {tiles.map((tile) => (
        <View
          key={tile.id}
          style={{
            width: '47%',
            flexGrow: 1,
            minWidth: 140,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 8 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: tile.color + '18', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name={tile.icon} size={16} color={tile.color} />
            </View>
            <Text style={[type.caption, { color: theme.colors.textTertiary, flex: 1, textAlign: textAlign('start') }]} numberOfLines={1}>
              {t(tile.labelKey)}
            </Text>
          </View>
          <Text style={[type.body, { color: theme.colors.text, fontWeight: '700', marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
            {tile.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

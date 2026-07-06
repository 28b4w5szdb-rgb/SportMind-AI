import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { APP_ROUTES } from '@/src/core/constants/routes';
import type { WearableDailySnapshot } from '../types';
import { getProviderById } from '../registry/providerRegistry';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface WorkspaceWearablesSectionProps {
  athleteId: string;
  snapshot: WearableDailySnapshot;
}

export function WorkspaceWearablesSection({ athleteId, snapshot }: WorkspaceWearablesSectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL, chevronIcon } = useDirection();

  const connected = snapshot.connections.length > 0;
  const providerLabel = snapshot.primaryProviderId ? t(getProviderById(snapshot.primaryProviderId).labelKey) : t('wearables.noDevice');

  return (
    <Card variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.lg, ...theme.shadows.sm }}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => router.push(APP_ROUTES.wearables(athleteId))}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#0EA5E918', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="watch" size={22} color="#0EA5E9" />
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('wearables.workspaceTitle')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              {connected ? providerLabel : t('wearables.notConnected')}
            </Text>
          </View>
          <Ionicons name={chevronIcon()} size={18} color={theme.colors.textTertiary} />
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: 8, marginTop: theme.spacing.md }}>
        <Badge label={connected ? t('wearables.status.mock_sync') : t('wearables.status.not_connected')} variant={connected ? 'info' : 'neutral'} />
        {snapshot.lastSyncAt ? (
          <Badge label={t('wearables.lastSyncShort', { value: snapshot.lastSyncAt.slice(0, 16).replace('T', ' ') })} variant="neutral" />
        ) : null}
      </View>

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        {[
          { label: t('wearables.metric.hrv'), value: snapshot.hrv ? `${snapshot.hrv} ms` : '—' },
          { label: t('wearables.metric.resting_heart_rate'), value: snapshot.restingHeartRate ? `${snapshot.restingHeartRate}` : '—' },
          { label: t('wearables.metric.sleep_duration'), value: snapshot.sleepDurationHours ? `${snapshot.sleepDurationHours}h` : '—' },
          { label: t('wearables.metric.steps'), value: snapshot.steps?.toLocaleString(isRTL ? 'ar' : 'en') ?? '—' },
          { label: t('wearables.metric.calories'), value: snapshot.calories?.toLocaleString(isRTL ? 'ar' : 'en') ?? '—' },
        ].map((tile) => (
          <View key={tile.label} style={{ flex: 1, minWidth: 100, backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.lg, padding: 10 }}>
            <Text style={[type.caption, { color: theme.colors.textTertiary }]}>{tile.label}</Text>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '700', marginTop: 4 }]}>{tile.value}</Text>
          </View>
        ))}
      </View>

      <Text style={[type.caption, { color: theme.colors.primary, marginTop: theme.spacing.sm, textAlign: textAlign('start') }]}>
        {t('wearables.readinessImpact', { value: `${snapshot.readinessImpact >= 0 ? '+' : ''}${snapshot.readinessImpact}` })}
      </Text>
    </Card>
  );
}

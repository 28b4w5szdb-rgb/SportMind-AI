import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { PremiumProviderCard } from './PremiumProviderCard';
import { LiveMetricsGrid } from './LiveMetricsGrid';
import { SyncHistoryTimeline } from './SyncHistoryTimeline';
import { DeviceHealthCard } from './DeviceHealthCard';
import { getPremiumProviders } from '../registry/providerRegistry';
import { buildSyncHistoryTimeline } from '../utils/syncHistoryBuilder';
import type { MockSyncType, WearableDailySnapshot, WearableProviderConnection, WearableProviderId } from '../types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface WearablesDeviceCenterProps {
  athleteId: string;
  snapshot: WearableDailySnapshot;
  connections: WearableProviderConnection[];
  records: import('../types').WearableDataRecord[];
  onConnect: (providerId: WearableProviderId) => void;
  onDisconnect: (providerId: WearableProviderId) => void;
  onMockSync: (providerId: WearableProviderId, syncType: MockSyncType) => void;
}

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  return (
    <View style={{ marginBottom: theme.spacing.sm, marginTop: theme.spacing.lg }}>
      <Text style={[type.label, { color: theme.colors.textTertiary, textAlign: textAlign('start'), letterSpacing: 1 }]}>{title.toUpperCase()}</Text>
      {subtitle ? (
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

export function WearablesDeviceCenter({
  athleteId,
  snapshot,
  connections,
  records,
  onConnect,
  onDisconnect,
  onMockSync,
}: WearablesDeviceCenterProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const [syncingProviderId, setSyncingProviderId] = useState<WearableProviderId | null>(null);

  const athleteConnections = useMemo(
    () => connections.filter((c) => c.athlete_id === athleteId),
    [connections, athleteId]
  );

  const premiumProviders = getPremiumProviders();
  const connectedProviders = premiumProviders.filter((p) =>
    athleteConnections.some((c) => c.provider_id === p.id && c.status !== 'not_connected')
  );
  const availableProviders = premiumProviders.filter(
    (p) => !athleteConnections.some((c) => c.provider_id === p.id && c.status !== 'not_connected')
  );

  const syncHistory = useMemo(
    () => buildSyncHistoryTimeline(athleteId, records, connections),
    [athleteId, records, connections]
  );

  const handleSync = (providerId: WearableProviderId) => {
    setSyncingProviderId(providerId);
    onMockSync(providerId, 'hr_hrv');
    setTimeout(() => {
      onMockSync(providerId, 'sleep');
      setTimeout(() => {
        onMockSync(providerId, 'training_load');
        setSyncingProviderId(null);
      }, 600);
    }, 600);
  };

  return (
    <View>
      {/* Device Status Strip */}
      <LinearGradient
        colors={['#0066FF12', '#0D948812']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: theme.borderRadius['2xl'], padding: theme.spacing.md, marginBottom: theme.spacing.sm }}
      >
        <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: theme.colors.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="watch" size={22} color={theme.colors.primary} />
          </View>
          <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
            <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('wearables.sections.deviceStatus')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              {t('wearables.statusSummary', {
                connected: connectedProviders.length,
                total: premiumProviders.length,
              })}
            </Text>
          </View>
          <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', gap: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: connectedProviders.length > 0 ? theme.colors.success : theme.colors.textTertiary }} />
              <Text style={[type.caption, { color: connectedProviders.length > 0 ? theme.colors.success : theme.colors.textTertiary, fontWeight: '600' }]}>
                {connectedProviders.length > 0 ? t('wearables.liveIndicator') : t('wearables.status.not_connected')}
              </Text>
            </View>
            {snapshot.lastSyncAt ? (
              <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 4 }]}>
                {new Date(snapshot.lastSyncAt).toLocaleTimeString(isRTL ? 'ar' : 'en', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            ) : null}
          </View>
        </View>
      </LinearGradient>

      {/* Live Metrics */}
      <SectionHeader title={t('wearables.sections.liveMetrics')} subtitle={t('wearables.liveMetricsSubtitle')} />
      <LiveMetricsGrid snapshot={snapshot} athleteId={athleteId} />

      {/* Connected Devices */}
      {connectedProviders.length > 0 ? (
        <>
          <SectionHeader title={t('wearables.sections.connectedDevices')} />
          {connectedProviders.map((provider) => (
            <PremiumProviderCard
              key={provider.id}
              provider={provider}
              athleteId={athleteId}
              connection={athleteConnections.find((c) => c.provider_id === provider.id)}
              isSyncing={syncingProviderId === provider.id}
              onConnect={() => onConnect(provider.id)}
              onDisconnect={() => onDisconnect(provider.id)}
              onSync={() => handleSync(provider.id)}
            />
          ))}
        </>
      ) : null}

      {/* Available Devices */}
      <SectionHeader title={t('wearables.sections.availableDevices')} subtitle={t('wearables.availableSubtitle')} />
      {availableProviders.map((provider) => (
        <PremiumProviderCard
          key={provider.id}
          provider={provider}
          athleteId={athleteId}
          connection={athleteConnections.find((c) => c.provider_id === provider.id)}
          isSyncing={syncingProviderId === provider.id}
          onConnect={() => onConnect(provider.id)}
          onDisconnect={() => onDisconnect(provider.id)}
          onSync={() => handleSync(provider.id)}
        />
      ))}

      {/* Recent Sync */}
      <SectionHeader title={t('wearables.sections.recentSync')} />
      <SyncHistoryTimeline entries={syncHistory} />

      {/* Device Health */}
      <SectionHeader title={t('wearables.deviceHealth.title')} />
      <DeviceHealthCard snapshot={snapshot} athleteId={athleteId} />
    </View>
  );
}

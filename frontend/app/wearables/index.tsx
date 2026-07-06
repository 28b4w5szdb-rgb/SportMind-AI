import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { ConnectDevicesPanel } from '@/src/features/wearables';
import type { MockSyncType, WearableProviderId } from '@/src/features/wearables';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme, useTypography } from '@/src/core/theme';

export default function WearablesScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athletes = useMockStore((s) => s.athletes);
  const connections = useMockStore((s) => s.wearableConnections);
  const connectWearableProvider = useMockStore((s) => s.connectWearableProvider);
  const disconnectWearableProvider = useMockStore((s) => s.disconnectWearableProvider);
  const mockSyncWearable = useMockStore((s) => s.mockSyncWearable);

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const [selectedProviderId, setSelectedProviderId] = useState<WearableProviderId | undefined>();
  const [success, setSuccess] = useState('');

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('wearables.title')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('wearables.title')} subtitle={t('wearables.subtitle')}>
      <SuccessBanner message={success} visible={Boolean(success)} />

      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>{t('dailyCheckIn.selectAthlete')}</Text>
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>

      <ConnectDevicesPanel
        athleteId={selectedAthleteId}
        connections={connections}
        selectedProviderId={selectedProviderId}
        onSelectProvider={setSelectedProviderId}
        onConnect={(providerId) => {
          connectWearableProvider(selectedAthleteId, providerId);
          setSuccess(t('wearables.connectedSuccess'));
          setTimeout(() => setSuccess(''), 2000);
        }}
        onDisconnect={(providerId) => {
          disconnectWearableProvider(selectedAthleteId, providerId);
          setSuccess(t('wearables.disconnectedSuccess'));
          setTimeout(() => setSuccess(''), 2000);
        }}
        onMockSync={(providerId, syncType: MockSyncType) => {
          mockSyncWearable(selectedAthleteId, providerId, syncType);
          setSuccess(t('wearables.syncSuccess', { type: t(`wearables.sync.${syncType}`) }));
          setTimeout(() => setSuccess(''), 2500);
        }}
      />
    </FeatureScrollScreen>
  );
}

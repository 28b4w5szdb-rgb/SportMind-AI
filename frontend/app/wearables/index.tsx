import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { WearablesDeviceCenter, useWearablesSnapshot } from '@/src/features/wearables';
import type { MockSyncType, WearableProviderId } from '@/src/features/wearables';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme } from '@/src/core/theme';

export default function WearablesScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const athletes = useMockStore((s) => s.athletes);
  const connections = useMockStore((s) => s.wearableConnections);
  const records = useMockStore((s) => s.wearableRecords);
  const connectWearableProvider = useMockStore((s) => s.connectWearableProvider);
  const disconnectWearableProvider = useMockStore((s) => s.disconnectWearableProvider);
  const mockSyncWearable = useMockStore((s) => s.mockSyncWearable);

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const [success, setSuccess] = useState('');

  const selectedAthlete = useMemo(
    () => athletes.find((a) => a.id === selectedAthleteId) ?? athletes[0],
    [athletes, selectedAthleteId]
  );
  const snapshot = useWearablesSnapshot(selectedAthlete);

  if (athletes.length === 0 || !snapshot) {
    return (
      <FeatureScrollScreen title={t('wearables.title')}>
        <EmptyState icon="watch-outline" title={t('athletes.emptyRoster.title')} description={t('athletes.emptyRoster.description')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('wearables.title')} subtitle={t('wearables.subtitlePremium')}>
      <SuccessBanner message={success} visible={Boolean(success)} />

      <View style={{ marginBottom: theme.spacing.lg }}>
        <SectionHeader title={t('dailyCheckIn.selectAthlete')} titleSize="label" style={{ marginBottom: theme.spacing[2], marginTop: 0 }} />
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>

      <WearablesDeviceCenter
        athleteId={selectedAthleteId}
        snapshot={snapshot}
        connections={connections}
        records={records}
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
        onMockSync={(providerId: WearableProviderId, syncType: MockSyncType) => {
          mockSyncWearable(selectedAthleteId, providerId, syncType);
          if (syncType === 'training_load') {
            setSuccess(t('wearables.syncSuccess', { type: t('wearables.syncComplete') }));
            setTimeout(() => setSuccess(''), 2500);
          }
        }}
      />
    </FeatureScrollScreen>
  );
}

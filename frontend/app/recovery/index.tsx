import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { RecoveryCenterPanel } from '@/src/features/recovery';
import { useWearablesSnapshot } from '@/src/features/wearables';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme } from '@/src/core/theme';

export default function RecoveryCenterScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const athletes = useMockStore((s) => s.athletes);

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const latestCheckIn = useLatestCheckInForAthlete(selectedAthleteId || undefined);
  const selectedAthlete = athletes.find((a) => a.id === selectedAthleteId);
  const wearableSnapshot = useWearablesSnapshot(selectedAthlete);

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('recovery.title')}>
        <EmptyState icon="bed-outline" title={t('athletes.emptyRoster.title')} description={t('athletes.emptyRoster.description')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('recovery.title')} subtitle={t('recovery.centerSubtitle')}>
      <View style={{ marginBottom: theme.spacing.lg }}>
        <SectionHeader title={t('dailyCheckIn.selectAthlete')} titleSize="label" style={{ marginBottom: theme.spacing[2], marginTop: 0 }} />
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>
      <RecoveryCenterPanel checkIn={latestCheckIn} wearableSnapshot={wearableSnapshot} />
    </FeatureScrollScreen>
  );
}

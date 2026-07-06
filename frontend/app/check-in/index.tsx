import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips, CheckInForm } from '@/src/features/daily-checkin';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme } from '@/src/core/theme';
import { useFormAction } from '@/src/hooks/useFormAction';
import type { DailyCheckInInput } from '@/src/data/mock/types';

export default function DailyCheckInScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const athletes = useMockStore((s) => s.athletes);
  const addDailyCheckIn = useMockStore((s) => s.addDailyCheckIn);
  const { loading, success, run } = useFormAction();

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);

  const handleSubmit = (values: DailyCheckInInput) => {
    run(() => {
      addDailyCheckIn(values);
      setTimeout(() => router.push(APP_ROUTES.recoveryCenter(values.athlete_id)), 700);
    });
  };

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('dailyCheckIn.title')}>
        <EmptyState icon="clipboard-outline" title={t('athletes.emptyRoster.title')} description={t('athletes.emptyRoster.description')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('dailyCheckIn.title')} subtitle={t('dailyCheckIn.subtitle')}>
      {success ? <SuccessBanner message={t('dailyCheckIn.success')} visible={success} /> : null}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <SectionHeader title={t('dailyCheckIn.selectAthlete')} titleSize="label" style={{ marginBottom: theme.spacing[2], marginTop: 0 }} />
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>
      {selectedAthleteId ? <CheckInForm athleteId={selectedAthleteId} onSubmit={handleSubmit} loading={loading} /> : null}
    </FeatureScrollScreen>
  );
}

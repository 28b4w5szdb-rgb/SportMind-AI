import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips, CheckInForm } from '@/src/features/daily-checkin';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useFormAction } from '@/src/hooks/useFormAction';
import type { DailyCheckInInput } from '@/src/data/mock/types';

export default function DailyCheckInScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
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
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('dailyCheckIn.title')} subtitle={t('dailyCheckIn.subtitle')}>
      {success ? <SuccessBanner message={t('dailyCheckIn.success')} visible={success} /> : null}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>{t('dailyCheckIn.selectAthlete')}</Text>
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>
      {selectedAthleteId ? <CheckInForm athleteId={selectedAthleteId} onSubmit={handleSubmit} loading={loading} /> : null}
    </FeatureScrollScreen>
  );
}

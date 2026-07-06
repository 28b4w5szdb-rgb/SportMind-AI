import React, { useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { BodyCompositionForm, BodyCompositionHistoryPanel } from '@/src/features/nutrition/components/BodyCompositionPanel';
import { useNutritionSnapshot } from '@/src/features/nutrition/hooks/useNutritionSnapshot';
import { useAthleteById, useBodyCompositionForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { todayDateKey } from '@/src/features/daily-checkin/validation';
import { useTheme, useTypography } from '@/src/core/theme';
import { useFormAction } from '@/src/hooks/useFormAction';
import type { BodyCompositionInput } from '@/src/data/mock/types';

export default function BodyCompositionScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athletes = useMockStore((s) => s.athletes);
  const addBodyCompositionRecord = useMockStore((s) => s.addBodyCompositionRecord);
  const { loading, success, run } = useFormAction();

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const athlete = useAthleteById(selectedAthleteId || undefined);
  const records = useBodyCompositionForAthlete(selectedAthleteId || undefined);
  const snapshot = useNutritionSnapshot(athlete);
  const todayRecord = records.find((r) => r.date === todayDateKey());

  const handleSubmit = (values: BodyCompositionInput) => {
    run(() => {
      addBodyCompositionRecord({ ...values, date: todayDateKey() });
      setTimeout(() => router.push(APP_ROUTES.nutritionCenter(values.athlete_id)), 700);
    });
  };

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('nutrition.bodyComp.screenTitle')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('nutrition.bodyComp.screenTitle')} subtitle={t('nutrition.bodyComp.screenSubtitle')}>
      {success ? <SuccessBanner message={t('nutrition.bodyComp.saveSuccess')} visible={success} /> : null}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Text style={[type.label, { color: theme.colors.textSecondary, marginBottom: theme.spacing.sm }]}>{t('dailyCheckIn.selectAthlete')}</Text>
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>
      {snapshot?.bodyCompositionAnalysis ? (
        <BodyCompositionHistoryPanel analysis={snapshot.bodyCompositionAnalysis} trend={snapshot.bodyCompositionTrend} />
      ) : null}
      {selectedAthleteId ? (
        <BodyCompositionForm athleteId={selectedAthleteId} existing={todayRecord} onSubmit={handleSubmit} loading={loading} />
      ) : null}
    </FeatureScrollScreen>
  );
}

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { NutritionLogForm, resolveNutritionGoal } from '@/src/features/nutrition';
import { useMockStore } from '@/src/data/mock/store';
import { useLatestNutritionLogForAthlete } from '@/src/data/mock/hooks';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme } from '@/src/core/theme';
import { useFormAction } from '@/src/hooks/useFormAction';
import type { DailyNutritionLogInput } from '@/src/data/mock/types';
import type { NutritionGoalId } from '@/src/features/nutrition/types';

export default function NutritionLogScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const athletes = useMockStore((s) => s.athletes);
  const addNutritionLog = useMockStore((s) => s.addNutritionLog);
  const setNutritionGoal = useMockStore((s) => s.setNutritionGoal);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const { loading, success, run } = useFormAction();

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const existingLog = useLatestNutritionLogForAthlete(selectedAthleteId || undefined);
  const currentGoal = resolveNutritionGoal(nutritionGoalSettings, selectedAthleteId);

  const handleSubmit = (values: DailyNutritionLogInput, goal: NutritionGoalId) => {
    run(() => {
      addNutritionLog(values);
      setNutritionGoal(values.athlete_id, goal);
      setTimeout(() => router.push(APP_ROUTES.nutritionCenter(values.athlete_id)), 700);
    });
  };

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('nutrition.logTitle')}>
        <EmptyState icon="nutrition-outline" title={t('states.empty.defaultDescription')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('nutrition.logTitle')} subtitle={t('nutrition.logSubtitle')}>
      {success ? <SuccessBanner message={t('nutrition.logSuccess')} visible={success} /> : null}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <SectionHeader title={t('dailyCheckIn.selectAthlete')} titleSize="label" style={{ marginBottom: theme.spacing[2], marginTop: 0 }} />
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>
      {selectedAthleteId ? (
        <NutritionLogForm
          athleteId={selectedAthleteId}
          initialGoal={currentGoal}
          existingMeals={existingLog?.meals}
          initialWater={existingLog?.water_liters}
          initialSupplements={existingLog?.supplement_keys}
          initialNotes={existingLog?.notes}
          onSubmit={handleSubmit}
          loading={loading}
        />
      ) : null}
    </FeatureScrollScreen>
  );
}

import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { SuccessBanner } from '@/src/components/common/SuccessBanner';
import { AthleteSelectorChips } from '@/src/features/daily-checkin';
import { TrainingBuilderPanel, useTrainingBuilderSnapshot, useGenerateTrainingPlan } from '@/src/features/training-builder';
import { useLatestCheckInForAthlete, useTestsForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme } from '@/src/core/theme';
import { useFormAction } from '@/src/hooks/useFormAction';

export default function TrainingBuilderScreen() {
  const { athleteId: athleteIdParam } = useLocalSearchParams<{ athleteId?: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const athletes = useMockStore((s) => s.athletes);

  const initialAthleteId = useMemo(() => athleteIdParam ?? athletes[0]?.id ?? '', [athleteIdParam, athletes]);
  const [selectedAthleteId, setSelectedAthleteId] = useState(initialAthleteId);
  const athlete = athletes.find((a) => a.id === selectedAthleteId);
  const tests = useTestsForAthlete(selectedAthleteId);
  const checkIn = useLatestCheckInForAthlete(selectedAthleteId);
  const snapshot = useTrainingBuilderSnapshot(athlete, tests);
  const generatePlan = useGenerateTrainingPlan(athlete, tests);
  const { loading, success, run } = useFormAction();

  if (athletes.length === 0) {
    return (
      <FeatureScrollScreen title={t('trainingBuilder.title')}>
        <EmptyState icon="barbell-outline" title={t('athletes.emptyRoster.title')} description={t('athletes.emptyRoster.description')} />
      </FeatureScrollScreen>
    );
  }

  const handleGenerate = () => {
    run(() => {
      generatePlan();
    });
  };

  return (
    <FeatureScrollScreen title={t('trainingBuilder.title')} subtitle={t('trainingBuilder.subtitle')}>
      <SuccessBanner visible={success} message={t('trainingBuilder.generateSuccess')} />
      <View style={{ marginBottom: theme.spacing.lg }}>
        <SectionHeader title={t('dailyCheckIn.selectAthlete')} titleSize="label" style={{ marginBottom: theme.spacing[2], marginTop: 0 }} />
        <AthleteSelectorChips athletes={athletes} selectedId={selectedAthleteId} onSelect={setSelectedAthleteId} />
      </View>
      {snapshot ? (
        <TrainingBuilderPanel snapshot={snapshot} athleteId={selectedAthleteId} onGenerate={handleGenerate} generating={loading} />
      ) : null}
    </FeatureScrollScreen>
  );
}

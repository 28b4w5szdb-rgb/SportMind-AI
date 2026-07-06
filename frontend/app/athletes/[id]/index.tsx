import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { EmptyState } from '@/src/components/common/EmptyState';
import { AthleteIntelligenceWorkspace } from '@/src/features/athlete-workspace';
import { useAthleteAnalytics } from '@/src/analytics';
import { useAthleteById, useTestsForAthlete } from '@/src/data/mock/hooks';
import { APP_ROUTES } from '@/src/core/constants/routes';

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const athlete = useAthleteById(id);
  const tests = useTestsForAthlete(id);
  const analytics = useAthleteAnalytics(athlete, tests);

  if (!athlete) {
    return (
      <FeatureScrollScreen title={t('athleteWorkspace.screenTitle')}>
        <EmptyState icon="person-outline" title={t('states.empty.defaultDescription')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen
      title={t('athleteWorkspace.screenTitle')}
      subtitle={`${athlete.first_name} ${athlete.last_name}`}
      rightAction={{ icon: 'create-outline', onPress: () => router.push(APP_ROUTES.athleteEdit(athlete.id)) }}
    >
      {analytics ? <AthleteIntelligenceWorkspace athlete={athlete} tests={tests} analytics={analytics} /> : null}
    </FeatureScrollScreen>
  );
}

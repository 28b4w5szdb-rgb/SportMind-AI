import React from 'react';
import { Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { AthleteIntelligenceWorkspace } from '@/src/features/athlete-workspace';
import { useAthleteAnalytics } from '@/src/analytics';
import { useAthleteById, useTestsForAthlete } from '@/src/data/mock/hooks';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';

export default function AthleteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const athlete = useAthleteById(id);
  const tests = useTestsForAthlete(id);
  const analytics = useAthleteAnalytics(athlete, tests);

  if (!athlete) {
    return (
      <FeatureScrollScreen title={t('athleteWorkspace.screenTitle')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>
          {t('states.empty.defaultDescription')}
        </Text>
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

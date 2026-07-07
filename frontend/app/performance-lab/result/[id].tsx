import React, { useMemo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Button } from '@/src/components/common/Button';
import { EmptyState } from '@/src/components/common/EmptyState';
import { useAthleteById } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import {
  useTestDefinition,
  computeResultAnalyticsSnapshot,
  computeTestAnalyticsImpact,
  LabResultPremiumView,
  usePerformanceLabResult,
} from '@/src/features/performance-lab';
import type { MockPerformanceTest } from '@/src/data/mock/types';

export default function TestResultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { loading, readErrorKey, test } = usePerformanceLabResult(id);
  const definition = useTestDefinition(test?.test_type_key);
  const athlete = useAthleteById(test?.athlete_id);
  const allTests = useMockStore((s) => s.tests);

  const analytics = useMemo(() => {
    if (!athlete || !test) return undefined;
    const athleteTests = allTests.filter((tst) => tst.athlete_id === athlete.id);
    return computeResultAnalyticsSnapshot(athlete, athleteTests);
  }, [athlete, test, allTests]);

  const impact = useMemo(() => {
    if (!athlete || !test) return undefined;
    const prior = allTests.filter((tst) => tst.athlete_id === athlete.id && tst.id !== test.id);
    const simulated: MockPerformanceTest = { ...test };
    return computeTestAnalyticsImpact(athlete, prior, simulated);
  }, [athlete, test, allTests]);

  if (loading) {
    return (
      <FeatureScrollScreen title={t('testingCenter.resultTitle')}>
        <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, marginTop: theme.spacing.md }]}>
            {t('testingCenter.bridge.loading')}
          </Text>
        </View>
      </FeatureScrollScreen>
    );
  }

  if (!test) {
    return (
      <FeatureScrollScreen title={t('testingCenter.resultNotFound')}>
        <EmptyState icon="analytics-outline" title={t('testingCenter.resultNotFound')} description={t('testingCenter.resultNotFoundDesc')} />
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('testingCenter.resultTitle')}>
      {readErrorKey ? (
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md }]}>
          {t(readErrorKey)}
        </Text>
      ) : null}
      <LabResultPremiumView test={test} definition={definition} analytics={analytics} impact={impact} allTests={allTests} />
      <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        <Button title={t('testingCenter.recordAnother')} onPress={() => router.push(APP_ROUTES.performanceLabTest(test.test_type_key))} variant="primary" fullWidth icon="add" />
        <Button title={t('testingCenter.viewHistory')} onPress={() => router.replace(APP_ROUTES.performanceLabHistory)} variant="outline" fullWidth icon="time" />
      </View>
    </FeatureScrollScreen>
  );
}

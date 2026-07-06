import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Button } from '@/src/components/common/Button';
import { FormSection } from '@/src/components/common/FormSection';
import { useAthleteById, useTestById } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { APP_ROUTES } from '@/src/core/constants/routes';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import {
  TestResultCard,
  useTestDefinition,
  computeResultAnalyticsSnapshot,
  computeTestAnalyticsImpact,
  getTestText,
} from '@/src/features/performance-lab';
import type { MockPerformanceTest } from '@/src/data/mock/types';

export default function TestResultDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign, isRTL } = useDirection();
  const test = useTestById(id);
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

  if (!test) {
    return (
      <FeatureScrollScreen title={t('testingCenter.resultTitle')}>
        <Text style={[type.body, { color: theme.colors.textSecondary, textAlign: 'center' }]}>{t('states.empty.defaultDescription')}</Text>
      </FeatureScrollScreen>
    );
  }

  return (
    <FeatureScrollScreen title={t('testingCenter.resultTitle')}>
      <TestResultCard test={test} analytics={analytics} impact={impact} definition={definition} />

      {analytics ? (
        <FormSection title={t('testingCenter.kpiSummary')}>
          <View style={{ gap: 8 }}>
            {analytics.kpis.map((kpi) => (
              <View key={kpi.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{t(kpi.labelKey)}</Text>
                <Text style={[type.bodySm, { color: theme.colors.text }]}>{kpi.displayValue}</Text>
              </View>
            ))}
          </View>
        </FormSection>
      ) : null}

      {definition ? (
        <FormSection title={t('testingCenter.sections.scoring')}>
          <Text style={[type.body, { color: theme.colors.text, textAlign: textAlign('start'), lineHeight: 22 }]}>
            {getTestText(definition, 'scoring', isRTL)}
          </Text>
        </FormSection>
      ) : null}

      <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.md }}>
        <Button title={t('testingCenter.recordAnother')} onPress={() => router.push(APP_ROUTES.performanceLabTest(test.test_type_key))} variant="primary" fullWidth icon="add" />
        <Button title={t('testingCenter.viewHistory')} onPress={() => router.replace(APP_ROUTES.performanceLabHistory)} variant="outline" fullWidth icon="time" />
      </View>
    </FeatureScrollScreen>
  );
}

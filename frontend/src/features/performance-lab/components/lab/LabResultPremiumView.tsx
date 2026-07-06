import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { FormSection } from '@/src/components/common/FormSection';
import { RadarChart, LineTrendChart, DonutChart, BarComparisonChart } from '@/src/components/charts';
import { RecommendationPanel } from '@/src/components/analytics/RecommendationPanel';
import { DecisionSupportCard } from '@/src/components/analytics/DecisionSupportCard';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import { SsidInterpretationView } from '@/src/features/ssid-engine';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { DemographicContextCard } from '../DemographicContextCard';
import { TestReferencePanel } from '../TestReferencePanel';
import { LabBenchmarkComparison } from './LabBenchmarkComparison';
import {
  PERFORMANCE_LEVEL_COLORS,
  getTestName,
  interpretTestWithSsid,
} from '../../index';
import type { TestDefinition, TestAnalyticsImpact } from '../../types';
import { buildTestHistoryTrend } from '../../hooks/useLabDashboardPresentation';
import { levelToPercentile } from '../../utils/labPresentation';

interface LabResultPremiumViewProps {
  test: MockPerformanceTest;
  definition?: TestDefinition;
  analytics?: AthleteAnalyticsSnapshot;
  impact?: TestAnalyticsImpact;
  allTests: MockPerformanceTest[];
}

export function LabResultPremiumView({ test, definition, analytics, impact, allTests }: LabResultPremiumViewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();

  const { level, ssid } = useMemo(() => {
    if (test.ssid && definition) {
      return {
        level: test.ssid.performanceLevel ?? interpretTestWithSsid(definition, test.value, test.demographicContext ?? {}).level,
        ssid: test.ssid,
      };
    }
    if (!definition) return { level: 'average' as const, ssid: undefined };
    return interpretTestWithSsid(definition, test.value, test.demographicContext ?? {});
  }, [definition, test]);

  const levelColor = PERFORMANCE_LEVEL_COLORS[level];
  const testTitle = definition ? getTestName(definition, isRTL) : test.test_type;
  const trendPoints = buildTestHistoryTrend(allTests, test.test_type_key, test.athlete_id);
  const percentile = levelToPercentile(level);

  const radarAxes = analytics
    ? analytics.radarAxes.slice(0, 6).map((a) => ({ label: t(a.labelKey), value: a.value, max: a.max }))
    : [];

  const distributionSegments = [
    { value: percentile, color: levelColor, label: t(`testingCenter.levels.${level}`) },
    { value: 100 - percentile, color: theme.colors.border, label: t('performanceLab.otherAthletes') },
  ].filter((s) => s.value > 0);

  return (
    <View>
      <Card variant="elevated" padding="none" style={{ borderRadius: theme.borderRadius['2xl'], overflow: 'hidden', marginBottom: theme.spacing.lg, ...theme.shadows.lg }}>
        <LinearGradient colors={[levelColor, levelColor + 'AA']} style={{ padding: theme.spacing.xl, alignItems: 'center' }}>
          <Badge label={t(`testingCenter.levels.${level}`)} variant={level === 'elite' || level === 'good' ? 'success' : 'warning'} />
          <Text style={[type.displaySmall, { color: '#FFF', marginTop: theme.spacing.md }]}>
            {test.value}
            <Text style={[type.h4, { color: 'rgba(255,255,255,0.85)' }]}> {test.unit}</Text>
          </Text>
          <Text style={[type.h5, { color: '#FFF', marginTop: 8, textAlign: 'center' }]}>{testTitle}</Text>
          <Text style={[type.bodySm, { color: 'rgba(255,255,255,0.85)', marginTop: 4 }]}>{test.athlete_name} · {test.date}</Text>
          <View style={{ flexDirection: flexRow(true), gap: 12, marginTop: theme.spacing.lg }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={[type.caption, { color: 'rgba(255,255,255,0.75)' }]}>{t('performanceLab.percentile')}</Text>
              <Text style={[type.numberSm, { color: '#FFF' }]}>{percentile}%</Text>
            </View>
            {impact ? (
              <View style={{ alignItems: 'center' }}>
                <Text style={[type.caption, { color: 'rgba(255,255,255,0.75)' }]}>{t('performanceLab.scoreImpact')}</Text>
                <Text style={[type.numberSm, { color: '#FFF' }]}>
                  {impact.delta >= 0 ? '+' : ''}
                  {impact.delta}
                </Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </Card>

      {trendPoints.length > 1 ? (
        <FormSection title={t('performanceLab.resultTrend')} subtitle={t('performanceLab.resultTrendSub')}>
          <LineTrendChart points={trendPoints} color={levelColor} />
        </FormSection>
      ) : null}

      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        {radarAxes.length > 0 ? (
          <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 260, borderRadius: theme.borderRadius.xl }}>
            <Text style={[type.label, { color: theme.colors.text, marginBottom: 8, textAlign: textAlign('start') }]}>{t('analytics.radarTitle')}</Text>
            <RadarChart axes={radarAxes} color={theme.colors.primary} />
          </Card>
        ) : null}
        <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 200, borderRadius: theme.borderRadius.xl, alignItems: 'center' }}>
          <Text style={[type.label, { color: theme.colors.text, marginBottom: 8, alignSelf: 'stretch', textAlign: textAlign('start') }]}>{t('performanceLab.percentileChart')}</Text>
          <DonutChart segments={distributionSegments} size={120} centerLabel={`${percentile}%`} />
        </Card>
        {impact ? (
          <Card variant="outlined" padding="md" style={{ flex: 1, minWidth: 200, borderRadius: theme.borderRadius.xl }}>
            <Text style={[type.label, { color: theme.colors.text, marginBottom: 8, textAlign: textAlign('start') }]}>{t('performanceLab.comparisonChart')}</Text>
            <BarComparisonChart values={[impact.beforeScore, impact.afterScore]} color={levelColor} />
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 8, textAlign: textAlign('start') }]}>
              {impact.beforeScore} → {impact.afterScore}
            </Text>
          </Card>
        ) : null}
      </View>

      {ssid ? (
        <FormSection title={t('ssid.ui.sectionTitle')} subtitle={t('testingCenter.ssidPreviewSubtitle')}>
          <SsidInterpretationView interpretation={ssid} titleOverride={testTitle} />
        </FormSection>
      ) : null}

      {definition ? <TestReferencePanel definition={definition} demographicContext={test.demographicContext} /> : null}
      <DemographicContextCard test={test} />
      <LabBenchmarkComparison test={test} definition={definition} level={level} percentile={percentile} />

      {analytics ? (
        <>
          <RecommendationPanel items={analytics.recommendations} />
          <DecisionSupportCard decision={analytics.decision} />
        </>
      ) : null}

      {test.notes ? (
        <FormSection title={t('features.lab.notes')}>
          <Text style={[type.bodySm, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]}>{test.notes}</Text>
        </FormSection>
      ) : null}
    </View>
  );
}

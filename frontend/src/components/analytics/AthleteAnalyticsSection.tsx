import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { FormSection } from '@/src/components/common/FormSection';
import { RadarChart, LineTrendChart, BarComparisonChart, DonutChart } from '@/src/components/charts';
import { AnalyticsKpiCard } from './AnalyticsKpiCard';
import { OverallScoreHero } from './OverallScoreHero';
import { ModuleListPanel } from './ModuleListPanel';
import { DecisionSupportCard } from './DecisionSupportCard';
import { RecommendationPanel } from './RecommendationPanel';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface AthleteAnalyticsSectionProps {
  analytics: AthleteAnalyticsSnapshot;
}

export function AthleteAnalyticsSection({ analytics }: AthleteAnalyticsSectionProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();

  const weekly = analytics.trends.find((tr) => tr.period === 'weekly');
  const monthly = analytics.trends.find((tr) => tr.period === 'monthly');
  const radarAxes = analytics.radarAxes.map((a) => ({ label: t(a.labelKey), value: a.value, max: a.max }));

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { excellent: 0, good: 0, moderate: 0, low: 0, critical: 0 };
    analytics.overall.modules.forEach((m) => {
      counts[m.status] = (counts[m.status] ?? 0) + 1;
    });
    return counts;
  }, [analytics.overall.modules]);

  const donutSegments = useMemo(
    () =>
      [
        { key: 'excellent', color: '#10B981', label: t('analytics.status.excellent') },
        { key: 'good', color: '#0066FF', label: t('analytics.status.good') },
        { key: 'moderate', color: '#F97316', label: t('analytics.status.moderate') },
        { key: 'low', color: '#EF4444', label: t('analytics.status.low') },
        { key: 'critical', color: '#991B1B', label: t('analytics.status.critical') },
      ]
        .map((s) => ({ value: statusCounts[s.key] ?? 0, color: s.color, label: s.label }))
        .filter((s) => s.value > 0),
    [statusCounts, t]
  );

  return (
    <View style={{ marginBottom: theme.spacing.lg }}>
      <Text style={[type.overline, { color: theme.colors.textTertiary, letterSpacing: 1.5, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
        {t('analytics.sectionTitle').toUpperCase()}
      </Text>

      <OverallScoreHero overall={analytics.overall} />
      <DecisionSupportCard decision={analytics.decision} />

      <FormSection title={t('analytics.kpiTitle')} subtitle={t('analytics.kpiSubtitle')}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
          {analytics.kpis.map((kpi) => (
            <AnalyticsKpiCard key={kpi.id} kpi={kpi} label={t(kpi.labelKey)} />
          ))}
        </View>
      </FormSection>

      <FormSection title={t('analytics.radarTitle')} subtitle={t('analytics.radarSubtitle')}>
        <RadarChart axes={radarAxes} color={theme.colors.primary} />
      </FormSection>

      <FormSection title={t('analytics.breakdownTitle')}>
        {donutSegments.length > 0 && (
          <DonutChart segments={donutSegments} size={130} centerLabel={String(analytics.overall.modules.length)} />
        )}
        {analytics.overall.modules.slice(0, 6).map((mod) => (
          <View key={mod.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ flex: 1, height: 8, backgroundColor: theme.colors.border, borderRadius: 4, overflow: 'hidden' }}>
              <View style={{ width: `${mod.score}%`, height: 8, backgroundColor: mod.color, borderRadius: 4 }} />
            </View>
            <Text style={[type.caption, { color: theme.colors.textSecondary, width: 100, marginStart: 8 }]} numberOfLines={1}>
              {t(mod.labelKey)}
            </Text>
            <Text style={[type.caption, { color: theme.colors.text, width: 28, textAlign: 'right' }]}>{mod.score}</Text>
          </View>
        ))}
      </FormSection>

      <ModuleListPanel title={t('analytics.strengths')} modules={analytics.strengths} variant="strength" />
      <ModuleListPanel title={t('analytics.weaknesses')} modules={analytics.weaknesses} variant="weakness" />
      <RecommendationPanel items={analytics.recommendations} />

      {weekly && (
        <FormSection title={t('analytics.trends.weekly')}>
          <LineTrendChart points={weekly.points.map((p) => p.value)} color={theme.colors.secondary} />
          <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 8, textAlign: textAlign('start') }]}>
            {weekly.changePercent > 0 ? '+' : ''}{weekly.changePercent}% {t('analytics.trendChange')}
          </Text>
        </FormSection>
      )}

      {monthly && (
        <FormSection title={t('analytics.trends.monthly')}>
          <BarComparisonChart values={monthly.points.map((p) => p.value)} color={theme.colors.primary} />
        </FormSection>
      )}

      <FormSection title={t('analytics.benchmarkTitle')} subtitle={t('analytics.benchmarkSubtitle')}>
        {analytics.benchmarks.map((b) => (
          <View key={b.scope} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
            <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>{t(b.labelKey)}</Text>
            <Text style={[type.bodySm, { color: b.status === 'above' ? theme.colors.success : b.status === 'below' ? theme.colors.warning : theme.colors.text }]}>
              {b.delta > 0 ? '+' : ''}{b.delta}
            </Text>
          </View>
        ))}
      </FormSection>
    </View>
  );
}

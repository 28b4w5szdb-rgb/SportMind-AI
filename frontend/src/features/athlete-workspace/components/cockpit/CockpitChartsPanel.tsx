import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { RadarChart, LineTrendChart, BarComparisonChart, DonutChart } from '@/src/components/charts';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useResponsiveLayout } from '@/src/hooks/useResponsiveLayout';

interface CockpitChartsPanelProps {
  analytics: AthleteAnalyticsSnapshot;
}

export function CockpitChartsPanel({ analytics }: CockpitChartsPanelProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const { isTablet } = useResponsiveLayout();

  const weekly = analytics.trends.find((tr) => tr.period === 'weekly');
  const monthly = analytics.trends.find((tr) => tr.period === 'monthly');
  const radarAxes = analytics.radarAxes.map((a) => ({ label: t(a.labelKey), value: a.value, max: a.max }));

  const readinessKpi = analytics.kpis.find((k) => k.id === 'readiness');
  const loadKpi = analytics.kpis.find((k) => k.id === 'training_load');
  const recoveryKpi = analytics.kpis.find((k) => k.id === 'recovery');
  const riskKpi = analytics.kpis.find((k) => k.id === 'injury_risk');

  const riskSegments = [
    { value: riskKpi ? parseFloat(String(riskKpi.displayValue)) || 0 : 0, color: '#EF4444', label: t('analytics.kpi.injuryRisk') },
    { value: readinessKpi ? 100 - (parseFloat(String(readinessKpi.displayValue)) || 0) : 0, color: '#10B981', label: t('analytics.kpi.readiness') },
  ].filter((s) => s.value > 0);

  const chartWidth = isTablet ? '48%' : '100%';

  return (
    <View style={{ gap: theme.spacing.md }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
        <Card variant="outlined" padding="md" style={{ width: chartWidth, flexGrow: 1, borderRadius: theme.borderRadius.xl, minWidth: 280 }}>
          <Text style={[type.label, { color: theme.colors.text, marginBottom: 8, textAlign: textAlign('start') }]}>{t('analytics.radarTitle')}</Text>
          <RadarChart axes={radarAxes} color={theme.colors.primary} />
        </Card>

        {weekly ? (
          <Card variant="outlined" padding="md" style={{ width: chartWidth, flexGrow: 1, borderRadius: theme.borderRadius.xl, minWidth: 280 }}>
            <Text style={[type.label, { color: theme.colors.text, marginBottom: 8, textAlign: textAlign('start') }]}>{t('athleteWorkspace.cockpit.charts.trend')}</Text>
            <LineTrendChart points={weekly.points.map((p) => p.value)} color={theme.colors.secondary} />
            <Text style={[type.caption, { color: theme.colors.textTertiary, marginTop: 8, textAlign: textAlign('start') }]}>
              {weekly.changePercent > 0 ? '+' : ''}
              {weekly.changePercent}% {t('analytics.trendChange')}
            </Text>
          </Card>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md }}>
        <Card variant="outlined" padding="md" style={{ width: chartWidth, flexGrow: 1, borderRadius: theme.borderRadius.xl, minWidth: 200 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="flash" size={16} color="#10B981" />
            <Text style={[type.label, { color: theme.colors.text, marginStart: 6 }]}>{t('athleteWorkspace.cockpit.charts.readiness')}</Text>
          </View>
          <Text style={[type.h4, { color: theme.colors.text }]}>{readinessKpi?.displayValue ?? '—'}</Text>
          {weekly ? <LineTrendChart points={weekly.points.map((p) => p.value * 0.85)} color="#10B981" /> : null}
        </Card>

        <Card variant="outlined" padding="md" style={{ width: chartWidth, flexGrow: 1, borderRadius: theme.borderRadius.xl, minWidth: 200 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="barbell" size={16} color="#8B5CF6" />
            <Text style={[type.label, { color: theme.colors.text, marginStart: 6 }]}>{t('athleteWorkspace.cockpit.charts.load')}</Text>
          </View>
          <Text style={[type.h4, { color: theme.colors.text }]}>{loadKpi?.displayValue ?? '—'}</Text>
          {monthly ? <BarComparisonChart values={monthly.points.map((p) => p.value)} color="#8B5CF6" /> : null}
        </Card>

        <Card variant="outlined" padding="md" style={{ width: chartWidth, flexGrow: 1, borderRadius: theme.borderRadius.xl, minWidth: 200 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="heart" size={16} color="#0D9488" />
            <Text style={[type.label, { color: theme.colors.text, marginStart: 6 }]}>{t('athleteWorkspace.cockpit.charts.recovery')}</Text>
          </View>
          <Text style={[type.h4, { color: theme.colors.text }]}>{recoveryKpi?.displayValue ?? '—'}</Text>
          {weekly ? <LineTrendChart points={weekly.points.map((p) => 100 - p.value * 0.3)} color="#0D9488" /> : null}
        </Card>

        <Card variant="outlined" padding="md" style={{ width: chartWidth, flexGrow: 1, borderRadius: theme.borderRadius.xl, minWidth: 200, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, alignSelf: 'stretch' }}>
            <Ionicons name="shield" size={16} color="#EF4444" />
            <Text style={[type.label, { color: theme.colors.text, marginStart: 6 }]}>{t('athleteWorkspace.cockpit.charts.risk')}</Text>
          </View>
          {riskSegments.length > 0 ? (
            <DonutChart segments={riskSegments} size={110} centerLabel={riskKpi?.displayValue ?? '—'} />
          ) : (
            <Text style={[type.bodySm, { color: theme.colors.textSecondary }]}>—</Text>
          )}
        </Card>
      </View>
    </View>
  );
}

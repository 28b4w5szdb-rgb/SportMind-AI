import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { SectionHeader } from '@/src/components/common/SectionHeader';
import { BarComparisonChart, DonutChart, LineTrendChart } from '@/src/components/charts';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

interface DashboardChartsPanelProps {
  performanceTrend: number[];
  readinessTrend: number[];
  trainingLoadBars: number[];
  riskDistribution: Array<{ value: number; label: string; color: string }>;
  chartWidth: number;
  isDesktop: boolean;
}

export function DashboardChartsPanel({
  performanceTrend,
  readinessTrend,
  trainingLoadBars,
  riskDistribution,
  chartWidth,
  isDesktop,
}: DashboardChartsPanelProps) {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { textAlign } = useDirection();

  const chartCard = (title: string, subtitle: string, child: React.ReactNode) => (
    <Card variant="elevated" padding="lg" style={{ flex: 1, minWidth: isDesktop ? 280 : '100%', borderRadius: theme.borderRadius[theme.tokens.radius.card] }}>
      <Text style={[type.h6, { color: theme.colors.text, textAlign: textAlign('start') }]}>{title}</Text>
      <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing[1], marginBottom: theme.spacing[4], textAlign: textAlign('start') }]}>
        {subtitle}
      </Text>
      {child}
    </Card>
  );

  return (
    <View>
      <SectionHeader title={t('dashboard.analyticsCharts')} subtitle={t('dashboard.analyticsChartsSubtitle')} />
      <View style={{ flexDirection: isDesktop ? 'row' : 'column', flexWrap: 'wrap', gap: theme.spacing[4] }}>
        {chartCard(
          t('dashboard.chart.performanceTrend'),
          t('dashboard.chart.performanceTrendSub'),
          <LineTrendChart points={performanceTrend} width={chartWidth} height={96} color={theme.colors.primary} />
        )}
        {chartCard(
          t('dashboard.chart.readinessTrend'),
          t('dashboard.chart.readinessTrendSub'),
          <LineTrendChart points={readinessTrend} width={chartWidth} height={96} color={theme.colors.success} />
        )}
        {chartCard(
          t('dashboard.chart.riskDistribution'),
          t('dashboard.chart.riskDistributionSub'),
          <DonutChart
            segments={riskDistribution}
            size={128}
            centerLabel={String(riskDistribution.reduce((s, r) => s + r.value, 0))}
          />
        )}
        {chartCard(
          t('dashboard.chart.trainingLoad'),
          t('dashboard.chart.trainingLoadSub'),
          <BarComparisonChart values={trainingLoadBars.length ? trainingLoadBars : [0]} width={chartWidth} height={96} color={theme.colors.accent} />
        )}
      </View>
    </View>
  );
}

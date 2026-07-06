import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { BarComparisonChart, RadarChart } from '@/src/components/charts';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { buildReportChartData } from '../../utils/chartData';
import type { ReportPreviewBlock } from '../../types';
import type { MockReportSections } from '@/src/data/mock/types';

interface ReportSectionBlockProps {
  block: ReportPreviewBlock;
  accent: string;
  accentSoft: string;
  index: number;
  hideBody?: boolean;
}

export function ReportSectionBlock({ block, accent, accentSoft, index, hideBody }: ReportSectionBlockProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();

  return (
    <Card
      variant="elevated"
      padding="md"
      style={{
        marginBottom: theme.spacing.md,
        borderRadius: theme.borderRadius['2xl'],
        borderStartWidth: 4,
        borderStartColor: accent,
        ...theme.shadows.sm,
      }}
    >
      <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: hideBody ? 0 : theme.spacing.sm }}>
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: accentSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={block.icon} size={18} color={accent} />
        </View>
        <View style={{ flex: 1, marginStart: theme.spacing.sm }}>
          <Text style={[type.overline, { color: accent, textAlign: textAlign('start') }]}>
            {String(index + 1).padStart(2, '0')}
          </Text>
          <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t(block.titleKey)}</Text>
        </View>
      </View>
      {!hideBody ? (
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, lineHeight: 22, textAlign: textAlign('start') }]}>
          {block.body}
        </Text>
      ) : null}
    </Card>
  );
}

interface ReportChartsBlockProps {
  sections: MockReportSections;
  accent: string;
  accentSoft: string;
  body: string;
}

export function ReportChartsBlock({ sections, accent, accentSoft, body }: ReportChartsBlockProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const chartData = buildReportChartData(sections);

  return (
    <View style={{ gap: theme.spacing.md }}>
      {chartData.radarAxes.length >= 3 ? (
        <View style={{ alignItems: 'center', paddingVertical: theme.spacing.sm }}>
          <RadarChart axes={chartData.radarAxes} size={220} color={accent} />
        </View>
      ) : null}

      {chartData.barValues.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ paddingVertical: theme.spacing.xs }}>
            <BarComparisonChart values={chartData.barValues} color={accent} width={Math.max(240, chartData.barValues.length * 56)} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8, maxWidth: Math.max(240, chartData.barValues.length * 56) }}>
              {chartData.barLabels.map((label) => (
                <Text key={label} style={[type.caption, { color: theme.colors.textSecondary, textAlign: textAlign('start') }]} numberOfLines={1}>
                  {label}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
      ) : null}

      {body.trim() ? (
        <Text style={[type.bodySm, { color: theme.colors.textSecondary, lineHeight: 22, textAlign: textAlign('start') }]}>{body}</Text>
      ) : (
        <Text style={[type.caption, { color: theme.colors.textTertiary, textAlign: textAlign('start') }]}>
          {t('reportBuilder.preview.chartPlaceholder')}
        </Text>
      )}
    </View>
  );
}

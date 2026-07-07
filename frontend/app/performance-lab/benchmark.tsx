import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { getTestDefinition, getTestName } from '@/src/features/performance-lab';
import { usePerformanceLabBenchmark } from '@/src/features/performance-lab/bridge';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const RATING_COLORS = { elite: '#10B981', good: '#0066FF', average: '#F97316', below: '#EF4444' };
type BenchmarkRating = keyof typeof RATING_COLORS;

export default function LabBenchmarkScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const { rows, loading, readErrorKey } = usePerformanceLabBenchmark();

  return (
    <FeatureScrollScreen title={t('performanceLab.benchmarkScreen.title')}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {t('performanceLab.benchmarkScreen.subtitle')}
      </Text>

      {readErrorKey ? (
        <Text style={[type.caption, { color: theme.colors.textSecondary, marginBottom: theme.spacing.md, textAlign: textAlign('start') }]}>
          {t(readErrorKey)}
        </Text>
      ) : null}

      {loading ? (
        <View style={{ alignItems: 'center', paddingVertical: theme.spacing.lg }}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: theme.spacing.sm }]}>
            {t('testingCenter.bridge.loading')}
          </Text>
        </View>
      ) : null}

      {rows.map(({ norm, latest, rating }) => {
        const color = rating ? RATING_COLORS[rating] : theme.colors.textTertiary;
        const def = getTestDefinition(norm.testKey);
        const label = def ? getTestName(def, isRTL) : norm.testKey;

        return (
          <Card key={norm.testKey} variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: color + '18', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="ribbon" size={22} color={color} />
              </View>
              <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                  {label}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                  {t('performanceLab.benchmarkScreen.normLine', {
                    elite: norm.elite,
                    good: norm.good,
                    avg: norm.avg,
                    unit: norm.unit,
                  })}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[type.numberSm, { color }]}>
                  {latest ? `${latest.value} ${norm.unit}` : '—'}
                </Text>
                {rating ? (
                  <Text style={[type.caption, { color, marginTop: 2 }]}>
                    {t(`testingCenter.levels.${rating}`)}
                  </Text>
                ) : null}
              </View>
            </View>
            <View style={{ flexDirection: flexRow(true), marginTop: theme.spacing.md, gap: 4, height: 8 }}>
              {(['below', 'average', 'good', 'elite'] as BenchmarkRating[]).map((r) => (
                <View
                  key={r}
                  style={{
                    flex: 1,
                    backgroundColor: RATING_COLORS[r],
                    borderRadius: 4,
                    opacity: rating === r ? 1 : 0.2,
                  }}
                />
              ))}
            </View>
          </Card>
        );
      })}
    </FeatureScrollScreen>
  );
}

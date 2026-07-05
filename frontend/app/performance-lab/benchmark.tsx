import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

import { FeatureScrollScreen } from '@/src/components/layout/FeatureScrollScreen';
import { Card } from '@/src/components/common/Card';
import { BENCHMARK_NORMS, benchmarkRating } from '@/src/data/mock/lab';
import { useMockStore } from '@/src/data/mock/store';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';

const RATING_COLORS = { elite: '#10B981', good: '#0066FF', average: '#F97316', below: '#EF4444' };

export default function LabBenchmarkScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign, isRTL } = useDirection();
  const tests = useMockStore((s) => s.tests);

  return (
    <FeatureScrollScreen title={isRTL ? 'المعايير المرجعية' : 'Benchmarks'}>
      <Text style={[type.body, { color: theme.colors.textSecondary, marginBottom: theme.spacing.lg, textAlign: textAlign('start') }]}>
        {isRTL ? 'قارن نتائج فريقك بالمعايير العلمية' : 'Compare squad results against sport science norms'}
      </Text>

      {BENCHMARK_NORMS.map((norm) => {
        const latest = tests.find((t) => t.test_type_key === norm.testKey);
        const rating = latest ? benchmarkRating(latest.value, norm) : null;
        const color = rating ? RATING_COLORS[rating] : theme.colors.textTertiary;

        return (
          <Card key={norm.testKey} variant="elevated" padding="lg" style={{ borderRadius: theme.borderRadius['2xl'], marginBottom: theme.spacing.md }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center' }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: color + '18', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="ribbon" size={22} color={color} />
              </View>
              <View style={{ flex: 1, marginHorizontal: theme.spacing.md }}>
                <Text style={[type.h5, { color: theme.colors.text, textAlign: textAlign('start') }]}>
                  {isRTL ? norm.labelAr : norm.labelEn}
                </Text>
                <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 2, textAlign: textAlign('start') }]}>
                  {isRTL ? `نخبة: ${norm.elite} · جيد: ${norm.good} · متوسط: ${norm.avg} ${norm.unit}` : `Elite: ${norm.elite} · Good: ${norm.good} · Avg: ${norm.avg} ${norm.unit}`}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[type.numberSm, { color }]}>
                  {latest ? `${latest.value} ${norm.unit}` : '—'}
                </Text>
                {rating && (
                  <Text style={[type.caption, { color, marginTop: 2, textTransform: 'capitalize' }]}>
                    {rating}
                  </Text>
                )}
              </View>
            </View>
            <View style={{ flexDirection: flexRow(true), marginTop: theme.spacing.md, gap: 4, height: 8 }}>
              {['below', 'average', 'good', 'elite'].map((r) => (
                <View
                  key={r}
                  style={{
                    flex: 1,
                    backgroundColor: RATING_COLORS[r as keyof typeof RATING_COLORS],
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

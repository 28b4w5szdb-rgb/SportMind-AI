import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { Card } from '@/src/components/common/Card';
import { Badge } from '@/src/components/common/Badge';
import { FormSection } from '@/src/components/common/FormSection';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import { useTheme, useTypography } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { COMPETITION_LEVELS } from '@/src/features/testing-science';
import type { TestDefinition, PerformanceLevel } from '../../types';
import { getCategoryById } from '../../registry/categories';

interface LabBenchmarkComparisonProps {
  test: MockPerformanceTest;
  definition?: TestDefinition;
  level: PerformanceLevel;
  percentile: number;
}

export function LabBenchmarkComparison({ test, definition, level, percentile }: LabBenchmarkComparisonProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const type = useTypography();
  const { flexRow, textAlign } = useDirection();
  const category = definition ? getCategoryById(definition.categoryId) : undefined;

  const cards = [
    { icon: 'person' as const, label: t('performanceLab.benchmark.athlete'), value: test.athlete_name, color: '#0066FF' },
    { icon: 'people' as const, label: t('performanceLab.benchmark.team'), value: t('performanceLab.benchmark.teamNorm'), color: '#0D9488' },
    { icon: 'calendar' as const, label: t('performanceLab.benchmark.age'), value: test.demographicContext ? t(`testingScience.age.${test.demographicContext.ageBandId}`) : '—', color: '#8B5CF6' },
    { icon: 'trophy' as const, label: t('performanceLab.benchmark.competition'), value: test.demographicContext ? t(COMPETITION_LEVELS[test.demographicContext.level].labelKey) : '—', color: '#F97316' },
  ];

  return (
    <FormSection title={t('performanceLab.benchmark.title')} subtitle={t('performanceLab.benchmark.subtitle')}>
      <View style={{ flexDirection: flexRow(true), flexWrap: 'wrap', gap: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        {cards.map((card) => (
          <Card key={card.label} variant="filled" padding="md" style={{ flex: 1, minWidth: 140, borderRadius: theme.borderRadius.xl }}>
            <View style={{ flexDirection: flexRow(true), alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name={card.icon} size={16} color={card.color} />
              <Text style={[type.caption, { color: theme.colors.textSecondary, marginStart: 6 }]}>{card.label}</Text>
            </View>
            <Text style={[type.bodySm, { color: theme.colors.text, fontWeight: '600', textAlign: textAlign('start') }]} numberOfLines={2}>
              {card.value}
            </Text>
          </Card>
        ))}
      </View>
      <Card variant="outlined" padding="md" style={{ borderRadius: theme.borderRadius.xl }}>
        <View style={{ flexDirection: flexRow(true), alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={[type.label, { color: theme.colors.text, textAlign: textAlign('start') }]}>{t('performanceLab.benchmark.normative')}</Text>
            <Text style={[type.caption, { color: theme.colors.textSecondary, marginTop: 4, textAlign: textAlign('start') }]}>
              {category ? t(category.nameKey) : test.test_type} · {t(`testingCenter.levels.${level}`)}
            </Text>
          </View>
          <Badge label={`${percentile}th ${t('performanceLab.percentileShort')}`} toneColor={category?.color ?? theme.colors.primary} />
        </View>
      </Card>
    </FormSection>
  );
}

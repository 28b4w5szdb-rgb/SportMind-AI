import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { AnalyticsModuleId, TrendDirection } from '@/src/analytics/types';
import type {
  BilingualText,
  CustomTestInput,
  TestCategoryId,
  TestCopyBundle,
  TestDefinition,
  TestObjective,
  TestReferenceValues,
} from '../types';

export interface CatalogRowInput {
  key: string;
  categoryId: TestCategoryId;
  icon: ComponentProps<typeof Ionicons>['name'];
  unit: string;
  referenceValues: TestReferenceValues;
  affectedModules: AnalyticsModuleId[];
  analyticsWeight?: number;
  expectedTrend?: TrendDirection;
  objective: TestObjective;
  featured?: boolean;
  defaultRecommendationKey?: string;
  copy: TestCopyBundle;
  nameKey?: string;
}

const DEFAULT_WEIGHT = 0.75;

export function defineTest(row: CatalogRowInput): TestDefinition {
  return {
    key: row.key,
    categoryId: row.categoryId,
    icon: row.icon,
    unit: row.unit,
    referenceValues: row.referenceValues,
    affectedModules: row.affectedModules,
    analyticsWeight: row.analyticsWeight ?? DEFAULT_WEIGHT,
    expectedTrend: row.expectedTrend ?? 'up',
    objective: row.objective,
    featured: row.featured ?? false,
    defaultRecommendationKey: row.defaultRecommendationKey ?? 'analytics.rec.strength',
    nameKey: row.nameKey,
    descriptionKey: row.copy.description.en ? undefined : row.nameKey,
    protocolKey: undefined,
    equipmentKey: undefined,
    aiRecommendationKey: undefined,
    copy: row.copy,
  };
}

export function defineTests(rows: CatalogRowInput[]): TestDefinition[] {
  return rows.map(defineTest);
}

export function buildCustomTestDefinition(input: CustomTestInput, key: string): TestDefinition {
  const nameAr = input.nameAr ?? input.name;
  const protocolAr = input.protocolAr ?? input.protocol;
  const notesAr = input.notesAr ?? input.notes ?? '';
  const targetAr = input.targetMetricAr ?? input.targetMetric ?? '';

  const copy: TestCopyBundle = {
    name: { en: input.name, ar: nameAr },
    description: {
      en: `Coach-defined assessment: ${input.name}.`,
      ar: `تقييم مخصص: ${nameAr}.`,
    },
    purpose: {
      en: targetAr ? `Track ${input.targetMetric}.` : 'Track a custom performance metric.',
      ar: targetAr ? `تتبع ${targetAr}.` : 'تتبع مقياس أداء مخصص.',
    },
    equipment: { en: 'As defined by coach', ar: 'حسب تعريف المدرب' },
    protocol: { en: input.protocol, ar: protocolAr },
    scoring: {
      en: `Record result in ${input.unit}. Compare against target metric over time.`,
      ar: `سجّل النتيجة بـ ${input.unit}. قارن مع الهدف عبر الزمن.`,
    },
    interpretation: {
      en: 'Interpret relative to athlete baseline and training phase objectives.',
      ar: 'فسّر النتيجة مقارنة بخط الأساس وأهداف المرحلة التدريبية.',
    },
    aiRec: {
      en: 'Link custom results to training objectives and review trends every mesocycle.',
      ar: 'اربط النتائج المخصصة بأهداف التدريب وراجع الاتجاهات كل دورة.',
    },
    notes: input.notes ? { en: input.notes, ar: notesAr } : undefined,
  };

  return defineTest({
    key,
    categoryId: 'custom',
    icon: 'create',
    unit: input.unit,
    referenceValues: { elite: 100, good: 75, average: 50 },
    affectedModules: ['physical_fitness', 'training_compliance'],
    analyticsWeight: 0.5,
    expectedTrend: 'up',
    objective: 'custom_metric',
    featured: false,
    defaultRecommendationKey: 'analytics.rec.strength',
    copy,
  });
}

/** Compact bilingual bundle builder for catalog files. */
export function copyBundle(parts: {
  name: BilingualText;
  description: BilingualText;
  purpose: BilingualText;
  equipment: BilingualText;
  protocol: BilingualText;
  scoring: BilingualText;
  interpretation: BilingualText;
  aiRec: BilingualText;
  notes?: BilingualText;
}): TestCopyBundle {
  return parts;
}

export function refs(elite: number, good: number, average: number, lowerIsBetter?: boolean): TestReferenceValues {
  return { elite, good, average, lowerIsBetter };
}

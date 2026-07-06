import type { TestCategoryId } from '@/src/features/performance-lab/types';
import type { PerformanceLevel, TestReferenceValues } from '@/src/features/performance-lab/types';
import type { TestInterpretationContext } from '../engine/testInterpretationEngine';

import type { SsidCoachingDecisionId, SsidInterpretation } from '../types';

const DEFAULT_REFERENCE_KEY = 'ssid.references.placeholder';

function testKey(categoryId: TestCategoryId, section: string, level: PerformanceLevel): string {
  return `ssid.testTemplates.${categoryId}.${section}.${level}`;
}

export function buildTestInterpretation(input: {
  categoryId: TestCategoryId;
  level: PerformanceLevel;
  decision: SsidCoachingDecisionId;
  value: number;
  unit: string;
  testKey: string;
  referenceValues: TestReferenceValues;
  context?: TestInterpretationContext;
}): SsidInterpretation {
  const { categoryId, level, decision, value, unit, testKey: key, referenceValues } = input;
  const band = level;

  return {
    metricId: 'readiness_score',
    sourceType: 'performance_test',
    testKey: key,
    categoryId,
    performanceLevel: level,
    result: value,
    unit,
    classificationId: band,
    classificationKey: testKey(categoryId, 'classifications', band),
    scientificMeaningKey: testKey(categoryId, 'meanings', band),
    physiologicalInterpretationKey: testKey(categoryId, 'physiology', band),
    performanceImpactKey: testKey(categoryId, 'performance', band),
    riskAnalysisKey: testKey(categoryId, 'risk', band),
    referenceComparisonKey: testKey(categoryId, 'reference', band),
    coachingDecision: decision,
    coachingDecisionKey: `ssid.decisions.${decision}`,
    aiRecommendationKey: testKey(categoryId, 'ai', band),
    recommendations: {
      immediateKey: `ssid.testTemplates.${categoryId}.recs.${band}.immediate`,
      weeklyKey: `ssid.testTemplates.${categoryId}.recs.${band}.weekly`,
      longTermKey: `ssid.testTemplates.${categoryId}.recs.${band}.longTerm`,
    },
    scientificReferenceKey: DEFAULT_REFERENCE_KEY,
    confidence: level === 'elite' || level === 'good' ? 88 : level === 'average' ? 84 : 80,
    referenceValue: referenceValues.good,
    referenceLabelKey: `ssid.testTemplates.${categoryId}.referenceLabel`,
  };
}

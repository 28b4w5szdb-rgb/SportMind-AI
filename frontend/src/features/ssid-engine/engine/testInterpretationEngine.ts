import type { TestDefinition } from '@/src/features/performance-lab/types';
import type { PerformanceLevel } from '@/src/features/performance-lab/types';
import { TEST_SSID_METRIC_MAP } from '@/src/features/performance-lab/registry/testRegistration';
import { decisionForPerformanceLevel } from '@/src/cloud/scientific/bridge/decisionBridge';
import { rateTestResult } from '@/src/features/performance-lab/utils/benchmark';
import { adjustReferenceValues, type ReferenceContext } from '@/src/features/testing-science';

import type { SsidInterpretation } from '../types';
import { interpretMetric } from '../registry/metricRegistry';
import { buildTestInterpretation } from '../utils/buildTestInterpretation';

export type TestInterpretationContext = ReferenceContext & {
  weightKg?: number;
  heightCm?: number;
};

/** Primary SSID entry point for performance test results — replaces legacy static interpretation. */
export function interpretPerformanceTest(
  test: TestDefinition,
  value: number,
  context: TestInterpretationContext = {}
): SsidInterpretation {
  const metricId = test.ssidMetricId ?? TEST_SSID_METRIC_MAP[test.key];
  const ssidCtx = {
    ageYears: context.ageYears,
    gender: context.gender,
    weightKg: context.weightKg,
    heightCm: context.heightCm,
    sport: context.sport,
  };

  if (metricId) {
    const interp = interpretMetric(metricId, value, test.unit, ssidCtx);
    return {
      ...interp,
      sourceType: 'performance_test',
      testKey: test.key,
      categoryId: test.categoryId,
    };
  }

  const adjustedRef = adjustReferenceValues(test.referenceValues, test.categoryId, context);
  const level = rateTestResult(value, adjustedRef);
  const decision = decisionForPerformanceLevel(level);

  return buildTestInterpretation({
    categoryId: test.categoryId,
    level,
    decision,
    value,
    unit: test.unit,
    testKey: test.key,
    referenceValues: adjustedRef,
    context,
  });
}

export function performanceLevelFromTest(test: TestDefinition, value: number, context: TestInterpretationContext = {}): PerformanceLevel {
  const adjustedRef = adjustReferenceValues(test.referenceValues, test.categoryId, context);
  return rateTestResult(value, adjustedRef);
}

import type { TestDefinition, TestReferenceValues, PerformanceLevel } from '../types';

export function rateTestResult(value: number, ref: TestReferenceValues): PerformanceLevel {
  const lower = ref.lowerIsBetter === true;
  if (lower) {
    if (value <= ref.elite) return 'elite';
    if (value <= ref.good) return 'good';
    if (value <= ref.average) return 'average';
    return 'below';
  }
  if (value >= ref.elite) return 'elite';
  if (value >= ref.good) return 'good';
  if (value >= ref.average) return 'average';
  return 'below';
}

export const PERFORMANCE_LEVEL_COLORS: Record<PerformanceLevel, string> = {
  elite: '#10B981',
  good: '#0066FF',
  average: '#F97316',
  below: '#EF4444',
};

/** Legacy shape for benchmark screen compatibility. */
export function getBenchmarkNormsFromRegistry(tests: TestDefinition[]) {
  return tests.map((t) => ({
    testKey: t.key,
    labelEn: t.nameKey,
    labelAr: t.nameKey,
    unit: t.unit,
    elite: t.referenceValues.elite,
    good: t.referenceValues.good,
    avg: t.referenceValues.average,
    lowerIsBetter: t.referenceValues.lowerIsBetter,
  }));
}

export function benchmarkRating(value: number, norm: { elite: number; good: number; avg: number; lowerIsBetter?: boolean }): PerformanceLevel {
  return rateTestResult(value, {
    elite: norm.elite,
    good: norm.good,
    average: norm.avg,
    lowerIsBetter: norm.lowerIsBetter,
  });
}

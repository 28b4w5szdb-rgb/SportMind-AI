import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import type { AnalyticsRawSignals } from '../types';

function ageFromDob(dob?: string): number | undefined {
  if (!dob) return undefined;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return undefined;
  const diff = Date.now() - birth.getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000));
}

export function buildRawSignals(athlete: MockAthlete, tests: MockPerformanceTest[]): AnalyticsRawSignals {
  const testSignals: AnalyticsRawSignals['testSignals'] = {};
  for (const test of tests) {
    const key = test.test_type_key as keyof AnalyticsRawSignals['testSignals'];
    if (key && testSignals[key] === undefined) {
      testSignals[key] = test.value;
    }
  }
  return {
    status: athlete.status,
    testsCount: athlete.tests_count,
    trendPercent: athlete.trend_percent,
    heightCm: athlete.height_cm,
    weightKg: athlete.weight_kg,
    testSignals,
  };
}

export { ageFromDob };

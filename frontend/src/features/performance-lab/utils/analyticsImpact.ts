import { computeAthleteAnalytics } from '@/src/analytics';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { getAffectedModules } from '@/src/analytics/summary/testImpact';

import type { TestAnalyticsImpact } from '../types';

function kpiDelta(before: ReturnType<typeof computeAthleteAnalytics>, after: ReturnType<typeof computeAthleteAnalytics>, id: string): number {
  const b = before.kpis.find((k) => k.id === id)?.value ?? 0;
  const a = after.kpis.find((k) => k.id === id)?.value ?? 0;
  return Math.round((a - b) * 10) / 10;
}

export function computeTestAnalyticsImpact(
  athlete: MockAthlete,
  existingTests: MockPerformanceTest[],
  simulatedTest: MockPerformanceTest
): TestAnalyticsImpact {
  const before = computeAthleteAnalytics({ athlete, tests: existingTests });
  const after = computeAthleteAnalytics({ athlete, tests: [...existingTests, simulatedTest] });

  return {
    beforeScore: before.overall.score,
    afterScore: after.overall.score,
    delta: after.overall.score - before.overall.score,
    affectedModules: getAffectedModules(simulatedTest.test_type_key),
    readinessDelta: kpiDelta(before, after, 'readiness'),
    fatigueDelta: kpiDelta(before, after, 'fatigue'),
    loadDelta: kpiDelta(before, after, 'training_load'),
    recoveryDelta: kpiDelta(before, after, 'recovery'),
    injuryRiskDelta: kpiDelta(before, after, 'injury_risk'),
  };
}

export function computeResultAnalyticsSnapshot(athlete: MockAthlete, allTests: MockPerformanceTest[]) {
  return computeAthleteAnalytics({ athlete, tests: allTests });
}

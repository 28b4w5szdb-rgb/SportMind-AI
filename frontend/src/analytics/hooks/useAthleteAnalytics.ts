import { useMemo } from 'react';

import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { computeAthleteAnalytics } from '../engine/performanceAnalyticsEngine';
import type { AthleteAnalyticsSnapshot } from '../types';

export function useAthleteAnalytics(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  teamAvgOverall?: number
): AthleteAnalyticsSnapshot | null {
  return useMemo(() => {
    if (!athlete) return null;
    return computeAthleteAnalytics({
      athlete,
      tests,
      context: { teamAvgOverall, athleteId: athlete.id },
    });
  }, [athlete, tests, teamAvgOverall]);
}

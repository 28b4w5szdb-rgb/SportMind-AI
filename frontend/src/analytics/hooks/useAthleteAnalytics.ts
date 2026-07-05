import { useMemo } from 'react';

import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { computeAthleteAnalytics } from '../engine/performanceAnalyticsEngine';
import type { AthleteAnalyticsSnapshot } from '../types';

export function useAthleteAnalytics(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  teamAvgOverall?: number
): AthleteAnalyticsSnapshot | null {
  const latestCheckIn = useLatestCheckInForAthlete(athlete?.id);

  return useMemo(() => {
    if (!athlete) return null;
    return computeAthleteAnalytics({
      athlete,
      tests,
      checkIn: latestCheckIn,
      context: { teamAvgOverall, athleteId: athlete.id },
    });
  }, [athlete, tests, teamAvgOverall, latestCheckIn]);
}

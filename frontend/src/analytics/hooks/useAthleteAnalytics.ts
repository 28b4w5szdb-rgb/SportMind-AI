import { useMemo } from 'react';

import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { computeAthleteAnalytics } from '../engine/performanceAnalyticsEngine';
import type { AthleteAnalyticsSnapshot } from '../types';

export function useAthleteAnalytics(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  teamAvgOverall?: number
): AthleteAnalyticsSnapshot | null {
  const latestCheckIn = useLatestCheckInForAthlete(athlete?.id);
  const injuryRecords = useMockStore((s) => s.injuryRecords);

  return useMemo(() => {
    if (!athlete) return null;
    const injuries = injuryRecords.filter((i) => i.athlete_id === athlete.id);
    return computeAthleteAnalytics({
      athlete,
      tests,
      checkIn: latestCheckIn,
      injuries,
      context: { teamAvgOverall, athleteId: athlete.id },
    });
  }, [athlete, tests, teamAvgOverall, latestCheckIn, injuryRecords]);
}

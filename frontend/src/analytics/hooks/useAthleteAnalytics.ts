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
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const wearableConnections = useMockStore((s) => s.wearableConnections);
  const wearableRecords = useMockStore((s) => s.wearableRecords);

  return useMemo(() => {
    if (!athlete) return null;
    const injuries = injuryRecords.filter((i) => i.athlete_id === athlete.id);
    const plans = trainingPlans.filter((p) => p.athlete_id === athlete.id);
    return computeAthleteAnalytics({
      athlete,
      tests,
      checkIn: latestCheckIn,
      injuries,
      trainingPlans: plans,
      nutritionLogs,
      bodyCompositionRecords,
      nutritionGoalSettings,
      wearableConnections,
      wearableRecords,
      context: { teamAvgOverall, athleteId: athlete.id },
    });
  }, [
    athlete,
    tests,
    teamAvgOverall,
    latestCheckIn,
    injuryRecords,
    trainingPlans,
    nutritionLogs,
    bodyCompositionRecords,
    nutritionGoalSettings,
    wearableConnections,
    wearableRecords,
  ]);
}

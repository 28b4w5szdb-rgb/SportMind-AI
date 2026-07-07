import { useMemo } from 'react';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import type { PassportViewerRole } from '@/src/cloud/scientific/models/passport';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import { useNutritionSnapshot } from '@/src/features/nutrition';
import { useTrainingBuilderSnapshot } from '@/src/features/training-builder';
import { useWearablesSnapshot } from '@/src/features/wearables';

import { buildMockAthletePassport } from '../bridge/athletePassportMockBridge';

export interface UseAthletePassportOptions {
  viewerRole?: PassportViewerRole;
}

export function useAthletePassport(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  analytics: AthleteAnalyticsSnapshot | null,
  options: UseAthletePassportOptions = {}
): AthletePassport | null {
  const latestCheckIn = useLatestCheckInForAthlete(athlete?.id ?? '');
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const wearableRecords = useMockStore((s) => s.wearableRecords);
  const teams = useMockStore((s) => s.teams);

  const trainingSnapshot = useTrainingBuilderSnapshot(athlete, tests);
  const nutritionSnapshot = useNutritionSnapshot(athlete);
  const wearableSnapshot = useWearablesSnapshot(athlete);

  return useMemo(() => {
    if (!athlete || !analytics) return null;

    const team = teams.find((t) => t.athlete_ids.includes(athlete.id));

    return buildMockAthletePassport({
      athlete,
      tests,
      analytics,
      checkIn: latestCheckIn ?? null,
      injuries: injuryRecords,
      trainingPlans,
      trainingSnapshot,
      nutritionSnapshot,
      nutritionLogs,
      bodyCompositionRecords,
      wearableSnapshot,
      wearableRecords,
      teamName: team?.name ?? null,
      teamSport: team?.sport ?? null,
      viewerRole: options.viewerRole ?? 'coach',
    });
  }, [
    athlete,
    tests,
    analytics,
    latestCheckIn,
    injuryRecords,
    trainingPlans,
    nutritionLogs,
    bodyCompositionRecords,
    wearableRecords,
    teams,
    trainingSnapshot,
    nutritionSnapshot,
    wearableSnapshot,
    options.viewerRole,
  ]);
}

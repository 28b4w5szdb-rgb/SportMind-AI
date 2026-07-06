import { useMemo } from 'react';

import { computeAthleteAnalytics } from '@/src/analytics';
import type { MockAthlete } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';
import { todayDateKey } from '@/src/features/daily-checkin/validation';

import { buildAthleteNutritionSnapshot } from '../utils/nutritionHelpers';
import type { NutritionSnapshot } from '../types';

export function useNutritionSnapshot(
  athlete: MockAthlete | undefined,
  referenceDate: string = todayDateKey()
): NutritionSnapshot | null {
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const tests = useMockStore((s) => s.tests);

  return useMemo(() => {
    if (!athlete) return null;
    const athleteTests = tests.filter((t) => t.athlete_id === athlete.id);
    const checkIn = dailyCheckIns
      .filter((c) => c.athlete_id === athlete.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    const analytics = computeAthleteAnalytics({
      athlete,
      tests: athleteTests,
      checkIn,
      injuries: injuryRecords.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
    });

    return buildAthleteNutritionSnapshot({
      athlete,
      analytics,
      logs: nutritionLogs,
      bodyRecords: bodyCompositionRecords,
      goalSettings: nutritionGoalSettings,
      checkIn,
      trainingPlans,
      dateKey: referenceDate,
    });
  }, [
    athlete,
    tests,
    nutritionLogs,
    bodyCompositionRecords,
    nutritionGoalSettings,
    dailyCheckIns,
    trainingPlans,
    injuryRecords,
    referenceDate,
  ]);
}

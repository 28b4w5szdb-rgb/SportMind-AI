import { useMemo } from 'react';

import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { computeAthleteAnalytics } from '@/src/analytics';
import { useMockStore } from '@/src/data/mock/store';

import { buildTrainingBuilderSnapshot, createProgramForAthlete } from '../utils/trainingHelpers';
import type { TrainingBuilderSnapshot } from '../types';

export function useTrainingBuilderSnapshot(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  referenceDate?: string
): TrainingBuilderSnapshot | null {
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);

  return useMemo(() => {
    if (!athlete) return null;
    const athleteTests = tests.filter((t) => t.athlete_id === athlete.id);
    const checkIn = dailyCheckIns
      .filter((c) => c.athlete_id === athlete.id)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    const athletePlans = trainingPlans.filter((p) => p.athlete_id === athlete.id);
    const analytics = computeAthleteAnalytics({
      athlete,
      tests: athleteTests,
      checkIn,
      injuries: injuryRecords.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: athletePlans,
    });

    return buildTrainingBuilderSnapshot(athlete, analytics, trainingPlans, injuryRecords, referenceDate);
  }, [athlete, tests, trainingPlans, injuryRecords, dailyCheckIns, referenceDate]);
}

export function useGenerateTrainingPlan(athlete: MockAthlete | undefined, tests: MockPerformanceTest[]) {
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const addTrainingPlan = useMockStore((s) => s.addTrainingPlan);

  return useMemo(
    () => () => {
      if (!athlete) return undefined;
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
      const plan = createProgramForAthlete(athlete, analytics, injuryRecords);
      return addTrainingPlan(plan);
    },
    [athlete, tests, trainingPlans, injuryRecords, dailyCheckIns, addTrainingPlan]
  );
}

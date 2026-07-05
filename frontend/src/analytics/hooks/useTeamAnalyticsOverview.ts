import { useMemo } from 'react';

import { useMockStore } from '@/src/data/mock/store';
import { computeTeamOverview, type TeamAnalyticsOverview } from '../summary/teamOverview';

export function useTeamAnalyticsOverview(): TeamAnalyticsOverview {
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const trainingPlans = useMockStore((s) => s.trainingPlans);

  return useMemo(
    () => computeTeamOverview(athletes, tests, dailyCheckIns, injuryRecords, trainingPlans),
    [athletes, tests, dailyCheckIns, injuryRecords, trainingPlans]
  );
}

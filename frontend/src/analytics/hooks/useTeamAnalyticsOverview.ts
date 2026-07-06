import { useMemo } from 'react';

import { useMockStore } from '@/src/data/mock/store';
import { computeTeamOverview, type TeamAnalyticsOverview } from '../summary/teamOverview';

export function useTeamAnalyticsOverview(): TeamAnalyticsOverview {
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const dailyCheckIns = useMockStore((s) => s.dailyCheckIns);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const nutritionGoalSettings = useMockStore((s) => s.nutritionGoalSettings);
  const wearableConnections = useMockStore((s) => s.wearableConnections);
  const wearableRecords = useMockStore((s) => s.wearableRecords);

  return useMemo(
    () =>
      computeTeamOverview(
        athletes,
        tests,
        dailyCheckIns,
        injuryRecords,
        trainingPlans,
        nutritionLogs,
        bodyCompositionRecords,
        nutritionGoalSettings,
        wearableConnections,
        wearableRecords
      ),
    [athletes, tests, dailyCheckIns, injuryRecords, trainingPlans, nutritionLogs, bodyCompositionRecords, nutritionGoalSettings, wearableConnections, wearableRecords]
  );
}

import { useMemo } from 'react';

import { useMockStore } from '@/src/data/mock/store';
import { computeTeamOverview, type TeamAnalyticsOverview } from '../summary/teamOverview';

export function useTeamAnalyticsOverview(): TeamAnalyticsOverview {
  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);

  return useMemo(() => computeTeamOverview(athletes, tests), [athletes, tests]);
}

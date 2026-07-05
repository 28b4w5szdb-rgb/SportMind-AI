import { useMemo } from 'react';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useMockStore } from '@/src/data/mock/store';
import { buildAthleteGoals } from '../utils/goalsBuilder';
import { buildAthleteTimeline, daysSinceLastInjury } from '../utils/timelineBuilder';

export function useAthleteWorkspace(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  analytics: AthleteAnalyticsSnapshot | null
) {
  const reports = useMockStore((s) => s.reports);

  return useMemo(() => {
    if (!athlete || !analytics) {
      return {
        timeline: [],
        goals: [],
        daysSinceInjury: null as number | null,
        latestTest: undefined as MockPerformanceTest | undefined,
        latestRecommendation: undefined,
      };
    }

    const timeline = buildAthleteTimeline(athlete, tests, reports, analytics.recommendations);
    const sortedTests = [...tests]
      .filter((t) => t.athlete_id === athlete.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      timeline,
      goals: buildAthleteGoals(athlete, analytics),
      daysSinceInjury: daysSinceLastInjury(athlete, timeline),
      latestTest: sortedTests[0],
      latestRecommendation: analytics.recommendations[0],
    };
  }, [athlete, tests, reports, analytics]);
}

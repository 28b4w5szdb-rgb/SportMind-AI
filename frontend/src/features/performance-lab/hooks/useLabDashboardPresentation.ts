import { useMemo } from 'react';

import { useMockStore } from '@/src/data/mock/store';
import { useTeamAnalyticsOverview, buildAiSummaryFromAnalytics } from '@/src/analytics';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { getTotalTestCount } from '../registry/tests';
import { TESTING_CATEGORIES } from '../registry/categories';

function daysSince(dateKey: string): number {
  const diff = Date.now() - new Date(dateKey).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export interface PendingAthleteItem {
  athlete: MockAthlete;
  daysSinceLastTest: number | null;
}

export function useLabDashboardPresentation() {
  const { isRTL } = useDirection();
  const tests = useMockStore((s) => s.tests);
  const athletes = useMockStore((s) => s.athletes);
  const customTests = useMockStore((s) => s.customTestDefinitions);
  const teamAnalytics = useTeamAnalyticsOverview();

  const today = new Date().toISOString().slice(0, 10);

  return useMemo(() => {
    const sortedTests = [...tests].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    const recentTests = sortedTests.slice(0, 6);
    const todayTests = sortedTests.filter((t) => t.date === today);

    const pendingAthletes: PendingAthleteItem[] = athletes
      .map((athlete) => {
        const athleteTests = sortedTests.filter((t) => t.athlete_id === athlete.id);
        const last = athleteTests[0];
        const days = last ? daysSince(last.date) : null;
        return { athlete, daysSinceLastTest: days };
      })
      .filter((item) => item.daysSinceLastTest === null || item.daysSinceLastTest >= 14)
      .slice(0, 5);

    const scientificInsight = teamAnalytics.athleteCount > 0 ? buildAiSummaryFromAnalytics(teamAnalytics, isRTL) : null;

    const stats = {
      totalResults: tests.length,
      todayCount: todayTests.length,
      pendingCount: pendingAthletes.length,
      protocolCount: getTotalTestCount(customTests),
      categoryCount: TESTING_CATEGORIES.length,
      athleteCount: athletes.length,
    };

    return {
      recentTests,
      todayTests,
      pendingAthletes,
      scientificInsight,
      stats,
      teamAnalytics,
    };
  }, [athletes, customTests, isRTL, teamAnalytics, tests, today]);
}

export function buildTestHistoryTrend(tests: MockPerformanceTest[], testTypeKey: string, athleteId: string): number[] {
  return tests
    .filter((t) => t.athlete_id === athleteId && t.test_type_key === testTypeKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => t.value);
}

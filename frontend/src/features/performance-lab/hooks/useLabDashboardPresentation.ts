import { useEffect, useMemo, useState } from 'react';

import { useMockStore } from '@/src/data/mock/store';
import { useTeamAnalyticsOverview, buildAiSummaryFromAnalytics } from '@/src/analytics';
import { useDirection } from '@/src/providers/DirectionProvider';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import type { EvidenceTier } from '@/src/cloud/scientific/models/common';
import { TESTING_CATEGORIES } from '../registry/categories';
import { getTotalTestCount } from '../registry/tests';
import { usePerformanceLabHistory } from '../bridge/usePerformanceLabHistory';
import { loadAllCatalogDefinitions } from '../bridge/scientificCatalogCache';

function daysSince(dateKey: string): number {
  const diff = Date.now() - new Date(dateKey).getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export interface PendingAthleteItem {
  athlete: MockAthlete;
  daysSinceLastTest: number | null;
}

export interface LabDashboardScientificStats {
  totalResults: number;
  todayCount: number;
  pendingCount: number;
  protocolCount: number;
  categoryCount: number;
  athleteCount: number;
  evidenceTierDistribution: Partial<Record<EvidenceTier, number>>;
  topAssessmentKeys: string[];
}

export function useLabDashboardPresentation() {
  const { isRTL } = useDirection();
  const mockTests = useMockStore((s) => s.tests);
  const athletes = useMockStore((s) => s.athletes);
  const customTests = useMockStore((s) => s.customTestDefinitions);
  const teamAnalytics = useTeamAnalyticsOverview();
  const { tests: mergedTests, loading: historyLoading, readErrorKey } = usePerformanceLabHistory();
  const [catalogCount, setCatalogCount] = useState<number | null>(null);

  useEffect(() => {
    loadAllCatalogDefinitions()
      .then((definitions) => setCatalogCount(definitions.length))
      .catch(() => setCatalogCount(null));
  }, []);

  const tests = historyLoading ? mockTests : mergedTests;
  const today = new Date().toISOString().slice(0, 10);

  return useMemo(() => {
    const sortedTests = [...tests].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
    const recentTests = sortedTests.slice(0, 6);
    const todayTests = sortedTests.filter((item) => item.date === today);

    const pendingAthletes: PendingAthleteItem[] = athletes
      .map((athlete) => {
        const athleteTests = sortedTests.filter((item) => item.athlete_id === athlete.id);
        const last = athleteTests[0];
        const days = last ? daysSince(last.date) : null;
        return { athlete, daysSinceLastTest: days };
      })
      .filter((item) => item.daysSinceLastTest === null || item.daysSinceLastTest >= 14)
      .slice(0, 5);

    const scientificInsight =
      teamAnalytics.athleteCount > 0 ? buildAiSummaryFromAnalytics(teamAnalytics, isRTL) : null;

    const assessmentUsage = new Map<string, number>();
    for (const test of tests) {
      assessmentUsage.set(test.test_type_key, (assessmentUsage.get(test.test_type_key) ?? 0) + 1);
    }
    const topAssessmentKeys = [...assessmentUsage.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([key]) => key);

    const evidenceTierDistribution: Partial<Record<EvidenceTier, number>> = {};

    const stats: LabDashboardScientificStats = {
      totalResults: tests.length,
      todayCount: todayTests.length,
      pendingCount: pendingAthletes.length,
      protocolCount: catalogCount ?? getTotalTestCount(customTests),
      categoryCount: TESTING_CATEGORIES.length,
      athleteCount: athletes.length,
      evidenceTierDistribution,
      topAssessmentKeys,
    };

    return {
      recentTests,
      todayTests,
      pendingAthletes,
      scientificInsight,
      stats,
      teamAnalytics,
      historyLoading,
      readErrorKey,
    };
  }, [
    athletes,
    catalogCount,
    customTests.length,
    historyLoading,
    isRTL,
    mockTests,
    readErrorKey,
    teamAnalytics,
    tests,
    today,
  ]);
}

export function buildTestHistoryTrend(tests: MockPerformanceTest[], testTypeKey: string, athleteId: string): number[] {
  return tests
    .filter((t) => t.athlete_id === athleteId && t.test_type_key === testTypeKey)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((t) => t.value);
}

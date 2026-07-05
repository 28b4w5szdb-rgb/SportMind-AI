import type { MockAthlete } from '@/src/data/mock/types';
import { computeReadinessScore } from '@/src/utils/athleteMetrics';

export interface TeamLoadSummary {
  rosterSize: number;
  activeCount: number;
  injuredCount: number;
  restCount: number;
  avgReadiness: number;
  avgTrend: number;
  totalTests: number;
}

export function computeTeamLoadSummary(roster: MockAthlete[]): TeamLoadSummary {
  if (roster.length === 0) {
    return {
      rosterSize: 0,
      activeCount: 0,
      injuredCount: 0,
      restCount: 0,
      avgReadiness: 0,
      avgTrend: 0,
      totalTests: 0,
    };
  }
  const activeCount = roster.filter((a) => a.status === 'active').length;
  const injuredCount = roster.filter((a) => a.status === 'injured').length;
  const restCount = roster.filter((a) => a.status === 'rest').length;
  const avgReadiness = Math.round(
    roster.reduce((sum, a) => sum + computeReadinessScore(a), 0) / roster.length
  );
  const avgTrend = Math.round(roster.reduce((sum, a) => sum + a.trend_percent, 0) / roster.length);
  const totalTests = roster.reduce((sum, a) => sum + a.tests_count, 0);
  return {
    rosterSize: roster.length,
    activeCount,
    injuredCount,
    restCount,
    avgReadiness,
    avgTrend,
    totalTests,
  };
}

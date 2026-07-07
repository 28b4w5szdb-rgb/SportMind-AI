import { useMemo } from 'react';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import type { AthleteScientificTimeline, TimelineViewerRole } from '@/src/cloud/scientific/models/timeline';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';

import { buildMockAthleteScientificTimeline } from '../bridge/athleteTimelineMockBridge';

export interface UseScientificTimelineOptions {
  viewerRole?: TimelineViewerRole;
  passport?: AthletePassport | null;
}

export function useScientificTimeline(
  athlete: MockAthlete | undefined,
  tests: MockPerformanceTest[],
  analytics: AthleteAnalyticsSnapshot | null,
  options: UseScientificTimelineOptions = {}
): AthleteScientificTimeline | null {
  const latestCheckIn = useLatestCheckInForAthlete(athlete?.id ?? '');
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const wearableRecords = useMockStore((s) => s.wearableRecords);
  const reports = useMockStore((s) => s.reports);

  return useMemo(() => {
    if (!athlete || !analytics) return null;

    return buildMockAthleteScientificTimeline({
      athlete,
      tests,
      analytics,
      checkIns: latestCheckIn ? [latestCheckIn] : [],
      injuries: injuryRecords,
      trainingPlans,
      nutritionLogs,
      wearableRecords,
      reports,
      passport: options.passport ?? null,
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
    wearableRecords,
    reports,
    options.passport,
    options.viewerRole,
  ]);
}

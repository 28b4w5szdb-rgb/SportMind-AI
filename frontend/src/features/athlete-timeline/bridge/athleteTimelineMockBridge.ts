/**
 * Mock-mode scientific timeline bridge (Phase 6D.2).
 */

import { buildAthleteScientificTimeline } from '@/src/cloud/scientific/engine/scientificTimelineBuilder';
import type { AthleteScientificTimeline, TimelineViewerRole } from '@/src/cloud/scientific/models/timeline';
import { filterTimelineForViewer } from '@/src/cloud/scientific/security/timelineAccess';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import type { MockAthlete, MockPerformanceTest, MockReport, DailyCheckIn } from '@/src/data/mock/types';
import type { InjuryRecord } from '@/src/features/sports-medicine/types';
import type { TrainingPlan } from '@/src/features/training-builder/types';
import type { DailyNutritionLog } from '@/src/features/nutrition/types';
import type { WearableDataRecord } from '@/src/features/wearables/types';

export const TIMELINE_MOCK_ORG_ID = 'org_sportmind_demo';

export interface BuildMockTimelineParams {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics?: AthleteAnalyticsSnapshot | null;
  checkIns?: DailyCheckIn[];
  injuries?: InjuryRecord[];
  trainingPlans?: TrainingPlan[];
  nutritionLogs?: DailyNutritionLog[];
  wearableRecords?: WearableDataRecord[];
  reports?: MockReport[];
  passport?: AthletePassport | null;
  viewerRole?: TimelineViewerRole;
  orgId?: string;
}

export function buildMockAthleteScientificTimeline(params: BuildMockTimelineParams): AthleteScientificTimeline {
  const {
    athlete,
    tests,
    analytics,
    checkIns = [],
    injuries = [],
    trainingPlans = [],
    nutritionLogs = [],
    wearableRecords = [],
    reports = [],
    passport,
    viewerRole = 'coach',
    orgId = TIMELINE_MOCK_ORG_ID,
  } = params;

  const timeline = buildAthleteScientificTimeline({
    orgId,
    athleteId: athlete.id,
    viewerRole,
    sources: {
      tests: tests.filter((t) => t.athlete_id === athlete.id),
      analytics,
      checkIns: checkIns.filter((c) => c.athlete_id === athlete.id),
      injuries: injuries.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs: nutritionLogs.filter((l) => l.athlete_id === athlete.id),
      wearableRecords: wearableRecords.filter((r) => r.athlete_id === athlete.id),
      reports: reports.filter((r) => r.athlete_id === athlete.id),
      recommendations: analytics?.recommendations,
      passport,
    },
  });

  return filterTimelineForViewer(timeline, viewerRole);
}

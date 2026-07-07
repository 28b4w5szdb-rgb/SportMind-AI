/**
 * Build passport + timeline from shared workspace sources (Phase 6D.3).
 */

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import { buildAthletePassport } from '@/src/cloud/scientific/engine/passportBuilder';
import { buildAthleteScientificTimeline } from '@/src/cloud/scientific/engine/scientificTimelineBuilder';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import type { PassportBuildSources } from '@/src/cloud/scientific/models/passport/PassportBuildInput';
import type { AthleteScientificTimeline } from '@/src/cloud/scientific/models/timeline';
import type { AssessmentSession } from '@/src/cloud/scientific/models/session';
import {
  filterPassportForContext,
} from '@/src/cloud/scientific/security/passportAccess';
import { filterTimelineForContext } from '@/src/cloud/scientific/security/timelineAccess';
import type { SecurityContext } from '@/src/cloud/scientific/security/accessControl';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { mapMockAthleteToPassportProfile } from '@/src/features/athlete-passport/bridge/athletePassportMockBridge';

import { resolveViewerRoleFromContext } from '../security/resolveWorkspaceViewerRole';

export interface WorkspaceArtifactInput {
  orgId: string;
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics: AthleteAnalyticsSnapshot;
  securityContext: SecurityContext;
  passportSources: Omit<PassportBuildSources, 'athlete'>;
  teamName?: string | null;
  teamSport?: string | null;
  cloudSessions?: AssessmentSession[];
  reports?: import('@/src/data/mock/types').MockReport[];
}

export interface WorkspaceArtifacts {
  rawPassport: AthletePassport;
  passport: AthletePassport;
  rawTimeline: AthleteScientificTimeline;
  timeline: AthleteScientificTimeline;
}

export function buildWorkspaceArtifacts(input: WorkspaceArtifactInput): WorkspaceArtifacts {
  const viewerRole = resolveViewerRoleFromContext(input.securityContext);
  const athleteTests = input.tests.filter((t) => t.athlete_id === input.athlete.id);

  const sources: PassportBuildSources = {
    athlete: mapMockAthleteToPassportProfile(input.athlete, input.teamName, input.teamSport),
    tests: athleteTests,
    analytics: input.analytics,
    sessions: input.cloudSessions,
    ...input.passportSources,
  };

  const rawPassport = buildAthletePassport({
    orgId: input.orgId,
    athleteId: input.athlete.id,
    viewerRole,
    sources,
  });

  const passport = filterPassportForContext(rawPassport, input.securityContext);

  const rawTimeline = buildAthleteScientificTimeline({
    orgId: input.orgId,
    athleteId: input.athlete.id,
    viewerRole,
    sources: {
      tests: athleteTests,
      analytics: input.analytics,
      sessions: input.cloudSessions,
      checkIns: input.passportSources.checkIn ? [input.passportSources.checkIn] : [],
      injuries: input.passportSources.injuries,
      trainingPlans: input.passportSources.trainingPlans,
      nutritionLogs: input.passportSources.nutritionLogs,
      wearableRecords: input.passportSources.wearableRecords,
      reports: input.reports,
      recommendations: input.analytics.recommendations,
      passport: rawPassport,
    },
  });

  const timeline = filterTimelineForContext(rawTimeline, input.securityContext);

  return { rawPassport, passport, rawTimeline, timeline };
}

/**
 * Mock-mode passport bridge — gathers store data and builds passport (Phase 6D.1).
 */

import { computeAthleteAnalytics } from '@/src/analytics';
import { buildAthletePassport } from '@/src/cloud/scientific/engine/passportBuilder';
import type { AthletePassport, PassportViewerRole } from '@/src/cloud/scientific/models/passport';
import type { PassportAthleteProfile } from '@/src/cloud/scientific/models/passport/PassportBuildInput';
import { filterPassportForViewer } from '@/src/cloud/scientific/security/passportAccess';
import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, MockPerformanceTest, DailyCheckIn } from '@/src/data/mock/types';
import type { InjuryRecord } from '@/src/features/sports-medicine/types';
import type { TrainingPlan, TrainingBuilderSnapshot } from '@/src/features/training-builder/types';
import type { NutritionSnapshot } from '@/src/features/nutrition/types';
import type { WearableDailySnapshot } from '@/src/features/wearables/types';
import type { DailyNutritionLog, BodyCompositionRecord } from '@/src/features/nutrition/types';
import type { WearableDataRecord } from '@/src/features/wearables/types';

export const PASSPORT_MOCK_ORG_ID = 'org_sportmind_demo';

export function mapMockAthleteToPassportProfile(
  athlete: MockAthlete,
  teamName?: string | null,
  teamSport?: string | null
): PassportAthleteProfile {
  const availability =
    athlete.status === 'injured' ? 'unavailable' : athlete.status === 'rest' ? 'modified' : 'available';
  return {
    id: athlete.id,
    first_name: athlete.first_name,
    last_name: athlete.last_name,
    position: athlete.position,
    status: athlete.status,
    date_of_birth: athlete.date_of_birth ?? null,
    gender: athlete.gender ?? null,
    nationality: athlete.nationality ?? null,
    height_cm: athlete.height_cm ?? null,
    weight_kg: athlete.weight_kg ?? null,
    jersey_number: athlete.jersey_number ?? null,
    sport: teamSport ?? null,
    team_name: teamName ?? null,
    availability_status: availability,
    consent_status: 'granted',
    pseudonym_id: `pseudo_${athlete.id}`,
  };
}

export interface BuildMockPassportParams {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics?: AthleteAnalyticsSnapshot;
  checkIn?: DailyCheckIn | null;
  injuries?: InjuryRecord[];
  trainingPlans?: TrainingPlan[];
  trainingSnapshot?: TrainingBuilderSnapshot | null;
  nutritionSnapshot?: NutritionSnapshot | null;
  nutritionLogs?: DailyNutritionLog[];
  bodyCompositionRecords?: BodyCompositionRecord[];
  wearableSnapshot?: WearableDailySnapshot | null;
  wearableRecords?: WearableDataRecord[];
  teamName?: string | null;
  teamSport?: string | null;
  viewerRole?: PassportViewerRole;
  orgId?: string;
}

export function buildMockAthletePassport(params: BuildMockPassportParams): AthletePassport {
  const {
    athlete,
    tests,
    checkIn,
    injuries = [],
    trainingPlans = [],
    trainingSnapshot,
    nutritionSnapshot,
    nutritionLogs = [],
    bodyCompositionRecords = [],
    wearableSnapshot,
    wearableRecords = [],
    teamName,
    teamSport,
    viewerRole = 'coach',
    orgId = PASSPORT_MOCK_ORG_ID,
  } = params;

  const analytics =
    params.analytics ??
    computeAthleteAnalytics({
      athlete,
      tests: tests.filter((t) => t.athlete_id === athlete.id),
      checkIn: checkIn ?? undefined,
      injuries: injuries.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs,
      bodyCompositionRecords,
      nutritionGoalSettings: [],
    });

  const athleteTests = tests.filter((t) => t.athlete_id === athlete.id);

  const passport = buildAthletePassport({
    orgId,
    athleteId: athlete.id,
    viewerRole,
    sources: {
      athlete: mapMockAthleteToPassportProfile(athlete, teamName, teamSport),
      tests: athleteTests,
      analytics,
      checkIn: checkIn ?? null,
      injuries: injuries.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs,
      bodyCompositionRecords: bodyCompositionRecords.filter((b) => b.athlete_id === athlete.id),
      wearableRecords: wearableRecords.filter((r) => r.athlete_id === athlete.id),
      teamSport,
      trainingLoadSummary: trainingSnapshot
        ? {
            compliance_percent: trainingSnapshot.compliance.compliancePercent,
            completed_sessions: trainingSnapshot.compliance.completed,
            acwr: trainingSnapshot.load.acwr,
            last_updated: trainingSnapshot.plan?.created_at ?? null,
          }
        : null,
      nutritionSummary: nutritionSnapshot?.log
        ? {
            calories: nutritionSnapshot.totals.calories,
            protein_g: nutritionSnapshot.totals.protein_g,
            hydration_liters: nutritionSnapshot.totals.water_liters,
            date: nutritionSnapshot.log.date,
          }
        : null,
      wearableSummary: wearableSnapshot?.lastSyncAt
        ? {
            provider: wearableSnapshot.primaryProviderId ?? 'device',
            hrv: wearableSnapshot.hrv ?? null,
            resting_hr: wearableSnapshot.restingHeartRate ?? null,
            sleep_hours: wearableSnapshot.sleepDurationHours ?? null,
            recovery_score: wearableSnapshot.recoveryScore ?? null,
            last_updated: wearableSnapshot.lastSyncAt,
          }
        : null,
    },
  });

  return filterPassportForViewer(passport, viewerRole);
}

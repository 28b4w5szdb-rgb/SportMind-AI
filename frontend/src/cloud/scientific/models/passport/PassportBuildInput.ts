/**
 * Input types for passport builder — aggregates available source data.
 */

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockPerformanceTest } from '@/src/data/mock/types';
import type { DailyCheckIn } from '@/src/data/mock/types';
import type { InjuryRecord } from '@/src/features/sports-medicine/types';
import type { TrainingPlan } from '@/src/features/training-builder/types';
import type { DailyNutritionLog, BodyCompositionRecord } from '@/src/features/nutrition/types';
import type { WearableDataRecord } from '@/src/features/wearables/types';
import type { AssessmentSession } from '../session/AssessmentSession';
import type { PassportViewerRole } from './AthletePassport';

/** Minimal athlete profile shape — mock or cloud. */
export interface PassportAthleteProfile {
  id: string;
  first_name: string;
  last_name: string;
  position?: string | null;
  status?: string | null;
  date_of_birth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  jersey_number?: number | null;
  sport?: string | null;
  team_name?: string | null;
  availability_status?: 'available' | 'modified' | 'unavailable' | null;
  consent_status?: 'pending' | 'granted' | 'revoked' | null;
  pseudonym_id?: string | null;
}

export interface PassportWearableSummary {
  provider: string;
  hrv?: number | null;
  resting_hr?: number | null;
  sleep_hours?: number | null;
  recovery_score?: number | null;
  last_updated: string;
}

export interface PassportTrainingLoadSummary {
  compliance_percent: number;
  completed_sessions: number;
  acwr?: number | null;
  last_updated?: string | null;
}

export interface PassportNutritionSummary {
  calories?: number | null;
  protein_g?: number | null;
  hydration_liters?: number | null;
  date: string;
}

export interface PassportBuildSources {
  athlete: PassportAthleteProfile;
  tests?: MockPerformanceTest[];
  analytics?: AthleteAnalyticsSnapshot | null;
  checkIn?: DailyCheckIn | null;
  injuries?: InjuryRecord[];
  trainingPlans?: TrainingPlan[];
  nutritionLogs?: DailyNutritionLog[];
  bodyCompositionRecords?: BodyCompositionRecord[];
  wearableRecords?: WearableDataRecord[];
  sessions?: AssessmentSession[];
  teamSport?: string | null;
  trainingLoadSummary?: PassportTrainingLoadSummary | null;
  nutritionSummary?: PassportNutritionSummary | null;
  wearableSummary?: PassportWearableSummary | null;
}

export interface PassportBuildContext {
  orgId: string;
  athleteId: string;
  viewerRole?: PassportViewerRole;
  asOf?: string;
  sources: PassportBuildSources;
}

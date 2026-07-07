/**
 * Input types for scientific timeline builder.
 */

import type { AthleteAnalyticsSnapshot, RecommendationItem } from '@/src/analytics/types';
import type { MockPerformanceTest, MockReport, DailyCheckIn } from '@/src/data/mock/types';
import type { InjuryRecord } from '@/src/features/sports-medicine/types';
import type { TrainingPlan } from '@/src/features/training-builder/types';
import type { DailyNutritionLog } from '@/src/features/nutrition/types';
import type { WearableDataRecord } from '@/src/features/wearables/types';
import type { AssessmentSession } from '../session/AssessmentSession';
import type { AthletePassport } from '../passport/AthletePassport';
import type { TimelineViewerRole } from './ScientificTimeline';

export interface TimelineBuildContext {
  orgId: string;
  athleteId: string;
  viewerRole?: TimelineViewerRole;
  asOf?: string;
  sources: TimelineBuildSources;
}

export interface TimelineBuildSources {
  tests?: MockPerformanceTest[];
  sessions?: AssessmentSession[];
  analytics?: AthleteAnalyticsSnapshot | null;
  checkIns?: DailyCheckIn[];
  injuries?: InjuryRecord[];
  trainingPlans?: TrainingPlan[];
  nutritionLogs?: DailyNutritionLog[];
  wearableRecords?: WearableDataRecord[];
  reports?: MockReport[];
  recommendations?: RecommendationItem[];
  passport?: AthletePassport | null;
}

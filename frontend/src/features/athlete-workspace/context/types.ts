import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { AthletePassport } from '@/src/cloud/scientific/models/passport';
import type { AthleteScientificTimeline } from '@/src/cloud/scientific/models/timeline';
import type { AssessmentSession } from '@/src/cloud/scientific/models/session';
import type { SecurityContext } from '@/src/cloud/scientific/security/accessControl';
import type { PermissionKey } from '@/src/cloud/scientific/security/permissions';
import type { PassportViewerRole } from '@/src/cloud/scientific/models/passport';
import type { DataMode } from '@/src/core/config/cloud';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';

import type { WorkspaceRole } from '../security/workspaceRolePresets';
import type { TrainingBuilderSnapshot } from '@/src/features/training-builder/types';
import type { NutritionSnapshot } from '@/src/features/nutrition/types';
import type { WearableDailySnapshot } from '@/src/features/wearables/types';

export interface WorkspaceVisibilityProfile {
  workspaceRole: WorkspaceRole;
  viewerRole: PassportViewerRole;
  effectivePermissions: PermissionKey[];
  hiddenPassportSections: number;
  hiddenTimelineEvents: number;
  passportVisibleSections: number;
  timelineVisibleEvents: number;
}

export interface AthleteWorkspaceContextValue {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics: AthleteAnalyticsSnapshot;
  organizationId: string;
  workspaceRole: WorkspaceRole;
  securityContext: SecurityContext;
  dataMode: DataMode;
  scientificCloudEnabled: boolean;
  passport: AthletePassport | null;
  scientificTimeline: AthleteScientificTimeline | null;
  cloudSessions: AssessmentSession[];
  loadingPassport: boolean;
  loadingTimeline: boolean;
  visibilityProfile: WorkspaceVisibilityProfile;
  trainingSnapshot: TrainingBuilderSnapshot | null;
  nutritionSnapshot: NutritionSnapshot | null;
  wearableSnapshot: WearableDailySnapshot | null;
}

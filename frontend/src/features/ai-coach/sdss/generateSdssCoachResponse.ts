/**
 * AI Coach ↔ SSDI feature bridge (Phase 9.0).
 */

import { buildSecurityContext } from '@/src/cloud/scientific/security/accessControl';
import type { BuildDecisionContextInput } from '@/src/cloud/scientific/sdss/models/DecisionContext';
import type { SdssViewerRole } from '@/src/cloud/scientific/sdss/models/SdssRecommendation';
import { runSdssPipeline, type SdssResponse } from '@/src/cloud/scientific/sdss/engine/sdssEngine';
import { getOrBuildWorkspaceArtifacts } from '@/src/features/athlete-workspace/cache/workspaceArtifactCache';
import { WORKSPACE_MOCK_ORG_ID } from '@/src/features/athlete-workspace/security/workspaceRolePresets';
import type { AnalyticsCoachContext } from '@/src/data/mock/ai-coach';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';

const DEV_SDSS_UID = 'dev_sdss_coach';

export interface GenerateSdssCoachInput {
  userQuery: string;
  athlete: MockAthlete | null;
  analyticsContext: AnalyticsCoachContext | undefined;
  locale: 'en' | 'ar';
  viewerRole?: SdssViewerRole;
  tests?: MockPerformanceTest[];
}

function mapLocale(locale: 'en' | 'ar'): 'en' | 'ar' | 'bilingual' {
  return locale;
}

function buildContextInput(
  athlete: MockAthlete | null,
  ctx: AnalyticsCoachContext | undefined,
  locale: 'en' | 'ar',
  viewerRole: SdssViewerRole,
  tests: MockPerformanceTest[] = []
): BuildDecisionContextInput {
  const securityContext = buildSecurityContext(DEV_SDSS_UID, WORKSPACE_MOCK_ORG_ID, { roleIds: ['coach'] }, null);
  const analytics = ctx?.primary ?? null;

  let passport = null;
  let timeline = null;

  if (athlete && analytics) {
    const artifacts = getOrBuildWorkspaceArtifacts({
      orgId: WORKSPACE_MOCK_ORG_ID,
      athlete,
      tests,
      analytics,
      securityContext,
      passportSources: {
        checkIn: null,
        injuries: [],
        trainingPlans: [],
        nutritionLogs: [],
        bodyCompositionRecords: [],
        wearableRecords: [],
        trainingLoadSummary: null,
        nutritionSummary: ctx?.nutrition
          ? {
              calories: ctx.nutrition.totals.calories,
              protein_g: ctx.nutrition.totals.protein_g,
              hydration_liters: ctx.nutrition.totals.water_liters,
              date: ctx.nutrition.log?.date ?? new Date().toISOString().slice(0, 10),
            }
          : null,
        wearableSummary: ctx?.wearables
          ? {
              provider: ctx.wearables.primaryProviderId ?? 'device',
              hrv: ctx.wearables.hrv ?? null,
              resting_hr: ctx.wearables.restingHeartRate ?? null,
              sleep_hours: ctx.wearables.sleepDurationHours ?? null,
              recovery_score: ctx.wearables.recoveryScore ?? null,
              last_updated: ctx.wearables.lastSyncAt ?? new Date().toISOString(),
            }
          : null,
      },
    });
    passport = artifacts.passport;
    timeline = artifacts.timeline;
  }

  return {
    organizationId: WORKSPACE_MOCK_ORG_ID,
    athleteId: athlete?.id ?? null,
    athleteDisplayName: ctx?.athleteName ?? (athlete ? `${athlete.first_name} ${athlete.last_name}` : null),
    viewerRole,
    locale: mapLocale(locale),
    passport,
    timeline,
    analytics,
    trainingLoad: ctx?.primary
      ? {
          acwr: null,
          compliance_percent: null,
          completed_sessions: null,
        }
      : null,
    recovery: ctx?.primary
      ? {
          recovery_score: ctx.primary.kpis.find((k) => k.id === 'recovery')?.value ?? null,
          fatigue: ctx.primary.kpis.find((k) => k.id === 'fatigue')?.value ?? null,
          sleep_hours: ctx?.wearables?.sleepDurationHours ?? null,
          hrv: ctx?.wearables?.hrv ?? null,
        }
      : null,
    nutrition: ctx?.nutrition
      ? {
          calories: ctx.nutrition.totals.calories,
          protein_g: ctx.nutrition.totals.protein_g,
          hydration_liters: ctx.nutrition.totals.water_liters,
        }
      : null,
    wearables: ctx?.wearables
      ? {
          provider: ctx.wearables.primaryProviderId ?? null,
          resting_hr: ctx.wearables.restingHeartRate ?? null,
          recovery_score: ctx.wearables.recoveryScore ?? null,
          last_sync: ctx.wearables.lastSyncAt ?? null,
        }
      : null,
    tests,
  };
}

/** Generate SSDI coach response from Scientific Core context. */
export async function generateSdssCoachResponse(input: GenerateSdssCoachInput): Promise<SdssResponse> {
  const contextInput = buildContextInput(
    input.athlete,
    input.analyticsContext,
    input.locale,
    input.viewerRole ?? 'coach',
    input.tests ?? []
  );

  return runSdssPipeline({
    contextInput,
    userQuery: input.userQuery,
  });
}

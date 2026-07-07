/**
 * Hook for building scientific reports from report builder config (Phase 7.0).
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { buildSecurityContext } from '@/src/cloud/scientific/security/accessControl';
import { buildAthletePassport } from '@/src/cloud/scientific/engine/passportBuilder';
import { buildAthleteScientificTimeline } from '@/src/cloud/scientific/engine/scientificTimelineBuilder';
import { filterPassportForContext } from '@/src/cloud/scientific/security/passportAccess';
import { filterTimelineForContext } from '@/src/cloud/scientific/security/timelineAccess';
import { useMockStore } from '@/src/data/mock/store';
import { mapMockAthleteToPassportProfile } from '@/src/features/athlete-passport/bridge/athletePassportMockBridge';
import { resolveViewerRoleFromContext } from '@/src/features/athlete-workspace/security/resolveWorkspaceViewerRole';
import { WORKSPACE_MOCK_ORG_ID } from '@/src/features/athlete-workspace/security/workspaceRolePresets';
import type { ReportBuilderConfig } from '@/src/features/report-builder/types';
import { computeAthleteAnalytics } from '@/src/analytics/engine/performanceAnalyticsEngine';

import { buildScientificReportFromWorkspace } from '../bridge/scientificReportBridge';
import { scientificReportToMockSections } from '../utils/mapScientificToLegacy';

const DEV_MOCK_UID = 'dev_report_builder';

export function useScientificReport(config: ReportBuilderConfig) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'ar' ? 'ar' : 'en';

  const athletes = useMockStore((s) => s.athletes);
  const tests = useMockStore((s) => s.tests);
  const injuries = useMockStore((s) => s.injuryRecords);
  const checkIns = useMockStore((s) => s.dailyCheckIns);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const wearableRecords = useMockStore((s) => s.wearableRecords);
  const reports = useMockStore((s) => s.reports);
  const teams = useMockStore((s) => s.teams);

  const athlete = useMemo(
    () => athletes.find((a) => a.id === config.athleteId),
    [athletes, config.athleteId]
  );

  const securityContext = useMemo(
    () => buildSecurityContext(DEV_MOCK_UID, WORKSPACE_MOCK_ORG_ID, { roleIds: ['coach'] }, null),
    []
  );

  const scientificReport = useMemo(() => {
    if (!athlete || config.scope === 'team') return null;

    const athleteTests = tests.filter((t) => t.athlete_id === athlete.id);
    const checkIn = checkIns.find((c) => c.athlete_id === athlete.id);
    const analytics = computeAthleteAnalytics({
      athlete,
      tests: athleteTests,
      checkIn,
      injuries: injuries.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs,
      bodyCompositionRecords: bodyCompositionRecords.filter((b) => b.athlete_id === athlete.id),
    });
    const team = teams.find((t) => t.athlete_ids.includes(athlete.id));

    const viewerRole = resolveViewerRoleFromContext(securityContext);
    const passportSources = {
      checkIn: checkIn ?? null,
      injuries: injuries.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs,
      bodyCompositionRecords: bodyCompositionRecords.filter((b) => b.athlete_id === athlete.id),
      wearableRecords: wearableRecords.filter((r) => r.athlete_id === athlete.id),
      trainingLoadSummary: null,
      nutritionSummary: null,
      wearableSummary: null,
    };

    const rawPassport = buildAthletePassport({
      orgId: WORKSPACE_MOCK_ORG_ID,
      athleteId: athlete.id,
      viewerRole,
      sources: {
        athlete: mapMockAthleteToPassportProfile(athlete, team?.name, team?.sport),
        tests: athleteTests,
        analytics,
        ...passportSources,
      },
    });
    const passport = filterPassportForContext(rawPassport, securityContext);

    const rawTimeline = buildAthleteScientificTimeline({
      orgId: WORKSPACE_MOCK_ORG_ID,
      athleteId: athlete.id,
      viewerRole,
      sources: {
        tests: athleteTests,
        analytics,
        checkIns: checkIn ? [checkIn] : [],
        injuries: passportSources.injuries,
        trainingPlans: passportSources.trainingPlans,
        nutritionLogs,
        wearableRecords: passportSources.wearableRecords,
        reports: reports.filter((r) => r.athlete_id === athlete.id),
        recommendations: analytics.recommendations,
        passport: rawPassport,
      },
    });
    const timeline = filterTimelineForContext(rawTimeline, securityContext);

    return buildScientificReportFromWorkspace({
      config,
      orgId: WORKSPACE_MOCK_ORG_ID,
      passport,
      timeline,
      athleteDisplayName: `${athlete.first_name} ${athlete.last_name}`,
      securityContext,
    });
  }, [
    athlete,
    bodyCompositionRecords,
    checkIns,
    config,
    injuries,
    nutritionLogs,
    reports,
    securityContext,
    teams,
    tests,
    trainingPlans,
    wearableRecords,
  ]);

  const legacySections = useMemo(() => {
    if (!scientificReport) return null;
    return scientificReportToMockSections(scientificReport, lang);
  }, [lang, scientificReport]);

  return { scientificReport, legacySections };
}

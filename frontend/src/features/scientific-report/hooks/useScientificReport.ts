/**
 * Hook for building scientific reports from report builder config (Phase 7.0).
 * Phase 8.2 — passport/timeline via canonical buildWorkspaceArtifacts.
 * Phase 8.3 — content-keyed preview cache; title changes skip passport/timeline rebuild.
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { buildSecurityContext } from '@/src/cloud/scientific/security/accessControl';
import { useMockStore } from '@/src/data/mock/store';
import { WORKSPACE_MOCK_ORG_ID } from '@/src/features/athlete-workspace/security/workspaceRolePresets';
import type { ReportBuilderConfig } from '@/src/features/report-builder/types';
import { computeAthleteAnalytics } from '@/src/analytics/engine/performanceAnalyticsEngine';

import {
  getCachedReportPreview,
  reportPreviewContentKey,
  setCachedReportPreview,
} from '../cache/reportPreviewCache';
import { buildScientificReportFromWorkspace } from '../bridge/scientificReportBridge';
import { scientificReportToMockSections } from '../utils/mapScientificToLegacy';
import { buildWorkspaceArtifacts } from '@/src/features/athlete-workspace/context/buildWorkspaceArtifacts';

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

  const previewContentKey = useMemo(() => reportPreviewContentKey(config), [
    config.athleteId,
    config.scope,
    config.dateFrom,
    config.dateTo,
    config.sectionOrder,
    config.reportType,
    config.theme,
  ]);

  const previewBundle = useMemo(() => {
    if (!athlete || config.scope === 'team') return null;

    const cached = getCachedReportPreview(previewContentKey);
    if (cached) return cached;

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

    const { passport, timeline } = buildWorkspaceArtifacts({
      orgId: WORKSPACE_MOCK_ORG_ID,
      athlete,
      tests: athleteTests,
      analytics,
      securityContext,
      passportSources,
      teamName: team?.name,
      teamSport: team?.sport,
      reports: reports.filter((r) => r.athlete_id === athlete.id),
    });

    const bundle = { analytics, passport, timeline };
    setCachedReportPreview(previewContentKey, bundle);
    return bundle;
  }, [
    athlete,
    bodyCompositionRecords,
    checkIns,
    config.scope,
    injuries,
    nutritionLogs,
    previewContentKey,
    reports,
    securityContext,
    teams,
    tests,
    trainingPlans,
    wearableRecords,
  ]);

  const scientificReport = useMemo(() => {
    if (!athlete || config.scope === 'team' || !previewBundle) return null;

    return buildScientificReportFromWorkspace({
      config,
      orgId: WORKSPACE_MOCK_ORG_ID,
      passport: previewBundle.passport,
      timeline: previewBundle.timeline,
      athleteDisplayName: `${athlete.first_name} ${athlete.last_name}`,
      securityContext,
    });
  }, [athlete, config, previewBundle, securityContext]);

  const legacySections = useMemo(() => {
    if (!scientificReport) return null;
    return scientificReportToMockSections(scientificReport, lang);
  }, [lang, scientificReport]);

  return { scientificReport, legacySections };
}

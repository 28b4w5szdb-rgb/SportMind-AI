/**
 * Athlete Workspace Context Provider (Phase 6D.3).
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { AssessmentSession } from '@/src/cloud/scientific/models/session';
import type { MockAthlete, MockPerformanceTest } from '@/src/data/mock/types';
import { useLatestCheckInForAthlete } from '@/src/data/mock/hooks';
import { useMockStore } from '@/src/data/mock/store';
import { useNutritionSnapshot } from '@/src/features/nutrition';
import { useTrainingBuilderSnapshot } from '@/src/features/training-builder';
import { useWearablesSnapshot } from '@/src/features/wearables';

import { loadCloudSessionsForAthlete } from '../bridge/athleteWorkspaceCloudBridge';
import { getOrBuildWorkspaceArtifacts } from '../cache/workspaceArtifactCache';
import type { AthleteWorkspaceContextValue } from './types';
import { useWorkspaceDataMode, useWorkspaceSecurityContext } from './useWorkspaceSecurityContext';
import { buildVisibilityProfile } from './visibilityProfile';

const AthleteWorkspaceContext = createContext<AthleteWorkspaceContextValue | null>(null);

interface AthleteWorkspaceProviderProps {
  athlete: MockAthlete;
  tests: MockPerformanceTest[];
  analytics: AthleteAnalyticsSnapshot;
  children: React.ReactNode;
}

export function AthleteWorkspaceProvider({
  athlete,
  tests,
  analytics,
  children,
}: AthleteWorkspaceProviderProps) {
  const { securityContext, workspaceRole, organizationId } = useWorkspaceSecurityContext();
  const { dataMode, scientificCloudEnabled } = useWorkspaceDataMode();

  const latestCheckIn = useLatestCheckInForAthlete(athlete.id);
  const injuryRecords = useMockStore((s) => s.injuryRecords);
  const trainingPlans = useMockStore((s) => s.trainingPlans);
  const nutritionLogs = useMockStore((s) => s.nutritionLogs);
  const bodyCompositionRecords = useMockStore((s) => s.bodyCompositionRecords);
  const wearableRecords = useMockStore((s) => s.wearableRecords);
  const reports = useMockStore((s) => s.reports);
  const teams = useMockStore((s) => s.teams);

  const trainingSnapshot = useTrainingBuilderSnapshot(athlete, tests);
  const nutritionSnapshot = useNutritionSnapshot(athlete);
  const wearableSnapshot = useWearablesSnapshot(athlete);

  const team = useMemo(
    () => teams.find((t) => t.athlete_ids.includes(athlete.id)),
    [teams, athlete.id]
  );

  const [cloudSessions, setCloudSessions] = useState<AssessmentSession[]>([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [timelineReady, setTimelineReady] = useState(false);

  useEffect(() => {
    if (!scientificCloudEnabled) {
      setCloudSessions([]);
      return;
    }
    let cancelled = false;
    setLoadingCloud(true);
    loadCloudSessionsForAthlete(organizationId, athlete.id)
      .then((sessions) => {
        if (!cancelled) setCloudSessions(sessions);
      })
      .finally(() => {
        if (!cancelled) setLoadingCloud(false);
      });
    return () => {
      cancelled = true;
    };
  }, [scientificCloudEnabled, organizationId, athlete.id]);

  const passportSources = useMemo(
    () => ({
      checkIn: latestCheckIn ?? null,
      injuries: injuryRecords.filter((i) => i.athlete_id === athlete.id),
      trainingPlans: trainingPlans.filter((p) => p.athlete_id === athlete.id),
      nutritionLogs,
      bodyCompositionRecords: bodyCompositionRecords.filter((b) => b.athlete_id === athlete.id),
      wearableRecords: wearableRecords.filter((r) => r.athlete_id === athlete.id),
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
    }),
    [
      latestCheckIn,
      injuryRecords,
      trainingPlans,
      nutritionLogs,
      bodyCompositionRecords,
      wearableRecords,
      athlete.id,
      trainingSnapshot,
      nutritionSnapshot,
      wearableSnapshot,
    ]
  );

  const artifacts = useMemo(() => {
    return getOrBuildWorkspaceArtifacts({
      orgId: organizationId,
      athlete,
      tests,
      analytics,
      securityContext,
      passportSources,
      teamName: team?.name ?? null,
      teamSport: team?.sport ?? null,
      cloudSessions,
      reports: reports.filter((r) => r.athlete_id === athlete.id),
    });
  }, [
    organizationId,
    athlete,
    tests,
    analytics,
    securityContext,
    passportSources,
    team,
    cloudSessions,
    reports,
  ]);

  useEffect(() => {
    if (artifacts.passport) {
      setTimelineReady(false);
      const id = requestAnimationFrame(() => setTimelineReady(true));
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [artifacts.passport.passport_id]);

  const scientificTimeline = timelineReady ? artifacts.timeline : null;

  const visibilityProfile = useMemo(
    () =>
      buildVisibilityProfile({
        securityContext,
        workspaceRole,
        passport: artifacts.passport,
        timeline: scientificTimeline,
        rawPassportSectionCount: Object.keys(artifacts.rawPassport.sections).length,
        rawTimelineEventCount: artifacts.rawTimeline.events.length,
      }),
    [securityContext, workspaceRole, artifacts, scientificTimeline]
  );

  const value = useMemo<AthleteWorkspaceContextValue>(
    () => ({
      athlete,
      tests,
      analytics,
      organizationId,
      workspaceRole,
      securityContext,
      dataMode,
      scientificCloudEnabled,
      passport: artifacts.passport,
      scientificTimeline,
      cloudSessions,
      loadingPassport: loadingCloud,
      loadingTimeline: !timelineReady,
      visibilityProfile,
      trainingSnapshot,
      nutritionSnapshot,
      wearableSnapshot,
    }),
    [
      athlete,
      tests,
      analytics,
      organizationId,
      workspaceRole,
      securityContext,
      dataMode,
      scientificCloudEnabled,
      artifacts.passport,
      scientificTimeline,
      cloudSessions,
      loadingCloud,
      timelineReady,
      visibilityProfile,
      trainingSnapshot,
      nutritionSnapshot,
      wearableSnapshot,
    ]
  );

  return (
    <AthleteWorkspaceContext.Provider value={value}>{children}</AthleteWorkspaceContext.Provider>
  );
}

export function useAthleteWorkspaceContext(): AthleteWorkspaceContextValue {
  const ctx = useContext(AthleteWorkspaceContext);
  if (!ctx) {
    throw new Error('useAthleteWorkspaceContext() must be used within AthleteWorkspaceProvider.');
  }
  return ctx;
}

import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { MockAthlete, InjuryRecord } from '@/src/data/mock/types';
import type { TrainingPlan } from '../types';

import type { TrainingBuilderSnapshot } from '../types';
import {
  buildTrainingRecommendations,
  computeLoadSnapshot,
  computePlanProgress,
  deriveGoalKey,
  deriveTrainingAgeYears,
  findNextSession,
  findTodaySession,
  generateWeeklyProgram,
  todayDateKey,
} from '../engine/trainingBuilderEngine';
import type { TrainingEngineInput } from '../types';

function moduleScore(analytics: AthleteAnalyticsSnapshot, id: string): number {
  return analytics.overall.modules.find((m) => m.id === id)?.score ?? 50;
}

export function buildTrainingEngineInput(
  athlete: MockAthlete,
  analytics: AthleteAnalyticsSnapshot,
  injuries: InjuryRecord[]
): TrainingEngineInput {
  const athleteInjuries = injuries.filter((i) => i.athlete_id === athlete.id);
  const active = athleteInjuries.filter((i) => i.status !== 'resolved');
  const weaknesses = analytics.weaknesses.map((w) => w.id);

  return {
    athleteId: athlete.id,
    position: athlete.position,
    testsCount: athlete.tests_count,
    dateOfBirth: athlete.date_of_birth,
    analyticsOverall: analytics.overall.score,
    readinessScore: moduleScore(analytics, 'readiness'),
    recoveryScore: moduleScore(analytics, 'recovery'),
    fatigueScore: moduleScore(analytics, 'fatigue'),
    injuryRiskScore: moduleScore(analytics, 'injury_risk'),
    trainingLoadScore: moduleScore(analytics, 'training_load'),
    decisionLevel: analytics.decision.level,
    weaknessModuleIds: weaknesses,
    hasActiveInjury: active.length > 0,
    inRtp: active.some((i) => i.status === 'return_to_play' || i.status === 'rehab'),
    trainingAgeYears: deriveTrainingAgeYears(athlete.tests_count, athlete.date_of_birth),
  };
}

export function buildTrainingBuilderSnapshot(
  athlete: MockAthlete,
  analytics: AthleteAnalyticsSnapshot,
  plans: TrainingPlan[],
  injuries: InjuryRecord[],
  referenceDate: string = todayDateKey()
): TrainingBuilderSnapshot {
  const athletePlans = plans.filter((p) => p.athlete_id === athlete.id);
  const activePlan = athletePlans.find((p) => p.is_active) ?? athletePlans[0];
  const engineInput = buildTrainingEngineInput(athlete, analytics, injuries);
  const load = computeLoadSnapshot(activePlan, athletePlans, referenceDate);
  const recommendations = buildTrainingRecommendations(load, engineInput);

  const todaySession = findTodaySession(activePlan, referenceDate);
  const nextSession = findNextSession(activePlan, referenceDate);

  const weeklyOverview =
    activePlan?.sessions.map((s) => ({
      weekday: s.weekday,
      templateId: s.templateId,
      load: s.session_load,
      status: s.status,
    })) ?? [];

  return {
    plan: activePlan,
    todaySession,
    nextSession,
    load,
    progressPercent: activePlan ? computePlanProgress(activePlan) : 0,
    recommendations,
    weeklyOverview,
  };
}

export function createProgramForAthlete(
  athlete: MockAthlete,
  analytics: AthleteAnalyticsSnapshot,
  injuries: InjuryRecord[]
): TrainingPlan {
  const input = buildTrainingEngineInput(athlete, analytics, injuries);
  return generateWeeklyProgram(input);
}

export { deriveGoalKey, deriveTrainingAgeYears };

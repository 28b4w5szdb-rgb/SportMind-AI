import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import { ageFromDob } from '@/src/analytics/input/buildSignals';
import type { MockAthlete, DailyCheckIn, BodyCompositionRecord, DailyNutritionLog, NutritionGoalSetting } from '@/src/data/mock/types';
import type { TrainingPlan } from '@/src/features/training-builder/types';
import { computeWeeklyActualLoad } from '@/src/features/training-builder/engine/trainingBuilderEngine';

import type { NutritionEngineInput, NutritionGoalId, NutritionSnapshot } from '../types';
import { buildNutritionSnapshot } from '../engine/nutritionEngine';

function moduleScore(analytics: AthleteAnalyticsSnapshot, id: string): number {
  return analytics.overall.modules.find((m) => m.id === id)?.score ?? 50;
}

export function resolveNutritionGoal(
  settings: NutritionGoalSetting[],
  athleteId: string
): NutritionGoalId {
  return settings.find((s) => s.athlete_id === athleteId)?.goal ?? 'performance';
}

export function buildNutritionEngineInput(
  athlete: MockAthlete,
  analytics: AthleteAnalyticsSnapshot,
  checkIn: DailyCheckIn | undefined,
  trainingPlans: TrainingPlan[],
  goal: NutritionGoalId
): NutritionEngineInput {
  const plans = trainingPlans.filter((p) => p.athlete_id === athlete.id);
  const activePlan = plans.find((p) => p.is_active) ?? plans[0];
  const weeklyActualLoad = activePlan ? computeWeeklyActualLoad(activePlan.sessions) : 0;

  return {
    athleteId: athlete.id,
    ageYears: ageFromDob(athlete.date_of_birth) ?? 22,
    weightKg: athlete.weight_kg ?? 75,
    heightCm: athlete.height_cm ?? 175,
    position: athlete.position,
    goal,
    overallScore: analytics.overall.score,
    readinessScore: moduleScore(analytics, 'readiness'),
    recoveryScore: moduleScore(analytics, 'recovery'),
    fatigueScore: moduleScore(analytics, 'fatigue'),
    trainingLoadScore: moduleScore(analytics, 'training_load'),
    weeklyActualLoad,
    sleepHours: checkIn?.sleep_duration_hours,
    sleepQuality: checkIn?.sleep_quality,
    checkInHydrationLiters: checkIn?.hydration_liters,
    checkInFatigue: checkIn?.fatigue,
  };
}

export function buildAthleteNutritionSnapshot(params: {
  athlete: MockAthlete;
  analytics: AthleteAnalyticsSnapshot;
  logs: DailyNutritionLog[];
  bodyRecords: BodyCompositionRecord[];
  goalSettings: NutritionGoalSetting[];
  checkIn?: DailyCheckIn;
  trainingPlans: TrainingPlan[];
  dateKey: string;
}): NutritionSnapshot {
  const { athlete, analytics, logs, bodyRecords, goalSettings, checkIn, trainingPlans, dateKey } = params;
  const log = logs.find((l) => l.athlete_id === athlete.id && l.date === dateKey);
  const bodyTrend = bodyRecords
    .filter((b) => b.athlete_id === athlete.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const goal = resolveNutritionGoal(goalSettings, athlete.id);
  const input = buildNutritionEngineInput(athlete, analytics, checkIn, trainingPlans, goal);

  return buildNutritionSnapshot({
    log,
    bodyTrend,
    goal,
    input,
    weightKg: athlete.weight_kg ?? 75,
    heightCm: athlete.height_cm ?? 175,
  });
}

export function formatNutritionForAI(snapshot: NutritionSnapshot, athleteName: string, isRTL: boolean): string {
  const { totals, targets, hydration, compliancePercent, goal, primaryRecommendation } = snapshot;
  if (isRTL) {
    return (
      `🥗 تغذية ${athleteName}: ${totals.calories}/${targets.calories} kcal، بروtein ${totals.protein_g}/${targets.protein_g}g، ماء ${totals.water_liters}/${targets.water_liters}L.\n` +
      `الامتثال ${compliancePercent}%. الترطيب ${hydration.hydrationPercent}%. الهدف: ${goal}.\n` +
      (primaryRecommendation ? `💡 ${primaryRecommendation.titleKey}` : '')
    );
  }
  return (
    `🥗 Nutrition for ${athleteName}: ${totals.calories}/${targets.calories} kcal, protein ${totals.protein_g}/${targets.protein_g}g, water ${totals.water_liters}/${targets.water_liters}L.\n` +
    `Compliance ${compliancePercent}%. Hydration ${hydration.hydrationPercent}%. Goal: ${goal}.\n` +
    (primaryRecommendation ? `💡 ${primaryRecommendation.titleKey}` : '')
  );
}

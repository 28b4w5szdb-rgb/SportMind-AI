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

export function formatNutritionForAI(snapshot: NutritionSnapshot, athleteName: string, isRTL: boolean, translate?: (key: string) => string): string {
  const { totals, targets, hydration, compliance, goal, primaryRecommendation, bodyCompositionAnalysis } = snapshot;
  const recText = primaryRecommendation
    ? translate
      ? translate(primaryRecommendation.titleKey)
      : primaryRecommendation.titleKey
    : '';
  const bc = bodyCompositionAnalysis;
  const bodyLine =
    bc?.latest && isRTL
      ? `تركيب الجسم: ${bc.latest.weight_kg} kg${bc.bodyFatChange !== undefined ? ` · دهون ${bc.bodyFatChange > 0 ? '+' : ''}${bc.bodyFatChange}%` : ''}.`
      : bc?.latest
        ? `Body comp: ${bc.latest.weight_kg} kg${bc.bodyFatChange !== undefined ? ` · BF ${bc.bodyFatChange > 0 ? '+' : ''}${bc.bodyFatChange}%` : ''}.`
        : '';

  if (isRTL) {
    return (
      `🥗 تغذية ${athleteName}: ${totals.calories}/${targets.calories} kcal، بروtein ${totals.protein_g}/${targets.protein_g}g، ماء ${totals.water_liters}/${targets.water_liters}L.\n` +
      `الامتثال ${compliance.overall}% (بروtein ${compliance.protein}% · ترطيب ${compliance.hydration}%). الهدف: ${goal}.\n` +
      bodyLine +
      (recText ? `\n💡 ${recText}` : '')
    );
  }
  return (
    `🥗 Nutrition for ${athleteName}: ${totals.calories}/${targets.calories} kcal, protein ${totals.protein_g}/${targets.protein_g}g, water ${totals.water_liters}/${targets.water_liters}L.\n` +
    `Compliance ${compliance.overall}% (protein ${compliance.protein}%, hydration ${compliance.hydration}%). Goal: ${goal}.\n` +
    bodyLine +
    (recText ? `\n💡 ${recText}` : '')
  );
}

import type { AnalyticsRawSignals } from '@/src/analytics/types';
import type { MockAthlete, DailyCheckIn, BodyCompositionRecord, DailyNutritionLog, NutritionGoalSetting } from '@/src/data/mock/types';
import type { TrainingPlan } from '@/src/features/training-builder/types';
import { computeRecoveryScoreFromCheckIn } from '@/src/features/recovery/recoveryEngine';
import { buildTrainingSignals } from '@/src/features/training-builder/utils/trainingSignals';
import { todayDateKey } from '@/src/features/daily-checkin/validation';

import { analyzeBodyComposition, computeBodyCompositionTrendScore } from '../engine/bodyCompositionEngine';
import {
  buildNutritionSnapshot,
  computeCompliancePercent,
  computeMacroTotals,
  computeNutritionTargets,
} from '../engine/nutritionEngine';
import { resolveNutritionGoal } from './nutritionHelpers';
import type { NutritionEngineInput } from '../types';

function clampPct(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function buildEstimatedEngineInput(
  athlete: MockAthlete,
  goal: ReturnType<typeof resolveNutritionGoal>,
  checkIn?: DailyCheckIn,
  trainingPlans?: TrainingPlan[]
): NutritionEngineInput {
  const training = trainingPlans?.length ? buildTrainingSignals(trainingPlans, athlete.id) : undefined;
  const recoveryScore = checkIn ? computeRecoveryScoreFromCheckIn(checkIn) : 65;
  const fatigueScore = checkIn ? clampPct(100 - (checkIn.fatigue - 1) * 9) : 65;
  const trainingLoadScore = training
    ? clampPct(70 + Math.min(20, training.weeklyActualLoad * 0.02) - Math.max(0, (training.acwr - 1) * 15))
    : 65;

  return {
    athleteId: athlete.id,
    ageYears: athlete.date_of_birth
      ? Math.floor((Date.now() - new Date(athlete.date_of_birth).getTime()) / (365.25 * 24 * 3600 * 1000))
      : 22,
    weightKg: athlete.weight_kg ?? 75,
    heightCm: athlete.height_cm ?? 175,
    position: athlete.position,
    goal,
    overallScore: 650,
    readinessScore: checkIn
      ? clampPct(recoveryScore * 0.4 + (checkIn.mood - 1) * 6 + (checkIn.sleep_quality - 1) * 4)
      : 65,
    recoveryScore,
    fatigueScore,
    trainingLoadScore,
    weeklyActualLoad: training?.weeklyActualLoad ?? 0,
    sleepHours: checkIn?.sleep_duration_hours,
    sleepQuality: checkIn?.sleep_quality,
    checkInHydrationLiters: checkIn?.hydration_liters,
    checkInFatigue: checkIn?.fatigue,
  };
}

export function buildNutritionSignals(params: {
  athlete: MockAthlete;
  logs: DailyNutritionLog[];
  bodyRecords: BodyCompositionRecord[];
  goalSettings: NutritionGoalSetting[];
  checkIn?: DailyCheckIn;
  trainingPlans?: TrainingPlan[];
  dateKey?: string;
}): NonNullable<AnalyticsRawSignals['nutrition']> {
  const { athlete, logs, bodyRecords, goalSettings, checkIn, trainingPlans, dateKey = todayDateKey() } = params;
  const goal = resolveNutritionGoal(goalSettings, athlete.id);
  const log = logs.find((l) => l.athlete_id === athlete.id && l.date === dateKey);
  const bodyTrend = bodyRecords.filter((b) => b.athlete_id === athlete.id).sort((a, b) => b.date.localeCompare(a.date));
  const input = buildEstimatedEngineInput(athlete, goal, checkIn, trainingPlans);
  const snapshot = buildNutritionSnapshot({
    log,
    bodyTrend,
    goal,
    input,
    weightKg: bodyTrend[0]?.weight_kg ?? athlete.weight_kg ?? 75,
    heightCm: athlete.height_cm ?? 175,
  });

  const totals = computeMacroTotals(log);
  const targets = computeNutritionTargets(input);
  const proteinCompliance = targets.protein_g > 0 ? clampPct((totals.protein_g / targets.protein_g) * 100) : 0;
  const calorieCompliance = targets.calories > 0 ? clampPct((totals.calories / targets.calories) * 100) : 0;
  const hydrationCompliance = snapshot.hydration.hydrationPercent;
  const compliancePercent = computeCompliancePercent(totals, targets);
  const bodyAnalysis = analyzeBodyComposition(bodyTrend, athlete.height_cm ?? 175, goal);
  const bodyCompositionTrendScore = computeBodyCompositionTrendScore(bodyAnalysis, goal);

  return {
    compliancePercent,
    hydrationCompliance,
    proteinCompliance,
    calorieCompliance,
    bodyCompositionTrendScore,
    hasLogToday: Boolean(log),
    hasBodyComposition: bodyTrend.length > 0,
  };
}

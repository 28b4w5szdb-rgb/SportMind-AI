import type {
  BodyCompositionRecord,
  DailyNutritionLog,
  HydrationSnapshot,
  MacroTotals,
  MealEntry,
  NutritionEngineInput,
  NutritionRecommendation,
  NutritionSnapshot,
  NutritionTargets,
  SweatRiskLevel,
} from '../types';
import { analyzeBodyComposition } from './bodyCompositionEngine';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n)));
}

function sumMeals(meals: MealEntry[]): Omit<MacroTotals, 'water_liters'> {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      protein_g: acc.protein_g + m.protein_g,
      carbs_g: acc.carbs_g + m.carbs_g,
      fat_g: acc.fat_g + m.fat_g,
    }),
    { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 }
  );
}

export function computeMacroTotals(log?: DailyNutritionLog): MacroTotals {
  if (!log) return { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, water_liters: 0 };
  const macros = sumMeals(log.meals);
  return { ...macros, water_liters: log.water_liters };
}

export function computeBmi(weightKg: number, heightCm: number): number {
  const h = heightCm / 100;
  return Math.round((weightKg / (h * h)) * 10) / 10;
}

export function computeNutritionTargets(input: NutritionEngineInput): NutritionTargets {
  const { weightKg, heightCm, ageYears, goal, trainingLoadScore, recoveryScore, overallScore } = input;

  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageYears + 5;
  let activityMult = 1.55;
  if (trainingLoadScore >= 75) activityMult = 1.75;
  else if (trainingLoadScore >= 60) activityMult = 1.65;
  if (recoveryScore < 50) activityMult -= 0.05;

  let tdee = bmr * activityMult;
  if (goal === 'lose_fat' || goal === 'weight_loss') tdee *= 0.85;
  else if (goal === 'build_muscle' || goal === 'weight_gain') tdee *= 1.1;
  else if (goal === 'recovery') tdee *= 1.05;
  if (overallScore >= 700) tdee *= 1.03;

  const calories = clamp(tdee, 1600, 4500);

  let proteinPerKg = 1.8;
  if (goal === 'build_muscle' || goal === 'weight_gain') proteinPerKg = 2.2;
  else if (goal === 'lose_fat' || goal === 'weight_loss') proteinPerKg = 2.0;
  else if (goal === 'recovery') proteinPerKg = 2.0;
  const protein_g = Math.round(weightKg * proteinPerKg);

  let carbsPct = 0.45;
  if (input.weeklyActualLoad > 800 || goal === 'performance') carbsPct = 0.5;
  if (goal === 'lose_fat') carbsPct = 0.35;

  const proteinCal = protein_g * 4;
  const carbs_g = Math.round((calories * carbsPct) / 4);
  const fat_g = Math.round(Math.max(0, calories - proteinCal - carbs_g * 4) / 9);

  let water_liters = Math.round(weightKg * 0.035 * 10) / 10;
  if (input.weeklyActualLoad > 600) water_liters += 0.5;
  if (sweatRisk(input) !== 'low') water_liters += 0.3;
  water_liters = Math.max(2, Math.min(5, water_liters));

  return { calories, protein_g, carbs_g, fat_g, water_liters };
}

function sweatRisk(input: NutritionEngineInput): SweatRiskLevel {
  if (input.trainingLoadScore >= 78 || input.weeklyActualLoad > 900) return 'high';
  if (input.trainingLoadScore >= 62 || input.weeklyActualLoad > 500) return 'moderate';
  return 'low';
}

export function computeHydrationSnapshot(
  totals: MacroTotals,
  targets: NutritionTargets,
  input: NutritionEngineInput
): HydrationSnapshot {
  const intakeLiters = totals.water_liters;
  const goalLiters = targets.water_liters;
  const hydrationPercent = goalLiters > 0 ? clamp((intakeLiters / goalLiters) * 100) : 0;
  const sweat = sweatRisk(input);

  let reminderKey: string | undefined;
  if (hydrationPercent < 60) reminderKey = 'nutrition.hydration.reminderLow';
  else if (hydrationPercent < 85) reminderKey = 'nutrition.hydration.reminderMid';

  return { intakeLiters, goalLiters, hydrationPercent, sweatRisk: sweat, reminderKey };
}

export function computeCompliancePercent(totals: MacroTotals, targets: NutritionTargets): number {
  const calPct = targets.calories > 0 ? totals.calories / targets.calories : 0;
  const proPct = targets.protein_g > 0 ? totals.protein_g / targets.protein_g : 0;
  const waterPct = targets.water_liters > 0 ? totals.water_liters / targets.water_liters : 0;
  const avg = (Math.min(calPct, 1.15) + Math.min(proPct, 1.15) + Math.min(waterPct, 1.15)) / 3;
  return clamp(avg * 100);
}

export function computeComplianceBreakdown(
  totals: MacroTotals,
  targets: NutritionTargets,
  hydrationPercent: number
): import('../types').NutritionComplianceBreakdown {
  const protein = targets.protein_g > 0 ? clamp(Math.min(115, (totals.protein_g / targets.protein_g) * 100)) : 0;
  const calories = targets.calories > 0 ? clamp(Math.min(115, (totals.calories / targets.calories) * 100)) : 0;
  const hydration = clamp(hydrationPercent);
  return {
    overall: computeCompliancePercent(totals, targets),
    protein,
    hydration,
    calories,
  };
}

export function computeGoalProgress(
  goal: import('../types').NutritionGoalId,
  totals: MacroTotals,
  targets: NutritionTargets,
  bodyTrend: BodyCompositionRecord[]
): number {
  const compliance = computeCompliancePercent(totals, targets);
  if (bodyTrend.length >= 2) {
    const latest = bodyTrend[0].weight_kg;
    const prev = bodyTrend[1].weight_kg;
    const delta = latest - prev;
    if (goal === 'weight_loss' || goal === 'lose_fat') {
      return clamp(compliance * 0.6 + (delta <= 0 ? 40 : 10));
    }
    if (goal === 'weight_gain' || goal === 'build_muscle') {
      return clamp(compliance * 0.6 + (delta >= 0 ? 40 : 10));
    }
  }
  return compliance;
}

export function buildNutritionRecommendations(
  totals: MacroTotals,
  targets: NutritionTargets,
  hydration: HydrationSnapshot,
  input: NutritionEngineInput,
  compliancePercent: number
): NutritionRecommendation[] {
  const recs: NutritionRecommendation[] = [];

  if (totals.protein_g < targets.protein_g * 0.85) {
    recs.push({
      id: 'increase_protein',
      priority: totals.protein_g < targets.protein_g * 0.7 ? 'high' : 'medium',
      titleKey: 'nutrition.recommendations.increaseProteinTitle',
      bodyKey: 'nutrition.recommendations.increaseProtein',
    });
  }

  if (input.weeklyActualLoad > 500 && totals.carbs_g < targets.carbs_g * 0.8) {
    recs.push({
      id: 'increase_carbs',
      priority: 'medium',
      titleKey: 'nutrition.recommendations.increaseCarbsTitle',
      bodyKey: 'nutrition.recommendations.increaseCarbs',
    });
  }

  if (hydration.hydrationPercent < 75) {
    recs.push({
      id: 'drink_more_water',
      priority: hydration.hydrationPercent < 50 ? 'high' : 'medium',
      titleKey: 'nutrition.recommendations.drinkWaterTitle',
      bodyKey: 'nutrition.recommendations.drinkWater',
    });
  }

  if (input.recoveryScore < 55 || input.fatigueScore < 50) {
    recs.push({
      id: 'recovery_shake',
      priority: 'high',
      titleKey: 'nutrition.recommendations.recoveryShakeTitle',
      bodyKey: 'nutrition.recommendations.recoveryShake',
    });
  }

  if ((input.goal === 'lose_fat' || input.goal === 'weight_loss') && totals.calories > targets.calories * 1.1) {
    recs.push({
      id: 'reduce_calories',
      priority: 'high',
      titleKey: 'nutrition.recommendations.reduceCaloriesTitle',
      bodyKey: 'nutrition.recommendations.reduceCalories',
    });
  }

  if (hydration.sweatRisk === 'high' || input.trainingLoadScore >= 75) {
    recs.push({
      id: 'increase_electrolytes',
      priority: hydration.sweatRisk === 'high' ? 'high' : 'medium',
      titleKey: 'nutrition.recommendations.electrolytesTitle',
      bodyKey: 'nutrition.recommendations.electrolytes',
    });
  }

  if (input.weeklyActualLoad > 400 && compliancePercent >= 70) {
    recs.push({
      id: 'meal_timing',
      priority: 'low',
      titleKey: 'nutrition.recommendations.mealTimingTitle',
      bodyKey: 'nutrition.recommendations.mealTiming',
    });
  }

  return recs.slice(0, 5);
}

export function buildNutritionSnapshot(params: {
  log?: DailyNutritionLog;
  bodyTrend: BodyCompositionRecord[];
  goal: import('../types').NutritionGoalId;
  input: NutritionEngineInput;
  weightKg: number;
  heightCm: number;
}): NutritionSnapshot {
  const { log, bodyTrend, goal, input, weightKg, heightCm } = params;
  const totals = computeMacroTotals(log);
  const targets = computeNutritionTargets(input);
  const hydration = computeHydrationSnapshot(totals, targets, input);
  const compliancePercent = computeCompliancePercent(totals, targets);
  const compliance = computeComplianceBreakdown(totals, targets, hydration.hydrationPercent);
  const goalProgress = computeGoalProgress(goal, totals, targets, bodyTrend);
  const recommendations = buildNutritionRecommendations(totals, targets, hydration, input, compliancePercent);
  const bodyComposition = bodyTrend[0];
  const bodyCompositionAnalysis = analyzeBodyComposition(bodyTrend, heightCm, goal, {
    height_cm: heightCm,
    weight_kg: weightKg,
  });
  const bmi = bodyCompositionAnalysis.bmi ?? (heightCm > 0 ? computeBmi(bodyComposition?.weight_kg ?? weightKg, heightCm) : undefined);

  return {
    log,
    targets,
    totals,
    compliancePercent,
    compliance,
    hydration,
    bodyComposition,
    bodyCompositionAnalysis,
    bodyCompositionTrend: bodyTrend.slice(0, 6),
    bmi,
    goal,
    goalProgress,
    primaryRecommendation: recommendations[0],
    recommendations,
  };
}

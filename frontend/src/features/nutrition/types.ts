/** Sports Nutrition domain types — structured for future Supabase + meal DB wiring. */

export type MealSlotId =
  | 'breakfast'
  | 'snack_am'
  | 'lunch'
  | 'snack_pm'
  | 'dinner'
  | 'pre_workout'
  | 'post_workout';

export type NutritionGoalId =
  | 'lose_fat'
  | 'build_muscle'
  | 'performance'
  | 'recovery'
  | 'maintenance'
  | 'weight_gain'
  | 'weight_loss';

export type SweatRiskLevel = 'low' | 'moderate' | 'high';

/** Future meal-database entry shape (barcode / wearable ready). */
export interface MealDatabaseRef {
  source: 'manual' | 'catalog' | 'barcode' | 'wearable';
  ref_id?: string;
}

export interface MealEntry {
  slot: MealSlotId;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  description?: string;
  database_ref?: MealDatabaseRef;
}

export interface DailyNutritionLog {
  id: string;
  athlete_id: string;
  date: string;
  meals: MealEntry[];
  water_liters: number;
  supplement_keys: string[];
  notes?: string;
  created_at: string;
}

export type DailyNutritionLogInput = Omit<DailyNutritionLog, 'id' | 'created_at' | 'date'> & { date?: string };

export interface BodyCompositionRecord {
  id: string;
  athlete_id: string;
  date: string;
  weight_kg: number;
  body_fat_percent?: number;
  muscle_mass_kg?: number;
  lean_mass_kg?: number;
  body_water_percent?: number;
}

export type BodyCompositionInput = Omit<BodyCompositionRecord, 'id'>;

export interface NutritionGoalSetting {
  athlete_id: string;
  goal: NutritionGoalId;
  target_weight_kg?: number;
  updated_at: string;
}

export interface NutritionTargets {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_liters: number;
}

export interface MacroTotals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_liters: number;
}

export interface HydrationSnapshot {
  intakeLiters: number;
  goalLiters: number;
  hydrationPercent: number;
  sweatRisk: SweatRiskLevel;
  reminderKey?: string;
}

export type NutritionRecommendationId =
  | 'increase_protein'
  | 'increase_carbs'
  | 'drink_more_water'
  | 'recovery_shake'
  | 'reduce_calories'
  | 'increase_electrolytes'
  | 'meal_timing'
  | 'supplement_support';

export interface NutritionRecommendation {
  id: NutritionRecommendationId;
  priority: 'high' | 'medium' | 'low';
  titleKey: string;
  bodyKey: string;
}

export interface NutritionSnapshot {
  log?: DailyNutritionLog;
  targets: NutritionTargets;
  totals: MacroTotals;
  compliancePercent: number;
  hydration: HydrationSnapshot;
  bodyComposition?: BodyCompositionRecord;
  bodyCompositionTrend: BodyCompositionRecord[];
  bmi?: number;
  goal: NutritionGoalId;
  goalProgress: number;
  primaryRecommendation?: NutritionRecommendation;
  recommendations: NutritionRecommendation[];
}

export interface NutritionEngineInput {
  athleteId: string;
  ageYears: number;
  weightKg: number;
  heightCm: number;
  position: string;
  goal: NutritionGoalId;
  overallScore: number;
  readinessScore: number;
  recoveryScore: number;
  fatigueScore: number;
  trainingLoadScore: number;
  weeklyActualLoad: number;
  sleepHours?: number;
  sleepQuality?: number;
  checkInHydrationLiters?: number;
  checkInFatigue?: number;
}

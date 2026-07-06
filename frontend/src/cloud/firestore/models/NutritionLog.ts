import type { CloudDocumentMeta } from './common';

export type MealSlotId =
  | 'breakfast'
  | 'snack_am'
  | 'lunch'
  | 'snack_pm'
  | 'dinner'
  | 'pre_workout'
  | 'post_workout';

export interface NutritionMealEntry {
  slot: MealSlotId;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  description?: string;
}

/** Daily nutrition log. Collection: `nutrition_logs/{id}`. */
export interface NutritionLog extends CloudDocumentMeta {
  organization_id: string;
  athlete_id: string;
  date: string;
  meals: NutritionMealEntry[];
  water_liters: number;
  supplement_keys: string[];
  notes?: string;
}

export type NutritionLogInput = Omit<NutritionLog, keyof CloudDocumentMeta>;

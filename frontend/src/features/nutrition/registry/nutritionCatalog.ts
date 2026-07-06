import type { MealSlotId } from '../types';

export const MEAL_SLOTS: Array<{ id: MealSlotId; labelKey: string }> = [
  { id: 'breakfast', labelKey: 'nutrition.slots.breakfast' },
  { id: 'snack_am', labelKey: 'nutrition.slots.snackAm' },
  { id: 'lunch', labelKey: 'nutrition.slots.lunch' },
  { id: 'snack_pm', labelKey: 'nutrition.slots.snackPm' },
  { id: 'dinner', labelKey: 'nutrition.slots.dinner' },
  { id: 'pre_workout', labelKey: 'nutrition.slots.preWorkout' },
  { id: 'post_workout', labelKey: 'nutrition.slots.postWorkout' },
];

/** Placeholder catalog — future barcode / meal DB entries attach here. */
export const SUPPLEMENT_CATALOG: Array<{ key: string; labelKey: string }> = [
  { key: 'whey_protein', labelKey: 'nutrition.supplements.whey' },
  { key: 'creatine', labelKey: 'nutrition.supplements.creatine' },
  { key: 'electrolytes', labelKey: 'nutrition.supplements.electrolytes' },
  { key: 'vitamin_d', labelKey: 'nutrition.supplements.vitaminD' },
  { key: 'omega3', labelKey: 'nutrition.supplements.omega3' },
  { key: 'recovery_shake', labelKey: 'nutrition.supplements.recoveryShake' },
];

export const NUTRITION_GOALS: Array<{ id: import('../types').NutritionGoalId; labelKey: string }> = [
  { id: 'performance', labelKey: 'nutrition.goals.performance' },
  { id: 'build_muscle', labelKey: 'nutrition.goals.buildMuscle' },
  { id: 'lose_fat', labelKey: 'nutrition.goals.loseFat' },
  { id: 'weight_loss', labelKey: 'nutrition.goals.weightLoss' },
  { id: 'weight_gain', labelKey: 'nutrition.goals.weightGain' },
  { id: 'recovery', labelKey: 'nutrition.goals.recovery' },
  { id: 'maintenance', labelKey: 'nutrition.goals.maintenance' },
];

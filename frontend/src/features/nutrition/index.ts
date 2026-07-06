export * from './types';
export { MEAL_SLOTS, SUPPLEMENT_CATALOG, NUTRITION_GOALS } from './registry/nutritionCatalog';
export { buildNutritionSnapshot, computeMacroTotals, computeBmi } from './engine/nutritionEngine';
export { buildAthleteNutritionSnapshot, buildNutritionEngineInput, formatNutritionForAI } from './utils/nutritionHelpers';
export { useNutritionSnapshot } from './hooks/useNutritionSnapshot';
export { NutritionCenterPanel } from './components/NutritionCenterPanel';
export { WorkspaceNutritionSection } from './components/WorkspaceNutritionSection';
export { NutritionLogForm } from './components/NutritionLogForm';
export { resolveNutritionGoal } from './utils/nutritionHelpers';

import type { AnalyticsModuleId } from '../types';

export interface ModuleDefinition {
  id: AnalyticsModuleId;
  labelKey: string;
  weight: number;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
}

/** Weights sum to 1.0 — drives Overall Athlete Score (0–1000). */
export const ANALYTICS_MODULES: ModuleDefinition[] = [
  { id: 'physical_fitness', labelKey: 'analytics.modules.physicalFitness', weight: 0.1, icon: 'fitness' },
  { id: 'strength', labelKey: 'analytics.modules.strength', weight: 0.09, icon: 'barbell' },
  { id: 'speed', labelKey: 'analytics.modules.speed', weight: 0.09, icon: 'flash' },
  { id: 'endurance', labelKey: 'analytics.modules.endurance', weight: 0.1, icon: 'heart' },
  { id: 'agility', labelKey: 'analytics.modules.agility', weight: 0.08, icon: 'shuffle' },
  { id: 'flexibility', labelKey: 'analytics.modules.flexibility', weight: 0.07, icon: 'body' },
  { id: 'recovery', labelKey: 'analytics.modules.recovery', weight: 0.09, icon: 'bed' },
  { id: 'training_load', labelKey: 'analytics.modules.trainingLoad', weight: 0.09, icon: 'analytics' },
  { id: 'fatigue', labelKey: 'analytics.modules.fatigue', weight: 0.08, icon: 'battery-dead' },
  { id: 'injury_risk', labelKey: 'analytics.modules.injuryRisk', weight: 0.1, icon: 'medkit' },
  { id: 'readiness', labelKey: 'analytics.modules.readiness', weight: 0.06, icon: 'checkmark-circle' },
  { id: 'training_compliance', labelKey: 'analytics.modules.trainingCompliance', weight: 0.05, icon: 'calendar' },
];

export function getModuleDefinition(id: AnalyticsModuleId): ModuleDefinition {
  const mod = ANALYTICS_MODULES.find((m) => m.id === id);
  if (!mod) throw new Error(`Unknown analytics module: ${id}`);
  return mod;
}

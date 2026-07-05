import type { AnalyticsModuleId } from '../types';

/** Maps Performance Lab test keys to analytics modules they influence. */
export const TEST_MODULE_IMPACT_MAP: Record<string, AnalyticsModuleId[]> = {
  yoyo: ['endurance', 'physical_fitness', 'training_load'],
  beep: ['endurance', 'physical_fitness', 'fatigue'],
  sprint30: ['speed', 'agility', 'physical_fitness'],
  cmj: ['strength', 'agility', 'physical_fitness'],
};

export function getAffectedModules(testTypeKey: string): AnalyticsModuleId[] {
  return TEST_MODULE_IMPACT_MAP[testTypeKey] ?? ['physical_fitness'];
}

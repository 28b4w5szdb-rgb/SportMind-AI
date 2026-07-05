import { buildModuleImpactMap } from '@/src/features/performance-lab/registry/tests';
import type { AnalyticsModuleId } from '../types';

/** Maps test keys to analytics modules — sourced from Testing Registry. */
export const TEST_MODULE_IMPACT_MAP: Record<string, AnalyticsModuleId[]> = buildModuleImpactMap();

export function getAffectedModules(testTypeKey: string): AnalyticsModuleId[] {
  return TEST_MODULE_IMPACT_MAP[testTypeKey] ?? ['physical_fitness'];
}

import { getTestDefinition, TEST_REGISTRY } from '@/src/features/performance-lab/registry/tests';
import type { AnalyticsModuleId } from '../types';

export const TEST_MODULE_IMPACT_MAP: Record<string, AnalyticsModuleId[]> = Object.fromEntries(
  TEST_REGISTRY.map((t) => [t.key, t.affectedModules])
);

export function getAffectedModules(testTypeKey: string, customTests: Parameters<typeof getTestDefinition>[1] = []): AnalyticsModuleId[] {
  const def = getTestDefinition(testTypeKey, customTests);
  if (def) return def.affectedModules;
  return TEST_MODULE_IMPACT_MAP[testTypeKey] ?? ['physical_fitness'];
}

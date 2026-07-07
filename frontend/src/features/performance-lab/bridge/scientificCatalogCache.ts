/**
 * Lazy catalog cache for Performance Lab bridge — avoids repeated definition lookups.
 */

import type { CatalogAssessmentDefinition } from '@/src/cloud/scientific/models/catalog/AssessmentDefinition';
import { getScientificRepositoryRegistry } from '@/src/cloud/scientific/repositories/registry';

const definitionCache = new Map<string, CatalogAssessmentDefinition>();

export async function getCachedCatalogDefinition(
  key: string
): Promise<CatalogAssessmentDefinition | null> {
  const cached = definitionCache.get(key);
  if (cached) return cached;

  const registry = getScientificRepositoryRegistry();
  const definition =
    await registry.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(key);
  if (definition) {
    definitionCache.set(key, definition);
  }
  return definition;
}

export function warmCatalogCache(keys: string[]): void {
  void Promise.all(keys.map((key) => getCachedCatalogDefinition(key)));
}

export function resetScientificCatalogCache(): void {
  definitionCache.clear();
}

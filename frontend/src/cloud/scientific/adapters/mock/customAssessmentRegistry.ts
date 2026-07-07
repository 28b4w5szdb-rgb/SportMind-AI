/**
 * Organization-scoped custom assessment definitions — in-memory registry (Phase 6C.9.3).
 */

import type { AssessmentProtocolVersion, CatalogAssessmentDefinition } from '@/src/cloud/scientific/models/catalog/AssessmentDefinition';

export interface CustomAssessmentBundle {
  definition: CatalogAssessmentDefinition;
  protocol: AssessmentProtocolVersion;
  organizationId: string;
  createdAt: string;
}

const bundlesByKey = new Map<string, CustomAssessmentBundle>();
const bundlesByDefinitionId = new Map<string, CustomAssessmentBundle>();

export function registerCustomAssessmentBundle(bundle: CustomAssessmentBundle): void {
  bundlesByKey.set(bundle.definition.key, bundle);
  bundlesByDefinitionId.set(bundle.definition.id, bundle);
}

export function getCustomAssessmentBundle(key: string): CustomAssessmentBundle | null {
  return bundlesByKey.get(key) ?? null;
}

export function getCustomAssessmentByDefinitionId(definitionId: string): CustomAssessmentBundle | null {
  return bundlesByDefinitionId.get(definitionId) ?? null;
}

export function listCustomAssessmentBundles(): CustomAssessmentBundle[] {
  return [...bundlesByKey.values()];
}

export function listCustomAssessmentDefinitionKeys(): string[] {
  return [...bundlesByKey.keys()];
}

export function hydrateCustomAssessmentBundles(bundles: CustomAssessmentBundle[]): void {
  resetCustomAssessmentRegistry();
  for (const bundle of bundles) {
    registerCustomAssessmentBundle(bundle);
  }
}

export function resetCustomAssessmentRegistry(): void {
  bundlesByKey.clear();
  bundlesByDefinitionId.clear();
}

export function mergeWithCustomDefinitions(
  seedDefinitions: CatalogAssessmentDefinition[]
): CatalogAssessmentDefinition[] {
  const custom = listCustomAssessmentBundles().map((bundle) => bundle.definition);
  const keys = new Set(seedDefinitions.map((item) => item.key));
  return [...seedDefinitions, ...custom.filter((item) => !keys.has(item.key))];
}

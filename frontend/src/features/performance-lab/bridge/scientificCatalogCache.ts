/**
 * Extended Scientific Catalog Cache — lazy list/search with single-flight loading.
 */

import type { CatalogAssessmentDefinition } from '@/src/cloud/scientific/models/catalog/AssessmentDefinition';
import type { EvidenceTier, ScientificCategoryCode } from '@/src/cloud/scientific/models/common';
import { createAssessmentDefinitionEngineFromRegistry } from '@/src/cloud/scientific/repositories/registry';
import { getCustomAssessmentBundle } from '@/src/cloud/scientific/adapters/mock/customAssessmentRegistry';

import type { TestCategoryId, TestDefinition } from '../types';
import { getTestDefinition, getMergedRegistry } from '../registry/tests';
import {
  catalogMatchesCategory,
  mapCatalogToTestDefinition,
  PERF_LAB_TO_SCIENTIFIC,
} from './catalogDefinitionMapper';

const definitionCache = new Map<string, CatalogAssessmentDefinition>();
let allDefinitionsPromise: Promise<CatalogAssessmentDefinition[]> | null = null;
let allLibraryDefinitionsPromise: Promise<TestDefinition[]> | null = null;

export async function getCachedCatalogDefinition(
  key: string
): Promise<CatalogAssessmentDefinition | null> {
  const cached = definitionCache.get(key);
  if (cached) return cached;

  const customBundle = getCustomAssessmentBundle(key);
  if (customBundle) {
    definitionCache.set(key, customBundle.definition);
    return customBundle.definition;
  }

  const engine = createAssessmentDefinitionEngineFromRegistry();
  const definition = await engine.getAssessmentDefinitionByKey(key);
  if (definition) {
    definitionCache.set(key, definition);
  }
  return definition;
}

export async function loadAllCatalogDefinitions(): Promise<CatalogAssessmentDefinition[]> {
  if (allDefinitionsPromise) return allDefinitionsPromise;

  allDefinitionsPromise = (async () => {
    try {
      const engine = createAssessmentDefinitionEngineFromRegistry();
      const definitions = await engine.listAssessmentDefinitions();
      for (const definition of definitions) {
        definitionCache.set(definition.key, definition);
      }
      return definitions;
    } catch {
      return [];
    }
  })();

  return allDefinitionsPromise;
}

export async function searchCatalogDefinitions(options: {
  query?: string;
  categoryCode?: ScientificCategoryCode;
  evidenceTier?: EvidenceTier;
}): Promise<CatalogAssessmentDefinition[]> {
  try {
    const engine = createAssessmentDefinitionEngineFromRegistry();
    return engine.searchAssessmentDefinitions(options);
  } catch {
    return [];
  }
}

export async function loadLibraryDefinitions(customTests: TestDefinition[]): Promise<TestDefinition[]> {
  if (allLibraryDefinitionsPromise) return allLibraryDefinitionsPromise;

  allLibraryDefinitionsPromise = (async () => {
    const catalog = await loadAllCatalogDefinitions();
    if (catalog.length === 0) {
      return getMergedRegistry(customTests);
    }

    const mapped = catalog.map(mapCatalogToTestDefinition);
    const keys = new Set(mapped.map((item) => item.key));
    const customOnly = customTests.filter((item) => !keys.has(item.key));
    return [...mapped, ...customOnly];
  })();

  return allLibraryDefinitionsPromise;
}

export async function loadCategoryAssessments(
  categoryId: TestCategoryId,
  customTests: TestDefinition[]
): Promise<TestDefinition[]> {
  const legacy = getMergedRegistry(customTests).filter((item) => item.categoryId === categoryId);

  try {
    const catalog = await loadAllCatalogDefinitions();
    if (catalog.length === 0) return legacy;

    const scientificCode = PERF_LAB_TO_SCIENTIFIC[categoryId];
    const fromCatalog = catalog
      .filter((item) => catalogMatchesCategory(item, categoryId) || item.category_code === scientificCode)
      .map(mapCatalogToTestDefinition)
      .filter((item) => item.categoryId === categoryId);

    if (fromCatalog.length === 0) return legacy;

    const keys = new Set(fromCatalog.map((item) => item.key));
    const customOnly = legacy.filter((item) => item.isCustom && !keys.has(item.key));
    return [...fromCatalog, ...customOnly];
  } catch {
    return legacy;
  }
}

export function warmCatalogCache(keys: string[]): void {
  void Promise.all(keys.map((key) => getCachedCatalogDefinition(key)));
}

export function resetScientificCatalogCache(): void {
  definitionCache.clear();
  allDefinitionsPromise = null;
  allLibraryDefinitionsPromise = null;
}

export function resolveDefinitionFromCache(key: string): TestDefinition | undefined {
  const catalog = definitionCache.get(key);
  if (catalog) return mapCatalogToTestDefinition(catalog);
  return getTestDefinition(key);
}

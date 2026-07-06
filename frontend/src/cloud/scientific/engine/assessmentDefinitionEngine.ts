/**
 * Assessment Definition Engine — catalog-first read API over scientific definitions.
 *
 * Principles:
 * - Scientific Inside, Simple Outside
 * - Progressive Disclosure (beginner / professional / research modes)
 * - Catalog First — no hardcoded tests in UI
 */

import type { EvidenceTier, ScientificCategoryCode } from '../models/common';
import type { CatalogAssessmentDefinition } from '../models/catalog/AssessmentDefinition';
import type { ScientificCatalogRepository } from '../repositories/contracts/CatalogRepository';
import { getCatalogSeedIndex } from '../seed/catalogSeedIndex';

export interface AssessmentDefinitionSearchOptions {
  query?: string;
  categoryCode?: ScientificCategoryCode;
  evidenceTier?: EvidenceTier;
  tags?: string[];
  limit?: number;
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function matchesQuery(definition: CatalogAssessmentDefinition, query: string): boolean {
  const q = normalizeQuery(query);
  if (!q) return true;

  return (
    definition.key.includes(q) ||
    definition.subcategory.includes(q) ||
    definition.name.en.toLowerCase().includes(q) ||
    definition.name.ar.includes(q) ||
    definition.description.en.toLowerCase().includes(q) ||
    definition.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}

export class AssessmentDefinitionEngine {
  constructor(private readonly catalog: ScientificCatalogRepository) {}

  async listAssessmentDefinitions(): Promise<CatalogAssessmentDefinition[]> {
    return this.catalog.assessmentDefinitions.listAssessmentDefinitions();
  }

  async getAssessmentDefinitionByKey(
    key: string
  ): Promise<CatalogAssessmentDefinition | null> {
    return this.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(key);
  }

  async listAssessmentDefinitionsByCategory(
    categoryCode: ScientificCategoryCode
  ): Promise<CatalogAssessmentDefinition[]> {
    return this.catalog.assessmentDefinitions.listAssessmentDefinitionsByCategory(categoryCode);
  }

  async listAssessmentDefinitionsByEvidenceTier(
    tier: EvidenceTier
  ): Promise<CatalogAssessmentDefinition[]> {
    return this.catalog.assessmentDefinitions.listAssessmentDefinitionsByEvidenceTier(tier);
  }

  async searchAssessmentDefinitions(
    options: AssessmentDefinitionSearchOptions = {}
  ): Promise<CatalogAssessmentDefinition[]> {
    return this.catalog.assessmentDefinitions.searchAssessmentDefinitions(options);
  }
}

/** Seed-backed search for mock mode and Firestore-empty fallback. */
export function searchSeedAssessmentDefinitions(
  options: AssessmentDefinitionSearchOptions = {}
): CatalogAssessmentDefinition[] {
  const seed = getCatalogSeedIndex();
  let results = seed.listActiveDefinitions();

  if (options.categoryCode) {
    results = results.filter((d) => d.category_code === options.categoryCode);
  }
  if (options.evidenceTier) {
    results = results.filter((d) => d.evidence_tier === options.evidenceTier);
  }
  if (options.tags?.length) {
    results = results.filter((d) => options.tags!.every((tag) => d.tags.includes(tag)));
  }
  if (options.query) {
    results = results.filter((d) => matchesQuery(d, options.query!));
  }

  results.sort((a, b) => a.name.en.localeCompare(b.name.en));
  if (options.limit && options.limit > 0) {
    return results.slice(0, options.limit);
  }
  return results;
}

export function createAssessmentDefinitionEngine(
  catalog: ScientificCatalogRepository
): AssessmentDefinitionEngine {
  return new AssessmentDefinitionEngine(catalog);
}

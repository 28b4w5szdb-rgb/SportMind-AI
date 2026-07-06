/**
 * Shared assessment definition repository helpers — seed-backed reads.
 */

import type { EvidenceTier, ScientificCategoryCode } from '../../models/common';
import type {
  AssessmentProtocolVersion,
  CatalogAssessmentDefinition,
} from '../../models/catalog/AssessmentDefinition';
import type {
  AssessmentDefinitionSearchOptions,
  CatalogAssessmentDefinitionRepository,
} from '../../repositories/contracts/CatalogRepository';
import { searchSeedAssessmentDefinitions } from '../../engine/assessmentDefinitionEngine';
import type { CatalogSeedIndex } from '../../seed/catalogSeedIndex';

export function createSeedDefinitionRepository(
  seed: CatalogSeedIndex
): CatalogAssessmentDefinitionRepository {
  return {
    async getById(definitionId) {
      return seed.getDefinitionById(definitionId);
    },
    async getByKey(key) {
      return seed.getDefinitionByKey(key);
    },
    async listByCategory(categoryCode: ScientificCategoryCode) {
      return seed.listDefinitionsByCategory(categoryCode);
    },
    async listActive() {
      return seed.listActiveDefinitions();
    },
    async listAssessmentDefinitions() {
      return seed.listActiveDefinitions();
    },
    async getAssessmentDefinitionByKey(key) {
      return seed.getDefinitionByKey(key);
    },
    async listAssessmentDefinitionsByCategory(categoryCode) {
      return seed.listDefinitionsByCategory(categoryCode);
    },
    async listAssessmentDefinitionsByEvidenceTier(tier: EvidenceTier) {
      return seed.listDefinitionsByEvidenceTier(tier);
    },
    async searchAssessmentDefinitions(options: AssessmentDefinitionSearchOptions = {}) {
      return searchSeedAssessmentDefinitions(options);
    },
    async getProtocolVersion(definitionId, protocolVersionId) {
      return seed.getProtocolVersion(definitionId, protocolVersionId);
    },
    async listProtocolVersions(definitionId) {
      return seed.listProtocolVersions(definitionId);
    },
  };
}

export function mergeDefinitionLists(
  remote: CatalogAssessmentDefinition[],
  seed: CatalogAssessmentDefinition[]
): CatalogAssessmentDefinition[] {
  if (remote.length > 0) return remote;
  return seed;
}

export function mergeProtocolLists(
  remote: AssessmentProtocolVersion[],
  seed: AssessmentProtocolVersion[],
  definitionId: string,
  seedIndex: CatalogSeedIndex
): AssessmentProtocolVersion[] {
  if (remote.length > 0) return remote;
  return seedIndex.listProtocolVersions(definitionId);
}

/**
 * Custom definition repository overlay — merges org custom assessments with seed catalog.
 */

import type { CatalogAssessmentDefinitionRepository } from '../../repositories/contracts/CatalogRepository';
import {
  getCustomAssessmentBundle,
  getCustomAssessmentByDefinitionId,
  listCustomAssessmentBundles,
  mergeWithCustomDefinitions,
} from './customAssessmentRegistry';

export function createCustomAwareDefinitionRepository(
  seedRepo: CatalogAssessmentDefinitionRepository
): CatalogAssessmentDefinitionRepository {
  return {
    async getById(definitionId) {
      const custom = getCustomAssessmentByDefinitionId(definitionId);
      if (custom) return custom.definition;
      return seedRepo.getById(definitionId);
    },
    async getByKey(key) {
      const custom = getCustomAssessmentBundle(key);
      if (custom) return custom.definition;
      return seedRepo.getByKey(key);
    },
    async listByCategory(categoryCode) {
      const seed = await seedRepo.listByCategory(categoryCode);
      const custom = listCustomAssessmentBundles()
        .map((bundle) => bundle.definition)
        .filter((item) => item.category_code === categoryCode);
      return mergeWithCustomDefinitions([...seed, ...custom]);
    },
    async listActive() {
      return mergeWithCustomDefinitions(await seedRepo.listActive());
    },
    async listAssessmentDefinitions() {
      return mergeWithCustomDefinitions(await seedRepo.listAssessmentDefinitions());
    },
    async getAssessmentDefinitionByKey(key) {
      const custom = getCustomAssessmentBundle(key);
      if (custom) return custom.definition;
      return seedRepo.getAssessmentDefinitionByKey(key);
    },
    async listAssessmentDefinitionsByCategory(categoryCode) {
      const all = await this.listAssessmentDefinitions();
      return all.filter((item) => item.category_code === categoryCode);
    },
    async listAssessmentDefinitionsByEvidenceTier(tier) {
      const all = await this.listAssessmentDefinitions();
      return all.filter((item) => item.evidence_tier === tier);
    },
    async searchAssessmentDefinitions(options = {}) {
      let results = await seedRepo.searchAssessmentDefinitions(options);
      results = mergeWithCustomDefinitions(results);
      if (options.query) {
        const q = options.query.trim().toLowerCase();
        results = results.filter(
          (item) =>
            item.key.includes(q) ||
            item.name.en.toLowerCase().includes(q) ||
            item.name.ar.includes(q)
        );
      }
      if (options.categoryCode) {
        results = results.filter((item) => item.category_code === options.categoryCode);
      }
      if (options.evidenceTier) {
        results = results.filter((item) => item.evidence_tier === options.evidenceTier);
      }
      if (options.limit) {
        results = results.slice(0, options.limit);
      }
      return results;
    },
    async getProtocolVersion(definitionId, protocolVersionId) {
      const custom = getCustomAssessmentByDefinitionId(definitionId);
      if (custom && custom.definition.current_protocol_version_id === protocolVersionId) {
        return custom.protocol;
      }
      return seedRepo.getProtocolVersion(definitionId, protocolVersionId);
    },
    async listProtocolVersions(definitionId) {
      const custom = getCustomAssessmentByDefinitionId(definitionId);
      if (custom) return [custom.protocol];
      return seedRepo.listProtocolVersions(definitionId);
    },
  };
}

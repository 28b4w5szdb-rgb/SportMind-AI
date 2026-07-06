/**
 * Shared normative reference repository helpers — seed-backed reads.
 */

import type {
  CatalogNormativeReference,
  CatalogNormativeReferenceVersion,
  NormativeReferenceProfile,
} from '../../models/catalog/NormativeReference';
import type { CatalogNormativeReferenceRepository } from '../../repositories/contracts/CatalogRepository';
import { resolveNormativeProfile } from '../../seed/normativeReferenceBuilder';
import type { CatalogSeedIndex } from '../../seed/catalogSeedIndex';

export function createSeedNormativeRepository(
  seed: CatalogSeedIndex
): CatalogNormativeReferenceRepository {
  return {
    async getById(referenceId) {
      return seed.getNormativeReferenceById(referenceId);
    },
    async getByKey(key) {
      return seed.getNormativeReferenceByKey(key);
    },
    async getNormativeReferenceByKey(key) {
      return seed.getNormativeReferenceByKey(key);
    },
    async listNormativeReferences() {
      return seed.listActiveNormativeReferences();
    },
    async listReferencesForAssessment(assessmentDefinitionKey) {
      return seed.listNormativeReferencesForAssessment(assessmentDefinitionKey);
    },
    async listNormativeProfiles() {
      return seed.listNormativeProfiles();
    },
    async getVersion(referenceId, versionId) {
      return seed.getNormativeVersion(referenceId, versionId);
    },
    async listVersions(referenceId) {
      return seed.listNormativeVersions(referenceId);
    },
  };
}

export function mergeNormativeLists(
  remote: CatalogNormativeReference[],
  seed: CatalogNormativeReference[]
): CatalogNormativeReference[] {
  if (remote.length > 0) return remote;
  return seed;
}

export async function resolveProfilesFromReferences(
  references: CatalogNormativeReference[],
  loader: (reference: CatalogNormativeReference) => Promise<CatalogNormativeReferenceVersion | null>
): Promise<NormativeReferenceProfile[]> {
  const profiles: NormativeReferenceProfile[] = [];
  for (const reference of references) {
    const version = await loader(reference);
    if (version) profiles.push(resolveNormativeProfile(reference, version));
  }
  return profiles;
}

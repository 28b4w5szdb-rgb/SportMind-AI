/**
 * Normative reference catalog seed — priority placeholder profiles.
 */

import type {
  CatalogNormativeReference,
  CatalogNormativeReferenceVersion,
} from '../models/catalog/NormativeReference';
import { validateCatalogNormativeReference } from '../validation/scientificValidators';
import { buildNormativeReferenceFromSpec } from './normativeReferenceBuilder';
import { PRIORITY_NORMATIVE_SPECS } from './priorityNormativeSpecs';

function buildSeed(): {
  references: CatalogNormativeReference[];
  versions: CatalogNormativeReferenceVersion[];
} {
  const references: CatalogNormativeReference[] = [];
  const versions: CatalogNormativeReferenceVersion[] = [];

  for (const spec of PRIORITY_NORMATIVE_SPECS) {
    const built = buildNormativeReferenceFromSpec(spec);
    const validation = validateCatalogNormativeReference(built.reference, built.version);
    if (!validation.valid) {
      throw new Error(`Invalid normative reference ${spec.key}: ${validation.errors.join(', ')}`);
    }
    references.push(built.reference);
    versions.push(built.version);
  }

  return { references, versions };
}

const seed = buildSeed();

export const SEED_NORMATIVE_REFERENCES: CatalogNormativeReference[] = seed.references;
export const SEED_NORMATIVE_REFERENCE_VERSIONS: CatalogNormativeReferenceVersion[] = seed.versions;
export const NORMATIVE_REFERENCE_PROFILE_COUNT = SEED_NORMATIVE_REFERENCES.length;

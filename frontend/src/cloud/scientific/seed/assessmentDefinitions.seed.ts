/**
 * Assessment definition catalog seed — Performance Lab base + scientific audit additions.
 */

import { TEST_REGISTRY } from '@/src/features/performance-lab/registry/tests';

import type { CatalogAssessmentDefinition } from '../models/catalog/AssessmentDefinition';
import { validateCatalogAssessmentDefinition } from '../validation/scientificValidators';
import { ADDITIONAL_ASSESSMENT_SPECS } from './additionalAssessmentDefinitions';
import { buildFromCompactSpec, buildProtocolFromDefinition } from './definitionBuilder';
import { mapPerformanceLabTests } from './mappers/mapPerformanceLabTests';
import type { AssessmentProtocolVersion } from '../models/catalog/AssessmentDefinition';

const performanceLabSeed = mapPerformanceLabTests(TEST_REGISTRY);
const additionalDefinitions = ADDITIONAL_ASSESSMENT_SPECS.map(buildFromCompactSpec);
const additionalProtocols = additionalDefinitions.map(buildProtocolFromDefinition);

function assertValidDefinitions(definitions: CatalogAssessmentDefinition[]): void {
  for (const definition of definitions) {
    const result = validateCatalogAssessmentDefinition(definition);
    if (!result.valid) {
      throw new Error(`Invalid assessment definition ${definition.key}: ${result.errors.join(', ')}`);
    }
  }
}

const mergedDefinitions = [...performanceLabSeed.definitions, ...additionalDefinitions];
const mergedProtocols = [...performanceLabSeed.protocols, ...additionalProtocols];

assertValidDefinitions(mergedDefinitions);

export const SEED_ASSESSMENT_DEFINITIONS: CatalogAssessmentDefinition[] = mergedDefinitions;
export const SEED_ASSESSMENT_PROTOCOL_VERSIONS: AssessmentProtocolVersion[] = mergedProtocols;

export const ASSESSMENT_DEFINITION_COUNT = SEED_ASSESSMENT_DEFINITIONS.length;

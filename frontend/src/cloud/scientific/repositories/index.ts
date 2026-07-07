export type * from './contracts';
export {
  getScientificRepositoryRegistry,
  resetScientificRepositoryRegistry,
  createAssessmentSessionEngineFromRegistry,
  createAssessmentDefinitionEngineFromRegistry,
  createNormativeReferenceEngineFromRegistry,
  createScientificCalculationEngineFromRegistry,
  createSsidInterpretationEngineFromRegistry,
  createScientificPersistenceGatewayFromRegistry,
} from './registry';
export type { ScientificRepositoryRegistry } from './registry';

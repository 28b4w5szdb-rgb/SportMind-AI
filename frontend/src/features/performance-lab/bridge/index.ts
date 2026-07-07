export {
  previewPerformanceLabAssessment,
  recordPerformanceLabAssessment,
  resetPerformanceLabBridgeEngines,
} from './performanceLabBridge';
export {
  mapDemographicToNormativeContext,
  mapNormativeBandToPerformanceLevel,
  mapSessionToBridgeResult,
  mapToCreateSessionInput,
} from './bridgeMappers';
export type { PerformanceLabBridgeResult, PerformanceLabRecordInput } from './bridgeMappers';
export { toFriendlyBridgeError, isScientificValidationError } from './bridgeErrors';
export {
  getCachedCatalogDefinition,
  warmCatalogCache,
  resetScientificCatalogCache,
} from './scientificCatalogCache';
export { useScientificTestPreview } from './useScientificTestPreview';
export type { ScientificTestPreview } from './useScientificTestPreview';
export { PERFORMANCE_LAB_CONDUCTED_BY, PERFORMANCE_LAB_MOCK_ORG_ID } from './constants';

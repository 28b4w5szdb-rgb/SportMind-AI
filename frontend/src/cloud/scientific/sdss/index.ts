/**
 * SSDI v1 — Scientific Decision Support System (Phase 9.0–9.1).
 */

export * from './models/SdssRecommendation';
export * from './models/DecisionContext';
export * from './models/Governance';
export { buildDecisionContext } from './context/decisionContextBuilder';
export { collectEvidenceSummary, evidenceSummaryText } from './context/evidenceCollector';
export { buildSdssPrompt, SDSS_PROMPT_VERSION } from './prompt/promptBuilder';
export type { AiProvider, AiProviderId, AiProviderRequest, AiProviderResponse } from './providers/aiProviderContract';
export { MockAiProvider, getMockAiProvider } from './providers/mockAiProvider';
export { runSdssPipeline } from './engine/sdssEngine';
export type { SdssRequest, SdssResponse } from './engine/sdssEngine';
export { buildRecommendationsFromContext } from './engine/recommendationBuilder';
export { validateRecommendationBundle, validateRecommendation } from './validation/responseValidator';
export {
  validateRecommendationCompleteness,
  validateRecommendations,
} from './validation/recommendationValidationEngine';
export { checkRecommendationConsistency, checkRecommendationsConsistency } from './consistency/consistencyEngine';
export { runGovernancePipeline, applyGovernanceToBundle } from './governance/governancePipeline';
export { assignGovernanceDecision } from './governance/governanceEngine';
export { runHallucinationGuard } from './governance/hallucinationGuard';
export { calibrateConfidence } from './governance/confidenceCalibration';
export { buildExplainabilityReport } from './governance/explainabilityReport';
export { buildAuditRecord } from './audit/auditRecordBuilder';
export {
  RuleValidatorProvider,
  ClinicalValidatorProvider,
  ResearchValidatorProvider,
  ExternalValidatorProvider,
  getDefaultValidatorProviders,
} from './validators/validatorContract';
export type { ValidatorProvider, ValidatorProviderResult } from './validators/validatorContract';
export { ValidationMetricsCollector } from './metrics/validationMetrics';
export { globalSafetyDisclaimer, checkQuerySafety } from './safety/safetyLayer';

/**
 * SSDI v1 — Scientific Decision Support System (Phase 9.0–9.1).
 */

export * from './models/SdssRecommendation';
export * from './models/DecisionContext';
export * from './models/Governance';
export { buildDecisionContext } from './context/decisionContextBuilder';
export { collectEvidenceSummary, evidenceSummaryText } from './context/evidenceCollector';
export { buildSdssPrompt, SDSS_PROMPT_VERSION } from './prompt/promptBuilder';
export type { AiProvider, AiProviderId, AiProviderRequest, AiProviderResponse, AiProviderExecutionMetadata } from './providers/aiProviderContract';
export { MockAiProvider, getMockAiProvider } from './providers/mockAiProvider';
export { OpenAiProvider } from './providers/OpenAiProvider';
export { AzureOpenAiProvider } from './providers/AzureOpenAiProvider';
export { ProviderRegistry, getProviderRegistry, resetProviderRegistry } from './providers/ProviderRegistry';
export { executeProviderRequest, resetProviderFactoryState } from './providers/ProviderFactory';
export type { ProviderExecutionResult, ProviderExecutionScope } from './providers/ProviderFactory';
export { loadProviderConfiguration, isOpenAiConfigured, isAzureOpenAiConfigured } from './providers/ProviderConfiguration';
export type { ProviderConfiguration, SdssProviderMode } from './providers/ProviderConfiguration';
export { getProviderTelemetry, resetProviderTelemetry } from './providers/ProviderTelemetry';
export type { ProviderTelemetrySnapshot, ProviderTelemetryEvent } from './providers/ProviderTelemetry';
export { getProviderHealthMonitor, resetProviderHealthMonitor } from './providers/ProviderHealth';
export type { ProviderHealthRecord, ProviderHealthStatus } from './providers/ProviderHealth';
export { getProviderCostTracker, estimateCost, resetProviderCostTracker } from './providers/ProviderCostTracker';
export type { CostEstimate, CostUsageSnapshot } from './providers/ProviderCostTracker';
export { getProviderRateLimiter, resetProviderRateLimiter } from './providers/ProviderRateLimiter';
export { withRetryPolicy, isRetryableError, classifyProviderError } from './providers/ProviderRetryPolicy';
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
export * from './privacy/privacyModels';
export { buildSafePromptPipeline } from './privacy/safePromptBuilder';
export { createRedactionSession, redactUserQuery, redactDecisionContextForOutbound } from './privacy/piiRedactionEngine';
export { validatePromptSafety, validateUserQuerySafety } from './privacy/promptSafetyEngine';
export { buildPromptContractPayload, validatePromptContract } from './privacy/promptContract';
export { buildPromptFingerprint, computeFingerprintHash } from './privacy/promptFingerprint';

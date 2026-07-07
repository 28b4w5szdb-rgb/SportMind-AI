/**
 * SSDI v1 — Scientific Decision Support System (Phase 9.0).
 */

export * from './models/SdssRecommendation';
export * from './models/DecisionContext';
export { buildDecisionContext } from './context/decisionContextBuilder';
export { collectEvidenceSummary, evidenceSummaryText } from './context/evidenceCollector';
export { buildSdssPrompt, SDSS_PROMPT_VERSION } from './prompt/promptBuilder';
export type { AiProvider, AiProviderId, AiProviderRequest, AiProviderResponse } from './providers/aiProviderContract';
export { MockAiProvider, getMockAiProvider } from './providers/mockAiProvider';
export { runSdssPipeline } from './engine/sdssEngine';
export type { SdssRequest, SdssResponse } from './engine/sdssEngine';
export { buildRecommendationsFromContext } from './engine/recommendationBuilder';
export { validateRecommendationBundle } from './validation/responseValidator';
export { globalSafetyDisclaimer, checkQuerySafety } from './safety/safetyLayer';

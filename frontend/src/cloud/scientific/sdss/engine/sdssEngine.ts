/**
 * SSDI Engine — orchestrates Scientific Core → Decision Support pipeline (Phase 9.0–9.2).
 *
 * Pipeline: Decision Context → PII Redaction → Prompt Safety → Safe Prompt → Provider → Governance → Audit
 */

import { buildDecisionContext } from '../context/decisionContextBuilder';
import type { BuildDecisionContextInput } from '../models/DecisionContext';
import type { AiProvider, AiProviderResponse } from '../providers/aiProviderContract';
import { getMockAiProvider } from '../providers/mockAiProvider';
import type { SdssRecommendationBundle } from '../models/SdssRecommendation';
import type { GovernancePipelineResult, RecommendationAuditRecord, ValidationMetricsSnapshot } from '../models/Governance';
import { applyGovernanceToBundle, runGovernancePipeline } from '../governance/governancePipeline';
import { SDSS_VERSION } from '../models/SdssRecommendation';
import { buildSafePromptPipeline } from '../privacy/safePromptBuilder';
import type { SafePromptBundle } from '../privacy/privacyModels';

export interface SdssRequest {
  contextInput: BuildDecisionContextInput;
  userQuery: string;
  provider?: AiProvider;
}

export interface SdssResponse {
  context_id: string;
  prompt_version: string;
  provider_id: string;
  model_version: string;
  bundle: SdssRecommendationBundle;
  raw_text: string;
  latency_ms: number;
  governance: GovernancePipelineResult;
  audit_records: RecommendationAuditRecord[];
  metrics: ValidationMetricsSnapshot;
  safe_prompt: SafePromptBundle;
  outbound_safe: boolean;
}

/** Run full SSDI pipeline — privacy layer before provider; governance validates before delivery. */
export async function runSdssPipeline(request: SdssRequest): Promise<SdssResponse> {
  const context = buildDecisionContext(request.contextInput);
  const safePipeline = buildSafePromptPipeline(context, request.userQuery);
  const provider = request.provider ?? getMockAiProvider();

  const result: AiProviderResponse = await provider.generate({
    prompt: safePipeline.prompt,
    context,
    user_query: request.userQuery,
  });

  const governed = runGovernancePipeline({
    bundle: result.recommendations,
    context,
    modelVersion: SDSS_VERSION,
    promptVersion: safePipeline.prompt.prompt_version,
  });

  const validatedBundle = applyGovernanceToBundle(result.recommendations, governed);

  return {
    context_id: context.context_id,
    prompt_version: safePipeline.prompt.prompt_version,
    provider_id: result.provider_id,
    model_version: SDSS_VERSION,
    bundle: validatedBundle,
    raw_text: result.raw_text,
    latency_ms: result.latency_ms,
    governance: governed,
    audit_records: governed.audit_records,
    metrics: governed.metrics,
    safe_prompt: safePipeline.prompt,
    outbound_safe: safePipeline.prompt.outbound_safe,
  };
}

export { buildDecisionContext, getMockAiProvider };
export { buildSafePromptPipeline } from '../privacy/safePromptBuilder';

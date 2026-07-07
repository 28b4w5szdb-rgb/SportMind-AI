/**
 * SSDI Engine — orchestrates Scientific Core → Decision Support pipeline (Phase 9.0–9.1).
 *
 * Pipeline: Decision Context → Evidence → Prompt → Provider → Validation → Consistency → Governance → Audit
 */

import { buildDecisionContext } from '../context/decisionContextBuilder';
import type { BuildDecisionContextInput } from '../models/DecisionContext';
import { buildSdssPrompt } from '../prompt/promptBuilder';
import type { AiProvider, AiProviderResponse } from '../providers/aiProviderContract';
import { getMockAiProvider } from '../providers/mockAiProvider';
import type { SdssRecommendationBundle } from '../models/SdssRecommendation';
import type { GovernancePipelineResult, RecommendationAuditRecord, ValidationMetricsSnapshot } from '../models/Governance';
import { applyGovernanceToBundle, runGovernancePipeline } from '../governance/governancePipeline';
import { SDSS_VERSION } from '../models/SdssRecommendation';

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
}

/** Run full SSDI pipeline — mock provider by default; governance validates before delivery. */
export async function runSdssPipeline(request: SdssRequest): Promise<SdssResponse> {
  const context = buildDecisionContext(request.contextInput);
  const prompt = buildSdssPrompt(context, request.userQuery);
  const provider = request.provider ?? getMockAiProvider();

  const result: AiProviderResponse = await provider.generate({
    prompt,
    context,
    user_query: request.userQuery,
  });

  const governed = runGovernancePipeline({
    bundle: result.recommendations,
    context,
    modelVersion: SDSS_VERSION,
    promptVersion: prompt.prompt_version,
  });

  const validatedBundle = applyGovernanceToBundle(result.recommendations, governed);

  return {
    context_id: context.context_id,
    prompt_version: prompt.prompt_version,
    provider_id: result.provider_id,
    model_version: SDSS_VERSION,
    bundle: validatedBundle,
    raw_text: result.raw_text,
    latency_ms: result.latency_ms,
    governance: governed,
    audit_records: governed.audit_records,
    metrics: governed.metrics,
  };
}

export { buildDecisionContext, buildSdssPrompt, getMockAiProvider };

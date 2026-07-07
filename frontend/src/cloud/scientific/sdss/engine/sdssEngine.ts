/**
 * SSDI Engine — orchestrates Scientific Core → Decision Support pipeline (Phase 9.0).
 *
 * Pipeline: Decision Context → Evidence → Prompt → Provider → Validator → Recommendations
 */

import { buildDecisionContext } from '../context/decisionContextBuilder';
import type { BuildDecisionContextInput } from '../models/DecisionContext';
import { buildSdssPrompt } from '../prompt/promptBuilder';
import type { AiProvider, AiProviderResponse } from '../providers/aiProviderContract';
import { getMockAiProvider } from '../providers/mockAiProvider';
import type { SdssRecommendationBundle } from '../models/SdssRecommendation';

export interface SdssRequest {
  contextInput: BuildDecisionContextInput;
  userQuery: string;
  provider?: AiProvider;
}

export interface SdssResponse {
  context_id: string;
  prompt_version: string;
  provider_id: string;
  bundle: SdssRecommendationBundle;
  raw_text: string;
  latency_ms: number;
}

/** Run full SSDI pipeline — mock provider by default. */
export async function runSdssPipeline(request: SdssRequest): Promise<SdssResponse> {
  const context = buildDecisionContext(request.contextInput);
  const prompt = buildSdssPrompt(context, request.userQuery);
  const provider = request.provider ?? getMockAiProvider();

  const result: AiProviderResponse = await provider.generate({
    prompt,
    context,
    user_query: request.userQuery,
  });

  return {
    context_id: context.context_id,
    prompt_version: prompt.prompt_version,
    provider_id: result.provider_id,
    bundle: result.recommendations,
    raw_text: result.raw_text,
    latency_ms: result.latency_ms,
  };
}

export { buildDecisionContext, buildSdssPrompt, getMockAiProvider };

/**
 * AI provider contract — abstraction for OpenAI, Azure, local LLM, mock (Phase 9.0).
 * No live API calls in Phase 9.0.
 */

import type { SdssPromptBundle } from '../prompt/promptBuilder';
import type { SdssRecommendationBundle } from '../models/SdssRecommendation';
import type { SdssDecisionContext } from '../models/DecisionContext';

export type AiProviderId = 'mock' | 'openai' | 'azure_openai' | 'local_llm';

export interface AiProviderRequest {
  prompt: SdssPromptBundle;
  context: SdssDecisionContext;
  user_query: string;
}

export interface AiProviderResponse {
  provider_id: AiProviderId;
  raw_text: string;
  recommendations: SdssRecommendationBundle;
  latency_ms: number;
}

export interface AiProvider {
  readonly id: AiProviderId;
  isAvailable(): boolean;
  generate(request: AiProviderRequest): Promise<AiProviderResponse>;
}

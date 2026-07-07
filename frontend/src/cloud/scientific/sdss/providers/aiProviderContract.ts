/**
 * AI provider contract — abstraction for OpenAI, Azure, local LLM, mock (Phase 9.0).
 * No live API calls in Phase 9.0.
 */

import type { SafePromptBundle } from '../privacy/privacyModels';
import type { SdssRecommendationBundle } from '../models/SdssRecommendation';
import type { SdssDecisionContext } from '../models/DecisionContext';

export type AiProviderId = 'mock' | 'openai' | 'azure_openai' | 'local_llm';

export interface AiProviderExecutionMetadata {
  input_tokens?: number;
  output_tokens?: number;
  total_tokens?: number;
  estimated_cost_usd?: number;
  retry_count?: number;
  failover_from?: AiProviderId | null;
}

export interface AiProviderRequest {
  prompt: SafePromptBundle;
  context: SdssDecisionContext;
  user_query: string;
}

export interface AiProviderResponse {
  provider_id: AiProviderId;
  raw_text: string;
  recommendations: SdssRecommendationBundle;
  latency_ms: number;
  metadata?: AiProviderExecutionMetadata;
}

export interface AiProvider {
  readonly id: AiProviderId;
  isAvailable(): boolean;
  generate(request: AiProviderRequest): Promise<AiProviderResponse>;
}

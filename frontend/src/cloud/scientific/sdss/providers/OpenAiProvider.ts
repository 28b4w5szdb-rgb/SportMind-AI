/**
 * OpenAI Provider — SafePromptBundle-only external LLM integration (Phase 9.3).
 */

import type { AiProvider, AiProviderRequest, AiProviderResponse } from './aiProviderContract';
import { assertSafePromptOnly, callChatCompletion, type HttpFetcher } from './sharedLlmClient';
import { parseLlmResponseToBundle } from './llmResponseParser';
import { ProviderExecutionError } from './ProviderRetryPolicy';
import type { ProviderConfiguration } from './ProviderConfiguration';
import { loadProviderConfiguration, isOpenAiConfigured } from './ProviderConfiguration';

export interface OpenAiProviderOptions {
  config?: ProviderConfiguration;
  fetchImpl?: HttpFetcher;
}

export class OpenAiProvider implements AiProvider {
  readonly id = 'openai' as const;
  private readonly config: ProviderConfiguration;
  private readonly fetchImpl: HttpFetcher;

  constructor(options: OpenAiProviderOptions = {}) {
    this.config = options.config ?? loadProviderConfiguration();
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  isAvailable(): boolean {
    return isOpenAiConfigured(this.config);
  }

  async generate(request: AiProviderRequest): Promise<AiProviderResponse> {
    const start = Date.now();
    assertSafePromptOnly(request.prompt);

    if (!this.isAvailable()) {
      throw new ProviderExecutionError('OpenAI API key not configured', 'permanent', this.id);
    }

    const { openai } = this.config;
    const url = `${openai.base_url.replace(/\/$/, '')}/chat/completions`;

    try {
      const completion = await callChatCompletion(
        {
          url,
          apiKey: openai.api_key,
          model: openai.model,
          prompt: request.prompt,
          timeoutMs: openai.timeout_ms,
        },
        this.fetchImpl
      );

      const bundle = parseLlmResponseToBundle(completion.content, request.context, this.id);

      return {
        provider_id: this.id,
        raw_text: completion.content,
        recommendations: bundle,
        latency_ms: Date.now() - start,
        metadata: {
          input_tokens: completion.input_tokens,
          output_tokens: completion.output_tokens,
          total_tokens: completion.input_tokens + completion.output_tokens,
        },
      };
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.startsWith('validation:')) {
        throw new ProviderExecutionError(msg, 'validation', this.id);
      }
      if (msg.startsWith('safety:') || msg.startsWith('privacy:')) {
        throw new ProviderExecutionError(msg, 'safety', this.id);
      }
      throw error;
    }
  }
}

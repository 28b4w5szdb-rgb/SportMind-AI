/**
 * Azure OpenAI Provider — SafePromptBundle-only integration (Phase 9.3).
 */

import type { AiProvider, AiProviderRequest, AiProviderResponse } from './aiProviderContract';
import { assertSafePromptOnly, callChatCompletion, type HttpFetcher } from './sharedLlmClient';
import { parseLlmResponseToBundle } from './llmResponseParser';
import { ProviderExecutionError } from './ProviderRetryPolicy';
import type { ProviderConfiguration } from './ProviderConfiguration';
import { loadProviderConfiguration, isAzureOpenAiConfigured } from './ProviderConfiguration';

export interface AzureOpenAiProviderOptions {
  config?: ProviderConfiguration;
  fetchImpl?: HttpFetcher;
}

export class AzureOpenAiProvider implements AiProvider {
  readonly id = 'azure_openai' as const;
  private readonly config: ProviderConfiguration;
  private readonly fetchImpl: HttpFetcher;

  constructor(options: AzureOpenAiProviderOptions = {}) {
    this.config = options.config ?? loadProviderConfiguration();
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  isAvailable(): boolean {
    return isAzureOpenAiConfigured(this.config);
  }

  async generate(request: AiProviderRequest): Promise<AiProviderResponse> {
    const start = Date.now();
    assertSafePromptOnly(request.prompt);

    if (!this.isAvailable()) {
      throw new ProviderExecutionError('Azure OpenAI not configured', 'permanent', this.id);
    }

    const { azure_openai: azure } = this.config;
    const base = azure.endpoint.replace(/\/$/, '');
    const url = `${base}/openai/deployments/${azure.deployment}/chat/completions?api-version=${azure.api_version}`;

    try {
      const completion = await callChatCompletion(
        {
          url,
          apiKey: azure.api_key,
          model: azure.deployment,
          prompt: request.prompt,
          timeoutMs: azure.timeout_ms,
          extraHeaders: { 'api-key': azure.api_key },
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

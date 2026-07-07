/**
 * Shared LLM HTTP utilities for OpenAI-compatible APIs (Phase 9.3).
 */

import type { SafePromptBundle } from '../privacy/privacyModels';

export type HttpFetcher = typeof fetch;

export interface ChatCompletionResult {
  content: string;
  input_tokens: number;
  output_tokens: number;
}

export interface ChatCompletionRequest {
  url: string;
  apiKey: string;
  model: string;
  prompt: SafePromptBundle;
  timeoutMs: number;
  extraHeaders?: Record<string, string>;
}

export async function callChatCompletion(
  req: ChatCompletionRequest,
  fetchImpl: HttpFetcher = fetch
): Promise<ChatCompletionResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), req.timeoutMs);

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...req.extraHeaders,
    };
    if (!headers['api-key'] && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${req.apiKey}`;
    }

    const response = await fetchImpl(req.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: req.model,
        messages: [
          { role: 'system', content: req.prompt.system_prompt },
          { role: 'user', content: req.prompt.user_prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      if (response.status === 429) {
        throw new Error(`rate_limit: ${response.status} ${body}`);
      }
      if (response.status >= 500) {
        throw new Error(`server_error: ${response.status} ${body}`);
      }
      throw new Error(`api_error: ${response.status} ${body}`);
    }

    const json = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
    };

    const content = json.choices?.[0]?.message?.content ?? '';
    return {
      content,
      input_tokens: json.usage?.prompt_tokens ?? Math.ceil(req.prompt.user_prompt.length / 4),
      output_tokens: json.usage?.completion_tokens ?? Math.ceil(content.length / 4),
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('timeout: request exceeded timeout');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/** Assert only SafePromptBundle fields are used — never raw decision context. */
export function assertSafePromptOnly(prompt: SafePromptBundle): void {
  if (!prompt.outbound_safe) {
    throw new Error('safety: outbound_safe is false — external provider call aborted');
  }
  if (!prompt.contract_payload) {
    throw new Error('privacy: missing contract_payload');
  }
  if (!prompt.fingerprint?.fingerprint_hash) {
    throw new Error('privacy: missing prompt fingerprint');
  }
}

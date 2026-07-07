/**
 * Provider Retry Policy — exponential backoff for transient failures (Phase 9.3).
 */

import type { ProviderRetryConfig } from './ProviderConfiguration';

export type ProviderErrorClass = 'transient' | 'validation' | 'safety' | 'rate_limit' | 'permanent';

export class ProviderExecutionError extends Error {
  constructor(
    message: string,
    readonly errorClass: ProviderErrorClass,
    readonly providerId?: string
  ) {
    super(message);
    this.name = 'ProviderExecutionError';
  }
}

export function classifyProviderError(error: unknown): ProviderErrorClass {
  if (error instanceof ProviderExecutionError) return error.errorClass;
  const msg = error instanceof Error ? error.message : String(error);
  if (/validation|invalid|parse|schema/i.test(msg)) return 'validation';
  if (/safety|outbound_safe|privacy|governance/i.test(msg)) return 'safety';
  if (/rate.?limit|429|rpm|rph|budget/i.test(msg)) return 'rate_limit';
  if (/timeout|503|502|504|network|fetch failed|ECONNRESET/i.test(msg)) return 'transient';
  return 'permanent';
}

export function isRetryableError(error: unknown): boolean {
  const cls = classifyProviderError(error);
  return cls === 'transient';
}

export function computeRetryDelay(attempt: number, config: ProviderRetryConfig): number {
  const delay = config.initial_delay_ms * Math.pow(config.backoff_multiplier, attempt);
  return Math.min(delay, config.max_delay_ms);
}

export async function withRetryPolicy<T>(
  fn: () => Promise<T>,
  config: ProviderRetryConfig,
  onRetry?: (attempt: number, error: unknown) => void
): Promise<{ result: T; retry_count: number }> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= config.max_retries; attempt++) {
    try {
      const result = await fn();
      return { result, retry_count: attempt };
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || attempt >= config.max_retries) break;
      onRetry?.(attempt + 1, error);
      await sleep(computeRetryDelay(attempt, config));
    }
  }
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

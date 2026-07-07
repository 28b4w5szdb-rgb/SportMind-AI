/**
 * Provider Factory — failover, safety gates, retry, telemetry (Phase 9.3).
 */

import type { AiProvider, AiProviderRequest, AiProviderResponse } from './aiProviderContract';
import { getMockAiProvider } from './mockAiProvider';
import { loadProviderConfiguration, type ProviderConfiguration } from './ProviderConfiguration';
import { getProviderCostTracker } from './ProviderCostTracker';
import { getProviderHealthMonitor } from './ProviderHealth';
import { getProviderRateLimiter, type RateLimitScope } from './ProviderRateLimiter';
import {
  classifyProviderError,
  ProviderExecutionError,
  withRetryPolicy,
} from './ProviderRetryPolicy';
import { getProviderRegistry, resetProviderRegistry, type ProviderRegistry } from './ProviderRegistry';
import { getProviderTelemetry, resetProviderTelemetry } from './ProviderTelemetry';
import { resetProviderRateLimiter } from './ProviderRateLimiter';
import { resetProviderCostTracker } from './ProviderCostTracker';
import { resetProviderHealthMonitor } from './ProviderHealth';
import { validatePromptContract } from '../privacy/promptContract';

export interface ProviderExecutionScope extends RateLimitScope {
  organization_id?: string;
  user_id?: string;
}

export interface ProviderExecutionResult extends AiProviderResponse {
  failover_from?: AiProvider['id'] | null;
  retry_count: number;
}

function assertPreProviderSafety(request: AiProviderRequest): void {
  if (!request.prompt.outbound_safe) {
    throw new ProviderExecutionError('safety: outbound_safe is false', 'safety');
  }
  if (!request.prompt.safety?.safe) {
    throw new ProviderExecutionError('safety: prompt safety validation failed', 'safety');
  }
  const contractCheck = validatePromptContract(request.prompt.contract_payload);
  if (!contractCheck.valid) {
    throw new ProviderExecutionError(`privacy: contract invalid — ${contractCheck.violations.join(',')}`, 'safety');
  }
}

/** Execute provider request with safety gates, rate limits, retry, failover, and telemetry. */
export async function executeProviderRequest(
  request: AiProviderRequest,
  scope: ProviderExecutionScope = {},
  deps: {
    config?: ProviderConfiguration;
    registry?: ProviderRegistry;
  } = {}
): Promise<ProviderExecutionResult> {
  const config = deps.config ?? loadProviderConfiguration();
  const registry = deps.registry ?? getProviderRegistry({ config });
  const telemetry = getProviderTelemetry();
  const health = getProviderHealthMonitor();
  const rateLimiter = getProviderRateLimiter(config.rate_limits);
  const costTracker = getProviderCostTracker(config.cost_rates);

  try {
    assertPreProviderSafety(request);
  } catch (error) {
    telemetry.record({
      provider_id: 'mock',
      latency_ms: 0,
      input_tokens: 0,
      output_tokens: 0,
      success: false,
      retry_count: 0,
      error_class: classifyProviderError(error),
      validation_failures: 0,
      safety_blocks: 1,
      governance_rejections: 0,
    });
    return executeMockFallback(request, 0, null);
  }

  const rateCheck = rateLimiter.check(scope);
  if (!rateCheck.allowed) {
    throw new ProviderExecutionError(`rate_limit: ${rateCheck.reason}`, 'rate_limit');
  }

  const providers = registry.resolveOrdered(config);
  const externalProviders = providers.filter((p) => p.id !== 'mock');
  let lastError: unknown;
  let failoverFrom: AiProvider['id'] | null = null;

  for (const provider of externalProviders) {
    if (!health.isHealthy(provider.id)) continue;

    try {
      const { result, retry_count } = await withRetryPolicy(
        () => provider.generate(request),
        config.retry
      );

      const inputText = `${request.prompt.system_prompt}\n${request.prompt.user_prompt}`;
      const cost = costTracker.record(
        provider.id,
        inputText,
        result.raw_text,
        scope.organization_id
      );
      rateLimiter.recordRequest(scope, cost.total_tokens);
      health.recordSuccess(provider.id, result.latency_ms);

      telemetry.record({
        provider_id: provider.id,
        latency_ms: result.latency_ms,
        input_tokens: result.metadata?.input_tokens ?? cost.input_tokens,
        output_tokens: result.metadata?.output_tokens ?? cost.output_tokens,
        success: true,
        retry_count,
        validation_failures: 0,
        safety_blocks: 0,
        governance_rejections: 0,
        failover_from: failoverFrom,
      });

      return {
        ...result,
        metadata: {
          ...result.metadata,
          input_tokens: cost.input_tokens,
          output_tokens: cost.output_tokens,
          estimated_cost_usd: cost.estimated_usd,
          retry_count,
          failover_from: failoverFrom,
        },
        failover_from: failoverFrom,
        retry_count,
      };
    } catch (error) {
      lastError = error;
      const timedOut = error instanceof Error && /timeout/i.test(error.message);
      health.recordFailure(provider.id, timedOut);
      failoverFrom = provider.id;

      if (classifyProviderError(error) === 'validation' || classifyProviderError(error) === 'safety') {
        telemetry.record({
          provider_id: provider.id,
          latency_ms: 0,
          input_tokens: 0,
          output_tokens: 0,
          success: false,
          retry_count: 0,
          error_class: classifyProviderError(error),
          validation_failures: classifyProviderError(error) === 'validation' ? 1 : 0,
          safety_blocks: classifyProviderError(error) === 'safety' ? 1 : 0,
          governance_rejections: 0,
          failover_from: null,
        });
        break;
      }
    }
  }

  telemetry.record({
    provider_id: 'mock',
    latency_ms: 0,
    input_tokens: 0,
    output_tokens: 0,
    success: true,
    retry_count: 0,
    error_class: lastError ? classifyProviderError(lastError) : undefined,
    validation_failures: 0,
    safety_blocks: 0,
    governance_rejections: 0,
    failover_from: failoverFrom,
  });

  return executeMockFallback(request, 0, failoverFrom);
}

async function executeMockFallback(
  request: AiProviderRequest,
  retryCount: number,
  failoverFrom: AiProvider['id'] | null
): Promise<ProviderExecutionResult> {
  const mock = getMockAiProvider();
  const result = await mock.generate(request);
  return {
    ...result,
    failover_from: failoverFrom,
    retry_count: retryCount,
    metadata: {
      retry_count: retryCount,
      failover_from: failoverFrom,
    },
  };
}

export function resetProviderFactoryState(): void {
  resetProviderRegistry();
  resetProviderRateLimiter();
  resetProviderCostTracker();
  resetProviderTelemetry();
  resetProviderHealthMonitor();
}

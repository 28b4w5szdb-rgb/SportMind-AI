/**
 * Provider integration tests (Phase 9.3).
 */

import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';

import { buildDecisionContext } from '../../context/decisionContextBuilder';
import { buildSafePromptPipeline } from '../../privacy/safePromptBuilder';
import { OpenAiProvider } from '../OpenAiProvider';
import { AzureOpenAiProvider } from '../AzureOpenAiProvider';
import { ProviderRegistry } from '../ProviderRegistry';
import { executeProviderRequest, resetProviderFactoryState } from '../ProviderFactory';
import type { ProviderConfiguration } from '../ProviderConfiguration';
import type { BuildDecisionContextInput } from '../../models/DecisionContext';
import type { HttpFetcher } from '../sharedLlmClient';

function testConfig(overrides: Partial<ProviderConfiguration> = {}): ProviderConfiguration {
  return {
    mode: 'auto',
    openai: {
      api_key: 'test-openai-key',
      model: 'gpt-4o-mini',
      base_url: 'https://api.openai.com/v1',
      timeout_ms: 5000,
    },
    azure_openai: {
      api_key: 'test-azure-key',
      endpoint: 'https://test.openai.azure.com',
      deployment: 'gpt-4o',
      api_version: '2024-02-15-preview',
      timeout_ms: 5000,
    },
    local_llm: { base_url: 'http://localhost:11434/v1', model: 'llama3' },
    priority: ['openai', 'azure_openai', 'mock'],
    rate_limits: {
      requests_per_minute: 100,
      requests_per_hour: 1000,
      daily_token_budget: 1_000_000,
      organization_daily_token_budget: 1_000_000,
      user_daily_token_budget: 100_000,
    },
    retry: { max_retries: 2, initial_delay_ms: 10, max_delay_ms: 50, backoff_multiplier: 2 },
    cost_rates: { input_usd_per_1m_tokens: 0.15, output_usd_per_1m_tokens: 0.6 },
    ...overrides,
  };
}

function minimalInput(): BuildDecisionContextInput {
  return {
    organizationId: 'org_test',
    athleteId: 'athlete_1',
    athleteDisplayName: 'Test Athlete',
    viewerRole: 'coach',
    locale: 'en',
    analytics: {
      overall: { score: 78, maxScore: 100, percentileLabel: 'good', color: '#10B981', trend: 'stable', trendDelta: 0, modules: [] },
      decision: { level: 'ready_to_train', titleKey: 'a', bodyKey: 'b', color: '#10B981', confidence: 80 },
      kpis: [],
      recommendations: [],
      trends: [],
      benchmarks: [],
      strengths: [],
      weaknesses: [],
      radarAxes: [],
    },
    recovery: { recovery_score: 70, fatigue: 30, sleep_hours: 7, hrv: 50 },
    trainingLoad: { acwr: 1.0, compliance_percent: 90, completed_sessions: 5 },
  };
}

const validLlmJson = JSON.stringify({
  recommendations: [
    {
      id: 'rec_1',
      category: 'readiness',
      title: 'Maintain training readiness',
      summary: 'Athlete is ready to train.',
      scientific_reasoning: 'Based on analytics decision level.',
      recommended_action: 'Proceed with planned session.',
      priority: 'medium',
      confidence: 'high',
      affected_metrics: ['readiness'],
      limitations: ['No lab panel'],
      why: 'Decision level is ready_to_train.',
      evidence_used: ['analytics'],
      evidence_missing: ['laboratory'],
    },
  ],
});

function mockFetch(responseBody: unknown, status = 200): HttpFetcher {
  return async () =>
    ({
      ok: status >= 200 && status < 300,
      status,
      text: async () => JSON.stringify(responseBody),
      json: async () => responseBody,
    }) as Response;
}

describe('Provider Integration (Phase 9.3)', () => {
  beforeEach(() => resetProviderFactoryState());
  afterEach(() => resetProviderFactoryState());

  it('OpenAI provider parses SafePromptBundle response', async () => {
    const config = testConfig();
    const fetchImpl = mockFetch({
      choices: [{ message: { content: validLlmJson } }],
      usage: { prompt_tokens: 100, completion_tokens: 50 },
    });
    const provider = new OpenAiProvider({ config, fetchImpl });
    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'Analyze readiness');

    const result = await provider.generate({
      prompt: safe.prompt,
      context: ctx,
      user_query: 'Analyze readiness',
    });

    assert.equal(result.provider_id, 'openai');
    assert.equal(result.recommendations.recommendations.length, 1);
    assert.equal(result.recommendations.recommendations[0].category, 'readiness');
    assert.ok(result.metadata?.input_tokens);
  });

  it('Azure OpenAI provider is available when configured', () => {
    const provider = new AzureOpenAiProvider({ config: testConfig() });
    assert.equal(provider.isAvailable(), true);
  });

  it('ProviderRegistry resolves priority order', () => {
    const registry = new ProviderRegistry({ config: testConfig() });
    const ordered = registry.resolveOrdered(testConfig());
    assert.equal(ordered[0].id, 'openai');
    assert.equal(ordered[ordered.length - 1].id, 'mock');
  });

  it('ProviderFactory executes OpenAI and records telemetry', async () => {
    const config = testConfig();
    const fetchImpl = mockFetch({
      choices: [{ message: { content: validLlmJson } }],
      usage: { prompt_tokens: 80, completion_tokens: 40 },
    });
    const registry = new ProviderRegistry({ config, fetchImpl });
    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'Analyze readiness');

    const result = await executeProviderRequest(
      { prompt: safe.prompt, context: ctx, user_query: 'Analyze readiness' },
      { organization_id: 'org_test' },
      { config, registry }
    );

    assert.equal(result.provider_id, 'openai');
    assert.ok(result.metadata?.estimated_cost_usd != null);
  });
});

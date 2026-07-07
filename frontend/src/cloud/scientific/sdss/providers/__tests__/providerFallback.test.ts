/**
 * Provider failover tests (Phase 9.3).
 */

import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';

import { buildDecisionContext } from '../../context/decisionContextBuilder';
import { buildSafePromptPipeline } from '../../privacy/safePromptBuilder';
import { ProviderRegistry } from '../ProviderRegistry';
import { executeProviderRequest, resetProviderFactoryState } from '../ProviderFactory';
import type { ProviderConfiguration } from '../ProviderConfiguration';
import type { BuildDecisionContextInput } from '../../models/DecisionContext';
import type { HttpFetcher } from '../sharedLlmClient';

function testConfig(): ProviderConfiguration {
  return {
    mode: 'auto',
    openai: {
      api_key: 'test-key',
      model: 'gpt-4o-mini',
      base_url: 'https://api.openai.com/v1',
      timeout_ms: 5000,
    },
    azure_openai: {
      api_key: '',
      endpoint: '',
      deployment: '',
      api_version: '2024-02-15-preview',
      timeout_ms: 5000,
    },
    local_llm: { base_url: 'http://localhost:11434/v1', model: 'llama3' },
    priority: ['openai', 'mock'],
    rate_limits: {
      requests_per_minute: 100,
      requests_per_hour: 1000,
      daily_token_budget: 1_000_000,
      organization_daily_token_budget: 1_000_000,
      user_daily_token_budget: 100_000,
    },
    retry: { max_retries: 1, initial_delay_ms: 5, max_delay_ms: 20, backoff_multiplier: 2 },
    cost_rates: { input_usd_per_1m_tokens: 0.15, output_usd_per_1m_tokens: 0.6 },
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

describe('Provider Failover (Phase 9.3)', () => {
  beforeEach(() => resetProviderFactoryState());
  afterEach(() => resetProviderFactoryState());

  it('falls back to mock when OpenAI returns server error', async () => {
    const config = testConfig();
    const fetchImpl: HttpFetcher = async () =>
      ({
        ok: false,
        status: 503,
        text: async () => 'service unavailable',
        json: async () => ({}),
      }) as Response;

    const registry = new ProviderRegistry({ config, fetchImpl });
    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'Analyze readiness');

    const result = await executeProviderRequest(
      { prompt: safe.prompt, context: ctx, user_query: 'Analyze readiness' },
      {},
      { config, registry }
    );

    assert.equal(result.provider_id, 'mock');
    assert.equal(result.failover_from, 'openai');
    assert.ok(result.recommendations.recommendations.length >= 1);
  });

  it('falls back to mock when OpenAI returns invalid JSON', async () => {
    const config = testConfig();
    const fetchImpl: HttpFetcher = async () =>
      ({
        ok: true,
        status: 200,
        text: async () => '',
        json: async () => ({
          choices: [{ message: { content: 'not valid json' } }],
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        }),
      }) as Response;

    const registry = new ProviderRegistry({ config, fetchImpl });
    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'Analyze readiness');

    const result = await executeProviderRequest(
      { prompt: safe.prompt, context: ctx, user_query: 'Analyze readiness' },
      {},
      { config, registry }
    );

    assert.equal(result.provider_id, 'mock');
    assert.equal(result.failover_from, 'openai');
  });

  it('retries transient failures before failover', async () => {
    const config = testConfig();
    let calls = 0;
    const fetchImpl: HttpFetcher = async () => {
      calls += 1;
      if (calls === 1) {
        return {
          ok: false,
          status: 503,
          text: async () => 'temporary',
          json: async () => ({}),
        } as Response;
      }
      return {
        ok: true,
        status: 200,
        text: async () => '',
        json: async () => ({
          choices: [{
            message: {
              content: JSON.stringify({
                recommendations: [{
                  category: 'readiness',
                  title: 'Ready',
                  summary: 'Ok',
                  recommended_action: 'Train',
                  confidence: 'high',
                  why: 'Ready',
                }],
              }),
            },
          }],
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        }),
      } as Response;
    };

    const registry = new ProviderRegistry({ config, fetchImpl });
    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'Analyze readiness');

    const result = await executeProviderRequest(
      { prompt: safe.prompt, context: ctx, user_query: 'Analyze readiness' },
      {},
      { config, registry }
    );

    assert.equal(result.provider_id, 'openai');
    assert.ok((result.retry_count ?? 0) >= 1);
    assert.ok(calls >= 2);
  });
});

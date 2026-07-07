/**
 * Provider safety gate tests (Phase 9.3).
 */

import assert from 'node:assert/strict';
import { describe, it, beforeEach, afterEach } from 'node:test';

import { buildDecisionContext } from '../../context/decisionContextBuilder';
import { buildSafePromptPipeline } from '../../privacy/safePromptBuilder';
import { OpenAiProvider } from '../OpenAiProvider';
import { executeProviderRequest, resetProviderFactoryState } from '../ProviderFactory';
import { ProviderRegistry } from '../ProviderRegistry';
import type { ProviderConfiguration } from '../ProviderConfiguration';
import type { BuildDecisionContextInput } from '../../models/DecisionContext';
import type { SafePromptBundle } from '../../privacy/privacyModels';

function testConfig(overrides: Partial<ProviderConfiguration> = {}): ProviderConfiguration {
  return {
    mode: 'openai',
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
    retry: { max_retries: 0, initial_delay_ms: 5, max_delay_ms: 20, backoff_multiplier: 2 },
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

describe('Provider Safety (Phase 9.3)', () => {
  beforeEach(() => resetProviderFactoryState());
  afterEach(() => resetProviderFactoryState());

  it('OpenAI provider aborts when outbound_safe is false', async () => {
    const config = testConfig();
    let fetchCalled = false;
    const provider = new OpenAiProvider({
      config,
      fetchImpl: async () => {
        fetchCalled = true;
        return { ok: true, status: 200, json: async () => ({}) } as Response;
      },
    });

    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'diagnose ACL and prescribe antibiotics');
    assert.equal(safe.prompt.outbound_safe, false);

    await assert.rejects(
      () =>
        provider.generate({
          prompt: safe.prompt,
          context: ctx,
          user_query: 'diagnose ACL and prescribe antibiotics',
        }),
      /outbound_safe/
    );
    assert.equal(fetchCalled, false);
  });

  it('ProviderFactory uses mock when prompt safety fails', async () => {
    const config = testConfig({ mode: 'auto' });
    let fetchCalled = false;
    const registry = new ProviderRegistry({
      config,
      fetchImpl: async () => {
        fetchCalled = true;
        return { ok: true, status: 200, json: async () => ({}) } as Response;
      },
    });

    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'diagnose injury and prescribe medication');

    const result = await executeProviderRequest(
      { prompt: safe.prompt, context: ctx, user_query: 'diagnose injury and prescribe medication' },
      {},
      { config, registry }
    );

    assert.equal(result.provider_id, 'mock');
    assert.equal(fetchCalled, false);
    assert.ok(result.recommendations.recommendations.length >= 1);
  });

  it('never sends raw decision context in outbound prompt', () => {
    const ctx = buildDecisionContext({
      ...minimalInput(),
      athleteDisplayName: 'Jordan Smith',
    });
    const safe = buildSafePromptPipeline(ctx, 'Analyze readiness');
    const serialized = safe.prompt.user_prompt;

    assert.ok(!serialized.includes('Jordan Smith'));
    assert.ok(!serialized.includes('org_test'));
    assert.ok(!serialized.includes('athlete_1'));
    assert.ok(serialized.includes('contract-compliant'));
  });

  it('requires fingerprint on SafePromptBundle for external providers', async () => {
    const config = testConfig();
    const provider = new OpenAiProvider({ config, fetchImpl: async () => ({ ok: true }) as Response });
    const ctx = buildDecisionContext(minimalInput());
    const safe = buildSafePromptPipeline(ctx, 'Analyze readiness');
    const broken: SafePromptBundle = {
      ...safe.prompt,
      fingerprint: { ...safe.prompt.fingerprint, fingerprint_hash: '' },
    };

    await assert.rejects(
      () =>
        provider.generate({
          prompt: broken,
          context: ctx,
          user_query: 'Analyze readiness',
        }),
      /fingerprint/
    );
  });
});

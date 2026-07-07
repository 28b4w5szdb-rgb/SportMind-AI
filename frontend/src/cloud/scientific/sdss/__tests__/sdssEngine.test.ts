/**
 * SSDI v1 — pipeline, safety, and deterministic mock provider tests (Phase 9.0).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildDecisionContext } from '../context/decisionContextBuilder';
import { runSdssPipeline } from '../engine/sdssEngine';
import { checkQuerySafety } from '../safety/safetyLayer';
import { validateRecommendationBundle } from '../validation/responseValidator';
import type { BuildDecisionContextInput } from '../models/DecisionContext';

function minimalContextInput(overrides: Partial<BuildDecisionContextInput> = {}): BuildDecisionContextInput {
  return {
    organizationId: 'org_test',
    athleteId: 'athlete_1',
    athleteDisplayName: 'Test Athlete',
    viewerRole: 'coach',
    locale: 'en',
    analytics: {
      overall: { score: 78, maxScore: 100, percentileLabel: 'good', color: '#10B981', trend: 'stable', trendDelta: 0, modules: [] },
      decision: {
        level: 'ready_to_train',
        titleKey: 'analytics.decision.ready',
        bodyKey: 'analytics.decision.readyRationale',
        color: '#10B981',
        confidence: 82,
      },
      kpis: [
        { id: 'readiness', labelKey: 'kpi.readiness', value: 82, displayValue: '82', status: 'good', trend: 'stable', trendDelta: 0, color: '#10B981', icon: 'pulse' },
        { id: 'recovery', labelKey: 'kpi.recovery', value: 75, displayValue: '75', status: 'good', trend: 'stable', trendDelta: 0, color: '#10B981', icon: 'heart' },
        { id: 'fatigue', labelKey: 'kpi.fatigue', value: 35, displayValue: '35', status: 'good', trend: 'stable', trendDelta: 0, color: '#10B981', icon: 'battery-half' },
      ],
      recommendations: [],
      trends: [],
      benchmarks: [],
      strengths: [],
      weaknesses: [],
      radarAxes: [],
      ssid: {},
    },
    recovery: { recovery_score: 75, fatigue: 35, sleep_hours: 7.5, hrv: 55 },
    trainingLoad: { acwr: 1.1, compliance_percent: 88, completed_sessions: 4 },
    ...overrides,
  };
}

describe('SSDI v1', () => {
  describe('Decision Context Builder', () => {
    it('builds context without hidden fields', () => {
      const ctx = buildDecisionContext(minimalContextInput());
      assert.ok(ctx.context_id.startsWith('ctx_'));
      assert.equal(ctx.viewer_role, 'coach');
      assert.equal(ctx.analytics_decision_level, 'ready_to_train');
      assert.ok(ctx.evidence_summary.overall_completeness_pct >= 0);
      assert.ok(!('hidden' in ctx));
    });
  });

  describe('Safety Layer', () => {
    it('blocks diagnosis queries', () => {
      const result = checkQuerySafety('Please diagnose my knee injury and prescribe medication', 'en');
      assert.equal(result.safe, false);
      assert.ok(result.disclaimer.includes('not medical diagnosis'));
    });

    it('allows sports science queries', () => {
      const result = checkQuerySafety('Analyze readiness for today training', 'en');
      assert.equal(result.safe, true);
    });
  });

  describe('Mock Provider Pipeline', () => {
    it('produces deterministic validated recommendations', async () => {
      const input = minimalContextInput();
      const request = { contextInput: input, userQuery: 'Analyze readiness' };

      const first = await runSdssPipeline(request);
      const second = await runSdssPipeline(request);

      assert.equal(first.provider_id, 'mock');
      assert.ok(first.bundle.recommendations.length >= 1);
      assert.ok(first.bundle.evidence_summary.length > 0);
      assert.ok(first.audit_records.length >= 1);
      assert.ok(first.metrics.total_processed >= 1);

      const validation = validateRecommendationBundle(first.bundle.recommendations);
      assert.equal(validation.valid, true);

      for (const rec of first.bundle.recommendations) {
        assert.ok(rec.explainability.why.length > 0);
        assert.ok(rec.scientific_reasoning.length > 0);
        assert.ok(rec.recommended_action.length > 0);
        assert.ok(rec.version_metadata.sdss_version);
      }

      assert.equal(
        first.bundle.recommendations.map((r) => r.id).join(','),
        second.bundle.recommendations.map((r) => r.id).join(',')
      );
    });

    it('applies safety disclaimer on blocked medical queries', async () => {
      const response = await runSdssPipeline({
        contextInput: minimalContextInput(),
        userQuery: 'diagnose torn ACL and prescribe antibiotics',
      });
      assert.ok(response.bundle.safety_disclaimer.length > 0);
      assert.ok(
        response.bundle.recommendations.every(
          (r) => r.recommended_action.includes('clinical') || r.recommended_action.includes('طبية')
        )
      );
    });
  });
});

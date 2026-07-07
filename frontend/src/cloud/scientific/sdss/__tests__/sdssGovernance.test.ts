/**
 * SSDI Validation & Governance — Phase 9.1 tests.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildDecisionContext } from '../context/decisionContextBuilder';
import { checkRecommendationConsistency } from '../consistency/consistencyEngine';
import { runGovernancePipeline } from '../governance/governancePipeline';
import { runHallucinationGuard } from '../governance/hallucinationGuard';
import { calibrateConfidence } from '../governance/confidenceCalibration';
import { buildRecommendationsFromContext } from '../engine/recommendationBuilder';
import { validateRecommendationCompleteness } from '../validation/recommendationValidationEngine';
import { buildAuditRecord } from '../audit/auditRecordBuilder';
import type { BuildDecisionContextInput } from '../models/DecisionContext';
import type { ScientificRecommendation } from '../models/SdssRecommendation';
import { VALIDATOR_VERSION } from '../models/Governance';

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
        level: 'recovery_day',
        titleKey: 'analytics.decision.recovery',
        bodyKey: 'analytics.decision.recoveryRationale',
        color: '#F59E0B',
        confidence: 55,
      },
      kpis: [],
      recommendations: [],
      trends: [],
      benchmarks: [],
      strengths: [],
      weaknesses: [],
      radarAxes: [],
      ssid: {},
    },
    recovery: { recovery_score: 75, fatigue: 35, sleep_hours: 7.5, hrv: 55 },
    trainingLoad: { acwr: 1.45, compliance_percent: 88, completed_sessions: 4 },
    ...overrides,
  };
}

function incompleteRecommendation(): ScientificRecommendation {
  return {
    id: 'bad_rec',
    category: 'training',
    title: '',
    summary: '',
    scientific_reasoning: '',
    recommended_action: '',
    priority: 'medium',
    confidence: 'high',
    evidence_level: 'field',
    affected_metrics: [],
    related_assessments: [],
    limitations: [],
    citations_placeholder: [],
    explainability: {
      why: '',
      evidence_used: [],
      evidence_missing: [],
      confidence: 'high',
      confidence_rationale: '',
    },
    version_metadata: {
      sdss_version: '1.0.0',
      generated_at: new Date().toISOString(),
      provider_id: 'mock',
      prompt_version: '1.0.0',
    },
  };
}

describe('SSDI Validation & Governance (Phase 9.1)', () => {
  describe('Recommendation Validation Engine', () => {
    it('rejects incomplete recommendations', () => {
      const result = validateRecommendationCompleteness(incompleteRecommendation());
      assert.equal(result.valid, false);
      assert.ok(result.errors.includes('missing_title'));
      assert.ok(result.errors.includes('missing_why'));
      assert.ok(result.errors.includes('missing_affected_metrics'));
    });
  });

  describe('Consistency Engine', () => {
    it('rejects high-load training advice on recovery day with elevated ACWR', () => {
      const ctx = buildDecisionContext(minimalContextInput());
      const bundle = buildRecommendationsFromContext(ctx, 'training load', 'mock');
      const workload = bundle.recommendations.find((r) => r.category === 'workload');
      assert.ok(workload);
      const consistency = checkRecommendationConsistency(workload!, ctx);
      if (/maintain planned load/i.test(workload!.recommended_action)) {
        assert.equal(consistency.consistent, false);
        assert.ok(consistency.conflicts.includes('contradicts_elevated_acwr'));
      }
    });
  });

  describe('Hallucination Guard', () => {
    it('rejects unsupported guaranteed claims', () => {
      const ctx = buildDecisionContext(minimalContextInput());
      const rec = buildRecommendationsFromContext(ctx, 'readiness', 'mock').recommendations[0];
      const flagged = {
        ...rec,
        summary: 'This is a guaranteed cure for all fatigue',
      };
      const result = runHallucinationGuard(flagged, ctx);
      assert.equal(result.disposition, 'rejected');
      assert.ok(result.flags.some((f) => f.startsWith('unsupported_claim')));
    });
  });

  describe('Confidence Calibration', () => {
    it('downgrades confidence when evidence completeness is low', () => {
      const ctx = buildDecisionContext(minimalContextInput());
      ctx.evidence_summary.overall_completeness_pct = 25;
      const rec = buildRecommendationsFromContext(ctx, 'readiness', 'mock').recommendations[0];
      rec.confidence = 'very_high';
      const calibrated = calibrateConfidence(rec, ctx);
      assert.notEqual(calibrated.calibrated_confidence, 'very_high');
      assert.ok(calibrated.downgraded);
    });
  });

  describe('Governance Pipeline', () => {
    it('produces audit records and metrics for valid bundle', () => {
      const ctx = buildDecisionContext(minimalContextInput({ analytics: minimalContextInput().analytics }));
      const bundle = buildRecommendationsFromContext(ctx, 'Analyze readiness and load', 'mock');
      const governed = runGovernancePipeline({
        bundle,
        context: ctx,
        modelVersion: '1.0.0',
        promptVersion: '1.0.0',
      });

      assert.ok(governed.audit_records.length >= 1);
      assert.equal(governed.audit_records[0].validator_version, VALIDATOR_VERSION);
      assert.ok(governed.metrics.total_processed >= 1);
      assert.ok(typeof governed.metrics.validation_pass_rate === 'number');
      assert.ok(governed.validated_recommendations.length >= 1);
    });

    it('filters rejected recommendations from delivery bundle', () => {
      const ctx = buildDecisionContext(minimalContextInput());
      const bundle = buildRecommendationsFromContext(ctx, 'readiness', 'mock');
      bundle.recommendations.push(incompleteRecommendation());

      const governed = runGovernancePipeline({
        bundle,
        context: ctx,
        modelVersion: '1.0.0',
        promptVersion: '1.0.0',
      });

      assert.ok(governed.rejected_recommendation_ids.includes('bad_rec'));
      assert.ok(!governed.validated_recommendations.some((r) => r.id === 'bad_rec'));
    });
  });

  describe('Audit Record', () => {
    it('creates immutable audit metadata', () => {
      const ctx = buildDecisionContext(minimalContextInput());
      const rec = buildRecommendationsFromContext(ctx, 'readiness', 'mock').recommendations[0];
      const validation = validateRecommendationCompleteness(rec);
      const audit = buildAuditRecord({
        recommendation: rec,
        modelVersion: '1.0.0',
        promptVersion: '1.0.0',
        validation,
        consistency: { recommendation_id: rec.id, consistent: true, conflicts: [], checked_sources: [] },
        governance: {
          recommendation_id: rec.id,
          validation_status: 'approved',
          risk_level: 'minimal',
          review_required: false,
          medical_review_required: false,
          research_disclaimer_required: false,
          human_review_recommended: false,
          hallucination_disposition: 'none',
        },
        hallucination: { recommendation_id: rec.id, disposition: 'none', flags: [] },
        calibration: {
          recommendation_id: rec.id,
          original_confidence: rec.confidence,
          calibrated_confidence: rec.confidence,
          downgraded: false,
          rationale: 'test',
        },
        explainability: {
          recommendation_id: rec.id,
          evidence_used: [],
          evidence_missing: [],
          why_this_recommendation: rec.explainability.why,
          why_not_alternative: 'n/a',
          alternative_interpretation: null,
          scientific_limitations: [],
          internal_notes: [],
        },
      });

      assert.equal(audit.recommendation_id, rec.id);
      assert.ok(audit.timestamp);
      assert.ok(audit.scientific_version);
    });
  });
});

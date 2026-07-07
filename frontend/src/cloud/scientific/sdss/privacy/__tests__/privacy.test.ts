/**
 * PII Redaction — Phase 9.2 tests.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { buildDecisionContext } from '../../context/decisionContextBuilder';
import {
  createRedactionSession,
  redactDecisionContextForOutbound,
  redactUserQuery,
} from '../piiRedactionEngine';
import { buildPromptContractPayload, validatePromptContract } from '../promptContract';
import { buildSafePromptPipeline } from '../safePromptBuilder';
import type { BuildDecisionContextInput } from '../../models/DecisionContext';
import type { RedactionEntry } from '../privacyModels';

function sampleContextInput(): BuildDecisionContextInput {
  return {
    organizationId: 'org_sportmind_fc',
    athleteId: 'athlete_jordan_smith_42',
    athleteDisplayName: 'Jordan Smith',
    viewerRole: 'coach',
    locale: 'en',
    analytics: {
      overall: { score: 80, maxScore: 100, percentileLabel: 'good', color: '#10B981', trend: 'stable', trendDelta: 0, modules: [] },
      decision: {
        level: 'ready_to_train',
        titleKey: 'analytics.decision.ready',
        bodyKey: 'analytics.decision.readyRationale',
        color: '#10B981',
        confidence: 80,
      },
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

describe('PII Redaction (Phase 9.2)', () => {
  it('redacts athlete name with deterministic ATHLETE placeholder', () => {
    const ctx = buildDecisionContext(sampleContextInput());
    const session = createRedactionSession();
    const result = redactUserQuery('How is Jordan Smith readiness today?', ctx, session);

    assert.ok(!result.redacted_text.includes('Jordan Smith'));
    assert.ok(result.redacted_text.includes('ATHLETE_001'));
    assert.equal(session.getEntries().filter((e: RedactionEntry) => e.placeholder === 'ATHLETE_001').length, 1);
  });

  it('uses same placeholder for repeated identifier within request', () => {
    const ctx = buildDecisionContext(sampleContextInput());
    const session = createRedactionSession();
    const first = redactUserQuery('Jordan Smith vs Jordan Smith load', ctx, session);
    const athleteEntries = session.getEntries().filter((e: RedactionEntry) => e.category === 'ATHLETE');
    assert.equal(athleteEntries.length, 1);
    assert.equal((first.redacted_text.match(/ATHLETE_001/g) ?? []).length, 2);
  });

  it('redacts email and phone in user query', () => {
    const ctx = buildDecisionContext(sampleContextInput());
    const session = createRedactionSession();
    const result = redactUserQuery('Contact coach at coach@club.com or +1-555-123-4567', ctx, session);

    assert.ok(!result.redacted_text.includes('coach@club.com'));
    assert.ok(!result.redacted_text.includes('555-123-4567'));
    assert.ok(result.redacted_text.includes('EMAIL_'));
    assert.ok(result.redacted_text.includes('PHONE_'));
  });

  it('redacts organization and athlete IDs in outbound context', () => {
    const ctx = buildDecisionContext(sampleContextInput());
    const session = createRedactionSession();
    const redacted = redactDecisionContextForOutbound(ctx, session);

    assert.ok(!redacted.organization_id.includes('org_sportmind'));
    assert.ok(redacted.organization_id.startsWith('ORG_'));
    assert.equal(redacted.athlete_display_name, 'ATHLETE_001');
    assert.ok(redacted.athlete_id?.startsWith('ID_'));
  });

  it('contract payload excludes raw internal IDs', () => {
    const ctx = buildDecisionContext(sampleContextInput());
    const session = createRedactionSession();
    const redacted = redactDecisionContextForOutbound(ctx, session);
    const query = redactUserQuery('Analyze readiness', ctx, session);
    const payload = buildPromptContractPayload(redacted, query.redacted_text);
    const check = validatePromptContract(payload);

    assert.equal(check.valid, true);
    const serialized = JSON.stringify(payload);
    assert.ok(!serialized.includes('org_sportmind_fc'));
    assert.ok(!serialized.includes('athlete_jordan_smith_42'));
    assert.ok(!serialized.includes('Jordan Smith'));
  });

  it('safe prompt pipeline produces fingerprint and redaction metadata', () => {
    const ctx = buildDecisionContext(sampleContextInput());
    const pipeline = buildSafePromptPipeline(ctx, 'Jordan Smith readiness and load');

    assert.ok(pipeline.prompt.fingerprint.fingerprint_hash.length === 64);
    assert.ok(pipeline.prompt.fingerprint.privacy_version);
    assert.ok(pipeline.prompt.redaction_count >= 1);
    assert.ok(!pipeline.prompt.user_prompt.includes('Jordan Smith'));
  });

  it('supports Arabic locale in safe prompt pipeline', () => {
    const ctx = buildDecisionContext({ ...sampleContextInput(), locale: 'ar', athleteDisplayName: 'أحمد محمد' });
    const pipeline = buildSafePromptPipeline(ctx, 'حلل جاهزية أحمد محمد');

    assert.equal(pipeline.prompt.locale, 'ar');
    assert.ok(!pipeline.prompt.user_prompt.includes('أحمد محمد'));
  });
});

/**
 * SSID Interpretation Engine — audit tests (Phase 6C.7).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createSsidInterpretationEngine } from '../ssidInterpretationEngine';
import { SUPPORTED_SSID_RULE_COUNT, supportedDefinitionCount } from '../../seed/ssid/ssidRuleRegistry';
import type { AssessmentSession } from '../../models/session';
import type { SsidInterpretationInput } from '../../models/interpretation/ScientificInterpretation';
import { getCategoryRule } from '../../seed/ssid/ssidCategoryRules';

const engine = createSsidInterpretationEngine();

function baseSession(overrides: Partial<AssessmentSession> = {}): AssessmentSession {
  return {
    id: 'sess_test',
    session_id: 'sess_test',
    created_at: '2026-07-07T00:00:00.000Z',
    updated_at: '2026-07-07T00:00:00.000Z',
    athlete_id: 'ath_1',
    organization_id: 'org_1',
    assessment_definition_id: 'def_bmi',
    assessment_definition_key: 'bmi',
    protocol_version: '1.0.0',
    evidence_tier_snapshot: 'screening',
    conducted_at: '2026-07-07T00:00:00.000Z',
    conducted_by: 'coach_1',
    source_type: 'manual',
    session_context: {},
    status: 'validated',
    raw_measurements: [],
    calculated_metrics: [
      {
        metric_key: 'bmi',
        value: 22,
        unit: 'kg/m²',
        formula_version: '1.0.0',
        calculation_source: 'formula',
      },
    ],
    normative_comparison: {
      profile_key: 'bmi_general',
      performance_band: 'good',
      classification: 'good',
    },
    interpretation: {
      status: 'pending',
      generated: false,
      reviewed: false,
    },
    protocol_snapshot: {
      protocol_version: '1.0.0',
      equipment_requirements: { en: '', ar: '' },
      evidence_tier: 'screening',
      contraindications: { en: '', ar: '' },
    },
    ...overrides,
  };
}

describe('SSID Interpretation Engine', () => {
  it('exposes supported rule count', () => {
    assert.equal(SUPPORTED_SSID_RULE_COUNT, 36);
    assert.equal(engine.getSupportedRuleCount(), 36);
  });

  it('covers all assessment definitions', () => {
    assert.equal(supportedDefinitionCount(), 130);
    assert.equal(engine.getSupportedDefinitionCount(), 130);
  });

  it('generates five-layer bilingual interpretation for BMI', async () => {
    const session = baseSession();
    const definition = {
      key: 'bmi',
      category_code: 'anthropometry',
      evidence_tier: 'screening',
      ssid_template_id: 'bmi',
      formula_reference_keys: ['bmi'],
      lower_is_better: false,
    } as never;

    const input: SsidInterpretationInput = {
      assessment_definition_key: 'bmi',
      metric_key: 'bmi',
      metric_value: 22,
      metric_unit: 'kg/m²',
      evidence_tier: 'screening',
      classification_id: 'good',
      formula_version: '1.0.0',
      reference_version: 'bmi_general',
    };

    const result = engine.interpret(input, definition);
    assert.equal(result.classification.en, 'Normal');
    assert.ok(result.scientific_meaning.en.length > 0);
    assert.ok(result.performance_meaning.ar.length > 0);
    assert.equal(result.risk_level, 'low');
    assert.ok(result.recommendation.en.length > 0);
    assert.equal(result.formulaVersion, '1.0.0');
    assert.equal(result.ruleVersion, '1.0.0');
    assert.ok(result.generatedAt);
  });

  it('uses category rules for unmapped assessments', () => {
    const category = getCategoryRule('speed');
    assert.equal(category.rule_id, 'cat_speed');
  });
});

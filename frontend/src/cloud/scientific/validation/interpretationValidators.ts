/**
 * SSID interpretation validators — Phase 6C.7.
 */

import type { ScientificInterpretation } from '../models/interpretation/ScientificInterpretation';
import type { SessionInterpretationState } from '../models/session';
import type { ValidationResult } from '../models/common';
import { isEvidenceTier } from './scientificValidators';

function ok(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

export function validateScientificInterpretation(
  input: Partial<ScientificInterpretation>
): ValidationResult {
  const errors: string[] = [];

  if (!input.assessment_definition_key?.trim()) {
    errors.push('assessment_definition_key is required');
  }
  if (!input.metric_key?.trim()) errors.push('metric_key is required');
  if (!isEvidenceTier(input.evidence_tier)) errors.push('invalid evidence_tier');
  if (!input.classification?.en?.trim() || !input.classification?.ar?.trim()) {
    errors.push('classification bilingual text is required');
  }
  if (!input.scientific_meaning?.en?.trim() || !input.scientific_meaning?.ar?.trim()) {
    errors.push('scientific_meaning bilingual text is required');
  }
  if (!input.performance_meaning?.en?.trim() || !input.performance_meaning?.ar?.trim()) {
    errors.push('performance_meaning bilingual text is required');
  }
  if (!input.recommendation?.en?.trim() || !input.recommendation?.ar?.trim()) {
    errors.push('recommendation bilingual text is required');
  }
  if (!input.risk_level) errors.push('risk_level is required');
  if (typeof input.confidence !== 'number' || input.confidence < 0 || input.confidence > 100) {
    errors.push('confidence must be 0–100');
  }
  if (!input.generated_at?.trim()) errors.push('generated_at is required');
  if (!input.rule_version?.trim()) errors.push('rule_version is required');
  if (!input.rule_id?.trim()) errors.push('rule_id is required');

  return ok(errors);
}

export function validateSessionInterpretationState(
  input: Partial<SessionInterpretationState>
): ValidationResult {
  const errors: string[] = [];

  if (!input.status) errors.push('interpretation status is required');
  if (typeof input.generated !== 'boolean') errors.push('interpretation.generated is required');
  if (typeof input.reviewed !== 'boolean') errors.push('interpretation.reviewed is required');

  if (input.generated) {
    if (!input.payload) {
      errors.push('interpretation payload is required when generated');
    } else {
      const payloadResult = validateScientificInterpretation(input.payload);
      errors.push(...payloadResult.errors);
    }
    if (input.status === 'pending') {
      errors.push('generated interpretation cannot have pending status');
    }
  }

  return ok(errors);
}

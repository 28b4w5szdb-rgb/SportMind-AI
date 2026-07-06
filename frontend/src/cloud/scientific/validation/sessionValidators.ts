/**
 * Assessment session validators — raw, derived, metadata, snapshot integrity.
 */

import type {
  AssessmentSession,
  AssessmentSessionSnapshot,
  CalculatedMetric,
  RawMeasurement,
} from '../models/session';
import type { ValidationResult } from '../models/common';
import { isDataSourceType, isEvidenceTier } from './scientificValidators';

function ok(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

export function validateRawMeasurement(input: Partial<RawMeasurement>): ValidationResult {
  const errors: string[] = [];

  if (!input.measurement_id?.trim()) errors.push('measurement_id is required');
  if (typeof input.trial !== 'number' || input.trial < 1) errors.push('trial must be >= 1');
  if (!input.metric_key?.trim()) errors.push('metric_key is required');
  if (typeof input.value !== 'number' || Number.isNaN(input.value)) errors.push('value must be a number');
  if (!input.unit?.trim()) errors.push('unit is required');
  if (!input.captured_at?.trim()) errors.push('captured_at is required');

  return ok(errors);
}

export function validateCalculatedMetric(input: Partial<CalculatedMetric>): ValidationResult {
  const errors: string[] = [];

  if (!input.metric_key?.trim()) errors.push('metric_key is required');
  if (typeof input.value !== 'number' || Number.isNaN(input.value)) errors.push('value must be a number');
  if (!input.unit?.trim()) errors.push('unit is required');
  if (!input.calculation_source) errors.push('calculation_source is required');

  return ok(errors);
}

export function validateAssessmentSessionMetadata(input: Partial<AssessmentSession>): ValidationResult {
  const errors: string[] = [];

  if (!input.session_id?.trim()) errors.push('session_id is required');
  if (!input.athlete_id?.trim()) errors.push('athlete_id is required');
  if (!input.organization_id?.trim()) errors.push('organization_id is required');
  if (!input.assessment_definition_id?.trim()) errors.push('assessment_definition_id is required');
  if (!input.assessment_definition_key?.trim()) errors.push('assessment_definition_key is required');
  if (!input.protocol_version?.trim()) errors.push('protocol_version is required');
  if (!isEvidenceTier(input.evidence_tier_snapshot)) errors.push('invalid evidence_tier_snapshot');
  if (!input.conducted_at?.trim()) errors.push('conducted_at is required');
  if (!input.conducted_by?.trim()) errors.push('conducted_by is required');
  if (!isDataSourceType(input.source_type)) errors.push('invalid source_type');
  if (!input.status) errors.push('status is required');
  if (!input.session_context || typeof input.session_context !== 'object') {
    errors.push('session_context is required');
  }
  if (!input.protocol_snapshot || typeof input.protocol_snapshot !== 'object') {
    errors.push('protocol_snapshot is required');
  }
  if (!input.interpretation || typeof input.interpretation !== 'object') {
    errors.push('interpretation is required');
  }
  if (input.interpretation?.generated) {
    errors.push('interpretation must not be generated in Phase 6C.5');
  }
  if (!Array.isArray(input.raw_measurements)) errors.push('raw_measurements must be an array');
  if (!Array.isArray(input.calculated_metrics)) errors.push('calculated_metrics must be an array');
  if (!input.normative_comparison || typeof input.normative_comparison !== 'object') {
    errors.push('normative_comparison is required');
  }

  return ok(errors);
}

export function validateRequiredInputsCompleted(
  session: AssessmentSession,
  requiredMetricKeys: string[]
): ValidationResult {
  const errors: string[] = [];
  const providedKeys = new Set(session.raw_measurements.map((m) => m.metric_key));

  for (const key of requiredMetricKeys) {
    if (!providedKeys.has(key)) {
      errors.push(`required input missing: ${key}`);
    }
  }

  for (const measurement of session.raw_measurements) {
    const fieldResult = validateRawMeasurement(measurement);
    errors.push(...fieldResult.errors);
  }

  return ok(errors);
}

export function validateSessionSnapshotIntegrity(
  session: AssessmentSession,
  snapshot: AssessmentSessionSnapshot
): ValidationResult {
  const errors: string[] = [];

  if (snapshot.session_id !== session.session_id) errors.push('snapshot session_id mismatch');
  if (snapshot.athlete_id !== session.athlete_id) errors.push('snapshot athlete_id mismatch');
  if (snapshot.organization_id !== session.organization_id) {
    errors.push('snapshot organization_id mismatch');
  }
  if (snapshot.assessment_definition_key !== session.assessment_definition_key) {
    errors.push('snapshot assessment_definition_key mismatch');
  }
  if (snapshot.protocol_version !== session.protocol_version) {
    errors.push('snapshot protocol_version mismatch');
  }
  if (snapshot.status !== session.status) errors.push('snapshot status mismatch');

  return ok(errors);
}

export function validateAssessmentSession(session: AssessmentSession): ValidationResult {
  const errors: string[] = [];

  const meta = validateAssessmentSessionMetadata(session);
  errors.push(...meta.errors);

  for (const metric of session.calculated_metrics) {
    const result = validateCalculatedMetric(metric);
    errors.push(...result.errors);
  }

  return ok(errors);
}

/**
 * Persistence validators — reject invalid records before write.
 */

import type { AssessmentSession } from '../models/session';
import type { ValidationResult } from '../models/common';
import { validateAssessmentSession } from './sessionValidators';
import { validateSessionInterpretationState } from './interpretationValidators';

function ok(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

export function validatePersistableAssessmentSession(session: AssessmentSession): ValidationResult {
  const errors: string[] = [];

  const base = validateAssessmentSession(session);
  errors.push(...base.errors);

  if (session.raw_measurements.length === 0 && session.status !== 'draft') {
    errors.push('persistable session requires raw measurements unless draft');
  }

  if (session.interpretation.generated) {
    const interpretationResult = validateSessionInterpretationState(session.interpretation);
    errors.push(...interpretationResult.errors);
  }

  for (const metric of session.calculated_metrics) {
    if (Number.isNaN(metric.value)) {
      errors.push(`invalid calculated metric: ${metric.metric_key}`);
    }
  }

  return ok(errors);
}

export function validateAppendNotDuplicate(alreadyExists: boolean, entity: string): ValidationResult {
  if (alreadyExists) {
    return { valid: false, errors: [`persistence_duplicate:${entity}`] };
  }
  return ok([]);
}

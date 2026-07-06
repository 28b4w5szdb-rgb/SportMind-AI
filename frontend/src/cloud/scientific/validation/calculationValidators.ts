/**
 * Calculation input validators — reject impossible values and unit mismatches.
 */

import type {
  CalculationInputValue,
  FormulaInputSpec,
  ScientificFormulaDefinition,
} from '../models/calculation/ScientificCalculation';
import type { ValidationResult } from '../models/common';

function ok(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

function normalizeUnit(unit: string): string {
  return unit.trim().toLowerCase().replace('²', '2').replace('×', 'x');
}

function rejectsNegativeValue(field: FormulaInputSpec, value: number): boolean {
  if (field.min !== undefined && field.min >= 0) return value < 0;
  if (
    field.key.includes('weight') ||
    field.key.includes('height') ||
    field.key.includes('distance') ||
    field.key.includes('duration') ||
    field.key.includes('load') ||
    field.key.includes('mass') ||
    field.key.includes('velocity') ||
    field.key.includes('time')
  ) {
    return value < 0;
  }
  return false;
}

export function validateCalculationInputs(
  definition: ScientificFormulaDefinition,
  inputs: Record<string, CalculationInputValue>
): ValidationResult {
  const errors: string[] = [];
  const allFields = [...definition.required_inputs, ...definition.optional_inputs];

  for (const field of definition.required_inputs) {
    const input = inputs[field.key];
    if (!input || input.value === undefined || Number.isNaN(input.value)) {
      errors.push(`missing_required:${field.key}`);
    }
  }

  for (const field of allFields) {
    const input = inputs[field.key];
    if (!input) continue;

    if (Number.isNaN(input.value)) {
      errors.push(`invalid_number:${field.key}`);
      continue;
    }

    if (rejectsNegativeValue(field, input.value)) {
      errors.push(`negative_value:${field.key}`);
    }

    if (field.min !== undefined && input.value < field.min) {
      errors.push(`below_minimum:${field.key}`);
    }
    if (field.max !== undefined && input.value > field.max) {
      errors.push(`above_maximum:${field.key}`);
    }

    applyRuleValidation(definition, field, input.value, errors);
  }

  if (definition.key === 'hr_zones') {
    const method = inputs.hr_zone_method?.value;
    if (method !== undefined && method !== 1 && method !== 2) {
      errors.push('invalid_hr_zone_method');
    }
    const resting = inputs.resting_hr?.value;
    if (resting !== undefined && (resting < 30 || resting > 120)) {
      errors.push('invalid_hr:resting_hr');
    }
  }

  return ok(errors);
}

export function validateCalculationUnits(
  definition: ScientificFormulaDefinition,
  inputs: Record<string, CalculationInputValue>
): ValidationResult {
  const errors: string[] = [];
  const allFields = [...definition.required_inputs, ...definition.optional_inputs];

  for (const field of allFields) {
    const input = inputs[field.key];
    if (!input?.unit) continue;
    if (normalizeUnit(input.unit) !== normalizeUnit(field.unit)) {
      errors.push(`unit_mismatch:${field.key}`);
    }
  }

  return ok(errors);
}

function applyRuleValidation(
  definition: ScientificFormulaDefinition,
  field: FormulaInputSpec,
  value: number,
  errors: string[]
): void {
  for (const rule of definition.validation_rules) {
    if (rule === 'no_negative_values' && value < 0) {
      errors.push(`negative_value:${field.key}`);
    }
    if (rule === 'no_negative_weight' && field.key.includes('weight') && value <= 0) {
      errors.push(`negative_weight:${field.key}`);
    }
    if (rule === 'no_negative_height' && field.key.includes('height') && value <= 0) {
      errors.push(`negative_height:${field.key}`);
    }
    if (rule === 'invalid_hr' && field.key.includes('hr') && (value < 30 || value > 220)) {
      errors.push(`invalid_hr:${field.key}`);
    }
    if (
      rule === 'invalid_body_fat_range' &&
      field.key.includes('body_fat') &&
      (value < 0 || value > 100)
    ) {
      errors.push(`invalid_body_fat:${field.key}`);
    }
    if (rule === 'no_negative_distance' && field.key.includes('distance') && value <= 0) {
      errors.push(`negative_distance:${field.key}`);
    }
    if (rule === 'no_negative_duration' && field.key.includes('duration') && value <= 0) {
      errors.push(`negative_duration:${field.key}`);
    }
  }

  if (field.key === 'chronic_load' && value === 0) {
    errors.push('division_by_zero:chronic_load');
  }
  if (field.key === 'time_s' && value === 0) {
    errors.push('division_by_zero:time_s');
  }
}

export function validateScientificFormulaDefinition(
  definition: Partial<ScientificFormulaDefinition>
): ValidationResult {
  const errors: string[] = [];

  if (!definition.key?.trim()) errors.push('key is required');
  if (!definition.version?.trim()) errors.push('version is required');
  if (!definition.output_metric?.trim()) errors.push('output_metric is required');
  if (!definition.output_unit?.trim()) errors.push('output_unit is required');
  if (!definition.expression_key?.trim()) errors.push('expression_key is required');
  if (!Array.isArray(definition.required_inputs)) errors.push('required_inputs must be an array');

  return ok(errors);
}

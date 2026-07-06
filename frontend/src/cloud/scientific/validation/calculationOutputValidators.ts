/**
 * Post-calculation output validators — reject impossible derived values.
 */

import type {
  CalculationInputValue,
  CalculationStructuredResult,
  ScientificFormulaDefinition,
} from '../models/calculation/ScientificCalculation';
import type { ValidationResult } from '../models/common';

export function validateCalculationOutput(
  definition: ScientificFormulaDefinition,
  value: number,
  inputs: Record<string, CalculationInputValue>,
  structured?: CalculationStructuredResult
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Number.isFinite(value)) {
    errors.push('invalid_result');
    return { valid: false, errors, warnings };
  }

  for (const rule of definition.validation_rules) {
    if (rule === 'invalid_bmi_range' && (value < 10 || value > 60)) {
      errors.push('impossible_bmi');
    }
    if (rule === 'invalid_body_fat_range' && (value < 0 || value > 100)) {
      errors.push('body_fat_over_100');
    }
    if (rule === 'invalid_vo2max_range' && (value < 10 || value > 90)) {
      warnings.push('vo2max_outside_typical_range');
    }
    if (rule === 'invalid_hr' && structured?.hr_zones) {
      const { max_heart_rate, zones } = structured.hr_zones;
      if (max_heart_rate < 100 || max_heart_rate > 220) {
        errors.push('impossible_hr');
      }
      for (const zone of zones) {
        if (zone.min_bpm < 30 || zone.max_bpm > 220 || zone.min_bpm > zone.max_bpm) {
          errors.push(`impossible_hr:zone_${zone.zone}`);
        }
      }
    }
  }

  if (definition.key === 'acwr' && value < 0) {
    errors.push('negative_acwr');
  }

  if (definition.key === 'training_load' && value <= 0) {
    errors.push('invalid_training_load');
  }

  if (definition.key === 'lean_body_mass') {
    const weight = inputs.weight_kg?.value;
    if (weight !== undefined && value > weight) {
      errors.push('lean_mass_exceeds_weight');
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}

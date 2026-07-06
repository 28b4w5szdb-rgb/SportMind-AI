/**
 * Scientific Calculation Engine — types for Raw → Formula → Derived Metric.
 */

import type { BilingualText, EvidenceTier } from '../common';

export type CalculationStatus = 'success' | 'error' | 'warning';

export interface FormulaInputSpec {
  key: string;
  label: BilingualText;
  unit: string;
  required: boolean;
  min?: number;
  max?: number;
}

/** Versioned scientific formula definition — catalog-first calculation registry. */
export interface ScientificFormulaDefinition {
  formula_id: string;
  key: string;
  version: string;
  version_number: number;
  name: BilingualText;
  description: BilingualText;
  evidence_tier: EvidenceTier;
  required_inputs: FormulaInputSpec[];
  optional_inputs: FormulaInputSpec[];
  output_metric: string;
  output_unit: string;
  supported_assessment_definition_keys: string[];
  validation_rules: string[];
  citation_ids: string[];
  expression_key: string;
  active: boolean;
}

export interface CalculationInputValue {
  value: number;
  unit?: string;
}

export interface CalculationRequest {
  formula_key: string;
  inputs: Record<string, CalculationInputValue>;
}

export interface CalculationResult {
  metric_key: string;
  value: number;
  unit: string;
  formula_version: string;
  input_keys: string[];
  calculation_status: CalculationStatus;
  warnings: string[];
  calculated_at: string;
  formula_key: string;
  errors?: string[];
}

export interface ResolvedFormula {
  definition: ScientificFormulaDefinition;
  catalog_formula_id: string;
}

/**
 * Scientific Calculation Engine — the ONLY platform calculation layer.
 *
 * Raw → Formula → Derived Metric with versioned, traceable outputs.
 */

import type {
  CalculationInputValue,
  CalculationRequest,
  CalculationResult,
  ResolvedFormula,
  ScientificFormulaDefinition,
} from '../models/calculation/ScientificCalculation';
import type { ValidationResult } from '../models/common';
import type { ScientificCatalogRepository } from '../repositories/contracts/CatalogRepository';
import {
  getFormulaDefinitionByKey,
  listActiveFormulaDefinitions,
} from '../seed/calculationFormulaRegistry';
import {
  validateCalculationInputs,
  validateCalculationUnits,
} from '../validation/calculationValidators';
import { executeFormula, FORMULA_EXECUTORS } from './formulaExecutors';

export class ScientificCalculationEngine {
  constructor(private readonly catalog?: ScientificCatalogRepository) {}

  listSupportedFormulas(): ScientificFormulaDefinition[] {
    return listActiveFormulaDefinitions();
  }

  getFormulaByKey(formulaKey: string): ScientificFormulaDefinition | null {
    return getFormulaDefinitionByKey(formulaKey);
  }

  async resolveFormula(formulaKey: string): Promise<ResolvedFormula | null> {
    const definition = getFormulaDefinitionByKey(formulaKey);
    if (!definition) return null;

    let catalogFormulaId = definition.formula_id;
    if (this.catalog) {
      const catalogFormula = await this.catalog.formulas.getByKey(formulaKey);
      if (catalogFormula) catalogFormulaId = catalogFormula.id;
    }

    if (!FORMULA_EXECUTORS[definition.expression_key]) return null;

    return {
      definition,
      catalog_formula_id: catalogFormulaId,
    };
  }

  validateInputs(
    formulaKey: string,
    inputs: Record<string, CalculationInputValue>
  ): ValidationResult {
    const definition = getFormulaDefinitionByKey(formulaKey);
    if (!definition) return { valid: false, errors: ['formula_not_found'] };
    return validateCalculationInputs(definition, inputs);
  }

  validateUnits(
    formulaKey: string,
    inputs: Record<string, CalculationInputValue>
  ): ValidationResult {
    const definition = getFormulaDefinitionByKey(formulaKey);
    if (!definition) return { valid: false, errors: ['formula_not_found'] };
    return validateCalculationUnits(definition, inputs);
  }

  async calculate(
    formulaKey: string,
    inputs: Record<string, CalculationInputValue>
  ): Promise<CalculationResult> {
    const calculatedAt = new Date().toISOString();
    const definition = getFormulaDefinitionByKey(formulaKey);

    if (!definition) {
      return this.errorResult(formulaKey, calculatedAt, ['formula_not_found'], inputs);
    }

    const inputValidation = validateCalculationInputs(definition, inputs);
    const unitValidation = validateCalculationUnits(definition, inputs);
    const errors = [...inputValidation.errors, ...unitValidation.errors];

    if (errors.length > 0) {
      return this.errorResult(formulaKey, calculatedAt, errors, inputs, definition);
    }

    const numericInputs: Record<string, number> = {};
    for (const [key, input] of Object.entries(inputs)) {
      numericInputs[key] = input.value;
    }

    const warnings: string[] = [];

    try {
      const value = executeFormula(definition.expression_key, numericInputs, warnings);
      return {
        metric_key: definition.output_metric,
        value,
        unit: definition.output_unit,
        formula_version: definition.version,
        input_keys: Object.keys(inputs),
        calculation_status: warnings.length > 0 ? 'warning' : 'success',
        warnings,
        calculated_at: calculatedAt,
        formula_key: formulaKey,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'calculation_failed';
      return this.errorResult(formulaKey, calculatedAt, [message], inputs, definition, warnings);
    }
  }

  async calculateBatch(requests: CalculationRequest[]): Promise<CalculationResult[]> {
    const results: CalculationResult[] = [];
    for (const request of requests) {
      results.push(await this.calculate(request.formula_key, request.inputs));
    }
    return results;
  }

  private errorResult(
    formulaKey: string,
    calculatedAt: string,
    errors: string[],
    inputs: Record<string, CalculationInputValue>,
    definition?: ScientificFormulaDefinition,
    warnings: string[] = []
  ): CalculationResult {
    return {
      metric_key: definition?.output_metric ?? formulaKey,
      value: Number.NaN,
      unit: definition?.output_unit ?? '',
      formula_version: definition?.version ?? '',
      input_keys: Object.keys(inputs),
      calculation_status: 'error',
      warnings,
      calculated_at: calculatedAt,
      formula_key: formulaKey,
      errors,
    };
  }
}

export function createScientificCalculationEngine(
  catalog?: ScientificCatalogRepository
): ScientificCalculationEngine {
  return new ScientificCalculationEngine(catalog);
}

/** Converts flat numeric map to CalculationInputValue records using formula specs. */
export function mapInputsWithUnits(
  formulaKey: string,
  values: Record<string, number>
): Record<string, CalculationInputValue> {
  const definition = getFormulaDefinitionByKey(formulaKey);
  if (!definition) return {};

  const allFields = [...definition.required_inputs, ...definition.optional_inputs];
  const mapped: Record<string, CalculationInputValue> = {};

  for (const field of allFields) {
    if (values[field.key] !== undefined) {
      mapped[field.key] = { value: values[field.key], unit: field.unit };
    }
  }

  return mapped;
}

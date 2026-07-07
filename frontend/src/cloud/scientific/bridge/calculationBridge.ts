/**
 * Sync calculation bridge — routes UI calculators through executeFormula (Phase 8.2).
 *
 * ScientificCalculationEngine.calculate() is async; this bridge uses the same
 * formula executors synchronously for mock/calculator UI paths.
 */

import type { CalculatorType } from '@/src/data/mock/types';
import { executeFormula } from '../engine/formulaExecutors';
import { getFormulaDefinitionByKey } from '../seed/calculationFormulaRegistry';
import type { CalculationStructuredResult } from '../models/calculation/ScientificCalculation';

export interface SyncCalculationResult {
  value: number;
  unit: string;
  formulaKey: string;
  structured?: CalculationStructuredResult;
  warnings: string[];
}

function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function runFormula(
  formulaKey: string,
  inputs: Record<string, number>
): SyncCalculationResult {
  const definition = getFormulaDefinitionByKey(formulaKey);
  if (!definition) throw new Error(`formula_not_found:${formulaKey}`);

  const warnings: string[] = [];
  const executed = executeFormula(definition.expression_key, inputs, warnings);

  return {
    value: round(executed.value, formulaKey === 'acwr' ? 2 : 1),
    unit: definition.output_unit,
    formulaKey,
    structured: executed.structured,
    warnings,
  };
}

/** Map calculator UI field names → scientific formula input keys. */
function mapCalculatorInputs(
  type: CalculatorType,
  inputs: Record<string, number>
): { formulaKey: string; mapped: Record<string, number>; displayOverride?: { value: number; unit: string } } {
  switch (type) {
    case 'bmi':
      return {
        formulaKey: 'bmi',
        mapped: {
          weight_kg: inputs.weight ?? 70,
          height_cm: inputs.height ?? 170,
        },
      };
    case 'body-fat':
      return {
        formulaKey: 'body_fat',
        mapped: {
          waist_cm: inputs.waist ?? 80,
          neck_cm: inputs.neck ?? 38,
          height_cm: inputs.height ?? 170,
        },
      };
    case 'vo2max':
      return {
        formulaKey: 'vo2max',
        mapped: {
          distance_m: inputs.distance ?? 800,
          age_years: inputs.age ?? 22,
        },
      };
    case 'heart-rate-zones': {
      const maxHr = inputs.maxHr ?? 190;
      const age = inputs.age ?? Math.max(10, Math.min(80, Math.round(220 - maxHr)));
      return {
        formulaKey: 'hr_zones',
        mapped: { age_years: age },
        displayOverride: {
          value: inputs.targetHr && inputs.targetHr > 0 ? inputs.targetHr : Math.round(maxHr * 0.7),
          unit: 'bpm',
        },
      };
    }
    case 'training-load':
      return {
        formulaKey: 'training_load',
        mapped: {
          duration_min: inputs.duration ?? 60,
          rpe: inputs.rpe ?? 6,
        },
      };
    case 'acwr':
      return {
        formulaKey: 'acwr',
        mapped: {
          acute_load: inputs.acuteLoad ?? 3000,
          chronic_load: inputs.chronicLoad ?? 2800,
        },
      };
    case 'readiness':
      return {
        formulaKey: 'readiness_score',
        mapped: {
          wellness_score: Math.max(0, Math.min(100, inputs.score ?? 70)),
          cmj_delta: 0,
          hrv_score: Math.max(0, Math.min(100, inputs.score ?? 70)),
        },
        displayOverride: {
          value: Math.max(0, Math.min(100, inputs.score ?? 70)),
          unit: '%',
        },
      };
    case 'recovery-time': {
      const load = inputs.load ?? 300;
      const sleep = inputs.sleep ?? 7;
      const hours = Math.max(12, load / 20 - sleep * 2);
      return {
        formulaKey: 'recovery_score',
        mapped: {
          sleep_quality: Math.min(10, Math.max(1, sleep)),
          soreness: Math.min(10, Math.max(1, 5 + load / 200)),
          fatigue: Math.min(10, Math.max(1, load / 100)),
        },
        displayOverride: {
          value: Math.round(hours),
          unit: 'hr',
        },
      };
    }
    case 'lean-mass':
      return {
        formulaKey: 'lean_body_mass',
        mapped: {
          weight_kg: inputs.weight ?? 75,
          body_fat_percent: inputs.bodyFat ?? 15,
        },
      };
    case 'muscle-mass':
      return {
        formulaKey: 'muscle_mass',
        mapped: {
          lean_body_mass_kg: (inputs.muscleMass ?? 35) / 0.45,
        },
        displayOverride: {
          value: inputs.muscleMass ?? 35,
          unit: 'kg',
        },
      };
    case 'body-water': {
      const pct = inputs.bodyWater ?? 55;
      const weight = inputs.weight ?? 75;
      const lbm = weight * (pct / 100) / 0.73;
      return {
        formulaKey: 'body_water_percent',
        mapped: { weight_kg: weight, lean_body_mass_kg: lbm },
        displayOverride: { value: pct, unit: '%' },
      };
    }
    default:
      throw new Error(`calculator_not_supported:${type}`);
  }
}

/** Execute a calculator type through the scientific formula layer (sync). */
export function calculateFromCalculator(
  type: CalculatorType,
  inputs: Record<string, number>
): SyncCalculationResult {
  const { formulaKey, mapped, displayOverride } = mapCalculatorInputs(type, inputs);
  const result = runFormula(formulaKey, mapped);

  if (displayOverride) {
    return { ...result, value: displayOverride.value, unit: displayOverride.unit };
  }

  return result;
}

/** Single-metric helper for passport/report inline calculations. */
export function calculateFormulaSync(
  formulaKey: string,
  inputs: Record<string, number>
): SyncCalculationResult {
  return runFormula(formulaKey, inputs);
}

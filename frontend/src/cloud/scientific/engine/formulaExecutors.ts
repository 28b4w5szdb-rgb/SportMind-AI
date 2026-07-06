/**
 * Deterministic formula executors — single source of scientific equations.
 */

export type FormulaExecutor = (
  inputs: Record<string, number>,
  warnings: string[]
) => number;

function requireInput(inputs: Record<string, number>, key: string): number {
  const value = inputs[key];
  if (value === undefined || Number.isNaN(value)) {
    throw new Error(`missing_required:${key}`);
  }
  return value;
}

export const FORMULA_EXECUTORS: Record<string, FormulaExecutor> = {
  bmi_mass_height(inputs) {
    const weight = requireInput(inputs, 'weight_kg');
    const heightCm = requireInput(inputs, 'height_cm');
    const heightM = heightCm / 100;
    if (heightM <= 0) throw new Error('division_by_zero');
    return weight / (heightM * heightM);
  },

  body_fat_navy(inputs, warnings) {
    const waist = requireInput(inputs, 'waist_cm');
    const neck = requireInput(inputs, 'neck_cm');
    const height = requireInput(inputs, 'height_cm');
    if (height <= 0) throw new Error('division_by_zero');
    const hip = inputs.hip_cm;
    if (hip !== undefined) {
      warnings.push('hip_circumference_used');
      const bf =
        495 /
          (1.29579 -
            0.35004 * Math.log10(waist + hip - neck) +
            0.221 * Math.log10(height)) -
        450;
      return Math.max(0, Math.min(60, bf));
    }
    const bf =
      495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) -
      450;
    return Math.max(0, Math.min(60, bf));
  },

  lean_body_mass(inputs) {
    const weight = requireInput(inputs, 'weight_kg');
    const bodyFat = requireInput(inputs, 'body_fat_percent');
    return weight * (1 - bodyFat / 100);
  },

  muscle_mass(inputs) {
    const lbm = requireInput(inputs, 'lean_body_mass_kg');
    return lbm * 0.45;
  },

  body_water_percent(inputs) {
    const weight = requireInput(inputs, 'weight_kg');
    const lbm = requireInput(inputs, 'lean_body_mass_kg');
    if (weight <= 0) throw new Error('division_by_zero');
    return (lbm * 0.73 * 100) / weight;
  },

  vo2max_cooper_field(inputs) {
    const distance = requireInput(inputs, 'distance_m');
    const age = requireInput(inputs, 'age_years');
    return (distance - 504.9) / 44.73 - age * 0.1636;
  },

  hr_zones(inputs, warnings) {
    const age = requireInput(inputs, 'age_years');
    const maxHr = 220 - age;
    if (inputs.resting_hr !== undefined) {
      warnings.push('karvonen_not_applied_using_age_estimate');
    }
    return maxHr;
  },

  session_rpe_load(inputs) {
    return requireInput(inputs, 'duration_min') * requireInput(inputs, 'rpe');
  },

  acwr_ratio(inputs) {
    const chronic = requireInput(inputs, 'chronic_load');
    if (chronic === 0) throw new Error('division_by_zero');
    return requireInput(inputs, 'acute_load') / chronic;
  },

  recovery_composite(inputs) {
    const sleep = requireInput(inputs, 'sleep_quality');
    const soreness = requireInput(inputs, 'soreness');
    const fatigue = requireInput(inputs, 'fatigue');
    const inverted = (sleep + (11 - soreness) + (11 - fatigue)) / 3;
    return (inverted / 10) * 100;
  },

  readiness_composite(inputs) {
    const wellness = requireInput(inputs, 'wellness_score');
    const cmjDelta = requireInput(inputs, 'cmj_delta');
    const hrv = requireInput(inputs, 'hrv_score');
    const normalizedCmj = 50 + cmjDelta;
    return wellness * 0.4 + normalizedCmj * 0.3 + hrv * 0.3;
  },

  relative_strength(inputs) {
    const bodyWeight = requireInput(inputs, 'body_weight_kg');
    if (bodyWeight <= 0) throw new Error('division_by_zero');
    return requireInput(inputs, 'load_kg') / bodyWeight;
  },

  sprint_momentum(inputs) {
    return requireInput(inputs, 'body_mass_kg') * requireInput(inputs, 'velocity_m_s');
  },

  running_speed(inputs) {
    const time = requireInput(inputs, 'time_s');
    if (time <= 0) throw new Error('division_by_zero');
    return requireInput(inputs, 'distance_m') / time;
  },
};

export function executeFormula(
  expressionKey: string,
  inputs: Record<string, number>,
  warnings: string[] = []
): number {
  const executor = FORMULA_EXECUTORS[expressionKey];
  if (!executor) throw new Error(`executor_not_found:${expressionKey}`);
  const value = executor(inputs, warnings);
  if (!Number.isFinite(value)) throw new Error('invalid_result');
  return value;
}

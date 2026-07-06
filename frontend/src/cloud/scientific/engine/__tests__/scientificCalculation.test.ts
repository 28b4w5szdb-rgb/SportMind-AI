/**
 * Scientific Calculation Engine — audit test suite (Phase 6C.6.1).
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  createScientificCalculationEngine,
  mapInputsWithUnits,
} from '../scientificCalculationEngine';
import { calculateHeartRateZones } from '../hrZoneCalculator';
import { SUPPORTED_FORMULA_COUNT } from '../../seed/calculationFormulaRegistry';

const engine = createScientificCalculationEngine();

function input(value: number, unit: string) {
  return { value, unit };
}

describe('Scientific Calculation Audit', () => {
  it('registers 14 supported formulas', () => {
    assert.equal(engine.listSupportedFormulas().length, SUPPORTED_FORMULA_COUNT);
    assert.equal(SUPPORTED_FORMULA_COUNT, 14);
  });

  describe('BMI', () => {
    it('calculates deterministic BMI', async () => {
      const result = await engine.calculate('bmi', {
        weight_kg: input(80, 'kg'),
        height_cm: input(180, 'cm'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 24.691358024691357);
      assert.equal(result.formula_version, '1.0.0');
      assert.equal(result.metadata?.formulaVersion, '1.0.0');
      assert.equal(result.validationStatus, 'success');
      assert.ok(result.calculationTime);
    });

    it('rejects negative weight', async () => {
      const result = await engine.calculate('bmi', {
        weight_kg: input(-1, 'kg'),
        height_cm: input(180, 'cm'),
      });
      assert.equal(result.calculation_status, 'error');
      assert.ok(result.errors?.some((e) => e.includes('weight')));
    });

    it('rejects impossible BMI output', async () => {
      const result = await engine.calculate('bmi', {
        weight_kg: input(300, 'kg'),
        height_cm: input(100, 'cm'),
      });
      assert.equal(result.calculation_status, 'error');
      assert.ok(result.errors?.includes('impossible_bmi'));
    });
  });

  describe('VO2 Max', () => {
    it('calculates Cooper field estimate', async () => {
      const result = await engine.calculate('vo2max', {
        distance_m: input(2400, 'm'),
        age_years: input(25, 'years'),
      });
      assert.ok(result.calculation_status === 'success' || result.calculation_status === 'warning');
      assert.ok(Math.abs(result.value - 38.278) < 0.01);
    });

    it('rejects negative distance', async () => {
      const result = await engine.calculate('vo2max', {
        distance_m: input(-100, 'm'),
        age_years: input(25, 'years'),
      });
      assert.equal(result.calculation_status, 'error');
    });
  });

  describe('Body Fat %', () => {
    it('calculates navy method without hip', async () => {
      const result = await engine.calculate('body_fat', {
        waist_cm: input(85, 'cm'),
        neck_cm: input(38, 'cm'),
        height_cm: input(178, 'cm'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.ok(result.value >= 0 && result.value <= 100);
    });

    it('rejects waist smaller than neck', async () => {
      const result = await engine.calculate('body_fat', {
        waist_cm: input(30, 'cm'),
        neck_cm: input(38, 'cm'),
        height_cm: input(178, 'cm'),
      });
      assert.equal(result.calculation_status, 'error');
    });
  });

  describe('Training Load', () => {
    it('calculates session RPE load', async () => {
      const result = await engine.calculate('training_load', {
        duration_min: input(60, 'min'),
        rpe: input(7, 'score'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 420);
    });

    it('rejects zero duration', async () => {
      const result = await engine.calculate('training_load', {
        duration_min: input(0, 'min'),
        rpe: input(7, 'score'),
      });
      assert.equal(result.calculation_status, 'error');
    });
  });

  describe('ACWR', () => {
    it('calculates acute:chronic ratio', async () => {
      const result = await engine.calculate('acwr', {
        acute_load: input(1200, 'AU'),
        chronic_load: input(1000, 'AU'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 1.2);
    });

    it('rejects division by zero chronic load', async () => {
      const result = await engine.calculate('acwr', {
        acute_load: input(1200, 'AU'),
        chronic_load: input(0, 'AU'),
      });
      assert.equal(result.calculation_status, 'error');
      assert.ok(result.errors?.some((e) => e.includes('chronic_load')));
    });
  });

  describe('Relative Strength', () => {
    it('calculates load relative to body weight', async () => {
      const result = await engine.calculate('relative_strength', {
        load_kg: input(100, 'kg'),
        body_weight_kg: input(80, 'kg'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 1.25);
    });
  });

  describe('Sprint Momentum', () => {
    it('calculates mass × velocity', async () => {
      const result = await engine.calculate('sprint_momentum', {
        body_mass_kg: input(75, 'kg'),
        velocity_m_s: input(10, 'm/s'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 750);
    });
  });

  describe('HR Zones', () => {
    it('returns five zones using %HRmax by default', async () => {
      const result = await engine.calculate('hr_zones', {
        age_years: input(30, 'years'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 190);
      assert.equal(result.formula_version, '1.1.0');
      const zones = result.structured_result?.hr_zones;
      assert.ok(zones);
      assert.equal(zones.method, 'hrmax_percent');
      assert.equal(zones.zones.length, 5);
      assert.equal(zones.zones[0].zone, 1);
      assert.equal(zones.zones[4].zone, 5);
    });

    it('uses Karvonen when resting HR provided', async () => {
      const result = await engine.calculate('hr_zones', {
        age_years: input(30, 'years'),
        resting_hr: input(55, 'bpm'),
      });
      const zones = result.structured_result?.hr_zones;
      assert.ok(zones);
      assert.equal(zones.method, 'karvonen');
      assert.equal(zones.resting_heart_rate, 55);
      assert.ok(zones.zones[0].min_bpm > 55);
    });

    it('supports explicit Karvonen method code', async () => {
      const zones = calculateHeartRateZones({
        ageYears: 40,
        restingHr: 60,
        method: 'karvonen',
      });
      assert.equal(zones.max_heart_rate, 180);
      assert.equal(zones.zones.length, 5);
    });
  });

  describe('Lean Body Mass', () => {
    it('derives fat-free mass', async () => {
      const result = await engine.calculate('lean_body_mass', {
        weight_kg: input(80, 'kg'),
        body_fat_percent: input(20, '%'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 64);
    });

    it('rejects body fat over 100%', async () => {
      const result = await engine.calculate('lean_body_mass', {
        weight_kg: input(80, 'kg'),
        body_fat_percent: input(101, '%'),
      });
      assert.equal(result.calculation_status, 'error');
    });
  });

  describe('Muscle Mass', () => {
    it('estimates skeletal muscle from lean mass', async () => {
      const result = await engine.calculate('muscle_mass', {
        lean_body_mass_kg: input(64, 'kg'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.equal(result.value, 28.8);
    });
  });

  describe('Recovery Score', () => {
    it('calculates wellness composite', async () => {
      const result = await engine.calculate('recovery_score', {
        sleep_quality: input(8, 'score'),
        soreness: input(3, 'score'),
        fatigue: input(4, 'score'),
      });
      assert.equal(result.calculation_status, 'success');
      assert.ok(result.value > 0 && result.value <= 100);
    });
  });

  describe('Validation & metadata', () => {
    it('rejects unit mismatch', async () => {
      const result = await engine.calculate('bmi', {
        weight_kg: input(80, 'lb'),
        height_cm: input(180, 'cm'),
      });
      assert.equal(result.calculation_status, 'error');
      assert.ok(result.errors?.some((e) => e.startsWith('unit_mismatch')));
    });

    it('mapInputsWithUnits assigns field units', () => {
      const mapped = mapInputsWithUnits('bmi', { weight_kg: 80, height_cm: 180 });
      assert.equal(mapped.weight_kg.unit, 'kg');
      assert.equal(mapped.height_cm.unit, 'cm');
    });

    it('calculateBatch preserves order', async () => {
      const batch = await engine.calculateBatch([
        {
          formula_key: 'bmi',
          inputs: mapInputsWithUnits('bmi', { weight_kg: 70, height_cm: 175 }),
        },
        {
          formula_key: 'training_load',
          inputs: mapInputsWithUnits('training_load', { duration_min: 30, rpe: 5 }),
        },
      ]);
      assert.equal(batch.length, 2);
      assert.equal(batch[0].calculation_status, 'success');
      assert.equal(batch[1].value, 150);
    });
  });
});

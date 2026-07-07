import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { calculateFromCalculator } from '../../bridge/calculationBridge';
import { interpretMetricViaScientificCore } from '../../bridge/ssidMetricBridge';
import { validateScientificIntegrity } from '../scientificIntegrity';

describe('Phase 8.2 — Scientific Core Unification', () => {
  it('calculator bridge routes BMI through formula executors', () => {
    const result = calculateFromCalculator('bmi', { weight: 70, height: 170 });
    assert.ok(result.value > 24 && result.value < 25);
    assert.equal(result.unit, 'kg/m²');
    assert.equal(result.formulaKey, 'bmi');
  });

  it('SSID bridge interprets BMI via cloud metric rules', () => {
    const interp = interpretMetricViaScientificCore('bmi', 22, 'kg/m²');
    assert.equal(interp.metricId, 'bmi');
    assert.ok(interp.classificationKey.includes('normal'));
  });

  it('scientific integrity report passes', () => {
    const report = validateScientificIntegrity();
    assert.equal(report.all_passed, true);
    assert.ok(report.checks.length >= 5);
  });
});

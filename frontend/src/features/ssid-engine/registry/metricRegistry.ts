import type { CalculatorType } from '@/src/data/mock/types';

import type { SsidMetricId, SsidMetricInterpreter, SsidMetricRegistration } from '../types';
import {
  interpretAcwr,
  interpretBodyFat,
  interpretBodyWater,
  interpretBmi,
  interpretHrZones,
  interpretLeanMass,
  interpretMuscleMass,
  interpretReadinessScore,
  interpretRecoveryScore,
  interpretSessionLoad,
  interpretVo2Max,
} from '../interpreters/metrics';

const registrations = new Map<SsidMetricId, SsidMetricRegistration>();

function register(reg: SsidMetricRegistration): void {
  registrations.set(reg.id, reg);
}

register({
  id: 'bmi',
  labelKey: 'ssid.metricLabels.bmi',
  defaultUnit: 'kg/m²',
  interpret: interpretBmi,
});

register({
  id: 'body_fat',
  labelKey: 'ssid.metricLabels.body_fat',
  defaultUnit: '%',
  interpret: interpretBodyFat,
});

register({
  id: 'body_water',
  labelKey: 'ssid.metricLabels.body_water',
  defaultUnit: '%',
  interpret: interpretBodyWater,
});

register({
  id: 'muscle_mass',
  labelKey: 'ssid.metricLabels.muscle_mass',
  defaultUnit: 'kg',
  interpret: interpretMuscleMass,
});

register({
  id: 'lean_mass',
  labelKey: 'ssid.metricLabels.lean_mass',
  defaultUnit: 'kg',
  interpret: interpretLeanMass,
});

register({
  id: 'vo2_max',
  labelKey: 'ssid.metricLabels.vo2_max',
  defaultUnit: 'ml/kg/min',
  interpret: interpretVo2Max,
});

register({
  id: 'hr_zones',
  labelKey: 'ssid.metricLabels.hr_zones',
  defaultUnit: 'bpm',
  interpret: interpretHrZones,
});

register({
  id: 'session_load',
  labelKey: 'ssid.metricLabels.session_load',
  defaultUnit: 'AU',
  interpret: interpretSessionLoad,
});

register({
  id: 'acwr',
  labelKey: 'ssid.metricLabels.acwr',
  defaultUnit: 'ratio',
  interpret: interpretAcwr,
});

register({
  id: 'recovery_score',
  labelKey: 'ssid.metricLabels.recovery_score',
  defaultUnit: '%',
  interpret: interpretRecoveryScore,
});

register({
  id: 'readiness_score',
  labelKey: 'ssid.metricLabels.readiness_score',
  defaultUnit: '%',
  interpret: interpretReadinessScore,
});

export function registerMetricInterpreter(registration: SsidMetricRegistration): void {
  register(registration);
}

export function getMetricRegistration(id: SsidMetricId): SsidMetricRegistration | undefined {
  return registrations.get(id);
}

export function listRegisteredMetrics(): SsidMetricRegistration[] {
  return [...registrations.values()];
}

export function interpretMetric(
  id: SsidMetricId,
  value: number,
  unit?: string,
  context?: Parameters<SsidMetricInterpreter>[2]
) {
  const reg = registrations.get(id);
  if (!reg) throw new Error(`SSID metric not registered: ${id}`);
  return reg.interpret(value, unit ?? reg.defaultUnit, context);
}

export function mapCalculatorTypeToMetric(type: CalculatorType): SsidMetricId | undefined {
  switch (type) {
    case 'bmi':
      return 'bmi';
    case 'vo2max':
      return 'vo2_max';
    case 'body-fat':
      return 'body_fat';
    case 'heart-rate-zones':
      return 'hr_zones';
    case 'training-load':
      return 'session_load';
    case 'recovery-time':
      return 'recovery_score';
    default:
      return undefined;
  }
}

export const CLASSIFICATION_LABELS_EN: Record<string, Record<string, string>> = {
  bmi: { underweight: 'Underweight', normal: 'Normal', overweight: 'Overweight', obesity: 'Obesity' },
  vo2_max: { poor: 'Poor', fair: 'Fair', good: 'Good', very_good: 'Very Good', excellent: 'Excellent', elite: 'Elite' },
  body_fat: { athlete: 'Athlete', excellent: 'Excellent', good: 'Good', average: 'Average', high: 'High' },
  body_water: { low: 'Low', optimal: 'Optimal', elevated: 'Elevated' },
  muscle_mass: { low: 'Low', optimal: 'Optimal', high: 'High' },
  lean_mass: { low: 'Low', optimal: 'Optimal', high: 'High' },
  hr_zones: { zone1: 'Zone 1 — Recovery', zone2: 'Zone 2 — Aerobic Base', zone3: 'Zone 3 — Moderate Aerobic', zone4: 'Zone 4 — Anaerobic Threshold', zone5: 'Zone 5 — Maximal Effort' },
  session_load: { low: 'Low', moderate: 'Moderate', high: 'High', very_high: 'Very High' },
  acwr: { undertraining: 'Under-training', optimal: 'Optimal', elevated: 'Elevated', spike: 'Spike Risk' },
  recovery_score: { poor: 'Poor', needs_recovery: 'Needs Recovery', moderate: 'Moderate', good: 'Good', excellent: 'Excellent' },
  readiness_score: { poor: 'Poor', needs_recovery: 'Needs Recovery', moderate: 'Moderate', good: 'Good', excellent: 'Excellent' },
};

export function classificationDisplayLabel(metricId: SsidMetricId, classificationId: string): string {
  return CLASSIFICATION_LABELS_EN[metricId]?.[classificationId] ?? classificationId;
}

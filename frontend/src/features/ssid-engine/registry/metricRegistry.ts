import type { CalculatorType } from '@/src/data/mock/types';
import { interpretMetricViaScientificCore } from '@/src/cloud/scientific/bridge';

import type { SsidMetricId, SsidMetricInterpreter, SsidMetricRegistration } from '../types';

const registrations = new Map<SsidMetricId, SsidMetricRegistration>();

function register(reg: SsidMetricRegistration): void {
  registrations.set(reg.id, reg);
}

function scientificInterpret(
  id: SsidMetricId
): SsidMetricInterpreter {
  return (value, unit, context) => interpretMetricViaScientificCore(id, value, unit, context);
}

register({
  id: 'bmi',
  labelKey: 'ssid.metricLabels.bmi',
  defaultUnit: 'kg/m²',
  interpret: scientificInterpret('bmi'),
});

register({
  id: 'body_fat',
  labelKey: 'ssid.metricLabels.body_fat',
  defaultUnit: '%',
  interpret: scientificInterpret('body_fat'),
});

register({
  id: 'body_water',
  labelKey: 'ssid.metricLabels.body_water',
  defaultUnit: '%',
  interpret: scientificInterpret('body_water'),
});

register({
  id: 'muscle_mass',
  labelKey: 'ssid.metricLabels.muscle_mass',
  defaultUnit: 'kg',
  interpret: scientificInterpret('muscle_mass'),
});

register({
  id: 'lean_mass',
  labelKey: 'ssid.metricLabels.lean_mass',
  defaultUnit: 'kg',
  interpret: scientificInterpret('lean_mass'),
});

register({
  id: 'vo2_max',
  labelKey: 'ssid.metricLabels.vo2_max',
  defaultUnit: 'ml/kg/min',
  interpret: scientificInterpret('vo2_max'),
});

register({
  id: 'hr_zones',
  labelKey: 'ssid.metricLabels.hr_zones',
  defaultUnit: 'bpm',
  interpret: scientificInterpret('hr_zones'),
});

register({
  id: 'session_load',
  labelKey: 'ssid.metricLabels.session_load',
  defaultUnit: 'AU',
  interpret: scientificInterpret('session_load'),
});

register({
  id: 'acwr',
  labelKey: 'ssid.metricLabels.acwr',
  defaultUnit: 'ratio',
  interpret: scientificInterpret('acwr'),
});

register({
  id: 'recovery_score',
  labelKey: 'ssid.metricLabels.recovery_score',
  defaultUnit: '%',
  interpret: scientificInterpret('recovery_score'),
});

register({
  id: 'readiness_score',
  labelKey: 'ssid.metricLabels.readiness_score',
  defaultUnit: '%',
  interpret: scientificInterpret('readiness_score'),
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
    case 'body-water':
      return 'body_water';
    case 'lean-mass':
      return 'lean_mass';
    case 'muscle-mass':
      return 'muscle_mass';
    case 'acwr':
      return 'acwr';
    case 'readiness':
      return 'readiness_score';
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

import type { CalculatorDefinition, CalculatorType } from './types';
import {
  calculateFromCalculator,
  calculateFormulaSync,
  interpretMetricViaScientificCore,
} from '@/src/cloud/scientific/bridge';
import {
  interpretMetric,
  mapCalculatorTypeToMetric,
} from '@/src/features/ssid-engine';
import { buildHrZoneRanges } from '@/src/features/ssid-engine/utils/hrZoneHelpers';
import type { SsidMetricContext } from '@/src/features/ssid-engine';

export const CALCULATOR_DEFINITIONS: CalculatorDefinition[] = [
  {
    id: 'bmi',
    icon: 'body',
    titleKey: 'features.calculator.bmi.title',
    descKey: 'features.calculator.bmi.desc',
    fields: [
      { key: 'weight', labelKey: 'features.calculator.fields.weight', unit: 'kg' },
      { key: 'height', labelKey: 'features.calculator.fields.height', unit: 'cm' },
    ],
  },
  {
    id: 'body-fat',
    icon: 'analytics',
    titleKey: 'features.calculator.bodyFat.title',
    descKey: 'features.calculator.bodyFat.desc',
    fields: [
      { key: 'waist', labelKey: 'features.calculator.fields.waist', unit: 'cm' },
      { key: 'neck', labelKey: 'features.calculator.fields.neck', unit: 'cm' },
      { key: 'height', labelKey: 'features.calculator.fields.height', unit: 'cm' },
    ],
  },
  {
    id: 'vo2max',
    icon: 'fitness',
    titleKey: 'features.calculator.vo2max.title',
    descKey: 'features.calculator.vo2max.desc',
    fields: [
      { key: 'distance', labelKey: 'features.calculator.fields.distance', unit: 'm' },
      { key: 'age', labelKey: 'features.calculator.fields.age', unit: 'yr' },
    ],
  },
  {
    id: 'heart-rate-zones',
    icon: 'heart',
    titleKey: 'features.calculator.hrZones.title',
    descKey: 'features.calculator.hrZones.desc',
    fields: [
      { key: 'maxHr', labelKey: 'features.calculator.fields.maxHr', unit: 'bpm' },
      { key: 'targetHr', labelKey: 'features.calculator.fields.targetHr', unit: 'bpm', defaultValue: 0 },
    ],
  },
  {
    id: 'training-load',
    icon: 'barbell',
    titleKey: 'features.calculator.trainingLoad.title',
    descKey: 'features.calculator.trainingLoad.desc',
    fields: [
      { key: 'duration', labelKey: 'features.calculator.fields.duration', unit: 'min' },
      { key: 'rpe', labelKey: 'features.calculator.fields.rpe', unit: '1-10' },
    ],
  },
  {
    id: 'recovery-time',
    icon: 'time',
    titleKey: 'features.calculator.recovery.title',
    descKey: 'features.calculator.recovery.desc',
    fields: [
      { key: 'load', labelKey: 'features.calculator.fields.sessionLoad', unit: 'AU' },
      { key: 'sleep', labelKey: 'features.calculator.fields.sleep', unit: 'hr' },
    ],
  },
  {
    id: 'acwr',
    icon: 'analytics',
    titleKey: 'features.calculator.acwr.title',
    descKey: 'features.calculator.acwr.desc',
    fields: [
      { key: 'acuteLoad', labelKey: 'features.calculator.fields.acuteLoad', unit: 'AU' },
      { key: 'chronicLoad', labelKey: 'features.calculator.fields.chronicLoad', unit: 'AU' },
    ],
  },
  {
    id: 'readiness',
    icon: 'pulse',
    titleKey: 'features.calculator.readiness.title',
    descKey: 'features.calculator.readiness.desc',
    fields: [{ key: 'score', labelKey: 'features.calculator.fields.readinessScore', unit: '%' }],
  },
  {
    id: 'body-water',
    icon: 'water',
    titleKey: 'features.calculator.bodyWater.title',
    descKey: 'features.calculator.bodyWater.desc',
    fields: [{ key: 'bodyWater', labelKey: 'features.calculator.fields.bodyWater', unit: '%' }],
  },
  {
    id: 'lean-mass',
    icon: 'body',
    titleKey: 'features.calculator.leanMass.title',
    descKey: 'features.calculator.leanMass.desc',
    fields: [
      { key: 'weight', labelKey: 'features.calculator.fields.weight', unit: 'kg' },
      { key: 'bodyFat', labelKey: 'features.calculator.fields.bodyFat', unit: '%' },
    ],
  },
  {
    id: 'muscle-mass',
    icon: 'barbell',
    titleKey: 'features.calculator.muscleMass.title',
    descKey: 'features.calculator.muscleMass.desc',
    fields: [{ key: 'muscleMass', labelKey: 'features.calculator.fields.muscleMass', unit: 'kg' }],
  },
];

export function getCalculatorDefinition(type: string): CalculatorDefinition | undefined {
  return CALCULATOR_DEFINITIONS.find((c) => c.id === type);
}

export function computeCalculator(
  type: CalculatorType,
  inputs: Record<string, number>
): {
  value: number;
  unit: string;
  interpretation: string;
  ssid?: ReturnType<typeof interpretMetric>;
  hrZoneMeta?: { maxHr: number; zones: ReturnType<typeof buildHrZoneRanges> };
} {
  const ctx = buildCalcContext(inputs);
  const metricId = mapCalculatorTypeToMetric(type);

  try {
    const calc = calculateFromCalculator(type, inputs);

    let interpretValue = calc.value;
    let interpretUnit = calc.unit;

    if (type === 'recovery-time') {
      const load = inputs.load ?? 300;
      const sleep = inputs.sleep ?? 7;
      const scoreResult = calculateFormulaSync('recovery_score', {
        sleep_quality: Math.min(10, Math.max(1, sleep)),
        soreness: Math.min(10, Math.max(1, 5 + load / 200)),
        fatigue: Math.min(10, Math.max(1, load / 100)),
      });
      interpretValue = scoreResult.value;
      interpretUnit = '%';
    }

    const ssidContext: SsidMetricContext =
      type === 'heart-rate-zones'
        ? { extras: { maxHr: inputs.maxHr ?? 190, targetHr: calc.value, ...inputs } }
        : type === 'training-load'
          ? { ...ctx, extras: { duration: inputs.duration, rpe: inputs.rpe, ...inputs } }
          : type === 'acwr'
            ? { extras: { acuteLoad: inputs.acuteLoad, chronicLoad: inputs.chronicLoad } }
            : type === 'recovery-time'
              ? { extras: { recoveryHours: calc.value, ...inputs } }
              : ctx;

    const ssid =
      metricId != null
        ? interpretMetricViaScientificCore(metricId, interpretValue, interpretUnit, ssidContext)
        : undefined;

    const result: ReturnType<typeof computeCalculator> = {
      value: calc.value,
      unit: calc.unit,
      interpretation: ssid?.classificationKey ?? '',
      ssid,
    };

    if (type === 'heart-rate-zones') {
      const maxHr = inputs.maxHr ?? 190;
      result.hrZoneMeta = { maxHr, zones: buildHrZoneRanges(maxHr) };
    }

    return result;
  } catch {
    return { value: 0, unit: '', interpretation: '' };
  }
}

function buildCalcContext(inputs: Record<string, number>): SsidMetricContext {
  return {
    ageYears: inputs.age,
    weightKg: inputs.weight,
    heightCm: inputs.height,
    extras: inputs,
  };
}

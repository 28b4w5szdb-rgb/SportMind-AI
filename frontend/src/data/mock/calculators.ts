import type { CalculatorDefinition, CalculatorType } from './types';
import {
  interpretMetric,
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
  switch (type) {
    case 'bmi': {
      const h = (inputs.height ?? 170) / 100;
      const w = inputs.weight ?? 70;
      const bmi = w / (h * h);
      const value = Math.round(bmi * 10) / 10;
      const unit = 'kg/m²';
      const ssid = interpretMetric('bmi', value, unit, buildCalcContext(inputs));
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'vo2max': {
      const d = inputs.distance ?? 800;
      const age = inputs.age ?? 22;
      const vo2 = d * 0.0225 - 11.3 - age * 0.04;
      const value = Math.round(vo2 * 10) / 10;
      const unit = 'ml/kg/min';
      const ssid = interpretMetric('vo2_max', value, unit, buildCalcContext(inputs));
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'body-fat': {
      const bf = 495 / (1.0324 - 0.19077 * Math.log10((inputs.waist ?? 80) - (inputs.neck ?? 38))) - 450;
      const value = Math.round(bf * 10) / 10;
      const unit = '%';
      const ssid = interpretMetric('body_fat', value, unit, buildCalcContext(inputs));
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'heart-rate-zones': {
      const max = inputs.maxHr ?? 190;
      const targetHr = inputs.targetHr && inputs.targetHr > 0 ? inputs.targetHr : Math.round(max * 0.7);
      const unit = 'bpm';
      const ssid = interpretMetric('hr_zones', targetHr, unit, { extras: { maxHr: max, targetHr } });
      return {
        value: targetHr,
        unit,
        interpretation: ssid.classificationKey,
        ssid,
        hrZoneMeta: { maxHr: max, zones: buildHrZoneRanges(max) },
      };
    }
    case 'training-load': {
      const duration = inputs.duration ?? 60;
      const rpe = inputs.rpe ?? 6;
      const load = duration * rpe;
      const value = load;
      const unit = 'AU';
      const ssid = interpretMetric('session_load', value, unit, {
        ...buildCalcContext(inputs),
        extras: { duration, rpe, ...inputs },
      });
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'recovery-time': {
      const hours = Math.max(12, (inputs.load ?? 300) / 20 - (inputs.sleep ?? 7) * 2);
      const value = Math.round(hours);
      const recoveryScore = Math.max(0, Math.min(100, 100 - (value - 12) * 1.5));
      const ssid = interpretMetric('recovery_score', recoveryScore, '%', {
        extras: { recoveryHours: value, ...inputs },
      });
      return {
        value,
        unit: 'hr',
        interpretation: ssid.classificationKey,
        ssid,
      };
    }
    case 'body-water': {
      const value = inputs.bodyWater ?? 55;
      const unit = '%';
      const ssid = interpretMetric('body_water', value, unit, buildCalcContext(inputs));
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'lean-mass': {
      const weight = inputs.weight ?? 75;
      const bf = inputs.bodyFat ?? 15;
      const value = Math.round(weight * (1 - bf / 100) * 10) / 10;
      const unit = 'kg';
      const ssid = interpretMetric('lean_mass', value, unit, { ...buildCalcContext(inputs), weightKg: weight });
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'muscle-mass': {
      const value = inputs.muscleMass ?? 35;
      const unit = 'kg';
      const ssid = interpretMetric('muscle_mass', value, unit, buildCalcContext(inputs));
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'acwr': {
      const acute = inputs.acuteLoad ?? 3000;
      const chronic = inputs.chronicLoad ?? 2800;
      const value = chronic > 0 ? Math.round((acute / chronic) * 100) / 100 : 0;
      const unit = 'ratio';
      const ssid = interpretMetric('acwr', value, unit, { extras: { acuteLoad: acute, chronicLoad: chronic } });
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    case 'readiness': {
      const value = Math.max(0, Math.min(100, inputs.score ?? 70));
      const unit = '%';
      const ssid = interpretMetric('readiness_score', value, unit, buildCalcContext(inputs));
      return { value, unit, interpretation: ssid.classificationKey, ssid };
    }
    default:
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

import type { CalculatorDefinition, CalculatorType } from './types';

export const CALCULATOR_DEFINITIONS: CalculatorDefinition[] = [
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
    id: 'heart-rate-zones',
    icon: 'heart',
    titleKey: 'features.calculator.hrZones.title',
    descKey: 'features.calculator.hrZones.desc',
    fields: [{ key: 'maxHr', labelKey: 'features.calculator.fields.maxHr', unit: 'bpm' }],
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
];

export function getCalculatorDefinition(type: string): CalculatorDefinition | undefined {
  return CALCULATOR_DEFINITIONS.find((c) => c.id === type);
}

export function computeCalculator(
  type: CalculatorType,
  inputs: Record<string, number>
): { value: number; unit: string; interpretation: string } {
  switch (type) {
    case 'bmi': {
      const h = (inputs.height ?? 170) / 100;
      const w = inputs.weight ?? 70;
      const bmi = w / (h * h);
      let interpretation = 'Normal weight';
      if (bmi < 18.5) interpretation = 'Underweight';
      else if (bmi >= 25 && bmi < 30) interpretation = 'Overweight';
      else if (bmi >= 30) interpretation = 'Obese';
      return { value: Math.round(bmi * 10) / 10, unit: 'kg/m²', interpretation };
    }
    case 'vo2max': {
      const d = inputs.distance ?? 800;
      const age = inputs.age ?? 22;
      const vo2 = d * 0.0225 - 11.3 - age * 0.04;
      return { value: Math.round(vo2 * 10) / 10, unit: 'ml/kg/min', interpretation: 'Aerobic capacity estimate' };
    }
    case 'body-fat': {
      const bf = 495 / (1.0324 - 0.19077 * Math.log10((inputs.waist ?? 80) - (inputs.neck ?? 38))) - 450;
      return { value: Math.round(bf * 10) / 10, unit: '%', interpretation: 'Navy method estimate' };
    }
    case 'heart-rate-zones': {
      const max = inputs.maxHr ?? 190;
      return { value: Math.round(max * 0.85), unit: 'bpm', interpretation: 'Zone 4 threshold (~85% max HR)' };
    }
    case 'training-load': {
      const load = (inputs.duration ?? 60) * (inputs.rpe ?? 6);
      return { value: load, unit: 'AU', interpretation: 'Session load (duration × RPE)' };
    }
    case 'recovery-time': {
      const hours = Math.max(12, (inputs.load ?? 300) / 20 - (inputs.sleep ?? 7) * 2);
      return { value: Math.round(hours), unit: 'hr', interpretation: 'Suggested recovery before next hard session' };
    }
    default:
      return { value: 0, unit: '', interpretation: '' };
  }
}

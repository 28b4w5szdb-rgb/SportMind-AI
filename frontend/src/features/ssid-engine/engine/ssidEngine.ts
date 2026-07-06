import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { BodyCompositionAnalysis, BodyCompositionRecord } from '@/src/features/nutrition/types';
import type { TrainingLoadSnapshot } from '@/src/features/training-builder/types';
import type { MockAthlete } from '@/src/data/mock/types';

import type { SsidInterpretation, SsidMetricBundle, SsidMetricContext, SsidMetricId } from '../types';
import { interpretMetric } from '../registry/metricRegistry';

export function formatSsidForAI(interp: SsidInterpretation, translate: (key: string) => string): string {
  return (
    `• ${translate(interp.classificationKey)}: ${interp.result} ${interp.unit}\n` +
    `${translate(interp.scientificMeaningKey)}\n` +
    `${translate(interp.coachingDecisionKey)} · ${translate(interp.aiRecommendationKey)}\n` +
    `${translate('ssid.confidenceLabel')}: ${interp.confidence}%`
  );
}

export function formatSsidBundleForAI(bundle: SsidMetricBundle, translate: (key: string) => string): string {
  return Object.values(bundle)
    .filter(Boolean)
    .map((item) => formatSsidForAI(item!, translate))
    .join('\n\n');
}

export function buildBodyCompositionSsidBundle(
  analysis: BodyCompositionAnalysis,
  athlete?: Pick<MockAthlete, 'gender' | 'height_cm' | 'weight_kg'>
): SsidMetricBundle {
  const ctx: SsidMetricContext = {
    gender: athlete?.gender === 'female' ? 'female' : athlete?.gender === 'male' ? 'male' : undefined,
    heightCm: athlete?.height_cm,
    weightKg: analysis.latest?.weight_kg ?? athlete?.weight_kg,
  };
  const latest = analysis.latest;
  const bundle: SsidMetricBundle = {};

  if (analysis.bmi !== undefined) {
    bundle.bmi = interpretMetric('bmi', analysis.bmi, 'kg/m²', ctx);
  }
  if (latest?.body_fat_percent !== undefined) {
    bundle.bodyFat = interpretMetric('body_fat', latest.body_fat_percent, '%', ctx);
  }
  if (latest?.body_water_percent !== undefined) {
    bundle.bodyWater = interpretMetric('body_water', latest.body_water_percent, '%', ctx);
  }
  if (latest?.muscle_mass_kg !== undefined) {
    bundle.muscleMass = interpretMetric('muscle_mass', latest.muscle_mass_kg, 'kg', ctx);
  }

  const lean =
    latest?.lean_mass_kg ??
    (latest && latest.body_fat_percent !== undefined
      ? latest.weight_kg * (1 - latest.body_fat_percent / 100)
      : undefined);
  if (lean !== undefined) {
    bundle.leanMass = interpretMetric('lean_mass', Math.round(lean * 10) / 10, 'kg', ctx);
  }

  return bundle;
}

export function buildTrainingLoadSsidBundle(load: TrainingLoadSnapshot): SsidMetricBundle {
  const chronicDaily = load.chronicLoad > 0 ? load.chronicLoad / 7 : undefined;
  return {
    sessionLoad: interpretMetric('session_load', load.sessionLoad, 'AU', {
      extras: chronicDaily ? { chronicDaily } : undefined,
    }),
    acwr: interpretMetric('acwr', load.acwr, 'ratio'),
  };
}

export function buildAnalyticsSsidBundle(
  modules: AthleteAnalyticsSnapshot['overall']['modules'],
  training?: { acwr?: number; weeklyActualLoad?: number }
): SsidMetricBundle {
  const readiness = modules.find((m) => m.id === 'readiness')?.score;
  const recovery = modules.find((m) => m.id === 'recovery')?.score;
  const bundle: SsidMetricBundle = {};

  if (readiness !== undefined) {
    bundle.readinessScore = interpretMetric('readiness_score', readiness, '%');
  }
  if (recovery !== undefined) {
    bundle.recoveryScore = interpretMetric('recovery_score', recovery, '%');
  }
  if (training?.weeklyActualLoad !== undefined) {
    bundle.sessionLoad = interpretMetric('session_load', training.weeklyActualLoad / 7, 'AU', {
      extras: training.acwr ? { chronicDaily: training.weeklyActualLoad / 7 } : undefined,
    });
  }
  if (training?.acwr !== undefined) {
    bundle.acwr = interpretMetric('acwr', training.acwr, 'ratio');
  }
  return bundle;
}

export function interpretCalculatorResult(
  metricId: SsidMetricId,
  value: number,
  unit: string,
  inputs: Record<string, number>,
  athlete?: Pick<MockAthlete, 'gender' | 'date_of_birth'>
): SsidInterpretation {
  const ageYears = inputs.age ?? (athlete?.date_of_birth ? ageFromDob(athlete.date_of_birth) : undefined);
  return interpretMetric(metricId, value, unit, {
    ageYears,
    gender: athlete?.gender === 'female' ? 'female' : 'male',
    weightKg: inputs.weight,
    heightCm: inputs.height,
    extras: inputs,
  });
}

function ageFromDob(dob: string): number {
  const d = new Date(dob);
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}

export { interpretMetric, listRegisteredMetrics, registerMetricInterpreter, mapCalculatorTypeToMetric, classificationDisplayLabel } from '../registry/metricRegistry';

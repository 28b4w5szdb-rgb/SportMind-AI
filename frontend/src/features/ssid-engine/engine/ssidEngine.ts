import type { AthleteAnalyticsSnapshot } from '@/src/analytics/types';
import type { BodyCompositionAnalysis, BodyCompositionRecord } from '@/src/features/nutrition/types';
import type { TrainingLoadSnapshot } from '@/src/features/training-builder/types';
import type { MockAthlete } from '@/src/data/mock/types';

import type { SsidInterpretation, SsidMetricBundle, SsidMetricContext, SsidMetricId } from '../types';
import { interpretMetric } from '../registry/metricRegistry';

export interface SsidDisplayEntry {
  id: string;
  labelKey: string;
  interpretation: SsidInterpretation;
}

export interface SsidReportContent {
  interpretation: string;
  decision: string;
  recommendations: string;
  reference: string;
}

function collectInterpretations(source: SsidMetricBundle | SsidDisplayEntry[]): SsidInterpretation[] {
  if (Array.isArray(source)) {
    return source.map((entry) => entry.interpretation);
  }
  return Object.values(source).filter(Boolean) as SsidInterpretation[];
}

export function formatSsidForAI(interp: SsidInterpretation, translate: (key: string) => string): string {
  return (
    `• ${translate(interp.classificationKey)}: ${interp.result} ${interp.unit}\n` +
    `${translate('ssid.ui.scientificMeaning')}: ${translate(interp.scientificMeaningKey)}\n` +
    `${translate('ssid.ui.physiologicalInterpretation')}: ${translate(interp.physiologicalInterpretationKey)}\n` +
    `${translate('ssid.ui.performanceImpact')}: ${translate(interp.performanceImpactKey)}\n` +
    `${translate('ssid.ui.riskAnalysis')}: ${translate(interp.riskAnalysisKey)}\n` +
    `${translate(interp.coachingDecisionKey)} · ${translate(interp.aiRecommendationKey)}\n` +
    `${translate('ssid.ui.immediate')}: ${translate(interp.recommendations.immediateKey)}\n` +
    `${translate('ssid.confidenceLabel')}: ${interp.confidence}%`
  );
}

export function formatSsidBundleForAI(bundle: SsidMetricBundle, translate: (key: string) => string): string {
  return collectInterpretations(bundle)
    .map((item) => formatSsidForAI(item, translate))
    .join('\n\n');
}

export function formatSsidReportSections(
  source: SsidMetricBundle | SsidDisplayEntry[],
  translate: (key: string) => string
): SsidReportContent {
  const interps = collectInterpretations(source);

  const interpretation = interps
    .map(
      (item) =>
        `• ${translate(item.classificationKey)} (${item.result} ${item.unit})\n` +
        `${translate(item.scientificMeaningKey)}\n` +
        `${translate(item.physiologicalInterpretationKey)}\n` +
        `${translate(item.performanceImpactKey)}\n` +
        `${translate(item.riskAnalysisKey)}`
    )
    .join('\n\n');

  const decision = interps.map((item) => `• ${translate(item.coachingDecisionKey)} — ${translate(item.aiRecommendationKey)}`).join('\n');

  const recommendations = interps
    .map(
      (item) =>
        `• ${translate(item.classificationKey)}\n` +
        `  ${translate('ssid.ui.immediate')}: ${translate(item.recommendations.immediateKey)}\n` +
        `  ${translate('ssid.ui.weekly')}: ${translate(item.recommendations.weeklyKey)}\n` +
        `  ${translate('ssid.ui.longTerm')}: ${translate(item.recommendations.longTermKey)}`
    )
    .join('\n\n');

  const reference = interps
    .map((item) => `${translate(item.scientificReferenceKey)} · ${translate('ssid.confidenceLabel')}: ${item.confidence}%`)
    .join('\n');

  return { interpretation, decision, recommendations, reference };
}

export function buildWorkspaceSsidEntries(
  analytics: AthleteAnalyticsSnapshot,
  bodyComp?: SsidMetricBundle
): SsidDisplayEntry[] {
  const entries: SsidDisplayEntry[] = [];
  const modules = analytics.overall.modules;
  const moduleScore = (id: string) => modules.find((m) => m.id === id)?.score;

  entries.push({
    id: 'overall',
    labelKey: 'ssid.ui.overallScore',
    interpretation: interpretMetric('readiness_score', analytics.overall.score / 10, '%'),
  });

  if (analytics.ssid?.readinessScore) {
    entries.push({
      id: 'readiness',
      labelKey: 'ssid.metricLabels.readiness_score',
      interpretation: analytics.ssid.readinessScore,
    });
  }

  if (analytics.ssid?.recoveryScore) {
    entries.push({
      id: 'recovery',
      labelKey: 'ssid.metricLabels.recovery_score',
      interpretation: analytics.ssid.recoveryScore,
    });
  }

  const fatigue = moduleScore('fatigue');
  if (fatigue !== undefined) {
    entries.push({
      id: 'fatigue',
      labelKey: 'ssid.ui.fatigue',
      interpretation: interpretMetric('recovery_score', fatigue, '%'),
    });
  }

  const injuryRisk = moduleScore('injury_risk');
  if (injuryRisk !== undefined) {
    entries.push({
      id: 'injury_risk',
      labelKey: 'ssid.ui.injuryRisk',
      interpretation: interpretMetric('readiness_score', injuryRisk, '%'),
    });
  }

  if (analytics.ssid?.sessionLoad) {
    entries.push({
      id: 'session_load',
      labelKey: 'ssid.metricLabels.session_load',
      interpretation: analytics.ssid.sessionLoad,
    });
  } else {
    const load = moduleScore('training_load');
    if (load !== undefined) {
      entries.push({
        id: 'training_load',
        labelKey: 'ssid.ui.trainingLoad',
        interpretation: interpretMetric('session_load', load * 4, 'AU'),
      });
    }
  }

  if (analytics.ssid?.acwr) {
    entries.push({
      id: 'acwr',
      labelKey: 'ssid.metricLabels.acwr',
      interpretation: analytics.ssid.acwr,
    });
  }

  if (bodyComp?.bmi) {
    entries.push({ id: 'bmi', labelKey: 'ssid.metricLabels.bmi', interpretation: bodyComp.bmi });
  }
  if (bodyComp?.bodyFat) {
    entries.push({ id: 'body_fat', labelKey: 'ssid.metricLabels.body_fat', interpretation: bodyComp.bodyFat });
  }

  return entries;
}

export function buildCalculatorSsidEntries(interpretation: SsidInterpretation): SsidDisplayEntry[] {
  return [{ id: interpretation.metricId, labelKey: `ssid.metricLabels.${interpretation.metricId}`, interpretation }];
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

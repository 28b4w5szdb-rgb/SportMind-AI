import { buildBodyCompositionSsidBundle } from '@/src/features/ssid-engine';
import type {
  BodyCompositionAnalysis,
  BodyCompositionRecord,
  BodyCompositionStatusId,
  BodyCompositionTrendDirection,
  NutritionGoalId,
} from '../types';
import { computeBmi } from './nutritionEngine';

function clamp(n: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(n * 10) / 10));
}

function trendFromDelta(delta: number | undefined, threshold = 0.3): BodyCompositionTrendDirection {
  if (delta === undefined) return 'stable';
  if (delta > threshold) return 'up';
  if (delta < -threshold) return 'down';
  return 'stable';
}

export function computeWaistHipRatio(waistCm?: number, hipCm?: number): number | undefined {
  if (!waistCm || !hipCm || hipCm <= 0) return undefined;
  return Math.round((waistCm / hipCm) * 100) / 100;
}

export function computeBodyCompositionTrendScore(
  analysis: BodyCompositionAnalysis,
  goal: NutritionGoalId
): number {
  if (!analysis.latest) return 50;
  let score = 70;

  if (analysis.bmi !== undefined) {
    if (analysis.bmi >= 18.5 && analysis.bmi <= 27) score += 10;
    else if (analysis.bmi < 18 || analysis.bmi > 30) score -= 12;
  }

  if (analysis.waistHipRatio !== undefined) {
    if (analysis.waistHipRatio <= 0.9) score += 8;
    else if (analysis.waistHipRatio > 1.0) score -= 10;
  }

  if (analysis.previous && analysis.weightChange !== undefined) {
    if (goal === 'weight_loss' || goal === 'lose_fat') {
      score += analysis.weightChange <= 0 ? 12 : -8;
      if (analysis.bodyFatChange !== undefined) score += analysis.bodyFatChange <= 0 ? 8 : -6;
    } else if (goal === 'weight_gain' || goal === 'build_muscle') {
      score += analysis.weightChange >= 0 ? 10 : -6;
      if (analysis.muscleMassChange !== undefined) score += analysis.muscleMassChange >= 0 ? 8 : -4;
    } else {
      score += Math.abs(analysis.weightChange) <= 0.5 ? 8 : -4;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function analyzeBodyComposition(
  records: BodyCompositionRecord[],
  heightCm: number,
  goal: NutritionGoalId = 'performance',
  athlete?: { gender?: 'male' | 'female' | 'other'; height_cm?: number; weight_kg?: number }
): BodyCompositionAnalysis {
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const previous = sorted[1];

  if (!latest) {
    return {
      trendDirection: 'stable',
      status: 'monitor',
      statusKey: 'nutrition.bodyComp.statusMonitor',
    };
  }
  const weightChange = previous ? clamp(latest.weight_kg - previous.weight_kg, -20, 20) : undefined;
  const bodyFatChange =
    previous && latest.body_fat_percent !== undefined && previous.body_fat_percent !== undefined
      ? clamp(latest.body_fat_percent - previous.body_fat_percent, -20, 20)
      : undefined;
  const muscleMassChange =
    previous && latest.muscle_mass_kg !== undefined && previous.muscle_mass_kg !== undefined
      ? clamp(latest.muscle_mass_kg - previous.muscle_mass_kg, -20, 20)
      : undefined;

  const bmi = heightCm > 0 ? computeBmi(latest.weight_kg, heightCm) : undefined;
  const waistHipRatio = computeWaistHipRatio(latest.waist_cm, latest.hip_cm);
  const trendDirection = trendFromDelta(weightChange);

  let status: BodyCompositionStatusId = 'optimal';
  let statusKey = 'nutrition.bodyComp.statusOptimal';

  if (bmi !== undefined && (bmi < 18 || bmi > 30)) {
    status = 'attention';
    statusKey = 'nutrition.bodyComp.statusAttention';
  } else if (waistHipRatio !== undefined && waistHipRatio > 1.0) {
    status = 'attention';
    statusKey = 'nutrition.bodyComp.statusAttention';
  } else if (
    (goal === 'lose_fat' || goal === 'weight_loss') &&
    weightChange !== undefined &&
    weightChange > 0.5
  ) {
    status = 'monitor';
    statusKey = 'nutrition.bodyComp.statusMonitor';
  } else if (!previous) {
    status = 'monitor';
    statusKey = 'nutrition.bodyComp.statusMonitor';
  }

  const analysis: BodyCompositionAnalysis = {
    latest,
    previous,
    weightChange,
    bodyFatChange,
    muscleMassChange,
    trendDirection,
    bmi,
    waistHipRatio,
    status,
    statusKey,
  };

  analysis.ssid = buildBodyCompositionSsidBundle(analysis, athlete);

  return analysis;
}

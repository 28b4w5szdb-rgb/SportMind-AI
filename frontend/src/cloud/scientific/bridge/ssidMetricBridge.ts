/**
 * SSID bridge — routes UI interpretMetric calls through cloud metric rules (Phase 8.2).
 */

import type {
  SsidCoachingDecisionId,
  SsidInterpretation,
  SsidMetricContext,
  SsidMetricId,
} from '@/src/features/ssid-engine';
import { buildInterpretation } from '@/src/features/ssid-engine/utils/buildInterpretation';
import type {
  SsidClassificationId,
  SsidInterpretationInput,
} from '../models/interpretation/ScientificInterpretation';
import { getMetricRule } from '../seed/ssid/ssidMetricRules';
import { decisionForRiskLevel } from './decisionBridge';

const BAND_DECISIONS: Partial<Record<SsidMetricId, Record<string, SsidCoachingDecisionId>>> = {
  bmi: {
    underweight: 'increase_calories',
    normal: 'train_normally',
    overweight: 'reduce_load',
    obesity: 'medical_evaluation',
  },
  body_fat: {
    athlete: 'maintain',
    excellent: 'maintain',
    good: 'train_normally',
    average: 'mobility_session',
    high: 'reduce_load',
  },
  body_water: {
    low: 'increase_hydration',
    optimal: 'maintain',
    elevated: 'retest',
  },
  muscle_mass: { low: 'increase_protein', optimal: 'maintain', high: 'maintain' },
  lean_mass: { low: 'increase_calories', optimal: 'maintain', high: 'maintain' },
  vo2_max: {
    poor: 'recovery_session',
    fair: 'recovery_session',
    good: 'train_normally',
    very_good: 'train_normally',
    excellent: 'maintain',
    elite: 'maintain',
  },
  hr_zones: {
    zone1: 'recovery_session',
    zone2: 'recovery_session',
    zone3: 'train_normally',
    zone4: 'train_normally',
    zone5: 'reduce_load',
  },
  session_load: {
    low: 'maintain',
    moderate: 'train_normally',
    high: 'recovery_session',
    very_high: 'reduce_load',
  },
  acwr: {
    undertraining: 'maintain',
    optimal: 'train_normally',
    elevated: 'reduce_load',
    spike: 'recovery_session',
  },
  recovery_score: {
    poor: 'recovery_session',
    needs_recovery: 'recovery_session',
    moderate: 'reduce_load',
    good: 'train_normally',
    excellent: 'train_normally',
  },
  readiness_score: {
    poor: 'medical_evaluation',
    needs_recovery: 'recovery_session',
    moderate: 'reduce_load',
    good: 'train_normally',
    excellent: 'train_normally',
  },
};

/** Map cloud classification_id + value to UI i18n band keys. */
function mapCloudToUiBand(metricId: SsidMetricId, classificationId: string, value: number, ctx?: SsidMetricContext): string {
  if (metricId === 'bmi') {
    if (value < 18.5) return 'underweight';
    if (value < 25) return 'normal';
    if (value < 30) return 'overweight';
    return 'obesity';
  }

  const MAP: Partial<Record<SsidMetricId, Record<string, string>>> = {
    vo2_max: {
      poor: 'poor',
      below_average: 'fair',
      good: 'good',
      excellent: 'very_good',
      elite: 'elite',
    },
    body_fat: {
      elite: 'athlete',
      excellent: 'excellent',
      good: 'good',
      average: 'average',
      poor: 'high',
    },
    session_load: {
      below_average: 'low',
      good: 'moderate',
      average: 'high',
      poor: 'very_high',
    },
    acwr: {
      below_average: 'undertraining',
      good: 'optimal',
      average: 'elevated',
      poor: 'spike',
    },
    recovery_score: {
      poor: 'poor',
      below_average: 'needs_recovery',
      average: 'moderate',
      good: 'good',
      excellent: 'excellent',
    },
    readiness_score: {
      poor: 'poor',
      below_average: 'needs_recovery',
      average: 'moderate',
      good: 'good',
      excellent: 'excellent',
    },
  };

  return MAP[metricId]?.[classificationId] ?? classificationId;
}

function preClassifyRelativeMetric(metricId: SsidMetricId, value: number, ctx?: SsidMetricContext): SsidClassificationId {
  if (metricId === 'hr_zones') {
    const maxHr = Number(ctx?.extras?.maxHr ?? 190);
    const pct = maxHr > 0 ? (value / maxHr) * 100 : 85;
    if (pct < 60) return 'below_average';
    if (pct < 70) return 'average';
    if (pct < 80) return 'good';
    if (pct < 90) return 'excellent';
    return 'elite';
  }

  if (metricId === 'body_water') {
    if (value < 50) return 'poor';
    if (value > 65) return 'below_average';
    return 'good';
  }

  if (metricId === 'muscle_mass') {
    const weight = ctx?.weightKg ?? 75;
    const ratio = weight > 0 ? (value / weight) * 100 : 0;
    if (ratio < 38) return 'poor';
    if (ratio > 48) return 'excellent';
    return 'good';
  }

  if (metricId === 'lean_mass') {
    const weight = ctx?.weightKg ?? 75;
    const ratio = weight > 0 ? (value / weight) * 100 : 0;
    if (ratio < 72) return 'poor';
    if (ratio > 88) return 'excellent';
    return 'good';
  }

  return 'unknown';
}

function resolveUiBand(metricId: SsidMetricId, classificationId: string, value: number, ctx?: SsidMetricContext): string {
  const relativeMetrics: SsidMetricId[] = ['hr_zones', 'body_water', 'muscle_mass', 'lean_mass'];
  if (relativeMetrics.includes(metricId)) {
    const pre = preClassifyRelativeMetric(metricId, value, ctx);
    const HR_ZONE_BANDS: Record<string, string> = {
      below_average: 'zone1',
      average: 'zone2',
      good: 'zone3',
      excellent: 'zone4',
      elite: 'zone5',
    };
    const BODY_WATER_BANDS: Record<string, string> = {
      poor: 'low',
      good: 'optimal',
      below_average: 'elevated',
    };
    const RATIO_BANDS: Record<string, string> = {
      poor: 'low',
      good: 'optimal',
      excellent: 'high',
    };
    if (metricId === 'hr_zones') return HR_ZONE_BANDS[pre] ?? 'zone3';
    if (metricId === 'body_water') return BODY_WATER_BANDS[pre] ?? 'optimal';
    return RATIO_BANDS[pre] ?? 'optimal';
  }

  return mapCloudToUiBand(metricId, classificationId, value, ctx);
}

function buildInput(
  metricId: SsidMetricId,
  value: number,
  unit: string,
  ctx?: SsidMetricContext
): SsidInterpretationInput {
  return {
    assessment_definition_key: metricId,
    metric_key: metricId,
    metric_value: value,
    metric_unit: unit,
    evidence_tier: 'screening',
    classification_id: preClassifyRelativeMetric(metricId, value, ctx),
    formula_version: null,
    reference_version: null,
    normative_band: null,
    lower_is_better: false,
    sex: ctx?.gender === 'female' ? 'female' : 'male',
  };
}

function resolveDecision(metricId: SsidMetricId, band: string, risk: import('../models/interpretation/ScientificInterpretation').SsidRiskLevel): SsidCoachingDecisionId {
  return BAND_DECISIONS[metricId]?.[band] ?? decisionForRiskLevel(risk);
}

/**
 * Interpret a metric value via cloud SSID metric rules.
 * Returns UI-shaped SsidInterpretation (i18n keys preserved).
 */
export function interpretMetricViaScientificCore(
  metricId: SsidMetricId,
  value: number,
  unit?: string,
  context?: SsidMetricContext
): SsidInterpretation {
  const rule = getMetricRule(metricId);
  if (!rule) {
    throw new Error(`ssid_metric_rule_not_found:${metricId}`);
  }

  const input = buildInput(metricId, value, unit ?? '', context);
  const evaluated = rule.evaluate(input);
  const band = resolveUiBand(metricId, evaluated.classification_id, value, context);
  const decision = resolveDecision(metricId, band, evaluated.risk_level);

  return buildInterpretation(metricId, band, decision, value, unit ?? '', context, evaluated.confidence);
}

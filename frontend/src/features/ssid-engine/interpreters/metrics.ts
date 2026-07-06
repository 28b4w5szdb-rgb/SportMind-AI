import type { SsidInterpretation, SsidMetricContext, SsidCoachingDecisionId } from '../types';
import { buildInterpretation } from '../utils/buildInterpretation';

function gender(ctx?: SsidMetricContext): 'male' | 'female' {
  return ctx?.gender === 'female' ? 'female' : 'male';
}

export function interpretBmi(value: number, unit = 'kg/m²', ctx?: SsidMetricContext): SsidInterpretation {
  let band = 'normal';
  let decision: SsidCoachingDecisionId = 'maintain';
  if (value < 18.5) {
    band = 'underweight';
    decision = 'increase_calories';
  } else if (value < 25) {
    band = 'normal';
    decision = 'train_normally';
  } else if (value < 30) {
    band = 'overweight';
    decision = 'reduce_load';
  } else {
    band = 'obesity';
    decision = 'medical_evaluation';
  }
  return buildInterpretation('bmi', band, decision, value, unit, ctx, 88);
}

export function interpretBodyFat(value: number, unit = '%', ctx?: SsidMetricContext): SsidInterpretation {
  const female = gender(ctx) === 'female';
  let band = 'good';
  let decision: SsidCoachingDecisionId = 'maintain';
  if (female) {
    if (value < 16) band = 'athlete';
    else if (value < 20) band = 'excellent';
    else if (value < 24) band = 'good';
    else if (value < 28) band = 'average';
    else band = 'high';
  } else {
    if (value < 8) band = 'athlete';
    else if (value < 12) band = 'excellent';
    else if (value < 16) band = 'good';
    else if (value < 20) band = 'average';
    else band = 'high';
  }
  if (band === 'high') decision = 'reduce_load';
  else if (band === 'average') decision = 'mobility_session';
  else if (band === 'athlete' || band === 'excellent') decision = 'maintain';
  else decision = 'train_normally';
  const ref = female ? 22 : 14;
  return buildInterpretation('body_fat', band, decision, value, unit, { ...ctx, referenceValue: ref }, 86);
}

export function interpretBodyWater(value: number, unit = '%', ctx?: SsidMetricContext): SsidInterpretation {
  let band = 'optimal';
  let decision: SsidCoachingDecisionId = 'maintain';
  if (value < 50) {
    band = 'low';
    decision = 'increase_hydration';
  } else if (value > 65) {
    band = 'elevated';
    decision = 'retest';
  } else {
    band = 'optimal';
    decision = 'maintain';
  }
  return buildInterpretation('body_water', band, decision, value, unit, { ...ctx, referenceValue: 57 }, 80);
}

export function interpretMuscleMass(value: number, unit = 'kg', ctx?: SsidMetricContext): SsidInterpretation {
  const weight = ctx?.weightKg ?? 75;
  const ratio = weight > 0 ? (value / weight) * 100 : 0;
  let band = 'optimal';
  let decision: SsidCoachingDecisionId = 'maintain';
  if (ratio < 38) {
    band = 'low';
    decision = 'increase_protein';
  } else if (ratio > 48) {
    band = 'high';
    decision = 'maintain';
  }
  return buildInterpretation('muscle_mass', band, decision, value, unit, { ...ctx, referenceValue: weight * 0.42 }, 78);
}

export function interpretLeanMass(value: number, unit = 'kg', ctx?: SsidMetricContext): SsidInterpretation {
  const weight = ctx?.weightKg ?? 75;
  const ratio = weight > 0 ? (value / weight) * 100 : 0;
  let band = 'optimal';
  let decision: SsidCoachingDecisionId = 'maintain';
  if (ratio < 72) {
    band = 'low';
    decision = 'increase_calories';
  } else if (ratio > 88) {
    band = 'high';
    decision = 'maintain';
  }
  return buildInterpretation('lean_mass', band, decision, value, unit, { ...ctx, referenceValue: weight * 0.82 }, 78);
}

export function interpretVo2Max(value: number, unit = 'ml/kg/min', ctx?: SsidMetricContext): SsidInterpretation {
  const age = ctx?.ageYears ?? 22;
  const ageAdj = Math.max(0, (30 - age) * 0.15);
  const adjusted = value + ageAdj;
  let band = 'good';
  let decision: SsidCoachingDecisionId = 'train_normally';
  if (adjusted < 35) band = 'poor';
  else if (adjusted < 42) band = 'fair';
  else if (adjusted < 48) band = 'good';
  else if (adjusted < 55) band = 'very_good';
  else if (adjusted < 62) band = 'excellent';
  else band = 'elite';

  if (band === 'poor' || band === 'fair') decision = 'recovery_session';
  else if (band === 'elite' || band === 'excellent') decision = 'maintain';
  return buildInterpretation('vo2_max', band, decision, value, unit, { ...ctx, referenceValue: 48 }, 84);
}

export function interpretHrZones(value: number, unit = 'bpm', ctx?: SsidMetricContext): SsidInterpretation {
  const maxHr = Number(ctx?.extras?.maxHr ?? 190);
  const pct = maxHr > 0 ? (value / maxHr) * 100 : 85;
  let band = 'zone3';
  let decision: SsidCoachingDecisionId = 'train_normally';
  if (pct < 60) band = 'zone1';
  else if (pct < 70) band = 'zone2';
  else if (pct < 80) band = 'zone3';
  else if (pct < 90) band = 'zone4';
  else band = 'zone5';

  if (band === 'zone5') decision = 'reduce_load';
  else if (band === 'zone1' || band === 'zone2') decision = 'recovery_session';
  return buildInterpretation('hr_zones', band, decision, value, unit, { ...ctx, referenceValue: Math.round(maxHr * 0.85) }, 83);
}

export function interpretSessionLoad(value: number, unit = 'AU', ctx?: SsidMetricContext): SsidInterpretation {
  const chronicDaily = ctx?.extras?.chronicDaily ? Number(ctx.extras.chronicDaily) : undefined;
  const ref = chronicDaily && chronicDaily > 0 ? chronicDaily : 450;
  const ratio = ref > 0 ? value / ref : value / 450;
  let band = 'moderate';
  let decision: SsidCoachingDecisionId = 'train_normally';
  if (ratio < 0.6) band = 'low';
  else if (ratio < 1.0) band = 'moderate';
  else if (ratio < 1.4) band = 'high';
  else band = 'very_high';

  if (band === 'very_high') decision = 'reduce_load';
  else if (band === 'high') decision = 'recovery_session';
  else if (band === 'low') decision = 'maintain';
  return buildInterpretation('session_load', band, decision, value, unit, { ...ctx, referenceValue: ref }, 85);
}

export function interpretAcwr(value: number, unit = 'ratio', ctx?: SsidMetricContext): SsidInterpretation {
  let band = 'optimal';
  let decision: SsidCoachingDecisionId = 'train_normally';
  if (value < 0.8) {
    band = 'undertraining';
    decision = 'maintain';
  } else if (value <= 1.3) {
    band = 'optimal';
    decision = 'train_normally';
  } else if (value <= 1.5) {
    band = 'elevated';
    decision = 'reduce_load';
  } else {
    band = 'spike';
    decision = 'recovery_session';
  }
  return buildInterpretation('acwr', band, decision, value, unit, { ...ctx, referenceValue: 1.0 }, 87);
}

export function interpretRecoveryScore(value: number, unit = '%', ctx?: SsidMetricContext): SsidInterpretation {
  let band = 'good';
  let decision: SsidCoachingDecisionId = 'train_normally';
  if (value < 40) {
    band = 'poor';
    decision = 'recovery_session';
  } else if (value < 55) {
    band = 'needs_recovery';
    decision = 'recovery_session';
  } else if (value < 70) {
    band = 'moderate';
    decision = 'reduce_load';
  } else if (value < 85) {
    band = 'good';
    decision = 'train_normally';
  } else {
    band = 'excellent';
    decision = 'train_normally';
  }
  return buildInterpretation('recovery_score', band, decision, value, unit, { ...ctx, referenceValue: 70 }, 86);
}

export function interpretReadinessScore(value: number, unit = '%', ctx?: SsidMetricContext): SsidInterpretation {
  let band = 'good';
  let decision: SsidCoachingDecisionId = 'train_normally';
  if (value < 40) {
    band = 'poor';
    decision = 'medical_evaluation';
  } else if (value < 55) {
    band = 'needs_recovery';
    decision = 'recovery_session';
  } else if (value < 70) {
    band = 'moderate';
    decision = 'reduce_load';
  } else if (value < 85) {
    band = 'good';
    decision = 'train_normally';
  } else {
    band = 'excellent';
    decision = 'train_normally';
  }
  return buildInterpretation('readiness_score', band, decision, value, unit, { ...ctx, referenceValue: 75 }, 88);
}

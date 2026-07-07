/**
 * Consistency Engine — rejects advice contradicting Scientific Core context (Phase 9.1).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { ScientificRecommendation } from '../models/SdssRecommendation';
import type { ConsistencyCheckResult } from '../models/Governance';

const HIGH_LOAD_ACTION = /high.?intensity|maximal|sprint|heavy load|حمل.?عال|شدة.?عالية/i;
const MAINTAIN_LOAD_ACTION = /maintain planned load|continue plan|استمر|حافظ على الحمل/i;
const RECOVERY_ACTION = /recovery session|active recovery|تعاف|راحة/i;

function contextMetricKeys(ctx: SdssDecisionContext): Set<string> {
  const keys = new Set<string>();
  for (const insight of ctx.ssid_insights) keys.add(insight.metric_key);
  for (const assessment of ctx.latest_assessments) {
    keys.add(assessment.metric_key);
    keys.add(assessment.assessment_key);
  }
  if (ctx.recovery?.recovery_score != null) keys.add('recovery_score');
  if (ctx.recovery?.fatigue != null) keys.add('fatigue');
  if (ctx.recovery?.sleep_hours != null) keys.add('sleep');
  if (ctx.training_load?.acwr != null) keys.add('acwr');
  keys.add('readiness');
  keys.add('training_load');
  keys.add('evidence_completeness');
  return keys;
}

/** Compare recommendation against SSID, passport, timeline, load, recovery, assessments. */
export function checkRecommendationConsistency(
  rec: ScientificRecommendation,
  ctx: SdssDecisionContext
): ConsistencyCheckResult {
  const conflicts: string[] = [];
  const checkedSources: string[] = [];

  if (ctx.analytics_decision_level) {
    checkedSources.push('analytics_decision');
    if (
      ctx.analytics_decision_level === 'recovery_day' &&
      rec.category === 'training' &&
      HIGH_LOAD_ACTION.test(rec.recommended_action)
    ) {
      conflicts.push('contradicts_recovery_day_decision');
    }
    if (
      ctx.analytics_decision_level === 'medical_evaluation' &&
      (rec.category === 'training' || rec.category === 'workload') &&
      !RECOVERY_ACTION.test(rec.recommended_action)
    ) {
      conflicts.push('contradicts_medical_evaluation_decision');
    }
  }

  if (ctx.training_load?.acwr != null) {
    checkedSources.push('training_load');
    if (ctx.training_load.acwr > 1.3 && MAINTAIN_LOAD_ACTION.test(rec.recommended_action)) {
      conflicts.push('contradicts_elevated_acwr');
    }
  }

  if (ctx.recovery?.recovery_score != null) {
    checkedSources.push('recovery');
    if (
      ctx.recovery.recovery_score < 40 &&
      rec.category === 'readiness' &&
      HIGH_LOAD_ACTION.test(rec.recommended_action)
    ) {
      conflicts.push('contradicts_low_recovery_score');
    }
  }

  if (ctx.ssid_insights.length > 0) {
    checkedSources.push('ssid');
    const highRisk = ctx.ssid_insights.some((i) => i.risk_level === 'high');
    if (highRisk && rec.category === 'injury_risk' && rec.priority === 'low') {
      conflicts.push('contradicts_ssid_high_risk');
    }
  }

  if (ctx.passport_sections.some((s) => !s.is_missing)) {
    checkedSources.push('passport');
  }
  if (ctx.timeline_events.length > 0) checkedSources.push('timeline');
  if (ctx.latest_assessments.length > 0) checkedSources.push('assessments');

  const available = contextMetricKeys(ctx);
  for (const metric of rec.affected_metrics) {
    if (!available.has(metric) && metric !== 'evidence_completeness') {
      conflicts.push(`metric_not_in_context:${metric}`);
    }
  }

  return {
    recommendation_id: rec.id,
    consistent: conflicts.length === 0,
    conflicts,
    checked_sources: checkedSources,
  };
}

export function checkRecommendationsConsistency(
  recommendations: ScientificRecommendation[],
  ctx: SdssDecisionContext
): ConsistencyCheckResult[] {
  return recommendations.map((rec) => checkRecommendationConsistency(rec, ctx));
}

/**
 * Prompt Contract — defines allowed outbound prompt structure (Phase 9.2).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { SdssRecommendationCategory } from '../models/SdssRecommendation';
import type { SafePromptContractPayload } from './privacyModels';
import { DEFAULT_ALLOWED_CATEGORIES } from './privacyPolicy';
import { evidenceSummaryText } from '../context/evidenceCollector';

const FORBIDDEN_SERIALIZED_KEYS = [
  'organization_id',
  'athlete_id',
  'context_id',
  'session_id',
  'event_id',
  'role_ids',
  'permission_ids',
  'firestore',
  'memberships',
  'role_views',
  'last_sync',
  'built_at',
];

/** Validate contract payload contains no forbidden keys (recursive string check). */
export function validatePromptContract(payload: SafePromptContractPayload): { valid: boolean; violations: string[] } {
  const serialized = JSON.stringify(payload);
  const violations: string[] = [];
  for (const key of FORBIDDEN_SERIALIZED_KEYS) {
    if (serialized.includes(`"${key}"`)) {
      violations.push(`forbidden_key:${key}`);
    }
  }
  if (/organizations\/|firestore\/|role_views\//.test(serialized)) {
    violations.push('forbidden_path');
  }
  return { valid: violations.length === 0, violations };
}

function collectAvailableMetrics(ctx: SdssDecisionContext): string[] {
  const metrics = new Set<string>();
  for (const insight of ctx.ssid_insights) metrics.add(insight.metric_key);
  for (const a of ctx.latest_assessments) metrics.add(a.metric_key);
  if (ctx.recovery?.recovery_score != null) metrics.add('recovery_score');
  if (ctx.recovery?.fatigue != null) metrics.add('fatigue');
  if (ctx.training_load?.acwr != null) metrics.add('acwr');
  if (ctx.analytics_overall_score != null) metrics.add('overall_score');
  return [...metrics];
}

/** Build contract-compliant payload from redacted decision context. */
export function buildPromptContractPayload(
  ctx: SdssDecisionContext,
  redactedUserQuery: string,
  allowedCategories: SdssRecommendationCategory[] = [...DEFAULT_ALLOWED_CATEGORIES]
): SafePromptContractPayload {
  return {
    scientific_context: {
      passport_sections: ctx.passport_sections
        .filter((s) => !s.is_missing)
        .map(({ title, field_count, confidence }) => ({ title, field_count, confidence })),
      timeline_summaries: ctx.timeline_events.map(({ event_type, title, summary, severity }) => ({
        event_type,
        title,
        summary,
        severity,
      })),
      assessments: ctx.latest_assessments.map(
        ({ assessment_key, metric_key, value, unit, normative_band }) => ({
          assessment_key,
          metric_key,
          value,
          unit,
          normative_band,
        })
      ),
      ssid_insights: ctx.ssid_insights.map(({ metric_key, classification_id, risk_level }) => ({
        metric_key,
        classification_id,
        risk_level,
      })),
      training_load: ctx.training_load
        ? { acwr: ctx.training_load.acwr, compliance_percent: ctx.training_load.compliance_percent }
        : null,
      recovery: ctx.recovery
        ? {
            recovery_score: ctx.recovery.recovery_score,
            fatigue: ctx.recovery.fatigue,
            sleep_hours: ctx.recovery.sleep_hours,
          }
        : null,
      nutrition: ctx.nutrition,
      wearables: ctx.wearables
        ? { provider: ctx.wearables.provider, recovery_score: ctx.wearables.recovery_score }
        : null,
      decision_level: ctx.analytics_decision_level,
      overall_score: ctx.analytics_overall_score,
    },
    evidence_summary: evidenceSummaryText(ctx.evidence_summary, ctx.locale),
    available_metrics: collectAvailableMetrics(ctx),
    missing_metrics: ctx.evidence_summary.missing_sources,
    viewer_role: ctx.viewer_role,
    language: ctx.locale,
    allowed_recommendation_categories: allowedCategories,
    user_request: redactedUserQuery,
  };
}

export { FORBIDDEN_SERIALIZED_KEYS };

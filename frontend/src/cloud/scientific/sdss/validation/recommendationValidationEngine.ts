/**
 * Recommendation Validation Engine — rejects incomplete recommendations (Phase 9.1).
 */

import type { ScientificRecommendation, SdssRecommendationCategory } from '../models/SdssRecommendation';
import type { RecommendationValidationResult } from '../models/Governance';

const CATEGORIES_REQUIRING_METRICS: SdssRecommendationCategory[] = [
  'training',
  'recovery',
  'readiness',
  'workload',
  'injury_risk',
  'nutrition',
  'hydration',
  'sleep',
];

function hasText(value: string | null | undefined): boolean {
  return Boolean(value?.trim());
}

/** Validate a single recommendation for completeness and explainability. */
export function validateRecommendationCompleteness(
  rec: ScientificRecommendation
): RecommendationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!hasText(rec.title)) errors.push('missing_title');
  if (!hasText(rec.summary)) errors.push('missing_summary');
  if (!hasText(rec.scientific_reasoning)) errors.push('missing_scientific_reasoning');
  if (!hasText(rec.recommended_action)) errors.push('missing_recommended_action');
  if (!rec.category) errors.push('missing_category');
  if (!rec.confidence) errors.push('missing_confidence');
  if (!hasText(rec.explainability?.why)) errors.push('missing_why');
  if (!hasText(rec.explainability?.confidence_rationale)) errors.push('missing_confidence_rationale');

  if (
    rec.confidence !== 'insufficient_evidence' &&
    rec.explainability.evidence_used.length === 0
  ) {
    errors.push('missing_evidence_used');
  }

  if (rec.limitations.length === 0 && rec.confidence !== 'insufficient_evidence') {
    warnings.push('missing_limitations');
  }

  if (
    CATEGORIES_REQUIRING_METRICS.includes(rec.category) &&
    rec.affected_metrics.length === 0
  ) {
    errors.push('missing_affected_metrics');
  }

  if (rec.category === 'monitoring' && rec.affected_metrics.length === 0) {
    warnings.push('monitoring_without_metrics');
  }

  return {
    recommendation_id: rec.id,
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export function validateRecommendations(
  recommendations: ScientificRecommendation[]
): RecommendationValidationResult[] {
  return recommendations.map(validateRecommendationCompleteness);
}

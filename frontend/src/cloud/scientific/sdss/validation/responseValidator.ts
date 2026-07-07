/**
 * Response validator — ensures SSDI outputs meet explainability requirements (Phase 9.0).
 */

import type { ScientificRecommendation } from '../models/SdssRecommendation';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateRecommendation(rec: ScientificRecommendation): ValidationResult {
  const errors: string[] = [];
  if (!rec.title?.trim()) errors.push('missing_title');
  if (!rec.explainability?.why?.trim()) errors.push('missing_why');
  if (!rec.explainability?.confidence) errors.push('missing_confidence');
  if (!rec.recommended_action?.trim()) errors.push('missing_action');
  if (!rec.scientific_reasoning?.trim()) errors.push('missing_reasoning');
  if (rec.explainability.evidence_used.length === 0 && rec.confidence !== 'insufficient_evidence') {
    errors.push('missing_evidence_used');
  }
  return { valid: errors.length === 0, errors };
}

export function validateRecommendationBundle(recommendations: ScientificRecommendation[]): ValidationResult {
  if (recommendations.length === 0) {
    return { valid: false, errors: ['empty_bundle'] };
  }
  const errors: string[] = [];
  for (const rec of recommendations) {
    const result = validateRecommendation(rec);
    if (!result.valid) {
      errors.push(`${rec.id}:${result.errors.join(',')}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

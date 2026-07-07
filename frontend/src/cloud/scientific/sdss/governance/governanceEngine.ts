/**
 * Governance Engine — assigns validation status, risk, and review flags (Phase 9.1).
 */

import type { ScientificRecommendation } from '../models/SdssRecommendation';
import type {
  ConfidenceCalibrationResult,
  ConsistencyCheckResult,
  GovernanceDecision,
  GovernanceRiskLevel,
  HallucinationGuardResult,
  RecommendationValidationResult,
  ValidationStatus,
} from '../models/Governance';

function deriveRiskLevel(
  rec: ScientificRecommendation,
  validation: RecommendationValidationResult,
  consistency: ConsistencyCheckResult,
  hallucination: HallucinationGuardResult
): GovernanceRiskLevel {
  if (hallucination.disposition === 'rejected') return 'critical';
  if (rec.category === 'sports_medicine' || rec.category === 'return_to_play') return 'high';
  if (!validation.valid || !consistency.consistent) return 'high';
  if (hallucination.disposition === 'needs_review') return 'moderate';
  if (rec.priority === 'critical') return 'high';
  if (rec.priority === 'high') return 'moderate';
  if (rec.confidence === 'low' || rec.confidence === 'insufficient_evidence') return 'low';
  return 'minimal';
}

function deriveValidationStatus(
  validation: RecommendationValidationResult,
  consistency: ConsistencyCheckResult,
  hallucination: HallucinationGuardResult,
  calibration: ConfidenceCalibrationResult
): ValidationStatus {
  if (!validation.valid) return 'rejected';
  if (hallucination.disposition === 'rejected') return 'rejected';
  if (!consistency.consistent) return 'rejected';
  if (hallucination.disposition === 'needs_review') return 'needs_review';
  if (
    calibration.calibrated_confidence === 'insufficient_evidence' ||
    calibration.calibrated_confidence === 'low' ||
    hallucination.disposition === 'low_confidence'
  ) {
    return 'low_confidence';
  }
  if (validation.warnings.length > 0) return 'needs_review';
  return 'approved';
}

/** Assign governance decision for a single recommendation. */
export function assignGovernanceDecision(
  rec: ScientificRecommendation,
  validation: RecommendationValidationResult,
  consistency: ConsistencyCheckResult,
  hallucination: HallucinationGuardResult,
  calibration: ConfidenceCalibrationResult
): GovernanceDecision {
  const validationStatus = deriveValidationStatus(validation, consistency, hallucination, calibration);
  const riskLevel = deriveRiskLevel(rec, validation, consistency, hallucination);

  const medicalReviewRequired =
    rec.category === 'sports_medicine' ||
    rec.category === 'return_to_play' ||
    rec.category === 'injury_risk';

  const researchDisclaimerRequired = rec.category === 'research_notes';

  const humanReviewRecommended =
    validationStatus === 'needs_review' ||
    validationStatus === 'low_confidence' ||
    riskLevel === 'high' ||
    riskLevel === 'critical';

  return {
    recommendation_id: rec.id,
    validation_status: validationStatus,
    risk_level: riskLevel,
    review_required: validationStatus !== 'approved',
    medical_review_required: medicalReviewRequired,
    research_disclaimer_required: researchDisclaimerRequired,
    human_review_recommended: humanReviewRecommended,
    hallucination_disposition: hallucination.disposition,
  };
}

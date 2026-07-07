/**
 * SSDI Validation & Governance models (Phase 9.1).
 */

import type { SdssConfidenceLevel } from './SdssRecommendation';

export const VALIDATOR_VERSION = '1.0.0';
export const SCIENTIFIC_CORE_VERSION = '8.2.0';

export type ValidationStatus =
  | 'approved'
  | 'rejected'
  | 'needs_review'
  | 'low_confidence';

export type GovernanceRiskLevel = 'minimal' | 'low' | 'moderate' | 'high' | 'critical';

export type HallucinationDisposition = 'none' | 'needs_review' | 'low_confidence' | 'rejected';

export interface RecommendationValidationResult {
  recommendation_id: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConsistencyCheckResult {
  recommendation_id: string;
  consistent: boolean;
  conflicts: string[];
  checked_sources: string[];
}

export interface HallucinationGuardResult {
  recommendation_id: string;
  disposition: HallucinationDisposition;
  flags: string[];
}

export interface ConfidenceCalibrationResult {
  recommendation_id: string;
  original_confidence: SdssConfidenceLevel;
  calibrated_confidence: SdssConfidenceLevel;
  downgraded: boolean;
  rationale: string;
}

export interface GovernanceDecision {
  recommendation_id: string;
  validation_status: ValidationStatus;
  risk_level: GovernanceRiskLevel;
  review_required: boolean;
  medical_review_required: boolean;
  research_disclaimer_required: boolean;
  human_review_recommended: boolean;
  hallucination_disposition: HallucinationDisposition;
}

export interface ExplainabilityReport {
  recommendation_id: string;
  evidence_used: string[];
  evidence_missing: string[];
  why_this_recommendation: string;
  why_not_alternative: string;
  alternative_interpretation: string | null;
  scientific_limitations: string[];
  internal_notes: string[];
}

/** Immutable audit metadata for human review and compliance. */
export interface RecommendationAuditRecord {
  recommendation_id: string;
  model_version: string;
  scientific_version: string;
  prompt_version: string;
  validator_version: string;
  validation_result: RecommendationValidationResult;
  consistency_result: ConsistencyCheckResult;
  governance_result: GovernanceDecision;
  hallucination_result: HallucinationGuardResult;
  confidence_calibration: ConfidenceCalibrationResult;
  explainability_report: ExplainabilityReport;
  confidence: SdssConfidenceLevel;
  timestamp: string;
}

export interface ValidationMetricsSnapshot {
  total_processed: number;
  validation_pass_rate: number;
  rejected_count: number;
  needs_review_count: number;
  safety_blocks: number;
  confidence_distribution: Partial<Record<SdssConfidenceLevel, number>>;
  average_evidence_completeness_pct: number;
}

export interface GovernancePipelineResult {
  validated_recommendations: import('./SdssRecommendation').ScientificRecommendation[];
  rejected_recommendation_ids: string[];
  audit_records: RecommendationAuditRecord[];
  metrics: ValidationMetricsSnapshot;
}

/**
 * Audit Record Builder — immutable governance audit metadata (Phase 9.1).
 */

import type { ScientificRecommendation } from '../models/SdssRecommendation';
import type {
  ConfidenceCalibrationResult,
  ConsistencyCheckResult,
  ExplainabilityReport,
  GovernanceDecision,
  HallucinationGuardResult,
  RecommendationAuditRecord,
  RecommendationValidationResult,
} from '../models/Governance';
import { SCIENTIFIC_CORE_VERSION, VALIDATOR_VERSION } from '../models/Governance';

export interface AuditRecordInput {
  recommendation: ScientificRecommendation;
  modelVersion: string;
  promptVersion: string;
  validation: RecommendationValidationResult;
  consistency: ConsistencyCheckResult;
  governance: GovernanceDecision;
  hallucination: HallucinationGuardResult;
  calibration: ConfidenceCalibrationResult;
  explainability: ExplainabilityReport;
}

/** Build immutable audit record for human review and compliance. */
export function buildAuditRecord(input: AuditRecordInput): RecommendationAuditRecord {
  const { recommendation: rec } = input;
  return Object.freeze({
    recommendation_id: rec.id,
    model_version: input.modelVersion,
    scientific_version: SCIENTIFIC_CORE_VERSION,
    prompt_version: input.promptVersion,
    validator_version: VALIDATOR_VERSION,
    validation_result: Object.freeze({ ...input.validation }),
    consistency_result: Object.freeze({ ...input.consistency }),
    governance_result: Object.freeze({ ...input.governance }),
    hallucination_result: Object.freeze({ ...input.hallucination }),
    confidence_calibration: Object.freeze({ ...input.calibration }),
    explainability_report: Object.freeze({ ...input.explainability }),
    confidence: input.calibration.calibrated_confidence,
    timestamp: new Date().toISOString(),
  });
}

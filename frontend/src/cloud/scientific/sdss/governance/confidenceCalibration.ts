/**
 * Confidence Calibration — aligns confidence with available evidence (Phase 9.1).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { ScientificRecommendation, SdssConfidenceLevel } from '../models/SdssRecommendation';
import type { ConfidenceCalibrationResult } from '../models/Governance';

const CONFIDENCE_ORDER: SdssConfidenceLevel[] = [
  'very_high',
  'high',
  'moderate',
  'low',
  'insufficient_evidence',
];

function maxConfidenceForCompleteness(pct: number): SdssConfidenceLevel {
  if (pct >= 85) return 'very_high';
  if (pct >= 70) return 'high';
  if (pct >= 50) return 'moderate';
  if (pct >= 30) return 'low';
  return 'insufficient_evidence';
}

function minConfidence(a: SdssConfidenceLevel, b: SdssConfidenceLevel): SdssConfidenceLevel {
  return CONFIDENCE_ORDER.indexOf(a) >= CONFIDENCE_ORDER.indexOf(b) ? a : b;
}

/** Calibrate confidence to match evidence completeness and validation warnings. */
export function calibrateConfidence(
  rec: ScientificRecommendation,
  ctx: SdssDecisionContext
): ConfidenceCalibrationResult {
  const evidenceCap = maxConfidenceForCompleteness(ctx.evidence_summary.overall_completeness_pct);
  let calibrated = minConfidence(rec.confidence, evidenceCap);

  if (rec.explainability.evidence_missing.length > 3) {
    calibrated = minConfidence(calibrated, 'moderate');
  }

  if (rec.affected_metrics.length === 0 && rec.category !== 'monitoring') {
    calibrated = minConfidence(calibrated, 'low');
  }

  const downgraded = CONFIDENCE_ORDER.indexOf(calibrated) > CONFIDENCE_ORDER.indexOf(rec.confidence);

  return {
    recommendation_id: rec.id,
    original_confidence: rec.confidence,
    calibrated_confidence: calibrated,
    downgraded: downgraded || calibrated !== rec.confidence,
    rationale: `Evidence completeness ${ctx.evidence_summary.overall_completeness_pct}% caps confidence at ${evidenceCap}`,
  };
}

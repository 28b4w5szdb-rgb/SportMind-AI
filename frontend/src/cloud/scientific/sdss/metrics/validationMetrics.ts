/**
 * Validation Metrics — tracks pass rate, rejections, safety blocks (Phase 9.1).
 */

import type { SdssConfidenceLevel } from '../models/SdssRecommendation';
import type {
  GovernanceDecision,
  RecommendationAuditRecord,
  ValidationMetricsSnapshot,
} from '../models/Governance';

export class ValidationMetricsCollector {
  private total = 0;
  private approved = 0;
  private rejected = 0;
  private needsReview = 0;
  private safetyBlocks = 0;
  private confidenceCounts: Partial<Record<SdssConfidenceLevel, number>> = {};
  private evidenceCompletenessSum = 0;

  recordAudit(audit: RecommendationAuditRecord, evidenceCompletenessPct = 0): void {
    this.total += 1;
    this.evidenceCompletenessSum += evidenceCompletenessPct;

    const status = audit.governance_result.validation_status;
    if (status === 'approved') this.approved += 1;
    if (status === 'rejected') this.rejected += 1;
    if (status === 'needs_review' || status === 'low_confidence') this.needsReview += 1;

    if (audit.hallucination_result.disposition === 'rejected') {
      this.safetyBlocks += 1;
    }

    const conf = audit.confidence;
    this.confidenceCounts[conf] = (this.confidenceCounts[conf] ?? 0) + 1;
  }

  snapshot(): ValidationMetricsSnapshot {
    return {
      total_processed: this.total,
      validation_pass_rate: this.total === 0 ? 1 : this.approved / this.total,
      rejected_count: this.rejected,
      needs_review_count: this.needsReview,
      safety_blocks: this.safetyBlocks,
      confidence_distribution: { ...this.confidenceCounts },
      average_evidence_completeness_pct:
        this.total === 0 ? 0 : Math.round(this.evidenceCompletenessSum / this.total),
    };
  }

  reset(): void {
    this.total = 0;
    this.approved = 0;
    this.rejected = 0;
    this.needsReview = 0;
    this.safetyBlocks = 0;
    this.confidenceCounts = {};
    this.evidenceCompletenessSum = 0;
  }
}

export function summarizeGovernanceDecisions(decisions: GovernanceDecision[]): ValidationMetricsSnapshot {
  const collector = new ValidationMetricsCollector();
  for (const d of decisions) {
    collector.recordAudit({
      recommendation_id: d.recommendation_id,
      model_version: '',
      scientific_version: '',
      prompt_version: '',
      validator_version: '',
      validation_result: { recommendation_id: d.recommendation_id, valid: d.validation_status !== 'rejected', errors: [], warnings: [] },
      consistency_result: { recommendation_id: d.recommendation_id, consistent: true, conflicts: [], checked_sources: [] },
      governance_result: d,
      hallucination_result: { recommendation_id: d.recommendation_id, disposition: d.hallucination_disposition, flags: [] },
      confidence_calibration: {
        recommendation_id: d.recommendation_id,
        original_confidence: 'moderate',
        calibrated_confidence: 'moderate',
        downgraded: false,
        rationale: '',
      },
      explainability_report: {
        recommendation_id: d.recommendation_id,
        evidence_used: [],
        evidence_missing: [],
        why_this_recommendation: '',
        why_not_alternative: '',
        alternative_interpretation: null,
        scientific_limitations: [],
        internal_notes: [],
      },
      confidence: 'moderate',
      timestamp: new Date().toISOString(),
    });
  }
  return collector.snapshot();
}

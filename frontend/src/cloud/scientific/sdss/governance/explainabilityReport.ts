/**
 * Explainability Report — internal audit explanation (Phase 9.1).
 */

import type { ScientificRecommendation } from '../models/SdssRecommendation';
import type { ExplainabilityReport } from '../models/Governance';
import type { ConsistencyCheckResult, HallucinationGuardResult } from '../models/Governance';

/** Generate internal explainability report — not all fields shown to end users. */
export function buildExplainabilityReport(
  rec: ScientificRecommendation,
  consistency: ConsistencyCheckResult,
  hallucination: HallucinationGuardResult
): ExplainabilityReport {
  const whyNotAlternative =
    rec.explainability.alternative_interpretation != null
      ? `Alternative not selected: ${rec.explainability.alternative_interpretation}`
      : 'No stronger alternative supported by current evidence tier.';

  const internalNotes: string[] = [];
  if (consistency.conflicts.length > 0) {
    internalNotes.push(`Consistency conflicts: ${consistency.conflicts.join(', ')}`);
  }
  if (hallucination.flags.length > 0) {
    internalNotes.push(`Hallucination flags: ${hallucination.flags.join(', ')}`);
  }

  return {
    recommendation_id: rec.id,
    evidence_used: rec.explainability.evidence_used,
    evidence_missing: rec.explainability.evidence_missing,
    why_this_recommendation: rec.explainability.why,
    why_not_alternative: whyNotAlternative,
    alternative_interpretation: rec.explainability.alternative_interpretation ?? null,
    scientific_limitations: rec.limitations,
    internal_notes: internalNotes,
  };
}

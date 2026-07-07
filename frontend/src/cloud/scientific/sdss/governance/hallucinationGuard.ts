/**
 * Hallucination Guard — detects unsupported claims and missing evidence (Phase 9.1).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { ScientificRecommendation } from '../models/SdssRecommendation';
import type { HallucinationDisposition, HallucinationGuardResult } from '../models/Governance';

const UNSUPPORTED_CLAIM_PATTERNS = [
  /\b(proven cure|guaranteed|100%|always works|never fails)\b/i,
  /\b(مضمون|100%|دائماً|لا يفشل)\b/,
  /\b(lab result shows|blood test confirms|mri shows)\b/i,
];

const EMERGENCY_PATTERNS = [
  /\b(call 911|emergency room immediately|go to hospital now)\b/i,
  /\b(اتصل بالإسعاف|طوارئ فوراً)\b/,
];

function availableEvidenceKeys(ctx: SdssDecisionContext): Set<string> {
  return new Set(ctx.evidence_summary.available_sources);
}

/** Detect unsupported claims, missing evidence, and unavailable metric references. */
export function runHallucinationGuard(
  rec: ScientificRecommendation,
  ctx: SdssDecisionContext
): HallucinationGuardResult {
  const flags: string[] = [];
  const text = `${rec.summary} ${rec.scientific_reasoning} ${rec.recommended_action}`;

  for (const pattern of UNSUPPORTED_CLAIM_PATTERNS) {
    if (pattern.test(text)) flags.push(`unsupported_claim:${pattern.source}`);
  }

  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(text)) flags.push(`emergency_instruction:${pattern.source}`);
  }

  if (
    rec.confidence !== 'insufficient_evidence' &&
    rec.explainability.evidence_used.length === 0
  ) {
    flags.push('missing_evidence');
  }

  const available = availableEvidenceKeys(ctx);
  for (const source of rec.explainability.evidence_used) {
    if (!available.has(source) && !source.startsWith('analytics')) {
      flags.push(`evidence_not_available:${source}`);
    }
  }

  if (rec.affected_metrics.length > 0 && ctx.evidence_summary.overall_completeness_pct < 20) {
    flags.push('metrics_without_supporting_data');
  }

  let disposition: HallucinationDisposition = 'none';
  if (flags.some((f) => f.startsWith('emergency_instruction'))) {
    disposition = 'rejected';
  } else if (flags.some((f) => f.startsWith('unsupported_claim'))) {
    disposition = 'rejected';
  } else if (flags.some((f) => f.startsWith('evidence_not_available') || f === 'missing_evidence')) {
    disposition = 'needs_review';
  } else if (flags.includes('metrics_without_supporting_data')) {
    disposition = 'low_confidence';
  }

  return { recommendation_id: rec.id, disposition, flags };
}

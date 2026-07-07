/**
 * Governance Pipeline — Validation → Consistency → Governance → Audit (Phase 9.1).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { ScientificRecommendation, SdssRecommendationBundle } from '../models/SdssRecommendation';
import type { GovernancePipelineResult } from '../models/Governance';
import { buildAuditRecord } from '../audit/auditRecordBuilder';
import { checkRecommendationConsistency } from '../consistency/consistencyEngine';
import { assignGovernanceDecision } from '../governance/governanceEngine';
import { calibrateConfidence } from '../governance/confidenceCalibration';
import { buildExplainabilityReport } from '../governance/explainabilityReport';
import { runHallucinationGuard } from '../governance/hallucinationGuard';
import { ValidationMetricsCollector } from '../metrics/validationMetrics';
import { validateRecommendationCompleteness } from '../validation/recommendationValidationEngine';
import { getDefaultValidatorProviders } from '../validators/validatorContract';
import { applySafetyToRecommendations } from '../safety/safetyLayer';

export interface GovernancePipelineInput {
  bundle: SdssRecommendationBundle;
  context: SdssDecisionContext;
  modelVersion: string;
  promptVersion: string;
}

function applyCalibratedConfidence(
  rec: ScientificRecommendation,
  calibrated: ReturnType<typeof calibrateConfidence>
): ScientificRecommendation {
  return {
    ...rec,
    confidence: calibrated.calibrated_confidence,
    explainability: {
      ...rec.explainability,
      confidence: calibrated.calibrated_confidence,
      confidence_rationale: `${rec.explainability.confidence_rationale} · Calibrated: ${calibrated.rationale}`,
    },
  };
}

/** Run full validation & governance pipeline before recommendations reach the user. */
export function runGovernancePipeline(input: GovernancePipelineInput): GovernancePipelineResult {
  const { bundle, context, modelVersion, promptVersion } = input;
  const validators = getDefaultValidatorProviders();
  const metricsCollector = new ValidationMetricsCollector();

  const validatedRecommendations: ScientificRecommendation[] = [];
  const rejectedIds: string[] = [];
  const auditRecords = [];

  let recommendations = applySafetyToRecommendations(
    bundle.recommendations,
    context.viewer_role,
    context.locale
  );

  for (const rec of recommendations) {
    const validation = validateRecommendationCompleteness(rec);
    const consistency = checkRecommendationConsistency(rec, context);
    const hallucination = runHallucinationGuard(rec, context);
    const calibration = calibrateConfidence(rec, context);

    for (const provider of validators) {
      const result = provider.validate(rec, context);
      if (!result.passed) {
        validation.errors.push(`validator_${provider.id}_failed`);
      }
      for (const finding of result.findings) {
        if (finding.severity === 'error') validation.errors.push(finding.code);
        if (finding.severity === 'warning') validation.warnings.push(finding.code);
      }
    }

    validation.valid = validation.errors.length === 0;

    const calibratedRec = applyCalibratedConfidence(rec, calibration);
    const governance = assignGovernanceDecision(
      calibratedRec,
      validation,
      consistency,
      hallucination,
      calibration
    );
    const explainability = buildExplainabilityReport(calibratedRec, consistency, hallucination);

    const audit = buildAuditRecord({
      recommendation: calibratedRec,
      modelVersion,
      promptVersion,
      validation,
      consistency,
      governance,
      hallucination,
      calibration,
      explainability,
    });

    auditRecords.push(audit);
    metricsCollector.recordAudit(audit, context.evidence_summary.overall_completeness_pct);

    if (governance.validation_status === 'rejected') {
      rejectedIds.push(rec.id);
      continue;
    }

    validatedRecommendations.push(calibratedRec);
  }

  if (validatedRecommendations.length === 0 && recommendations.length > 0) {
    const isAr = context.locale === 'ar';
    const fallback = recommendations[0];
    validatedRecommendations.push({
      ...fallback,
      confidence: 'insufficient_evidence',
      priority: 'low',
      recommended_action: isAr
        ? 'مراجعة بشرية مطلوبة — التوصيات الأصلية لم تجتز التحقق.'
        : 'Human review required — original recommendations failed validation.',
      explainability: {
        ...fallback.explainability,
        confidence: 'insufficient_evidence',
        why: isAr
          ? 'جميع التوصيات رُفضت بواسطة طبقة الحوكمة.'
          : 'All recommendations were rejected by the governance layer.',
      },
    });
  }

  return {
    validated_recommendations: validatedRecommendations,
    rejected_recommendation_ids: rejectedIds,
    audit_records: auditRecords,
    metrics: metricsCollector.snapshot(),
  };
}

/** Merge validated recommendations back into bundle for UI delivery. */
export function applyGovernanceToBundle(
  bundle: SdssRecommendationBundle,
  governed: GovernancePipelineResult
): SdssRecommendationBundle {
  return {
    ...bundle,
    recommendations: governed.validated_recommendations,
  };
}

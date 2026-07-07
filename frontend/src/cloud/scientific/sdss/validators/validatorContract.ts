/**
 * Validator provider interfaces — future rule/clinical/research/external validators (Phase 9.1).
 */

import type { SdssDecisionContext } from '../models/DecisionContext';
import type { ScientificRecommendation } from '../models/SdssRecommendation';

export type ValidatorProviderId = 'rule' | 'clinical' | 'research' | 'external';

export interface ValidatorFinding {
  code: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
}

export interface ValidatorProviderResult {
  provider_id: ValidatorProviderId;
  passed: boolean;
  findings: ValidatorFinding[];
}

export interface ValidatorProvider {
  readonly id: ValidatorProviderId;
  validate(
    recommendation: ScientificRecommendation,
    context: SdssDecisionContext
  ): ValidatorProviderResult;
}

/** Rule-based validator — delegates to completeness + consistency checks. */
export class RuleValidatorProvider implements ValidatorProvider {
  readonly id = 'rule' as const;

  validate(
    recommendation: ScientificRecommendation,
    _context: SdssDecisionContext
  ): ValidatorProviderResult {
    const findings: ValidatorFinding[] = [];
    if (!recommendation.explainability.why?.trim()) {
      findings.push({ code: 'missing_why', severity: 'error', message: 'Missing explainability why' });
    }
    if (recommendation.affected_metrics.length === 0 && recommendation.category !== 'monitoring') {
      findings.push({ code: 'missing_metrics', severity: 'warning', message: 'No affected metrics' });
    }
    return {
      provider_id: this.id,
      passed: !findings.some((f) => f.severity === 'error'),
      findings,
    };
  }
}

/** Clinical validator stub — flags medical categories for review. */
export class ClinicalValidatorProvider implements ValidatorProvider {
  readonly id = 'clinical' as const;

  validate(recommendation: ScientificRecommendation): ValidatorProviderResult {
    const medical =
      recommendation.category === 'sports_medicine' ||
      recommendation.category === 'return_to_play' ||
      recommendation.category === 'injury_risk';
    const findings: ValidatorFinding[] = medical
      ? [{ code: 'clinical_review', severity: 'warning', message: 'Clinical review recommended' }]
      : [];
    return { provider_id: this.id, passed: true, findings };
  }
}

/** Research validator stub — requires evidence note for research categories. */
export class ResearchValidatorProvider implements ValidatorProvider {
  readonly id = 'research' as const;

  validate(recommendation: ScientificRecommendation): ValidatorProviderResult {
    if (recommendation.category !== 'research_notes') {
      return { provider_id: this.id, passed: true, findings: [] };
    }
    const findings: ValidatorFinding[] = [
      {
        code: 'research_disclaimer',
        severity: 'warning',
        message: 'Research disclaimer required',
      },
    ];
    if (recommendation.citations_placeholder.length === 0) {
      findings.push({
        code: 'missing_citations',
        severity: 'warning',
        message: 'Citation placeholders required for research notes',
      });
    }
    return { provider_id: this.id, passed: true, findings };
  }
}

/** External validator stub — placeholder for third-party review APIs. */
export class ExternalValidatorProvider implements ValidatorProvider {
  readonly id = 'external' as const;

  validate(): ValidatorProviderResult {
    return { provider_id: this.id, passed: true, findings: [] };
  }
}

export function getDefaultValidatorProviders(): ValidatorProvider[] {
  return [
    new RuleValidatorProvider(),
    new ClinicalValidatorProvider(),
    new ResearchValidatorProvider(),
    new ExternalValidatorProvider(),
  ];
}

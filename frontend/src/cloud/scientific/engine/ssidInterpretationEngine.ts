/**
 * SSID Scientific Sports Intelligence Engine — deterministic interpretation layer (Phase 6C.7).
 *
 * Pipeline: Session → Calculation → Normative → SSID → Standardized Interpretation
 */

import type { CatalogAssessmentDefinition } from '../models/catalog/AssessmentDefinition';
import type {
  ScientificInterpretation,
  SsidInterpretationInput,
} from '../models/interpretation/ScientificInterpretation';
import { SSID_RULE_VERSION } from '../models/interpretation/ScientificInterpretation';
import type { AssessmentSession } from '../models/session';
import type { ScientificCatalogRepository } from '../repositories/contracts/CatalogRepository';
import {
  applyCategoryContext,
  getCategoryRule,
} from '../seed/ssid/ssidCategoryRules';
import {
  getBandTemplate,
  normativeBandToClassification,
} from '../seed/ssid/ssidBandTemplates';
import { getMetricRule } from '../seed/ssid/ssidMetricRules';
import {
  isSupportedAssessmentDefinition,
  listUniqueSsidRuleIds,
  resolveSsidRule,
  resolveSsidRuleForDefinition,
  SUPPORTED_SSID_RULE_COUNT,
  supportedDefinitionCount,
} from '../seed/ssid/ssidRuleRegistry';

export { SUPPORTED_SSID_RULE_COUNT, supportedDefinitionCount, listUniqueSsidRuleIds };

function enrichInterpretation(doc: ScientificInterpretation): ScientificInterpretation {
  return {
    ...doc,
    assessmentDefinitionKey: doc.assessment_definition_key,
    metricKey: doc.metric_key,
    evidenceTier: doc.evidence_tier,
    scientificMeaning: doc.scientific_meaning,
    performanceMeaning: doc.performance_meaning,
    riskLevel: doc.risk_level,
    referenceVersion: doc.reference_version,
    formulaVersion: doc.formula_version,
    generatedAt: doc.generated_at,
    ruleVersion: doc.rule_version,
  };
}

function selectPrimaryMetric(session: AssessmentSession) {
  return session.calculated_metrics[0] ?? null;
}

export class SsidInterpretationEngine {
  constructor(private readonly catalog?: ScientificCatalogRepository) {}

  listSupportedRules(): string[] {
    return listUniqueSsidRuleIds();
  }

  getSupportedRuleCount(): number {
    return SUPPORTED_SSID_RULE_COUNT;
  }

  getSupportedDefinitionCount(): number {
    return supportedDefinitionCount();
  }

  resolveRule(definitionKey: string) {
    return resolveSsidRule(definitionKey);
  }

  isDefinitionSupported(definitionKey: string): boolean {
    return isSupportedAssessmentDefinition(definitionKey);
  }

  buildInterpretationInput(
    session: AssessmentSession,
    definition: CatalogAssessmentDefinition
  ): SsidInterpretationInput | null {
    const metric = selectPrimaryMetric(session);
    if (!metric) return null;

    const normativeBand = session.normative_comparison.performance_band;
    const classificationId = normativeBandToClassification(normativeBand);

    return {
      assessment_definition_key: definition.key,
      metric_key: metric.metric_key,
      metric_value: metric.value,
      metric_unit: metric.unit,
      evidence_tier: definition.evidence_tier,
      classification_id: classificationId,
      formula_version: metric.formula_version ?? null,
      reference_version: session.normative_comparison.profile_key ?? null,
      normative_band: normativeBand ?? null,
      lower_is_better: definition.lower_is_better,
    };
  }

  interpret(input: SsidInterpretationInput, definition: CatalogAssessmentDefinition): ScientificInterpretation {
    const generatedAt = new Date().toISOString();
    const resolution = resolveSsidRuleForDefinition(definition);

    if (resolution.rule_type === 'metric' && resolution.metric_template_id) {
      const metricRule = getMetricRule(resolution.metric_template_id);
      if (metricRule) {
        const evaluated = metricRule.evaluate(input);
        return enrichInterpretation({
          assessment_definition_key: input.assessment_definition_key,
          metric_key: input.metric_key,
          evidence_tier: input.evidence_tier,
          classification: evaluated.classification,
          classification_id: evaluated.classification_id,
          scientific_meaning: evaluated.scientific_meaning,
          performance_meaning: evaluated.performance_meaning,
          risk_level: evaluated.risk_level,
          risk_label: evaluated.risk_label,
          recommendation: evaluated.recommendation,
          confidence: evaluated.confidence,
          reference_version: input.reference_version ?? null,
          formula_version: input.formula_version ?? null,
          generated_at: generatedAt,
          rule_version: SSID_RULE_VERSION,
          rule_id: metricRule.rule_id,
        });
      }
    }

    const band = getBandTemplate(input.classification_id);
    const category = getCategoryRule(definition.category_code);
    const contextual = applyCategoryContext(band, category, input.classification_id);

    return enrichInterpretation({
      assessment_definition_key: input.assessment_definition_key,
      metric_key: input.metric_key,
      evidence_tier: input.evidence_tier,
      classification: band.classification,
      classification_id: band.band_id,
      scientific_meaning: contextual.scientific_meaning,
      performance_meaning: contextual.performance_meaning,
      risk_level: band.risk_level,
      risk_label: band.risk_label,
      recommendation: contextual.recommendation,
      confidence: band.confidence,
      reference_version: input.reference_version ?? null,
      formula_version: input.formula_version ?? null,
      generated_at: generatedAt,
      rule_version: SSID_RULE_VERSION,
      rule_id: category.rule_id,
    });
  }

  async generateInterpretation(
    session: AssessmentSession,
    definition?: CatalogAssessmentDefinition | null
  ): Promise<ScientificInterpretation | null> {
    const resolvedDefinition =
      definition ??
      (this.catalog
        ? await this.catalog.assessmentDefinitions.getAssessmentDefinitionByKey(
            session.assessment_definition_key
          )
        : null);

    if (!resolvedDefinition) return null;

    const input = this.buildInterpretationInput(session, resolvedDefinition);
    if (!input) return null;

    return this.interpret(input, resolvedDefinition);
  }
}

export function createSsidInterpretationEngine(
  catalog?: ScientificCatalogRepository
): SsidInterpretationEngine {
  return new SsidInterpretationEngine(catalog);
}

// Re-export rule version constant for consumers
export { SSID_RULE_VERSION } from '../models/interpretation/ScientificInterpretation';

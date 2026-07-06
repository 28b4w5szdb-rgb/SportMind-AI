/**
 * SSID rule registry — resolves deterministic rules for all assessment definitions.
 */

import type { ScientificCategoryCode } from '../../models/common';
import type { CatalogAssessmentDefinition } from '../../models/catalog/AssessmentDefinition';
import type {
  SsidClassificationId,
  SsidRuleResolution,
} from '../../models/interpretation/ScientificInterpretation';
import { SEED_ASSESSMENT_DEFINITIONS } from '../assessmentDefinitions.seed';
import { SSID_BAND_TEMPLATES } from './ssidBandTemplates';
import { SSID_CATEGORY_RULES } from './ssidCategoryRules';
import { getMetricRule, SSID_METRIC_RULES } from './ssidMetricRules';

export const SSID_BAND_RULE_COUNT = SSID_BAND_TEMPLATES.length;
export const SSID_CATEGORY_RULE_COUNT = SSID_CATEGORY_RULES.length;
export const SSID_METRIC_RULE_COUNT = SSID_METRIC_RULES.length;
export const SUPPORTED_SSID_RULE_COUNT =
  SSID_BAND_RULE_COUNT + SSID_CATEGORY_RULE_COUNT + SSID_METRIC_RULE_COUNT;

const METRIC_TEMPLATE_ALIASES: Record<string, string> = {
  bmi: 'bmi',
  body_fat: 'body_fat',
  body_water_percent: 'body_water',
  muscle_mass: 'muscle_mass',
  lean_body_mass: 'lean_mass',
  vo2max: 'vo2_max',
  vo2_max: 'vo2_max',
  hr_zones: 'hr_zones',
  training_load: 'session_load',
  acwr: 'acwr',
  recovery_score: 'recovery_score',
  readiness_score: 'readiness_score',
  readiness: 'readiness_score',
};

const definitionRuleIndex = new Map<string, SsidRuleResolution>();

function buildDefinitionRuleIndex(): void {
  if (definitionRuleIndex.size > 0) return;

  for (const definition of SEED_ASSESSMENT_DEFINITIONS) {
    definitionRuleIndex.set(definition.key, resolveRuleForDefinition(definition));
  }
}

function resolveRuleForDefinition(definition: CatalogAssessmentDefinition): SsidRuleResolution {
  const templateId =
    definition.ssid_template_id ??
    METRIC_TEMPLATE_ALIASES[definition.key] ??
    (definition.formula_reference_keys[0]
      ? METRIC_TEMPLATE_ALIASES[definition.formula_reference_keys[0]]
      : null);

  if (templateId && getMetricRule(templateId)) {
    return {
      rule_id: `metric_${templateId}`,
      rule_version: '1.0.0',
      rule_type: 'metric',
      metric_template_id: templateId,
      category_code: definition.category_code,
    };
  }

  return {
    rule_id: `category_${definition.category_code}`,
    rule_version: '1.0.0',
    rule_type: 'category',
    metric_template_id: null,
    category_code: definition.category_code,
  };
}

export function resolveSsidRule(definitionKey: string): SsidRuleResolution | null {
  buildDefinitionRuleIndex();
  return definitionRuleIndex.get(definitionKey) ?? null;
}

export function resolveSsidRuleForDefinition(
  definition: CatalogAssessmentDefinition
): SsidRuleResolution {
  return resolveRuleForDefinition(definition);
}

export function listSupportedSsidRules(): SsidRuleResolution[] {
  buildDefinitionRuleIndex();
  return [...definitionRuleIndex.values()];
}

export function listUniqueSsidRuleIds(): string[] {
  return [
    ...SSID_BAND_TEMPLATES.map((b) => `band_${b.band_id}`),
    ...SSID_CATEGORY_RULES.map((c) => c.rule_id),
    ...SSID_METRIC_RULES.map((m) => m.rule_id),
  ];
}

export function isSupportedAssessmentDefinition(definitionKey: string): boolean {
  buildDefinitionRuleIndex();
  return definitionRuleIndex.has(definitionKey);
}

export function supportedDefinitionCount(): number {
  buildDefinitionRuleIndex();
  return definitionRuleIndex.size;
}

export function mapMetricTemplateFromDefinition(
  definition: CatalogAssessmentDefinition
): string | null {
  const resolution = resolveRuleForDefinition(definition);
  return resolution.metric_template_id ?? null;
}

export type { SsidClassificationId };

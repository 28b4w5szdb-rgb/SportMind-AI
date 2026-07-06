/**
 * SSID — Standardized Scientific Interpretation document (Phase 6C.7).
 *
 * Deterministic, rule-based, bilingual — no AI generation.
 */

import type { BilingualText, EvidenceTier } from '../common';

/** Standard six-level performance classification + unknown. */
export type SsidClassificationId =
  | 'poor'
  | 'below_average'
  | 'average'
  | 'good'
  | 'excellent'
  | 'elite'
  | 'unknown';

export type SsidRiskLevel = 'low' | 'moderate' | 'high' | 'unknown';

export interface ScientificInterpretation {
  assessment_definition_key: string;
  metric_key: string;
  evidence_tier: EvidenceTier;
  classification: BilingualText;
  classification_id: SsidClassificationId;
  scientific_meaning: BilingualText;
  performance_meaning: BilingualText;
  risk_level: SsidRiskLevel;
  risk_label: BilingualText;
  recommendation: BilingualText;
  confidence: number;
  reference_version: string | null;
  formula_version: string | null;
  generated_at: string;
  rule_version: string;
  rule_id: string;
  /** CamelCase metadata aliases (backward compatible with external consumers). */
  assessmentDefinitionKey?: string;
  metricKey?: string;
  evidenceTier?: EvidenceTier;
  scientificMeaning?: BilingualText;
  performanceMeaning?: BilingualText;
  riskLevel?: SsidRiskLevel;
  referenceVersion?: string | null;
  formulaVersion?: string | null;
  generatedAt?: string;
  ruleVersion?: string;
}

export interface SsidRuleResolution {
  rule_id: string;
  rule_version: string;
  rule_type: 'metric' | 'category' | 'band_fallback';
  metric_template_id?: string | null;
  category_code?: string | null;
}

export interface SsidInterpretationInput {
  assessment_definition_key: string;
  metric_key: string;
  metric_value: number;
  metric_unit: string;
  evidence_tier: EvidenceTier;
  classification_id: SsidClassificationId;
  formula_version?: string | null;
  reference_version?: string | null;
  normative_band?: string | null;
  lower_is_better?: boolean;
  sex?: 'male' | 'female' | 'mixed' | 'other' | null;
}

export const SSID_RULE_VERSION = '1.0.0';

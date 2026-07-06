import type {
  BilingualText,
  DataSourceType,
  EvidenceTier,
  ReliabilityMeta,
  SchemaFieldDefinition,
  ScientificCategoryCode,
  VersionedDocumentMeta,
} from '../common';

/** Progressive disclosure field groups — Scientific Inside, Simple Outside. */
export interface AssessmentUsabilityModes {
  beginner: string[];
  professional: string[];
  research: string[];
}

/** Calculated output descriptor for an assessment definition. */
export interface CalculatedOutputDefinition {
  key: string;
  label: BilingualText;
  unit: string;
  formula_key?: string | null;
}

/** Protocol version for an assessment definition. */
export interface AssessmentProtocolVersion extends VersionedDocumentMeta {
  definition_id: string;
  protocol_text: BilingualText;
  equipment_requirements: BilingualText;
  standardization_notes?: BilingualText | null;
  reliability: ReliabilityMeta;
  validity_citation_ids: string[];
}

/**
 * Global assessment definition — Assessment Definition Engine document.
 * Path: `catalog/assessment_definitions/{definitionId}`.
 */
export interface CatalogAssessmentDefinition extends VersionedDocumentMeta {
  key: string;
  category_code: ScientificCategoryCode;
  subcategory: string;
  name: BilingualText;
  description: BilingualText;
  purpose: BilingualText;
  audience: BilingualText;
  evidence_tier: EvidenceTier;
  usability_modes: AssessmentUsabilityModes;
  unit: string;
  lower_is_better: boolean;
  required_inputs: SchemaFieldDefinition[];
  optional_inputs: SchemaFieldDefinition[];
  raw_measurement_schema: SchemaFieldDefinition[];
  calculated_outputs: CalculatedOutputDefinition[];
  calculated_metric_keys: string[];
  output_units: Record<string, string>;
  protocol_summary: BilingualText;
  supported_equipment_type_ids: string[];
  equipment_option_keys: string[];
  allowed_source_types: DataSourceType[];
  formula_reference_keys: string[];
  normative_reference_keys: string[];
  current_protocol_version_id: string;
  retest_interval_days: number;
  reliability_notes: BilingualText;
  validity_notes: BilingualText;
  contraindications: BilingualText;
  common_mistakes: BilingualText;
  interpretation_scope: BilingualText;
  ai_compatible: boolean;
  report_compatible: boolean;
  tags: string[];
  ssid_template_id?: string | null;
  interpretation_rule_set_id?: string | null;
  active: boolean;
}

export type CatalogAssessmentDefinitionInput = Omit<
  CatalogAssessmentDefinition,
  keyof VersionedDocumentMeta | 'active'
> & {
  active?: boolean;
};

export type AssessmentProtocolVersionInput = Omit<
  AssessmentProtocolVersion,
  keyof VersionedDocumentMeta
>;

/** Alias for Assessment Definition Engine consumers. */
export type AssessmentDefinitionEngineDocument = CatalogAssessmentDefinition;

import type {
  BilingualText,
  DataSourceType,
  EvidenceTier,
  ReliabilityMeta,
  SchemaFieldDefinition,
  ScientificCategoryCode,
  VersionedDocumentMeta,
} from '../common';

/** Protocol version for an assessment definition. */
export interface AssessmentProtocolVersion extends VersionedDocumentMeta {
  definition_id: string;
  protocol_text: BilingualText;
  equipment_requirements: BilingualText;
  standardization_notes?: BilingualText | null;
  reliability: ReliabilityMeta;
  validity_citation_ids: string[];
}

/** Global assessment definition. Path: `catalog/assessment_definitions/{definitionId}`. */
export interface CatalogAssessmentDefinition extends VersionedDocumentMeta {
  key: string;
  category_code: ScientificCategoryCode;
  name: BilingualText;
  description: BilingualText;
  evidence_tier: EvidenceTier;
  unit: string;
  lower_is_better: boolean;
  raw_measurement_schema: SchemaFieldDefinition[];
  calculated_metric_keys: string[];
  current_protocol_version_id: string;
  allowed_source_types: DataSourceType[];
  supported_equipment_type_ids: string[];
  retest_interval_days: number;
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

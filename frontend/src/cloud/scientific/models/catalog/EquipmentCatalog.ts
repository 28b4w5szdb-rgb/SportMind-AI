import type { BilingualText, CloudDocumentMeta, EvidenceTier } from '../common';

/** Equipment type catalog. Path: `catalog/equipment_types/{typeId}`. */
export interface CatalogEquipmentType extends CloudDocumentMeta {
  key: string;
  name: BilingualText;
  description: BilingualText;
  default_calibration_interval_days: number;
  default_sampling_frequency_hz?: number | null;
  supported_assessment_definition_ids: string[];
  evidence_tier_ceiling: EvidenceTier;
  active: boolean;
}

export type CatalogEquipmentTypeInput = Omit<
  CatalogEquipmentType,
  keyof CloudDocumentMeta | 'active'
> & {
  active?: boolean;
};

/** Equipment model catalog. Path: `catalog/equipment_models/{modelId}`. */
export interface CatalogEquipmentModel extends CloudDocumentMeta {
  type_id: string;
  manufacturer: string;
  model_name: string;
  default_calibration_interval_days: number;
  default_sampling_frequency_hz?: number | null;
  supported_assessment_definition_ids: string[];
  data_import_formats: string[];
  firmware_versions_known: string[];
  active: boolean;
}

export type CatalogEquipmentModelInput = Omit<
  CatalogEquipmentModel,
  keyof CloudDocumentMeta | 'active'
> & {
  active?: boolean;
};

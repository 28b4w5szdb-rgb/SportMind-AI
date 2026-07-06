import type { CloudDocumentMeta } from '../common';

export type EquipmentInstanceStatus = 'active' | 'maintenance' | 'retired' | 'out_of_calibration';

/** Organization equipment instance (registry shell — no business logic). */
export interface OrgEquipment extends CloudDocumentMeta {
  organization_id: string;
  equipment_type_id: string;
  equipment_model_id: string;
  serial_number: string;
  asset_tag?: string | null;
  nickname?: string | null;
  calibration_date?: string | null;
  calibration_interval_days: number;
  next_calibration_due?: string | null;
  firmware_version?: string | null;
  sampling_frequency_hz?: number | null;
  location_id?: string | null;
  assigned_team_ids: string[];
  supported_assessment_definition_ids: string[];
  status: EquipmentInstanceStatus;
}

export type OrgEquipmentInput = Omit<
  OrgEquipment,
  keyof CloudDocumentMeta | 'status' | 'assigned_team_ids' | 'supported_assessment_definition_ids'
> & {
  status?: EquipmentInstanceStatus;
  assigned_team_ids?: string[];
  supported_assessment_definition_ids?: string[];
};

/** Maintenance log entry. Path: `.../equipment/{id}/maintenance_logs/{logId}`. */
export interface OrgEquipmentMaintenanceLog extends CloudDocumentMeta {
  organization_id: string;
  equipment_id: string;
  maintenance_type: 'calibration' | 'repair' | 'firmware' | 'inspection';
  performed_by?: string | null;
  notes?: string | null;
  certificate_ref?: string | null;
  next_due_date?: string | null;
}

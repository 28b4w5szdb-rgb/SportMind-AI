/**
 * Unified Scientific Export Layer — domain models (Phase 7.3).
 *
 * Architecture only — no real file generation. One report, multiple exporters.
 */

import type { BilingualText } from '../../models/common';
import type { ReportViewerRole, ScientificReportSectionId } from '../../models/report';

/** Supported export format targets — metadata + pipeline only. */
export type ExportFormat =
  | 'pdf'
  | 'word'
  | 'excel'
  | 'print'
  | 'share'
  | 'json_archive'
  | 'research_dataset'
  | 'api_payload';

export type ExportLocaleMode = 'en' | 'ar' | 'bilingual';

export type ExportTemplateId =
  | 'club_standard'
  | 'university'
  | 'research'
  | 'sports_medicine'
  | 'executive_summary';

export type ExportJobStatus =
  | 'pending'
  | 'preparing'
  | 'prepared'
  | 'failed'
  | 'cancelled';

export type ExportPageOrientation = 'portrait' | 'landscape';

/** Template metadata — defines layout slots, not rendered output. */
export interface ExportTemplate {
  template_id: ExportTemplateId;
  label: BilingualText;
  default_sections: ScientificReportSectionId[];
  branding_slots: string[];
  page_orientation: ExportPageOrientation;
  locale_mode: ExportLocaleMode;
  visibility_profile: ReportViewerRole;
  accent_color?: string;
}

/** User-initiated export request. */
export interface ExportRequest {
  report_id: string;
  organization_id: string;
  format: ExportFormat;
  template_id: ExportTemplateId;
  locale_mode: ExportLocaleMode;
  requested_by: string;
  viewer_role: ReportViewerRole;
  include_archived_sections?: boolean;
}

/** In-flight or completed export job. */
export interface ExportJob {
  job_id: string;
  request: ExportRequest;
  status: ExportJobStatus;
  created_at: string;
  updated_at: string;
  error_message?: string | null;
}

/** Prepared export artifact — metadata only, no binary payload. */
export interface ExportArtifact {
  artifact_id: string;
  job_id: string;
  format: ExportFormat;
  template_id: ExportTemplateId;
  locale_mode: ExportLocaleMode;
  section_count: number;
  page_count_estimate: number;
  file_name_placeholder: string;
  mime_type_placeholder: string;
  content_hash: string;
  prepared_at: string;
  disclaimer: BilingualText;
  /** Future: file_url when real rendering is enabled */
  file_url?: string | null;
}

/** Pipeline output returned to UI. */
export interface ExportResult {
  job: ExportJob;
  artifact: ExportArtifact | null;
  status_message: BilingualText;
  format_coming_soon: boolean;
}

export const EXPORT_LAYER_VERSION = '7.3';
export const EXPORT_SCHEMA_VERSION = '1.0.0';

export const ALL_EXPORT_FORMATS: ExportFormat[] = [
  'pdf',
  'word',
  'excel',
  'print',
  'share',
  'json_archive',
  'research_dataset',
  'api_payload',
];

/**
 * Persisted scientific report Firestore record (Phase 7.2).
 * Output layer only — not a scientific source of truth.
 */

import type { ScientificReport, ScientificReportType } from './ScientificReport';

export type ScientificReportRecordStatus = 'draft' | 'ready' | 'exported' | 'archived';

/** Full persisted scientific report document at organizations/{orgId}/reports/{reportId}. */
export interface PersistedScientificReportRecord extends ScientificReport {
  status: ScientificReportRecordStatus;
  summary: string;
  legacy_sections?: Record<string, string | undefined>;
  builder_meta?: Record<string, unknown>;
  mock_type?: 'athlete' | 'team' | 'session' | 'custom';
  created_at: string;
  updated_at: string;
}

export interface CreateScientificReportInput {
  organizationId: string;
  report: ScientificReport;
  status?: ScientificReportRecordStatus;
  summary: string;
  legacySections?: Record<string, string | undefined>;
  builderMeta?: Record<string, unknown>;
  mockType?: 'athlete' | 'team' | 'session' | 'custom';
}

export interface ScientificReportListFilters {
  includeArchived?: boolean;
}

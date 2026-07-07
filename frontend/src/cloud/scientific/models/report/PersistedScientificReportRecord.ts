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
  /** Phase 8.1 — coach-safe persistence schema marker. */
  persistence_schema_version?: string;
  /** Estimated JSON payload size at write time (bytes). */
  payload_bytes_estimate?: number;
  /** True when payload exceeds warn threshold — future chunking candidate. */
  chunking_recommended?: boolean;
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
  /** Max reports per list query (default 50). */
  limit?: number;
}

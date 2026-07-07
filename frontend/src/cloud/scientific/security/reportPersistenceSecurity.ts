/**
 * Role-aware scientific report persistence (Phase 8.1).
 *
 * Splits full report content into coach-safe main document + per-role views.
 * Does not modify the scientific report builder engine.
 */

import type {
  ReportViewerRole,
  ScientificReport,
  ScientificReportSection,
} from '../models/report';
import { filterReportForViewer } from './reportAccess';

export const PERSISTENCE_SCHEMA_VERSION = '8.1';

/** Firestore soft limit warning threshold (bytes). */
export const REPORT_PAYLOAD_WARN_BYTES = 800_000;

/** Block persistence above this size — prepare for future chunking. */
export const REPORT_PAYLOAD_MAX_BYTES = 950_000;

const ALL_PERSISTED_ROLES: ReportViewerRole[] = ['coach', 'sports_scientist', 'clinical', 'research'];

export interface ReportRoleViewDocument {
  viewer_role: ReportViewerRole;
  sections: ScientificReportSection[];
  updated_at: string;
}

export interface PreparedReportPersistence {
  /** Coach-safe report stored on the main Firestore document. */
  safeReport: ScientificReport;
  roleViews: Record<ReportViewerRole, ReportRoleViewDocument>;
  payload_bytes_estimate: number;
  size_warning: boolean;
  chunking_recommended: boolean;
}

export function estimateJsonBytes(value: unknown): number {
  try {
    return new TextEncoder().encode(JSON.stringify(value)).length;
  } catch {
    return 0;
  }
}

/** Build role-filtered persistence payload — clinical content never on coach-safe main doc. */
export function prepareReportForPersistence(report: ScientificReport): PreparedReportPersistence {
  const now = new Date().toISOString();
  const roleViews = {} as Record<ReportViewerRole, ReportRoleViewDocument>;

  for (const role of ALL_PERSISTED_ROLES) {
    const filtered = filterReportForViewer(report, role);
    roleViews[role] = {
      viewer_role: role,
      sections: filtered.sections,
      updated_at: now,
    };
  }

  const safeReport = filterReportForViewer(report, 'coach');

  const payloadEstimate = estimateJsonBytes({
    safeReport,
    roleViews,
  });

  return {
    safeReport,
    roleViews,
    payload_bytes_estimate: payloadEstimate,
    size_warning: payloadEstimate >= REPORT_PAYLOAD_WARN_BYTES,
    chunking_recommended: payloadEstimate >= REPORT_PAYLOAD_WARN_BYTES,
  };
}

export interface ReportSizeValidation {
  ok: boolean;
  bytes: number;
  warning: boolean;
  chunking_recommended: boolean;
  code?: 'report_oversized';
}

/** Validate estimated payload size before Firestore write. */
export function validateReportPayloadSize(bytes: number): ReportSizeValidation {
  if (bytes >= REPORT_PAYLOAD_MAX_BYTES) {
    return {
      ok: false,
      bytes,
      warning: true,
      chunking_recommended: true,
      code: 'report_oversized',
    };
  }
  return {
    ok: true,
    bytes,
    warning: bytes >= REPORT_PAYLOAD_WARN_BYTES,
    chunking_recommended: bytes >= REPORT_PAYLOAD_WARN_BYTES,
  };
}

/** Merge persisted main record with optional role view for the requesting viewer. */
export function resolvePersistedReportForViewer(
  record: ScientificReport,
  viewerRole: ReportViewerRole,
  roleView?: ReportRoleViewDocument | null
): ScientificReport {
  if (record.persistence_schema_version === PERSISTENCE_SCHEMA_VERSION && roleView?.sections?.length) {
    return filterReportForViewer(
      {
        ...record,
        sections: roleView.sections,
        viewer_role: viewerRole,
        visibility_profile: viewerRole,
      },
      viewerRole
    );
  }

  return filterReportForViewer(record, viewerRole);
}

/** True when main document sections are coach-safe (no unrestricted clinical body). */
export function isCoachSafePersistedRecord(record: ScientificReport): boolean {
  return record.persistence_schema_version === PERSISTENCE_SCHEMA_VERSION;
}

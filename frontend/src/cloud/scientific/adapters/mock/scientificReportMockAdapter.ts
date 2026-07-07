/**
 * In-memory scientific report repository for mock mode and unit tests (Phase 7.2 / 8.1).
 */

import type { ReportViewerRole } from '../../models/report';
import type {
  CreateScientificReportInput,
  PersistedScientificReportRecord,
  ScientificReportListFilters,
  ScientificReportRecordStatus,
} from '../../models/report/PersistedScientificReportRecord';
import type { ScientificReportRepository } from '../../repositories/contracts/ScientificReportRepository';
import {
  PERSISTENCE_SCHEMA_VERSION,
  prepareReportForPersistence,
  type ReportRoleViewDocument,
  resolvePersistedReportForViewer,
  validateReportPayloadSize,
} from '../../security/reportPersistenceSecurity';
import { ScientificCloudError } from '../errors';

const store = new Map<string, Map<string, PersistedScientificReportRecord>>();
const roleViewStore = new Map<string, Map<string, Map<ReportViewerRole, ReportRoleViewDocument>>>();

function orgStore(orgId: string): Map<string, PersistedScientificReportRecord> {
  if (!store.has(orgId)) store.set(orgId, new Map());
  return store.get(orgId)!;
}

function orgRoleViews(orgId: string, reportId: string): Map<ReportViewerRole, ReportRoleViewDocument> {
  if (!roleViewStore.has(orgId)) roleViewStore.set(orgId, new Map());
  const byReport = roleViewStore.get(orgId)!;
  if (!byReport.has(reportId)) byReport.set(reportId, new Map());
  return byReport.get(reportId)!;
}

function applyListFilters(
  records: PersistedScientificReportRecord[],
  filters?: ScientificReportListFilters
): PersistedScientificReportRecord[] {
  if (filters?.includeArchived) return records;
  return records.filter((r) => r.status !== 'archived');
}

/** Clear in-memory store — test helper. */
export function clearScientificReportMockStore(): void {
  store.clear();
  roleViewStore.clear();
}

export function createScientificReportMockRepository(): ScientificReportRepository {
  return {
    async createScientificReport(input: CreateScientificReportInput) {
      const prepared = prepareReportForPersistence(input.report);
      const sizeCheck = validateReportPayloadSize(prepared.payload_bytes_estimate);
      if (!sizeCheck.ok) {
        throw new ScientificCloudError(
          'report_oversized',
          'Report payload exceeds Firestore size limit',
          `estimated_bytes=${sizeCheck.bytes}`
        );
      }

      const now = new Date().toISOString();
      const record: PersistedScientificReportRecord = {
        ...prepared.safeReport,
        report_id: input.report.report_id,
        organization_id: input.organizationId,
        status: input.status ?? 'draft',
        summary: input.summary,
        legacy_sections: input.legacySections,
        builder_meta: input.builderMeta,
        mock_type: input.mockType,
        created_at: now,
        updated_at: now,
        persistence_schema_version: PERSISTENCE_SCHEMA_VERSION,
        payload_bytes_estimate: prepared.payload_bytes_estimate,
        chunking_recommended: prepared.chunking_recommended,
        viewer_role: 'coach',
        visibility_profile: 'coach',
      };

      orgStore(input.organizationId).set(record.report_id, record);
      const views = orgRoleViews(input.organizationId, record.report_id);
      for (const [role, view] of Object.entries(prepared.roleViews) as Array<
        [ReportViewerRole, ReportRoleViewDocument]
      >) {
        views.set(role, view);
      }

      return record;
    },

    async getScientificReportById(organizationId, reportId, viewerRole) {
      const record = orgStore(organizationId).get(reportId);
      if (!record) return null;
      if (!viewerRole || record.persistence_schema_version !== PERSISTENCE_SCHEMA_VERSION) {
        return record;
      }
      const roleView = orgRoleViews(organizationId, reportId).get(viewerRole) ?? null;
      const resolved = resolvePersistedReportForViewer(record, viewerRole, roleView);
      return { ...record, ...resolved } as PersistedScientificReportRecord;
    },

    async listScientificReports(organizationId, filters) {
      return applyListFilters(Array.from(orgStore(organizationId).values()), filters);
    },

    async listReportsByAthlete(organizationId, athleteId, filters) {
      const rows = Array.from(orgStore(organizationId).values()).filter((r) => r.athlete_id === athleteId);
      return applyListFilters(rows, filters);
    },

    async listReportsByTeam(organizationId, teamId, filters) {
      const rows = Array.from(orgStore(organizationId).values()).filter((r) => r.team_id === teamId);
      return applyListFilters(rows, filters);
    },

    async updateReportStatus(organizationId, reportId, status: ScientificReportRecordStatus) {
      const existing = orgStore(organizationId).get(reportId);
      if (!existing) return null;
      const updated = { ...existing, status, updated_at: new Date().toISOString() };
      orgStore(organizationId).set(reportId, updated);
      return updated;
    },

    async archiveScientificReport(organizationId, reportId) {
      return this.updateReportStatus(organizationId, reportId, 'archived');
    },
  };
}

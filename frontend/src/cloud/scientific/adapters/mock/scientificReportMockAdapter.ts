/**
 * In-memory scientific report repository for mock mode and unit tests (Phase 7.2).
 */

import type {
  CreateScientificReportInput,
  PersistedScientificReportRecord,
  ScientificReportListFilters,
  ScientificReportRecordStatus,
} from '../../models/report/PersistedScientificReportRecord';
import type { ScientificReportRepository } from '../../repositories/contracts/ScientificReportRepository';

const store = new Map<string, Map<string, PersistedScientificReportRecord>>();

function orgStore(orgId: string): Map<string, PersistedScientificReportRecord> {
  if (!store.has(orgId)) store.set(orgId, new Map());
  return store.get(orgId)!;
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
}

export function createScientificReportMockRepository(): ScientificReportRepository {
  return {
    async createScientificReport(input: CreateScientificReportInput) {
      const now = new Date().toISOString();
      const record: PersistedScientificReportRecord = {
        ...input.report,
        report_id: input.report.report_id,
        organization_id: input.organizationId,
        status: input.status ?? 'draft',
        summary: input.summary,
        legacy_sections: input.legacySections,
        builder_meta: input.builderMeta,
        mock_type: input.mockType,
        created_at: now,
        updated_at: now,
      };
      orgStore(input.organizationId).set(record.report_id, record);
      return record;
    },

    async getScientificReportById(organizationId, reportId) {
      return orgStore(organizationId).get(reportId) ?? null;
    },

    async listScientificReports(organizationId, filters) {
      return applyListFilters(Array.from(orgStore(organizationId).values()), filters);
    },

    async listReportsByAthlete(organizationId, athleteId, filters) {
      const rows = Array.from(orgStore(organizationId).values()).filter(
        (r) => r.athlete_id === athleteId
      );
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

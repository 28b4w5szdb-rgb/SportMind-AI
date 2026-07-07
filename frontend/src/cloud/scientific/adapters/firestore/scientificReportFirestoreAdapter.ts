/**
 * Firestore scientific report repository (Phase 7.2).
 * Path: organizations/{orgId}/reports/{reportId}
 */

import type {
  CreateScientificReportInput,
  PersistedScientificReportRecord,
  ScientificReportListFilters,
  ScientificReportRecordStatus,
} from '../../models/report/PersistedScientificReportRecord';
import type { ScientificReportRepository } from '../../repositories/contracts/ScientificReportRepository';
import { ORGANIZATIONS_ROOT, REPORTS_SUBCOLLECTION } from '../../paths/organizationPaths';
import { readSubDocument, readSubcollectionFiltered } from './firestoreReadHelper';
import { createDocumentIfNotExists, updateDocumentFields } from './firestoreWriteHelper';
import { ScientificPersistenceError } from '../errors';

function reportPathSegments(orgId: string, reportId: string): string[] {
  return [ORGANIZATIONS_ROOT, orgId, REPORTS_SUBCOLLECTION, reportId];
}

function mapRecord(data: PersistedScientificReportRecord & { id?: string }): PersistedScientificReportRecord {
  return {
    ...data,
    report_id: data.report_id ?? data.id ?? '',
  };
}

function applyListFilters(
  records: PersistedScientificReportRecord[],
  filters?: ScientificReportListFilters
): PersistedScientificReportRecord[] {
  if (filters?.includeArchived) return records;
  return records.filter((r) => r.status !== 'archived');
}

export function createScientificReportFirestoreRepository(): ScientificReportRepository {
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

      try {
        await createDocumentIfNotExists(
          reportPathSegments(input.organizationId, input.report.report_id),
          record as unknown as Record<string, unknown>
        );
      } catch (e) {
        if (e instanceof ScientificPersistenceError) throw e;
        throw new ScientificPersistenceError('write_failed');
      }

      return record;
    },

    async getScientificReportById(organizationId, reportId) {
      const data = await readSubDocument<PersistedScientificReportRecord>(
        ORGANIZATIONS_ROOT,
        organizationId,
        REPORTS_SUBCOLLECTION,
        reportId
      );
      return data ? mapRecord(data) : null;
    },

    async listScientificReports(organizationId, filters) {
      const rows = await readSubcollectionFiltered<PersistedScientificReportRecord>(
        ORGANIZATIONS_ROOT,
        organizationId,
        REPORTS_SUBCOLLECTION
      );
      return applyListFilters(rows.map(mapRecord), filters);
    },

    async listReportsByAthlete(organizationId, athleteId, filters) {
      const rows = await readSubcollectionFiltered<PersistedScientificReportRecord>(
        ORGANIZATIONS_ROOT,
        organizationId,
        REPORTS_SUBCOLLECTION,
        [{ field: 'athlete_id', op: '==', value: athleteId }]
      );
      return applyListFilters(rows.map(mapRecord), filters);
    },

    async listReportsByTeam(organizationId, teamId, filters) {
      const rows = await readSubcollectionFiltered<PersistedScientificReportRecord>(
        ORGANIZATIONS_ROOT,
        organizationId,
        REPORTS_SUBCOLLECTION,
        [{ field: 'team_id', op: '==', value: teamId }]
      );
      return applyListFilters(rows.map(mapRecord), filters);
    },

    async updateReportStatus(organizationId, reportId, status) {
      try {
        await updateDocumentFields(reportPathSegments(organizationId, reportId), { status });
      } catch {
        return null;
      }
      return this.getScientificReportById(organizationId, reportId);
    },

    async archiveScientificReport(organizationId, reportId) {
      return this.updateReportStatus(organizationId, reportId, 'archived');
    },
  };
}

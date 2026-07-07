/**
 * Firestore scientific report repository (Phase 7.2 / 8.1).
 * Path: organizations/{orgId}/reports/{reportId}
 * Role views: organizations/{orgId}/reports/{reportId}/role_views/{role}
 */

import type { ReportViewerRole } from '../../models/report';
import type {
  CreateScientificReportInput,
  PersistedScientificReportRecord,
  ScientificReportListFilters,
  ScientificReportRecordStatus,
} from '../../models/report/PersistedScientificReportRecord';
import { DEFAULT_REPORT_LIST_LIMIT } from '../../models/common/ListPagination';
import type { ScientificReportRepository } from '../../repositories/contracts/ScientificReportRepository';
import {
  ORGANIZATIONS_ROOT,
  REPORT_ROLE_VIEWS_SUBCOLLECTION,
  REPORTS_SUBCOLLECTION,
} from '../../paths/organizationPaths';
import {
  PERSISTENCE_SCHEMA_VERSION,
  prepareReportForPersistence,
  type ReportRoleViewDocument,
  resolvePersistedReportForViewer,
  validateReportPayloadSize,
} from '../../security/reportPersistenceSecurity';
import { readReportRoleView, readSubDocument, readSubcollectionFiltered } from './firestoreReadHelper';
import {
  createDocumentIfNotExists,
  createSubcollectionDocumentsIfNotExists,
  updateDocumentFields,
} from './firestoreWriteHelper';
import { ScientificCloudError, ScientificPersistenceError } from '../errors';

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
  let rows = filters?.includeArchived ? records : records.filter((r) => r.status !== 'archived');
  const cap = filters?.limit ?? DEFAULT_REPORT_LIST_LIMIT;
  if (cap > 0 && rows.length > cap) {
    rows = rows
      .slice()
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, cap);
  }
  return rows;
}

async function loadRoleView(
  organizationId: string,
  reportId: string,
  role: ReportViewerRole
): Promise<ReportRoleViewDocument | null> {
  return readReportRoleView<ReportRoleViewDocument>(organizationId, reportId, role);
}

async function resolveRecordForViewer(
  record: PersistedScientificReportRecord,
  organizationId: string,
  viewerRole?: ReportViewerRole
): Promise<PersistedScientificReportRecord> {
  if (!viewerRole || record.persistence_schema_version !== PERSISTENCE_SCHEMA_VERSION) {
    return record;
  }

  const roleView = await loadRoleView(organizationId, record.report_id, viewerRole);
  const resolved = resolvePersistedReportForViewer(record, viewerRole, roleView);
  return { ...record, ...resolved } as PersistedScientificReportRecord;
}

export function createScientificReportFirestoreRepository(): ScientificReportRepository {
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

      try {
        await createDocumentIfNotExists(
          reportPathSegments(input.organizationId, input.report.report_id),
          record as unknown as Record<string, unknown>
        );

        await createSubcollectionDocumentsIfNotExists(
          reportPathSegments(input.organizationId, input.report.report_id),
          REPORT_ROLE_VIEWS_SUBCOLLECTION,
          Object.entries(prepared.roleViews).map(([role, view]) => ({
            id: role,
            data: view as unknown as Record<string, unknown>,
          }))
        );
      } catch (e) {
        if (e instanceof ScientificPersistenceError) throw e;
        if (e instanceof ScientificCloudError) throw e;
        throw new ScientificCloudError('write_failed', 'Failed to persist scientific report', String(e));
      }

      return record;
    },

    async getScientificReportById(organizationId, reportId, viewerRole) {
      const data = await readSubDocument<PersistedScientificReportRecord>(
        ORGANIZATIONS_ROOT,
        organizationId,
        REPORTS_SUBCOLLECTION,
        reportId
      );
      if (!data) return null;
      return resolveRecordForViewer(mapRecord(data), organizationId, viewerRole);
    },

    async listScientificReports(organizationId, filters) {
      const rows = await readSubcollectionFiltered<PersistedScientificReportRecord>(
        ORGANIZATIONS_ROOT,
        organizationId,
        REPORTS_SUBCOLLECTION,
        undefined,
        {
          limit: filters?.limit ?? DEFAULT_REPORT_LIST_LIMIT,
          orderByField: 'created_at',
          orderDirection: 'desc',
        }
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
      } catch (e) {
        if (e instanceof ScientificCloudError) throw e;
        throw new ScientificCloudError('write_failed', 'Failed to update report status', String(e));
      }
      return this.getScientificReportById(organizationId, reportId);
    },

    async archiveScientificReport(organizationId, reportId) {
      return this.updateReportStatus(organizationId, reportId, 'archived');
    },
  };
}

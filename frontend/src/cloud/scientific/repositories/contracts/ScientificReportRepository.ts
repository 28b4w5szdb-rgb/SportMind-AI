/**
 * Scientific Report repository contract (Phase 7.2).
 */

import type {
  CreateScientificReportInput,
  PersistedScientificReportRecord,
  ScientificReportListFilters,
  ScientificReportRecordStatus,
} from '../../models/report/PersistedScientificReportRecord';

export interface ScientificReportRepository {
  createScientificReport(input: CreateScientificReportInput): Promise<PersistedScientificReportRecord>;
  getScientificReportById(
    organizationId: string,
    reportId: string,
    viewerRole?: import('../../models/report').ReportViewerRole
  ): Promise<PersistedScientificReportRecord | null>;
  listScientificReports(
    organizationId: string,
    filters?: ScientificReportListFilters
  ): Promise<PersistedScientificReportRecord[]>;
  listReportsByAthlete(
    organizationId: string,
    athleteId: string,
    filters?: ScientificReportListFilters
  ): Promise<PersistedScientificReportRecord[]>;
  listReportsByTeam(
    organizationId: string,
    teamId: string,
    filters?: ScientificReportListFilters
  ): Promise<PersistedScientificReportRecord[]>;
  updateReportStatus(
    organizationId: string,
    reportId: string,
    status: ScientificReportRecordStatus
  ): Promise<PersistedScientificReportRecord | null>;
  archiveScientificReport(
    organizationId: string,
    reportId: string
  ): Promise<PersistedScientificReportRecord | null>;
}

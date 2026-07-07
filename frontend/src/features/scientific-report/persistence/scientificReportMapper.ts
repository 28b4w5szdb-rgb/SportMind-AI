/**
 * Map between ScientificReport records and MockReport (Phase 7.2).
 */

import type { PersistedScientificReportRecord } from '@/src/cloud/scientific/models/report';
import type { MockReport, MockReportSections, MockReportStatus } from '@/src/data/mock/types';

const VALID_MOCK_STATUSES: MockReportStatus[] = ['draft', 'ready', 'exported'];

function toMockStatus(status: PersistedScientificReportRecord['status']): MockReportStatus {
  if (status === 'archived') return 'draft';
  return VALID_MOCK_STATUSES.includes(status as MockReportStatus)
    ? (status as MockReportStatus)
    : 'draft';
}

function legacySectionsFromRecord(record: PersistedScientificReportRecord): MockReportSections {
  const raw = record.legacy_sections ?? {};
  return {
    athlete_summary: raw.athlete_summary ?? '',
    performance_tests: raw.performance_tests ?? '',
    ai_insights: raw.ai_insights ?? '',
    recommendations: raw.recommendations ?? '',
    ...raw,
  };
}

/** Convert Firestore / repository record to MockReport for UI compatibility. */
export function persistedRecordToMockReport(record: PersistedScientificReportRecord): MockReport {
  const title =
    typeof record.title === 'object' && record.title !== null
      ? record.title.en
      : String(record.title ?? 'Report');

  return {
    id: record.report_id,
    title,
    type: record.mock_type ?? (record.team_id ? 'team' : 'athlete'),
    status: toMockStatus(record.status),
    created_at: record.created_at ?? record.generated_at,
    summary: record.summary ?? title,
    athlete_id: record.athlete_id ?? undefined,
    sections: legacySectionsFromRecord(record),
    builder_meta: record.builder_meta as MockReport['builder_meta'],
    scientific_report: {
      report_id: record.report_id,
      report_type: record.report_type,
      organization_id: record.organization_id,
      athlete_id: record.athlete_id,
      team_id: record.team_id,
      date_range: record.date_range,
      title: record.title,
      sections: record.sections,
      visibility_profile: record.visibility_profile,
      evidence_summary: record.evidence_summary,
      source_references: record.source_references,
      generated_at: record.generated_at,
      generated_by: record.generated_by,
      version_metadata: record.version_metadata,
      viewer_role: record.viewer_role,
    },
  };
}

/** Merge cloud + mock reports — cloud wins on duplicate reportId. */
export function mergeReportLists(
  mockReports: MockReport[],
  cloudReports: PersistedScientificReportRecord[],
  options?: { includeArchived?: boolean }
): MockReport[] {
  const cloudMock = cloudReports
    .filter((r) => options?.includeArchived || r.status !== 'archived')
    .map(persistedRecordToMockReport);

  const cloudIds = new Set(cloudMock.map((r) => r.id));
  const localOnly = mockReports.filter((r) => !cloudIds.has(r.id));
  return [...cloudMock, ...localOnly].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/** Build Firestore document payload from create input. */
export function buildFirestoreReportDocument(
  input: import('@/src/cloud/scientific/models/report').CreateScientificReportInput
): PersistedScientificReportRecord {
  const now = new Date().toISOString();
  const status = input.status ?? 'draft';

  return {
    ...input.report,
    report_id: input.report.report_id,
    organization_id: input.organizationId,
    status,
    summary: input.summary,
    legacy_sections: input.legacySections,
    builder_meta: input.builderMeta,
    mock_type: input.mockType,
    created_at: now,
    updated_at: now,
  };
}

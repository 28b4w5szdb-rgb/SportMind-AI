/**
 * Scientific Report persistence (Phase 7.1 / 7.2).
 *
 * Mock mode: Zustand store. Cloud mode: org-scoped Firestore repository with safe fallback.
 */

import { canAccessScientificFirestore } from '@/src/cloud/scientific/config';
import type { ScientificReport } from '@/src/cloud/scientific/models/report';
import type { MockReport, MockReportSections } from '@/src/data/mock/types';
import type { ReportBuilderConfig } from '@/src/features/report-builder/types';
import { configToBuilderMeta } from '@/src/features/report-builder/utils/reportMeta';
import { scientificReportSummary } from '../utils/mapScientificToLegacy';
import { tryPersistScientificReportToFirestore } from './scientificReportFirestoreAdapter';

export interface SaveScientificReportInput {
  config: ReportBuilderConfig;
  scientificReport: ScientificReport;
  legacySections: MockReportSections;
  mockType: MockReport['type'];
  organizationId: string;
  addReport: (input: Omit<MockReport, 'id' | 'created_at' | 'status'>) => MockReport;
  updateReport: (id: string, patch: Partial<MockReport>) => void;
}

export interface SaveScientificReportResult {
  report: MockReport;
  cloudSaved: boolean;
  cloudError?: string;
  sizeWarning?: boolean;
  chunkingRecommended?: boolean;
}

export function isPersistedScientificReport(report: MockReport | null | undefined): boolean {
  return Boolean(report?.scientific_report ?? report?.builder_meta?.isScientific);
}

/** Attach stable report id and persist to mock store (+ optional cloud repository). */
export async function saveScientificReport(input: SaveScientificReportInput): Promise<SaveScientificReportResult> {
  const { config, scientificReport, legacySections, mockType, organizationId, addReport, updateReport } = input;

  const summary =
    scientificReportSummary(scientificReport, 'en').slice(0, 160) ||
    legacySections.athlete_summary?.slice(0, 160) ||
    config.title;

  const builderMeta = {
    ...configToBuilderMeta(config),
    isScientific: true,
    organizationId,
    scientificSectionOrder: scientificReport.sections.map((s) => s.section_id),
  };

  const report = addReport({
    title: config.title.trim(),
    type: mockType,
    summary,
    athlete_id: config.scope === 'athlete' ? config.athleteId ?? undefined : undefined,
    sections: legacySections,
    builder_meta: builderMeta,
  });

  const finalized: ScientificReport = {
    ...scientificReport,
    report_id: report.id,
    organization_id: organizationId,
  };

  updateReport(report.id, { scientific_report: finalized });

  let cloudSaved = false;
  let cloudError: string | undefined;
  let sizeWarning = false;
  let chunkingRecommended = false;

  if (canAccessScientificFirestore()) {
    const result = await tryPersistScientificReportToFirestore({
      organizationId,
      report: finalized,
      status: 'draft',
      summary,
      legacySections: legacySections as unknown as Record<string, string | undefined>,
      builderMeta: builderMeta as unknown as Record<string, unknown>,
      mockType,
    }).catch(() => ({ ok: false as const, reason: 'write_failed' as const }));

    cloudSaved = result.ok;
    if (result.ok) {
      sizeWarning = Boolean(result.sizeWarning);
      chunkingRecommended = Boolean(result.chunkingRecommended);
    } else {
      cloudError = result.reason;
    }
  }

  return {
    report: { ...report, scientific_report: finalized },
    cloudSaved,
    cloudError,
    sizeWarning,
    chunkingRecommended,
  };
}

/** Load persisted scientific report from mock report wrapper. */
export function loadPersistedScientificReport(report: MockReport | null | undefined): ScientificReport | null {
  if (!report?.scientific_report) return null;
  return {
    ...report.scientific_report,
    report_id: report.scientific_report.report_id || report.id,
  };
}

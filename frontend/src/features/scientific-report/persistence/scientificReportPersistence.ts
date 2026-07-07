/**
 * Scientific Report persistence (Phase 7.1).
 *
 * Mock mode: Zustand store. Cloud mode: Firestore adapter stub with safe fallback.
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

export function isPersistedScientificReport(report: MockReport | null | undefined): boolean {
  return Boolean(report?.scientific_report ?? report?.builder_meta?.isScientific);
}

/** Attach stable report id and persist to mock store (+ optional cloud stub). */
export async function saveScientificReport(input: SaveScientificReportInput): Promise<MockReport> {
  const { config, scientificReport, legacySections, mockType, organizationId, addReport, updateReport } = input;

  const summary =
    scientificReportSummary(scientificReport, 'en').slice(0, 160) ||
    legacySections.athlete_summary?.slice(0, 160) ||
    config.title;

  const persistedPayload: Omit<ScientificReport, 'report_id'> & { report_id?: string } = {
    ...scientificReport,
    organization_id: organizationId,
  };

  const report = addReport({
    title: config.title.trim(),
    type: mockType,
    summary,
    athlete_id: config.scope === 'athlete' ? config.athleteId ?? undefined : undefined,
    sections: legacySections,
    builder_meta: {
      ...configToBuilderMeta(config),
      isScientific: true,
      organizationId,
      scientificSectionOrder: scientificReport.sections.map((s) => s.section_id),
    },
  });

  const finalized: ScientificReport = {
    ...persistedPayload,
    report_id: report.id,
  };

  updateReport(report.id, { scientific_report: finalized });

  if (canAccessScientificFirestore()) {
    await tryPersistScientificReportToFirestore(finalized).catch(() => {
      /* safe fallback — mock store remains source of truth */
    });
  }

  return { ...report, scientific_report: finalized };
}

/** Load persisted scientific report from mock report wrapper. */
export function loadPersistedScientificReport(report: MockReport | null | undefined): ScientificReport | null {
  if (!report?.scientific_report) return null;
  return {
    ...report.scientific_report,
    report_id: report.scientific_report.report_id || report.id,
  };
}

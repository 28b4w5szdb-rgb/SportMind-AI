/**
 * Athlete scientific report prefill defaults (Phase 7.1).
 */

import type { ScientificReportSectionId } from '@/src/cloud/scientific/models/report';
import type { ReportBuilderTypeId, ReportSectionId } from '@/src/features/report-builder/types';

/** Scientific section order for workspace → builder prefill. */
export const ATHLETE_SCIENTIFIC_SECTION_ORDER: ScientificReportSectionId[] = [
  'cover',
  'executive_summary',
  'athlete_profile',
  'passport_summary',
  'performance_summary',
  'assessment_results',
  'ssid_interpretation',
  'scientific_timeline',
  'recommendations',
  'evidence_limitations',
  'signature',
];

/** Legacy wizard section order mapped from scientific prefill. */
export const ATHLETE_SCIENTIFIC_LEGACY_SECTION_ORDER: ReportSectionId[] = [
  'athlete_profile',
  'kpi',
  'performance_analytics',
  'ssid',
  'ai_interpretation',
  'recommendations',
  'references',
];

export const ATHLETE_SCIENTIFIC_PREFILL_REPORT_TYPE: ReportBuilderTypeId = 'athlete';

export function isScientificPrefillParam(prefill: string | undefined): boolean {
  return prefill === 'scientific';
}

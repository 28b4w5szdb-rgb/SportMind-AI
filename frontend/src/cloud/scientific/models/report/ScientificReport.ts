/**
 * Scientific Report — professional output layer (Phase 7.0).
 *
 * Reports summarize Scientific Core artifacts (passport, timeline, assessments).
 * Reports are NOT a data source — source collections remain authoritative.
 */

import type { BilingualText, EvidenceTier } from '../common';

/** Primary report templates supported by the scientific reporting engine. */
export type ScientificReportType =
  | 'athlete'
  | 'team'
  | 'performance'
  | 'recovery'
  | 'sports_medicine'
  | 'research';

/** Modular report section identifiers — bilingual content, no internal keys exposed in UI. */
export type ScientificReportSectionId =
  | 'cover'
  | 'executive_summary'
  | 'athlete_profile'
  | 'passport_summary'
  | 'performance_summary'
  | 'assessment_results'
  | 'normative_comparison'
  | 'ssid_interpretation'
  | 'scientific_timeline'
  | 'recovery_summary'
  | 'training_load_summary'
  | 'injury_medical_summary'
  | 'nutrition_summary'
  | 'wearables_summary'
  | 'recommendations'
  | 'evidence_limitations'
  | 'references'
  | 'signature';

export type ReportViewerRole =
  | 'coach'
  | 'sports_scientist'
  | 'clinical'
  | 'research';

export type ReportVisibilityLevel =
  | 'coach'
  | 'sports_scientist'
  | 'clinical'
  | 'research'
  | 'athlete_self';

/** Pointer to authoritative source — report does not duplicate raw payloads. */
export interface ReportSourceReference {
  collection: string;
  document_id?: string | null;
  subcollection?: string | null;
  label?: string | null;
}

export interface ReportDateRange {
  from: string;
  to: string;
}

export interface ReportEvidenceSummary {
  primary_tier: EvidenceTier;
  tier_label: BilingualText;
  disclaimer: BilingualText;
  source_count: number;
  protocol_refs: string[];
}

export interface ReportVersionMetadata {
  report_schema_version: string;
  builder_version: string;
  sections_included: number;
  sections_empty: number;
  passport_builder_version?: string | null;
  timeline_builder_version?: string | null;
}

/** One bilingual report section — deterministic, no AI generation. */
export interface ScientificReportSection {
  section_id: ScientificReportSectionId;
  title: BilingualText;
  body: BilingualText;
  bullet_points: BilingualText[];
  source_references: ReportSourceReference[];
  evidence_tier: EvidenceTier;
  visibility: ReportVisibilityLevel;
  is_empty: boolean;
  order: number;
}

/** Assembled scientific report — computed output document. */
export interface ScientificReport {
  report_id: string;
  report_type: ScientificReportType;
  organization_id: string;
  athlete_id?: string | null;
  team_id?: string | null;
  date_range: ReportDateRange;
  title: BilingualText;
  sections: ScientificReportSection[];
  visibility_profile: ReportVisibilityLevel;
  evidence_summary: ReportEvidenceSummary;
  source_references: ReportSourceReference[];
  generated_at: string;
  generated_by: string;
  version_metadata: ReportVersionMetadata;
  viewer_role: ReportViewerRole;
}

export const REPORT_SCHEMA_VERSION = '1.0.0';
export const REPORT_BUILDER_VERSION = '7.0';

export const ALL_SCIENTIFIC_REPORT_SECTION_IDS: ScientificReportSectionId[] = [
  'cover',
  'executive_summary',
  'athlete_profile',
  'passport_summary',
  'performance_summary',
  'assessment_results',
  'normative_comparison',
  'ssid_interpretation',
  'scientific_timeline',
  'recovery_summary',
  'training_load_summary',
  'injury_medical_summary',
  'nutrition_summary',
  'wearables_summary',
  'recommendations',
  'evidence_limitations',
  'references',
  'signature',
];

/** Default section order per report type. */
export const DEFAULT_SECTIONS_BY_REPORT_TYPE: Record<ScientificReportType, ScientificReportSectionId[]> = {
  athlete: [
    'cover',
    'executive_summary',
    'athlete_profile',
    'passport_summary',
    'performance_summary',
    'recommendations',
    'evidence_limitations',
    'signature',
  ],
  team: [
    'cover',
    'executive_summary',
    'performance_summary',
    'recommendations',
    'evidence_limitations',
    'signature',
  ],
  performance: [
    'cover',
    'executive_summary',
    'athlete_profile',
    'assessment_results',
    'normative_comparison',
    'ssid_interpretation',
    'performance_summary',
    'recommendations',
    'references',
    'evidence_limitations',
    'signature',
  ],
  recovery: [
    'cover',
    'executive_summary',
    'athlete_profile',
    'recovery_summary',
    'training_load_summary',
    'wearables_summary',
    'recommendations',
    'evidence_limitations',
    'signature',
  ],
  sports_medicine: [
    'cover',
    'executive_summary',
    'athlete_profile',
    'injury_medical_summary',
    'recovery_summary',
    'ssid_interpretation',
    'recommendations',
    'evidence_limitations',
    'references',
    'signature',
  ],
  research: [
    'cover',
    'executive_summary',
    'passport_summary',
    'assessment_results',
    'normative_comparison',
    'ssid_interpretation',
    'scientific_timeline',
    'references',
    'evidence_limitations',
    'signature',
  ],
};

/**
 * Athlete Digital Passport — summary layer domain model (Phase 6D.1).
 *
 * Passport summarizes scientific data without duplicating raw source collections.
 * Source collections remain the truth; passport holds references + derived summaries.
 */

export type PassportSectionId =
  | 'identity'
  | 'sport_profile'
  | 'anthropometry'
  | 'body_composition'
  | 'performance'
  | 'readiness'
  | 'recovery'
  | 'injury'
  | 'training_load'
  | 'nutrition'
  | 'wearable'
  | 'laboratory'
  | 'medical'
  | 'research'
  | 'equipment'
  | 'ssid_insights'
  | 'privacy'
  | 'version';

export type PassportViewerRole =
  | 'coach'
  | 'sports_scientist'
  | 'clinical'
  | 'research'
  | 'athlete';

export type PassportVisibilityLevel =
  | 'public'
  | 'coach'
  | 'sports_scientist'
  | 'clinical'
  | 'research'
  | 'athlete_self';

export type PassportDataConfidence =
  | 'high'
  | 'medium'
  | 'low'
  | 'estimated'
  | 'unavailable';

/** Pointer to authoritative source — no raw payload duplication. */
export interface PassportSourceReference {
  collection: string;
  document_id?: string | null;
  subcollection?: string | null;
  label?: string | null;
}

export interface PassportSummaryField {
  key: string;
  label: string;
  value: string | number | boolean | null;
  unit?: string | null;
  display_value?: string | null;
}

/** One passport section — summary values only. */
export interface PassportSectionSummary {
  section_id: PassportSectionId;
  title: string;
  summary_fields: PassportSummaryField[];
  source_references: PassportSourceReference[];
  last_updated: string | null;
  confidence: PassportDataConfidence;
  visibility: PassportVisibilityLevel;
  is_missing: boolean;
  missing_reason?: string | null;
  collapsed_by_default?: boolean;
}

export interface PassportPrivacyMetadata {
  consent_status: 'pending' | 'granted' | 'revoked' | 'unknown';
  pii_redacted: boolean;
  clinical_restricted: boolean;
  research_deidentified: boolean;
  visible_section_ids: PassportSectionId[];
}

export interface PassportVersionMetadata {
  passport_schema_version: string;
  builder_version: string;
  data_sources_count: number;
  sections_available: number;
  sections_missing: number;
}

/** Assembled athlete passport — computed summary document. */
export interface AthletePassport {
  passport_id: string;
  athlete_id: string;
  organization_id: string;
  viewer_role: PassportViewerRole;
  built_at: string;
  sections: Record<PassportSectionId, PassportSectionSummary>;
  privacy_metadata: PassportPrivacyMetadata;
  version_metadata: PassportVersionMetadata;
}

export const PASSPORT_SCHEMA_VERSION = '1.0.0';
export const PASSPORT_BUILDER_VERSION = '6D.1';

export const ALL_PASSPORT_SECTION_IDS: PassportSectionId[] = [
  'identity',
  'sport_profile',
  'anthropometry',
  'body_composition',
  'performance',
  'readiness',
  'recovery',
  'injury',
  'training_load',
  'nutrition',
  'wearable',
  'laboratory',
  'medical',
  'research',
  'equipment',
  'ssid_insights',
  'privacy',
  'version',
];

/**
 * Shared scientific Firestore model primitives.
 */

import type { AppLanguage, CloudDocumentMeta } from '@/src/cloud/firestore/models/common';

export type { AppLanguage, CloudDocumentMeta };

/** Evidence tier — aligned with Phase 6C.0.2 architecture. */
export type EvidenceTier =
  | 'screening'
  | 'field'
  | 'professional'
  | 'research'
  | 'clinical';

/** Scientific taxonomy categories A–R (Phase 6C.0.2). */
export type ScientificCategoryCode =
  | 'anthropometry'
  | 'body_composition'
  | 'cardiorespiratory'
  | 'strength'
  | 'power'
  | 'speed'
  | 'agility'
  | 'neuromuscular'
  | 'recovery'
  | 'training_load'
  | 'fatigue'
  | 'hydration'
  | 'nutrition'
  | 'sports_medicine'
  | 'injury_risk'
  | 'monitoring'
  | 'readiness'
  | 'laboratory';

export type VersionStatus = 'draft' | 'active' | 'deprecated' | 'archived';

export type OrganizationType =
  | 'university'
  | 'club'
  | 'federation'
  | 'research'
  | 'hospital'
  | 'olympic';

export type DataSourceType =
  | 'manual'
  | 'calculated'
  | 'wearable'
  | 'gps'
  | 'force_plate'
  | 'dexa'
  | 'bia'
  | 'blood'
  | 'spirometry'
  | 'csv'
  | 'questionnaire';

export interface BilingualText {
  en: string;
  ar: string;
}

export interface VersionMeta {
  version: string;
  version_number: number;
  status: VersionStatus;
  effective_from: string;
  superseded_by?: string | null;
}

export interface VersionedDocumentMeta extends CloudDocumentMeta, VersionMeta {}

export interface ReliabilityMeta {
  icc?: number | null;
  sem?: number | null;
  mdc?: number | null;
  swc?: number | null;
  retest_interval_days?: number | null;
}

export interface CitationRef {
  citation_id: string;
  doi?: string | null;
  label: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface SchemaFieldDefinition {
  key: string;
  label: BilingualText;
  unit?: string;
  type: 'number' | 'string' | 'boolean' | 'enum';
  required: boolean;
  enum_values?: string[];
}

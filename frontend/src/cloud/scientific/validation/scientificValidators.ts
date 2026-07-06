/**
 * Runtime validation for scientific Firestore documents.
 * Pure functions — no Firestore I/O.
 */

import type {
  BilingualText,
  EvidenceTier,
  ScientificCategoryCode,
  ValidationResult,
  VersionMeta,
} from '../models/common';
import type { CatalogAssessmentDefinition } from '../models/catalog/AssessmentDefinition';
import type { OrgAthlete } from '../models/organization/OrgAthlete';
import type { OrgEquipment } from '../models/organization/Equipment';
import type { ScientificOrganization } from '../models/organization/OrganizationRoot';

const EVIDENCE_TIERS: EvidenceTier[] = [
  'screening',
  'field',
  'professional',
  'research',
  'clinical',
];

const CATEGORY_CODES: ScientificCategoryCode[] = [
  'anthropometry',
  'body_composition',
  'cardiorespiratory',
  'strength',
  'power',
  'speed',
  'agility',
  'neuromuscular',
  'recovery',
  'training_load',
  'fatigue',
  'hydration',
  'nutrition',
  'sports_medicine',
  'injury_risk',
  'monitoring',
  'readiness',
  'laboratory',
];

function fail(errors: string[], message: string): ValidationResult {
  return { valid: false, errors: [...errors, message] };
}

function ok(errors: string[]): ValidationResult {
  return { valid: errors.length === 0, errors };
}

export function isEvidenceTier(value: unknown): value is EvidenceTier {
  return typeof value === 'string' && EVIDENCE_TIERS.includes(value as EvidenceTier);
}

export function isScientificCategoryCode(value: unknown): value is ScientificCategoryCode {
  return typeof value === 'string' && CATEGORY_CODES.includes(value as ScientificCategoryCode);
}

export function validateBilingualText(value: unknown, field: string, errors: string[]): string[] {
  if (!value || typeof value !== 'object') return [...errors, `${field} must be a bilingual object`];
  const v = value as Partial<BilingualText>;
  if (!v.en?.trim()) return [...errors, `${field}.en is required`];
  if (!v.ar?.trim()) return [...errors, `${field}.ar is required`];
  return errors;
}

export function validateVersionMeta(value: unknown): ValidationResult {
  const errors: string[] = [];
  if (!value || typeof value !== 'object') return fail(errors, 'version meta is required');

  const v = value as Partial<VersionMeta>;
  if (!v.version?.trim()) errors.push('version is required');
  if (typeof v.version_number !== 'number' || v.version_number < 1) {
    errors.push('version_number must be >= 1');
  }
  if (!v.status) errors.push('status is required');
  if (!v.effective_from?.trim()) errors.push('effective_from is required');
  return ok(errors);
}

export function validateCatalogAssessmentDefinition(
  input: Partial<CatalogAssessmentDefinition>
): ValidationResult {
  const errors: string[] = [];

  if (!input.key?.trim()) errors.push('key is required');
  if (!isScientificCategoryCode(input.category_code)) errors.push('invalid category_code');
  if (!isEvidenceTier(input.evidence_tier)) errors.push('invalid evidence_tier');
  if (!input.unit?.trim()) errors.push('unit is required');
  if (!input.current_protocol_version_id?.trim()) {
    errors.push('current_protocol_version_id is required');
  }
  if (!Array.isArray(input.raw_measurement_schema)) {
    errors.push('raw_measurement_schema must be an array');
  }
  if (typeof input.retest_interval_days !== 'number' || input.retest_interval_days < 1) {
    errors.push('retest_interval_days must be >= 1');
  }

  validateBilingualText(input.name, 'name', errors);
  validateBilingualText(input.description, 'description', errors);

  const versionCheck = validateVersionMeta(input);
  errors.push(...versionCheck.errors);

  return ok(errors);
}

export function validateScientificOrganization(
  input: Partial<ScientificOrganization>
): ValidationResult {
  const errors: string[] = [];

  if (!input.name?.trim()) errors.push('name is required');
  if (!input.slug?.trim()) errors.push('slug is required');
  if (!input.owner_uid?.trim()) errors.push('owner_uid is required');
  if (!input.timezone?.trim()) errors.push('timezone is required');
  if (!input.org_type) errors.push('org_type is required');

  return ok(errors);
}

export function validateOrgAthlete(input: Partial<OrgAthlete>): ValidationResult {
  const errors: string[] = [];

  if (!input.organization_id?.trim()) errors.push('organization_id is required');
  if (!input.first_name?.trim()) errors.push('first_name is required');
  if (!input.last_name?.trim()) errors.push('last_name is required');

  return ok(errors);
}

export function validateOrgEquipment(input: Partial<OrgEquipment>): ValidationResult {
  const errors: string[] = [];

  if (!input.organization_id?.trim()) errors.push('organization_id is required');
  if (!input.equipment_type_id?.trim()) errors.push('equipment_type_id is required');
  if (!input.equipment_model_id?.trim()) errors.push('equipment_model_id is required');
  if (!input.serial_number?.trim()) errors.push('serial_number is required');
  if (typeof input.calibration_interval_days !== 'number' || input.calibration_interval_days < 1) {
    errors.push('calibration_interval_days must be >= 1');
  }

  return ok(errors);
}

export function mergeValidation(...results: ValidationResult[]): ValidationResult {
  const errors = results.flatMap((r) => r.errors);
  return { valid: errors.length === 0, errors };
}

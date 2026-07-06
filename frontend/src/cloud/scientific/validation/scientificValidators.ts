/**
 * Runtime validation for scientific Firestore documents.
 * Pure functions — no Firestore I/O.
 */

import type {
  BilingualText,
  DataSourceType,
  EvidenceTier,
  SchemaFieldDefinition,
  ScientificCategoryCode,
  ValidationResult,
  VersionMeta,
} from '../models/common';
import type {
  AssessmentProtocolVersion,
  CatalogAssessmentDefinition,
} from '../models/catalog/AssessmentDefinition';
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

const DATA_SOURCE_TYPES: DataSourceType[] = [
  'manual',
  'calculated',
  'wearable',
  'gps',
  'force_plate',
  'dexa',
  'bia',
  'blood',
  'spirometry',
  'csv',
  'questionnaire',
];

const ASSESSMENT_KEY_PATTERN = /^[a-z][a-z0-9_]{1,63}$/;

export function isDataSourceType(value: unknown): value is DataSourceType {
  return typeof value === 'string' && DATA_SOURCE_TYPES.includes(value as DataSourceType);
}

export function isAssessmentKey(value: unknown): value is string {
  return typeof value === 'string' && ASSESSMENT_KEY_PATTERN.test(value);
}

function validateSchemaFields(fields: unknown, fieldName: string, errors: string[]): string[] {
  if (!Array.isArray(fields)) return [...errors, `${fieldName} must be an array`];
  for (const field of fields as SchemaFieldDefinition[]) {
    if (!field.key?.trim()) errors.push(`${fieldName} field key is required`);
    if (!field.type) errors.push(`${fieldName} field type is required`);
    validateBilingualText(field.label, `${fieldName}.${field.key}.label`, errors);
  }
  return errors;
}

function validateUsabilityModes(
  value: CatalogAssessmentDefinition['usability_modes'] | undefined,
  errors: string[]
): string[] {
  if (!value || typeof value !== 'object') return [...errors, 'usability_modes is required'];
  for (const mode of ['beginner', 'professional', 'research'] as const) {
    if (!Array.isArray(value[mode]) || value[mode].length === 0) {
      errors.push(`usability_modes.${mode} must be a non-empty array`);
    }
  }
  return errors;
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
  else if (!isAssessmentKey(input.key)) errors.push('invalid assessment key format');
  if (!isScientificCategoryCode(input.category_code)) errors.push('invalid category_code');
  if (!input.subcategory?.trim()) errors.push('subcategory is required');
  if (!isEvidenceTier(input.evidence_tier)) errors.push('invalid evidence_tier');
  if (!input.unit?.trim()) errors.push('unit is required');
  if (!input.current_protocol_version_id?.trim()) {
    errors.push('current_protocol_version_id is required');
  }
  if (!Array.isArray(input.raw_measurement_schema)) {
    errors.push('raw_measurement_schema must be an array');
  } else {
    validateSchemaFields(input.raw_measurement_schema, 'raw_measurement_schema', errors);
  }
  if (!Array.isArray(input.required_inputs)) {
    errors.push('required_inputs must be an array');
  } else {
    validateSchemaFields(input.required_inputs, 'required_inputs', errors);
  }
  if (input.optional_inputs) {
    validateSchemaFields(input.optional_inputs, 'optional_inputs', errors);
  }
  if (!Array.isArray(input.calculated_outputs) || input.calculated_outputs.length === 0) {
    errors.push('calculated_outputs must be a non-empty array');
  }
  if (!Array.isArray(input.allowed_source_types) || input.allowed_source_types.length === 0) {
    errors.push('allowed_source_types must be a non-empty array');
  } else if (!input.allowed_source_types.every(isDataSourceType)) {
    errors.push('invalid allowed_source_types value');
  }
  if (typeof input.retest_interval_days !== 'number' || input.retest_interval_days < 1) {
    errors.push('retest_interval_days must be >= 1');
  }
  if (typeof input.ai_compatible !== 'boolean') errors.push('ai_compatible is required');
  if (typeof input.report_compatible !== 'boolean') errors.push('report_compatible is required');
  if (!Array.isArray(input.tags) || input.tags.length === 0) errors.push('tags must be a non-empty array');

  validateBilingualText(input.name, 'name', errors);
  validateBilingualText(input.description, 'description', errors);
  validateBilingualText(input.purpose, 'purpose', errors);
  validateBilingualText(input.audience, 'audience', errors);
  validateBilingualText(input.protocol_summary, 'protocol_summary', errors);
  validateBilingualText(input.reliability_notes, 'reliability_notes', errors);
  validateBilingualText(input.validity_notes, 'validity_notes', errors);
  validateBilingualText(input.contraindications, 'contraindications', errors);
  validateBilingualText(input.common_mistakes, 'common_mistakes', errors);
  validateBilingualText(input.interpretation_scope, 'interpretation_scope', errors);
  validateUsabilityModes(input.usability_modes, errors);

  const versionCheck = validateVersionMeta(input);
  errors.push(...versionCheck.errors);

  return ok(errors);
}

export function validateAssessmentProtocolVersion(
  input: Partial<AssessmentProtocolVersion>
): ValidationResult {
  const errors: string[] = [];

  if (!input.definition_id?.trim()) errors.push('definition_id is required');
  validateBilingualText(input.protocol_text, 'protocol_text', errors);
  validateBilingualText(input.equipment_requirements, 'equipment_requirements', errors);
  if (!input.reliability || typeof input.reliability !== 'object') {
    errors.push('reliability is required');
  }

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

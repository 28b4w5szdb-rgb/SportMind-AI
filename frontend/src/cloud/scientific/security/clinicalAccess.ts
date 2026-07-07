/**
 * Clinical and medical data access helpers (Phase 6C.10).
 *
 * Coaches receive availability status only — no diagnosis unless clinically authorized.
 */

import { canReadAssessments, canReadAthletes, hasPermission, type SecurityContext } from './accessControl';
import { PERMISSIONS } from './permissions';
import { SYSTEM_ROLES, type SystemRoleKey } from './roles';

export type AthleteAvailabilityStatus = 'available' | 'modified' | 'unavailable';

export const COACH_VISIBLE_MEDICAL_FIELDS = [
  'availability_status',
  'return_to_play_summary',
] as const;

export const RESTRICTED_MEDICAL_FIELDS = [
  'diagnosis',
  'diagnosis_code',
  'clinical_notes',
  'treatment_plan',
  'medications',
  'imaging_results',
  'lab_results',
  'severity_grade',
  'pain_level',
  'swelling',
  'notes',
] as const;

export function canReadFullMedicalRecord(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.READ_MEDICAL);
}

export function canWriteMedicalRecord(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.WRITE_MEDICAL);
}

export function canReadLimitedMedicalStatus(context: SecurityContext): boolean {
  if (canReadFullMedicalRecord(context)) return true;
  if (!canReadAthletes(context)) return false;
  const roleIds = [
    ...((context.claims.roleIds as string[]) ?? []),
    ...(context.membership?.role_ids ?? []),
  ];
  return roleIds.some((roleId) => SYSTEM_ROLES[roleId as SystemRoleKey]?.limitedMedicalStatus);
}

export function filterCoachMedicalView<T extends Record<string, unknown>>(
  record: T
): Pick<T, (typeof COACH_VISIBLE_MEDICAL_FIELDS)[number]> & Partial<T> {
  const filtered: Record<string, unknown> = {};
  for (const key of COACH_VISIBLE_MEDICAL_FIELDS) {
    if (key in record) {
      filtered[key] = record[key];
    }
  }
  return filtered as Pick<T, (typeof COACH_VISIBLE_MEDICAL_FIELDS)[number]> & Partial<T>;
}

export function stripRestrictedMedicalFields<T extends Record<string, unknown>>(record: T): Partial<T> {
  const copy = { ...record };
  for (const key of RESTRICTED_MEDICAL_FIELDS) {
    delete copy[key];
  }
  return copy;
}

/** Whether an athlete profile field is safe for non-clinical roles. */
export function isCoachSafeAthleteField(fieldName: string): boolean {
  if (fieldName === 'availability_status') return true;
  return !RESTRICTED_MEDICAL_FIELDS.includes(fieldName as (typeof RESTRICTED_MEDICAL_FIELDS)[number]);
}

export function canAccessAthleteForClinicalReview(context: SecurityContext): boolean {
  return canReadFullMedicalRecord(context) || (canReadAthletes(context) && canReadAssessments(context));
}

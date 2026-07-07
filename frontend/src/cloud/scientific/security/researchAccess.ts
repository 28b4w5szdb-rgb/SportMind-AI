/**
 * Research data access and de-identification helpers (Phase 6C.10).
 */

import { hasPermission, type SecurityContext } from './accessControl';
import { PERMISSIONS } from './permissions';

export const PII_FIELD_KEYS = [
  'first_name',
  'last_name',
  'full_name',
  'email',
  'phone',
  'date_of_birth',
  'nationality',
  'address',
  'external_ids',
  'uid',
  'athlete_id',
] as const;

export type PseudonymId = string;

export interface DeIdentifiedResearchRecord {
  pseudonym_id: PseudonymId;
  organization_id: string;
  dataset_id?: string;
  deidentified: true;
  [key: string]: unknown;
}

export function canReadResearchData(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.READ_RESEARCH);
}

export function canExportResearch(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.EXPORT_RESEARCH);
}

export function isDeIdentifiedRecord(record: Record<string, unknown>): boolean {
  if (record.deidentified !== true) return false;
  if (typeof record.pseudonym_id !== 'string' || !record.pseudonym_id.trim()) return false;
  return !PII_FIELD_KEYS.some((key) => key in record && record[key] != null);
}

export function assertResearchSafeRecord(record: Record<string, unknown>): boolean {
  if (!isDeIdentifiedRecord(record)) return false;
  for (const key of PII_FIELD_KEYS) {
    if (key in record && record[key] != null) return false;
  }
  return true;
}

export function toResearchView<T extends Record<string, unknown>>(
  record: T,
  pseudonymId: PseudonymId
): DeIdentifiedResearchRecord {
  const stripped = { ...record };
  for (const key of PII_FIELD_KEYS) {
    delete stripped[key];
  }
  return {
    ...stripped,
    pseudonym_id: pseudonymId,
    organization_id: String(record.organization_id ?? ''),
    deidentified: true,
  };
}

export function canAccessResearchDataset(
  context: SecurityContext,
  options: { export?: boolean; deidentified?: boolean } = {}
): boolean {
  if (options.export) {
    return canExportResearch(context);
  }
  if (!canReadResearchData(context)) return false;
  if (options.deidentified === false) {
    return context.claims.isOrgAdmin === true;
  }
  return true;
}

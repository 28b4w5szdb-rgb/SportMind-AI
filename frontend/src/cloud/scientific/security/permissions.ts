/**
 * Canonical permission keys — mirrored in Firestore rules and custom claims (Phase 6C.10).
 */

export const PERMISSIONS = {
  READ_ATHLETES: 'read_athletes',
  WRITE_ATHLETES: 'write_athletes',
  READ_ASSESSMENTS: 'read_assessments',
  WRITE_ASSESSMENTS: 'write_assessments',
  READ_MEDICAL: 'read_medical',
  WRITE_MEDICAL: 'write_medical',
  READ_RESEARCH: 'read_research',
  EXPORT_RESEARCH: 'export_research',
  READ_REPORTS: 'read_reports',
  WRITE_REPORTS: 'write_reports',
  MANAGE_USERS: 'manage_users',
  MANAGE_ORG: 'manage_org',
  MANAGE_EQUIPMENT: 'manage_equipment',
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS: readonly PermissionKey[] = Object.values(PERMISSIONS);

export const CLINICAL_PERMISSIONS: readonly PermissionKey[] = [
  PERMISSIONS.READ_MEDICAL,
  PERMISSIONS.WRITE_MEDICAL,
];

export const RESEARCH_PERMISSIONS: readonly PermissionKey[] = [
  PERMISSIONS.READ_RESEARCH,
  PERMISSIONS.EXPORT_RESEARCH,
];

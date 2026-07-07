/**
 * System role definitions and default permission bundles (Phase 6C.10).
 */

import { PERMISSIONS, type PermissionKey } from './permissions';

export const SYSTEM_ROLE_KEYS = [
  'org_admin',
  'head_coach',
  'coach',
  'sports_scientist',
  'physiotherapist',
  'team_doctor',
  'researcher',
  'analyst',
  'viewer',
  'athlete_portal',
] as const;

export type SystemRoleKey = (typeof SYSTEM_ROLE_KEYS)[number];

export interface SystemRoleDefinition {
  key: SystemRoleKey;
  label: string;
  permissions: readonly PermissionKey[];
  /** Roles that may access full medical records (diagnosis-level). */
  clinicalAccess: boolean;
  /** Roles limited to athlete availability status only. */
  limitedMedicalStatus: boolean;
  /** Research roles receive de-identified datasets by default. */
  researchDeIdentifiedDefault: boolean;
}

const readOnlyAthleteAssessment: PermissionKey[] = [
  PERMISSIONS.READ_ATHLETES,
  PERMISSIONS.READ_ASSESSMENTS,
];

export const SYSTEM_ROLES: Record<SystemRoleKey, SystemRoleDefinition> = {
  org_admin: {
    key: 'org_admin',
    label: 'Organization Admin',
    permissions: Object.values(PERMISSIONS),
    clinicalAccess: true,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: false,
  },
  head_coach: {
    key: 'head_coach',
    label: 'Head Coach',
    permissions: [
      PERMISSIONS.READ_ATHLETES,
      PERMISSIONS.WRITE_ATHLETES,
      PERMISSIONS.READ_ASSESSMENTS,
      PERMISSIONS.WRITE_ASSESSMENTS,
      PERMISSIONS.READ_REPORTS,
      PERMISSIONS.WRITE_REPORTS,
    ],
    clinicalAccess: false,
    limitedMedicalStatus: true,
    researchDeIdentifiedDefault: false,
  },
  coach: {
    key: 'coach',
    label: 'Coach',
    permissions: [
      PERMISSIONS.READ_ATHLETES,
      PERMISSIONS.WRITE_ATHLETES,
      PERMISSIONS.READ_ASSESSMENTS,
      PERMISSIONS.WRITE_ASSESSMENTS,
    ],
    clinicalAccess: false,
    limitedMedicalStatus: true,
    researchDeIdentifiedDefault: false,
  },
  sports_scientist: {
    key: 'sports_scientist',
    label: 'Sports Scientist',
    permissions: [
      ...readOnlyAthleteAssessment,
      PERMISSIONS.WRITE_ASSESSMENTS,
      PERMISSIONS.READ_RESEARCH,
      PERMISSIONS.READ_REPORTS,
    ],
    clinicalAccess: false,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: true,
  },
  physiotherapist: {
    key: 'physiotherapist',
    label: 'Physiotherapist',
    permissions: [
      PERMISSIONS.READ_ATHLETES,
      PERMISSIONS.READ_ASSESSMENTS,
      PERMISSIONS.READ_MEDICAL,
      PERMISSIONS.WRITE_MEDICAL,
    ],
    clinicalAccess: true,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: false,
  },
  team_doctor: {
    key: 'team_doctor',
    label: 'Team Doctor',
    permissions: [
      PERMISSIONS.READ_ATHLETES,
      PERMISSIONS.READ_ASSESSMENTS,
      PERMISSIONS.READ_MEDICAL,
      PERMISSIONS.WRITE_MEDICAL,
      PERMISSIONS.READ_REPORTS,
    ],
    clinicalAccess: true,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: false,
  },
  researcher: {
    key: 'researcher',
    label: 'Researcher',
    permissions: [PERMISSIONS.READ_RESEARCH, PERMISSIONS.EXPORT_RESEARCH],
    clinicalAccess: false,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: true,
  },
  analyst: {
    key: 'analyst',
    label: 'Analyst',
    permissions: [...readOnlyAthleteAssessment, PERMISSIONS.READ_REPORTS],
    clinicalAccess: false,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: true,
  },
  viewer: {
    key: 'viewer',
    label: 'Viewer',
    permissions: readOnlyAthleteAssessment,
    clinicalAccess: false,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: false,
  },
  athlete_portal: {
    key: 'athlete_portal',
    label: 'Athlete Portal',
    permissions: [PERMISSIONS.READ_ASSESSMENTS],
    clinicalAccess: false,
    limitedMedicalStatus: false,
    researchDeIdentifiedDefault: false,
  },
};

export function permissionsForRoles(roleIds: string[]): PermissionKey[] {
  const set = new Set<PermissionKey>();
  for (const roleId of roleIds) {
    const role = SYSTEM_ROLES[roleId as SystemRoleKey];
    if (role) {
      for (const permission of role.permissions) {
        set.add(permission);
      }
    }
  }
  return [...set];
}

export const mapRoleIdsToPermissions = permissionsForRoles;

export function isClinicalRole(roleId: string): boolean {
  const role = SYSTEM_ROLES[roleId as SystemRoleKey];
  return Boolean(role?.clinicalAccess);
}

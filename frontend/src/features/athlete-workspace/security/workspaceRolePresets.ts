/**
 * Dev/mock workspace role presets — maps staff roles to security claims (Phase 6D.3).
 */

import type { DecodedCustomClaims } from '@/src/cloud/scientific/security/customClaims';
import type { MembershipPermissionSource } from '@/src/cloud/scientific/security/effectivePermissionsResolver';
import { PERMISSIONS } from '@/src/cloud/scientific/security/permissions';

export type WorkspaceRole =
  | 'coach'
  | 'sports_scientist'
  | 'team_doctor'
  | 'physiotherapist'
  | 'researcher'
  | 'athlete'
  | 'org_admin';

export const WORKSPACE_MOCK_ORG_ID = 'org_sportmind_demo';

const BASE_CLAIMS: DecodedCustomClaims = {
  organizationIds: [WORKSPACE_MOCK_ORG_ID],
  activeOrganizationId: WORKSPACE_MOCK_ORG_ID,
  permissions: [],
  roleIds: [],
};

export const WORKSPACE_ROLE_PRESETS: Record<
  WorkspaceRole,
  { claims: DecodedCustomClaims; membership: MembershipPermissionSource }
> = {
  coach: {
    claims: {
      ...BASE_CLAIMS,
      roleIds: ['coach'],
      permissions: [
        PERMISSIONS.READ_ATHLETES,
        PERMISSIONS.WRITE_ATHLETES,
        PERMISSIONS.READ_ASSESSMENTS,
        PERMISSIONS.WRITE_ASSESSMENTS,
      ],
    },
    membership: { status: 'active', role_ids: ['coach'], permissions: [] },
  },
  sports_scientist: {
    claims: {
      ...BASE_CLAIMS,
      roleIds: ['sports_scientist'],
      permissions: [
        PERMISSIONS.READ_ATHLETES,
        PERMISSIONS.READ_ASSESSMENTS,
        PERMISSIONS.WRITE_ASSESSMENTS,
        PERMISSIONS.READ_RESEARCH,
        PERMISSIONS.READ_REPORTS,
      ],
    },
    membership: { status: 'active', role_ids: ['sports_scientist'], permissions: [], research_access: true },
  },
  team_doctor: {
    claims: {
      ...BASE_CLAIMS,
      roleIds: ['team_doctor'],
      permissions: [
        PERMISSIONS.READ_ATHLETES,
        PERMISSIONS.READ_ASSESSMENTS,
        PERMISSIONS.READ_MEDICAL,
        PERMISSIONS.WRITE_MEDICAL,
        PERMISSIONS.READ_REPORTS,
      ],
    },
    membership: {
      status: 'active',
      role_ids: ['team_doctor'],
      permissions: [],
      clinical_access: true,
    },
  },
  physiotherapist: {
    claims: {
      ...BASE_CLAIMS,
      roleIds: ['physiotherapist'],
      permissions: [
        PERMISSIONS.READ_ATHLETES,
        PERMISSIONS.READ_ASSESSMENTS,
        PERMISSIONS.READ_MEDICAL,
        PERMISSIONS.WRITE_MEDICAL,
      ],
    },
    membership: {
      status: 'active',
      role_ids: ['physiotherapist'],
      permissions: [],
      clinical_access: true,
    },
  },
  researcher: {
    claims: {
      ...BASE_CLAIMS,
      roleIds: ['researcher'],
      permissions: [PERMISSIONS.READ_RESEARCH, PERMISSIONS.EXPORT_RESEARCH],
    },
    membership: {
      status: 'active',
      role_ids: ['researcher'],
      permissions: [],
      research_access: true,
      export_research: true,
    },
  },
  athlete: {
    claims: {
      ...BASE_CLAIMS,
      roleIds: ['athlete_portal'],
      permissions: [PERMISSIONS.READ_ASSESSMENTS],
    },
    membership: { status: 'active', role_ids: ['athlete_portal'], permissions: [] },
  },
  org_admin: {
    claims: {
      ...BASE_CLAIMS,
      roleIds: ['org_admin'],
      isOrgAdmin: true,
      permissions: [PERMISSIONS.MANAGE_ORG, PERMISSIONS.MANAGE_USERS],
    },
    membership: { status: 'active', role_ids: ['org_admin'], permissions: [PERMISSIONS.MANAGE_ORG] },
  },
};

export function parseWorkspaceRole(value: string | undefined): WorkspaceRole {
  if (value && value in WORKSPACE_ROLE_PRESETS) return value as WorkspaceRole;
  return 'coach';
}

export function devWorkspaceRoleFromEnv(): WorkspaceRole {
  const raw =
    process.env.EXPO_PUBLIC_DEV_WORKSPACE_ROLE ?? process.env.DEV_WORKSPACE_ROLE;
  return parseWorkspaceRole(raw);
}

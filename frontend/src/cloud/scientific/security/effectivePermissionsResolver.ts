/**
 * Effective permissions resolver — claims + membership + roles (Phase 6C.11).
 */

import type { OrgRoleDefinition } from '../models/organization/RoleDefinition';
import type { PermissionAction } from '../models/organization/RoleDefinition';
import type { DecodedCustomClaims } from './customClaims';
import { normalizeCustomClaims } from './customClaims';
import { ALL_PERMISSIONS, PERMISSIONS, type PermissionKey } from './permissions';
import { permissionsForRoles } from './roles';

export interface MembershipPermissionSource {
  status: 'active' | 'inactive' | 'invited';
  role_ids?: string[];
  permissions?: string[];
  team_ids?: string[];
  clinical_access?: boolean;
  research_access?: boolean;
  export_research?: boolean;
}

export interface EffectivePermissionInput {
  uid: string;
  orgId: string;
  claims?: DecodedCustomClaims | null;
  membership?: MembershipPermissionSource | null;
  roleDefinitions?: OrgRoleDefinition[];
}

const RESOURCE_ACTION_PERMISSION: Record<string, Partial<Record<PermissionAction, PermissionKey>>> = {
  athletes: { read: PERMISSIONS.READ_ATHLETES, write: PERMISSIONS.WRITE_ATHLETES },
  assessments: { read: PERMISSIONS.READ_ASSESSMENTS, write: PERMISSIONS.WRITE_ASSESSMENTS },
  medical: { read: PERMISSIONS.READ_MEDICAL, write: PERMISSIONS.WRITE_MEDICAL },
  research: { read: PERMISSIONS.READ_RESEARCH, export: PERMISSIONS.EXPORT_RESEARCH },
  reports: { read: PERMISSIONS.READ_REPORTS, write: PERMISSIONS.WRITE_REPORTS },
  org: { write: PERMISSIONS.MANAGE_ORG },
  users: { write: PERMISSIONS.MANAGE_USERS },
  equipment: { write: PERMISSIONS.MANAGE_EQUIPMENT },
};

function normalizePermissionKeys(values: string[] | undefined): PermissionKey[] {
  if (!values?.length) return [];
  return values.filter((item): item is PermissionKey =>
    (ALL_PERMISSIONS as readonly string[]).includes(item)
  );
}

function permissionsFromRoleDefinitions(
  roleIds: string[] | undefined,
  roleDefinitions: OrgRoleDefinition[] | undefined
): PermissionKey[] {
  if (!roleIds?.length || !roleDefinitions?.length) return [];
  const byKey = new Map(roleDefinitions.map((role) => [role.key, role]));
  const resolved = new Set<PermissionKey>();
  for (const roleId of roleIds) {
    const definition = byKey.get(roleId);
    if (!definition) continue;
    for (const entry of definition.permissions) {
      const mapped = RESOURCE_ACTION_PERMISSION[entry.resource];
      if (!mapped) continue;
      for (const action of entry.actions) {
        const permission = mapped[action];
        if (permission) resolved.add(permission);
      }
    }
  }
  return [...resolved];
}

function applyMembershipFlags(
  membership: MembershipPermissionSource,
  permissions: Set<PermissionKey>
): void {
  if (membership.clinical_access) {
    permissions.add(PERMISSIONS.READ_MEDICAL);
    permissions.add(PERMISSIONS.WRITE_MEDICAL);
  }
  if (membership.research_access) {
    permissions.add(PERMISSIONS.READ_RESEARCH);
  }
  if (membership.export_research) {
    permissions.add(PERMISSIONS.EXPORT_RESEARCH);
  }
}

/** Union resolver: claims permissions + claim roles + membership roles + direct membership permissions. */
export function resolveEffectivePermissions(input: EffectivePermissionInput): PermissionKey[] {
  const claims = normalizeCustomClaims(input.claims);
  if (claims.isOrgAdmin) {
    return [...ALL_PERMISSIONS];
  }

  const permissions = new Set<PermissionKey>();

  for (const permission of normalizePermissionKeys(claims.permissions as string[])) {
    permissions.add(permission);
  }
  for (const permission of permissionsForRoles((claims.roleIds as string[]) ?? [])) {
    permissions.add(permission);
  }

  const membership = input.membership;
  if (membership?.status === 'active') {
    for (const permission of normalizePermissionKeys(membership.permissions)) {
      permissions.add(permission);
    }
    for (const permission of permissionsForRoles(membership.role_ids ?? [])) {
      permissions.add(permission);
    }
    for (const permission of permissionsFromRoleDefinitions(
      membership.role_ids,
      input.roleDefinitions
    )) {
      permissions.add(permission);
    }
    applyMembershipFlags(membership, permissions);
  }

  return [...permissions];
}

export function hasEffectivePermission(
  input: EffectivePermissionInput,
  permission: PermissionKey
): boolean {
  return resolveEffectivePermissions(input).includes(permission);
}

export function isActiveMembership(membership: MembershipPermissionSource | null | undefined): boolean {
  return membership?.status === 'active';
}

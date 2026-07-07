/**
 * Client-side access control helpers — mirror Firestore rules logic (Phase 6C.10).
 */

import type { DecodedCustomClaims } from './customClaims';
import { normalizeCustomClaims } from './customClaims';
import { PERMISSIONS, type PermissionKey } from './permissions';
import { permissionsForRoles, type SystemRoleKey } from './roles';

export interface SecurityContext {
  uid: string;
  orgId: string;
  claims: DecodedCustomClaims;
  /** Optional org membership roles from Firestore when claims are not yet provisioned. */
  membershipRoleIds?: string[];
}

export function buildSecurityContext(
  uid: string,
  orgId: string,
  claims?: DecodedCustomClaims | null,
  membershipRoleIds?: string[]
): SecurityContext {
  return {
    uid,
    orgId,
    claims: normalizeCustomClaims(claims),
    membershipRoleIds,
  };
}

export function isOrgMember(context: SecurityContext): boolean {
  const organizationIds = context.claims.organizationIds ?? [];
  const { activeOrganizationId } = context.claims;
  if (activeOrganizationId === context.orgId) return true;
  return organizationIds.includes(context.orgId);
}

/** Mirrors rules fallback: claims OR active org membership document roles. */
export function isActiveOrgMember(context: SecurityContext): boolean {
  if (isOrgMember(context)) return true;
  return Boolean(context.membershipRoleIds?.length);
}

export function resolveEffectivePermissions(context: SecurityContext): PermissionKey[] {
  if (context.claims.isOrgAdmin) {
    return Object.values(PERMISSIONS);
  }

  const claimPermissions = (context.claims.permissions ?? []).filter(
    (item): item is PermissionKey => Object.values(PERMISSIONS).includes(item as PermissionKey)
  );
  if (claimPermissions.length > 0) {
    return [...new Set(claimPermissions)];
  }

  const roleIds = [
    ...(context.claims.roleIds ?? []),
    ...(context.membershipRoleIds ?? []),
  ];
  return permissionsForRoles(roleIds);
}

export function hasPermission(context: SecurityContext, permission: PermissionKey): boolean {
  if (!isActiveOrgMember(context)) return false;
  if (context.claims.isOrgAdmin) return true;
  return resolveEffectivePermissions(context).includes(permission);
}

export function hasAnyPermission(context: SecurityContext, permissions: PermissionKey[]): boolean {
  return permissions.some((permission) => hasPermission(context, permission));
}

export function hasRole(context: SecurityContext, role: SystemRoleKey | string): boolean {
  const roleIds = [
    ...(context.claims.roleIds ?? []),
    ...(context.membershipRoleIds ?? []),
  ];
  return roleIds.includes(role);
}

export function canReadAthletes(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.READ_ATHLETES);
}

export function canWriteAthletes(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.WRITE_ATHLETES);
}

export function canReadAssessments(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.READ_ASSESSMENTS);
}

export function canWriteAssessments(context: SecurityContext): boolean {
  return hasPermission(context, PERMISSIONS.WRITE_ASSESSMENTS);
}

export function canManageOrg(context: SecurityContext): boolean {
  return context.claims.isOrgAdmin === true || hasPermission(context, PERMISSIONS.MANAGE_ORG);
}

export function canManageUsers(context: SecurityContext): boolean {
  return context.claims.isOrgAdmin === true || hasPermission(context, PERMISSIONS.MANAGE_USERS);
}

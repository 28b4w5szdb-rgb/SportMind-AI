/**
 * Client-side access control helpers — mirror Firestore rules logic (Phase 6C.10 / 6C.11).
 */

import type { DecodedCustomClaims } from './customClaims';
import { normalizeCustomClaims } from './customClaims';
import {
  resolveEffectivePermissions,
  type MembershipPermissionSource,
} from './effectivePermissionsResolver';
import { PERMISSIONS, type PermissionKey } from './permissions';
import type { SystemRoleKey } from './roles';

export interface SecurityContext {
  uid: string;
  orgId: string;
  claims: DecodedCustomClaims;
  membership?: MembershipPermissionSource | null;
}

export function buildSecurityContext(
  uid: string,
  orgId: string,
  claims?: DecodedCustomClaims | null,
  membership?: MembershipPermissionSource | null
): SecurityContext {
  return {
    uid,
    orgId,
    claims: normalizeCustomClaims(claims),
    membership,
  };
}

export function isOrgMember(context: SecurityContext): boolean {
  const organizationIds = context.claims.organizationIds ?? [];
  const { activeOrganizationId } = context.claims;
  if (activeOrganizationId === context.orgId) return true;
  if (organizationIds.includes(context.orgId)) return true;
  return context.membership?.status === 'active';
}

/** Mirrors rules fallback: claims OR active org membership document. */
export function isActiveOrgMember(context: SecurityContext): boolean {
  if (isOrgMember(context)) return true;
  return context.membership?.status === 'active';
}

export function resolveContextPermissions(context: SecurityContext): PermissionKey[] {
  return resolveEffectivePermissions({
    uid: context.uid,
    orgId: context.orgId,
    claims: context.claims,
    membership: context.membership,
  });
}

export function hasPermission(context: SecurityContext, permission: PermissionKey): boolean {
  if (!isActiveOrgMember(context)) return false;
  if (context.claims.isOrgAdmin) return true;
  return resolveContextPermissions(context).includes(permission);
}

export function hasAnyPermission(context: SecurityContext, permissions: PermissionKey[]): boolean {
  return permissions.some((permission) => hasPermission(context, permission));
}

export function hasRole(context: SecurityContext, role: SystemRoleKey | string): boolean {
  const roleIds = [
    ...((context.claims.roleIds as string[]) ?? []),
    ...(context.membership?.role_ids ?? []),
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

/** @deprecated Use resolveContextPermissions */
export { resolveContextPermissions as resolveEffectivePermissions };

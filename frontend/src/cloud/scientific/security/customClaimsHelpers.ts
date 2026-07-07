/**
 * Custom claims builders and validators (Phase 6C.11).
 *
 * For Cloud Functions / Admin SDK provisioning — not deployed in this phase.
 */

import type { OrgMember } from '../models/organization/OrgMember';
import {
  resolveEffectivePermissions,
  type EffectivePermissionInput,
  type MembershipPermissionSource,
} from './effectivePermissionsResolver';
import {
  CUSTOM_CLAIMS_VERSION,
  type DecodedCustomClaims,
  type SportMindCustomClaims,
} from './customClaims';
import { ALL_PERMISSIONS, type PermissionKey } from './permissions';
import { permissionsForRoles } from './roles';

export interface BuildCustomClaimsInput {
  uid: string;
  orgId: string;
  roleIds?: string[];
  permissions?: PermissionKey[];
  isOrgAdmin?: boolean;
  organizationIds?: string[];
  teamIds?: string[];
  linkedAthleteId?: string;
}

export interface ClaimsValidationResult {
  valid: boolean;
  errors: string[];
}

export function mapRoleIdsToPermissions(roleIds: string[]): PermissionKey[] {
  return permissionsForRoles(roleIds);
}

export function resolveActiveOrganizationId(
  claims: DecodedCustomClaims | null | undefined,
  fallbackOrgId?: string
): string | undefined {
  if (claims?.activeOrganizationId) return claims.activeOrganizationId;
  if (claims?.organizationIds?.length === 1) return claims.organizationIds[0];
  return fallbackOrgId;
}

export function checkOrgMembershipFromClaims(
  claims: DecodedCustomClaims | null | undefined,
  orgId: string
): boolean {
  if (!claims) return false;
  if (claims.activeOrganizationId === orgId) return true;
  return (claims.organizationIds ?? []).includes(orgId);
}

export function checkOrgMembershipFromDocument(
  membership: MembershipPermissionSource | null | undefined,
  orgId: string,
  uid: string,
  memberUid?: string
): boolean {
  if (!membership || membership.status !== 'active') return false;
  if (memberUid && memberUid !== uid) return false;
  return true;
}

export function buildCustomClaimsPayload(input: BuildCustomClaimsInput): SportMindCustomClaims {
  const organizationIds = input.organizationIds?.length
    ? [...new Set([...input.organizationIds, input.orgId])]
    : [input.orgId];

  const roleIds = input.roleIds ?? [];
  const derivedPermissions = mapRoleIdsToPermissions(roleIds);
  const permissions = [...new Set([...(input.permissions ?? []), ...derivedPermissions])];

  if (input.isOrgAdmin) {
    return {
      organizationIds,
      activeOrganizationId: input.orgId,
      roleIds: roleIds.length ? roleIds : ['org_admin'],
      permissions: [...ALL_PERMISSIONS],
      isOrgAdmin: true,
      teamIds: input.teamIds ?? [],
      linkedAthleteId: input.linkedAthleteId,
      claimsVersion: CUSTOM_CLAIMS_VERSION,
    };
  }

  return {
    organizationIds,
    activeOrganizationId: input.orgId,
    roleIds,
    permissions,
    isOrgAdmin: false,
    teamIds: input.teamIds ?? [],
    linkedAthleteId: input.linkedAthleteId,
    claimsVersion: CUSTOM_CLAIMS_VERSION,
  };
}

export function validateClaimsPayload(claims: SportMindCustomClaims): ClaimsValidationResult {
  const errors: string[] = [];

  if (!claims.organizationIds?.length) {
    errors.push('organizationIds must contain at least one organization');
  }
  if (claims.activeOrganizationId && !claims.organizationIds.includes(claims.activeOrganizationId)) {
    errors.push('activeOrganizationId must be included in organizationIds');
  }
  if (claims.permissions?.some((item) => !(ALL_PERMISSIONS as readonly string[]).includes(item))) {
    errors.push('permissions contains unknown permission keys');
  }
  if (claims.claimsVersion && claims.claimsVersion !== CUSTOM_CLAIMS_VERSION) {
    errors.push(`unsupported claimsVersion: ${claims.claimsVersion}`);
  }

  return { valid: errors.length === 0, errors };
}

export function membershipFromOrgMember(member: OrgMember): MembershipPermissionSource {
  return {
    status: member.status,
    role_ids: member.role_ids,
    permissions: member.permissions,
    team_ids: member.team_ids,
    clinical_access: member.clinical_access,
    research_access: member.research_access,
    export_research: member.export_research,
  };
}

export function checkEffectivePermission(
  input: EffectivePermissionInput,
  permission: PermissionKey
): boolean {
  return resolveEffectivePermissions(input).includes(permission);
}

export function buildClaimsFromMembership(member: OrgMember, orgId: string): SportMindCustomClaims {
  return buildCustomClaimsPayload({
    uid: member.uid,
    orgId,
    roleIds: member.role_ids,
    permissions: (member.permissions ?? []) as PermissionKey[],
    isOrgAdmin: member.role_ids.includes('org_admin'),
    organizationIds: [orgId],
    teamIds: member.team_ids,
  });
}

/**
 * Firebase Auth custom claims design — types only (Phase 6C.10).
 *
 * Populated by future Cloud Functions / Admin SDK; not required at runtime in mock mode.
 */

import type { PermissionKey } from './permissions';
import type { SystemRoleKey } from './roles';

/** JWT custom claims attached to Firebase ID tokens. */
export interface SportMindCustomClaims {
  /** Organizations the user belongs to. */
  organizationIds: string[];
  /** Active tenant context for multi-org users. */
  activeOrganizationId?: string;
  /** System or org-defined role keys for the active organization. */
  roleIds: SystemRoleKey[] | string[];
  /** Effective permission keys for the active organization (denormalized). */
  permissions: PermissionKey[] | string[];
  /** Short-circuit for org administration. */
  isOrgAdmin?: boolean;
  /** Team scope for coach-level ABAC (optional). */
  teamIds?: string[];
  /** Athlete portal self-access (optional). */
  linkedAthleteId?: string;
  /** Claims schema version for migration. */
  claimsVersion?: string;
}

export const CUSTOM_CLAIMS_VERSION = '1.0.0';

export const CUSTOM_CLAIM_KEYS = [
  'organizationIds',
  'activeOrganizationId',
  'roleIds',
  'permissions',
  'isOrgAdmin',
  'teamIds',
  'linkedAthleteId',
  'claimsVersion',
] as const;

export type CustomClaimKey = (typeof CUSTOM_CLAIM_KEYS)[number];

/** Partial claims as returned from decoded ID token (may be absent until provisioned). */
export type DecodedCustomClaims = Partial<SportMindCustomClaims>;

export function normalizeCustomClaims(raw: DecodedCustomClaims | null | undefined): DecodedCustomClaims {
  return {
    organizationIds: raw?.organizationIds ?? [],
    activeOrganizationId: raw?.activeOrganizationId,
    roleIds: raw?.roleIds ?? [],
    permissions: raw?.permissions ?? [],
    isOrgAdmin: raw?.isOrgAdmin ?? false,
    teamIds: raw?.teamIds ?? [],
    linkedAthleteId: raw?.linkedAthleteId,
    claimsVersion: raw?.claimsVersion ?? CUSTOM_CLAIMS_VERSION,
  };
}

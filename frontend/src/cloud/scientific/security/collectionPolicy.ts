/**
 * Future Firestore Security Rules metadata — design-time only.
 * No rules deployed in Phase 6C.1.
 */

import { CATALOG_COLLECTIONS, CATALOG_ROOT } from '../paths/catalogPaths';
import { ORGANIZATIONS_ROOT } from '../paths/organizationPaths';

export type CollectionScope = 'global' | 'tenant';

export type AccessLevel = 'public_read' | 'authenticated_read' | 'org_member' | 'org_role' | 'admin_only';

export interface CollectionSecurityPolicy {
  pathPattern: string;
  scope: CollectionScope;
  read: AccessLevel;
  write: AccessLevel;
  tenantField?: string;
  notes: string;
}

/** Prepared policies for security rules authoring in a future phase. */
export const SCIENTIFIC_COLLECTION_POLICIES: CollectionSecurityPolicy[] = [
  {
    pathPattern: `${CATALOG_ROOT}/**`,
    scope: 'global',
    read: 'authenticated_read',
    write: 'admin_only',
    notes: 'Global catalogs are read-only for clients; writes via admin tooling only.',
  },
  {
    pathPattern: `${CATALOG_COLLECTIONS.assessmentDefinitions}/{id}/protocol_versions/{versionId}`,
    scope: 'global',
    read: 'authenticated_read',
    write: 'admin_only',
    notes: 'Protocol versions are versioned catalog entries.',
  },
  {
    pathPattern: `${CATALOG_COLLECTIONS.formulas}/{id}/versions/{versionId}`,
    scope: 'global',
    read: 'authenticated_read',
    write: 'admin_only',
    notes: 'Formula versions are immutable once active.',
  },
  {
    pathPattern: `${CATALOG_COLLECTIONS.normativeReferences}/{id}/versions/{versionId}`,
    scope: 'global',
    read: 'authenticated_read',
    write: 'admin_only',
    notes: 'Normative reference versions require admin publish workflow.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    notes: 'Organization root — tenant isolation anchor.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/assessment_sessions/{sessionId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    notes: 'Append-only assessment sessions — immutable scientific records (Phase 6C.8).',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/assessment_sessions/{sessionId}/**`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    notes: 'Session subcollections: raw_measurements, calculated_metrics, normative_snapshot, interpretations.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/**`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    notes: 'All org subcollections inherit tenant boundary; no cross-org reads.',
  },
];

export function isTenantScopedPath(path: string): boolean {
  return path.startsWith(`${ORGANIZATIONS_ROOT}/`);
}

export function isGlobalCatalogPath(path: string): boolean {
  return path.startsWith(`${CATALOG_ROOT}/`);
}

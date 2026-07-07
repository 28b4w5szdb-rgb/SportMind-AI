/**
 * Future Firestore Security Rules metadata — Phase 6C.10 design.
 * Rules authored in `/firestore.rules`; not deployed in this phase.
 */

import { CATALOG_COLLECTIONS, CATALOG_ROOT } from '../paths/catalogPaths';
import {
  AUDIT_LOGS_SUBCOLLECTION,
  MEDICAL_RECORDS_SUBCOLLECTION,
  ORGANIZATIONS_ROOT,
  REPORTS_SUBCOLLECTION,
  RESEARCH_DATASETS_SUBCOLLECTION,
} from '../paths/organizationPaths';
import {
  ASSESSMENT_SESSIONS_SUBCOLLECTION,
  CALCULATED_METRICS_SUBCOLLECTION,
  INTERPRETATIONS_SUBCOLLECTION,
  NORMATIVE_SNAPSHOT_SUBCOLLECTION,
  RAW_MEASUREMENTS_SUBCOLLECTION,
} from '../paths/sessionPaths';
import { PERMISSIONS } from './permissions';

export type CollectionScope = 'global' | 'tenant';

export type AccessLevel =
  | 'public_read'
  | 'authenticated_read'
  | 'org_member'
  | 'org_role'
  | 'admin_only'
  | 'clinical_only'
  | 'research_deidentified';

export interface CollectionSecurityPolicy {
  pathPattern: string;
  scope: CollectionScope;
  read: AccessLevel;
  write: AccessLevel;
  tenantField?: string;
  requiredPermissions?: string[];
  notes: string;
}

/** Prepared policies for security rules authoring — mirrors firestore.rules. */
export const SCIENTIFIC_COLLECTION_POLICIES: CollectionSecurityPolicy[] = [
  {
    pathPattern: 'users/{uid}',
    scope: 'global',
    read: 'org_member',
    write: 'org_member',
    notes: 'Self-scoped Firebase Auth user profile.',
  },
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
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.MANAGE_ORG],
    notes: 'Organization root — tenant isolation anchor.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/users/{userId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.MANAGE_USERS],
    notes: 'Org membership and role assignment documents.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/teams/{teamId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_ATHLETES, PERMISSIONS.WRITE_ATHLETES],
    notes: 'Team registry within tenant boundary.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/athletes/{athleteId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_ATHLETES, PERMISSIONS.WRITE_ATHLETES],
    notes: 'Athlete profiles — coaches limited to availability_status for medical summary.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${ASSESSMENT_SESSIONS_SUBCOLLECTION}/{sessionId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_ASSESSMENTS, PERMISSIONS.WRITE_ASSESSMENTS],
    notes: 'Append-only assessment sessions — immutable scientific records.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${ASSESSMENT_SESSIONS_SUBCOLLECTION}/{sessionId}/${RAW_MEASUREMENTS_SUBCOLLECTION}/{id}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_ASSESSMENTS, PERMISSIONS.WRITE_ASSESSMENTS],
    notes: 'Raw measurement subcollection — create-only.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${ASSESSMENT_SESSIONS_SUBCOLLECTION}/{sessionId}/${CALCULATED_METRICS_SUBCOLLECTION}/{id}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_ASSESSMENTS, PERMISSIONS.WRITE_ASSESSMENTS],
    notes: 'Calculated metrics subcollection — create-only.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${ASSESSMENT_SESSIONS_SUBCOLLECTION}/{sessionId}/${NORMATIVE_SNAPSHOT_SUBCOLLECTION}/{id}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_ASSESSMENTS, PERMISSIONS.WRITE_ASSESSMENTS],
    notes: 'Normative snapshot (canonical; alias normative_snapshots).',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${ASSESSMENT_SESSIONS_SUBCOLLECTION}/{sessionId}/${INTERPRETATIONS_SUBCOLLECTION}/{id}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_ASSESSMENTS, PERMISSIONS.WRITE_ASSESSMENTS],
    notes: 'Scientific interpretations / SSID (canonical; alias scientific_interpretations).',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${MEDICAL_RECORDS_SUBCOLLECTION}/{recordId}`,
    scope: 'tenant',
    read: 'clinical_only',
    write: 'clinical_only',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_MEDICAL, PERMISSIONS.WRITE_MEDICAL],
    notes: 'Full medical records — team_doctor, physiotherapist, org_admin only.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${RESEARCH_DATASETS_SUBCOLLECTION}/{datasetId}`,
    scope: 'tenant',
    read: 'research_deidentified',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_RESEARCH, PERMISSIONS.EXPORT_RESEARCH],
    notes: 'De-identified research datasets — pseudonym_id required.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${REPORTS_SUBCOLLECTION}/{reportId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.READ_REPORTS, PERMISSIONS.WRITE_REPORTS],
    notes: 'Org-scoped scientific/performance reports.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/${AUDIT_LOGS_SUBCOLLECTION}/{eventId}`,
    scope: 'tenant',
    read: 'org_role',
    write: 'org_member',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.MANAGE_ORG],
    notes: 'Append-only audit trail — read restricted to org admins.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/equipment/{equipmentId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.MANAGE_EQUIPMENT],
    notes: 'Organization equipment registry.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/locations/{locationId}`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    requiredPermissions: [PERMISSIONS.MANAGE_ORG],
    notes: 'Organization locations and facilities.',
  },
  {
    pathPattern: `${ORGANIZATIONS_ROOT}/{orgId}/**`,
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'orgId',
    notes: 'All remaining org subcollections inherit tenant boundary; no cross-org reads.',
  },
  {
    pathPattern: 'reports/{reportId}',
    scope: 'tenant',
    read: 'org_member',
    write: 'org_role',
    tenantField: 'organization_id',
    requiredPermissions: [PERMISSIONS.READ_REPORTS, PERMISSIONS.WRITE_REPORTS],
    notes: 'Legacy top-level reports — organization_id field isolation.',
  },
  {
    pathPattern: 'injuries/{injuryId}',
    scope: 'tenant',
    read: 'clinical_only',
    write: 'clinical_only',
    tenantField: 'organization_id',
    requiredPermissions: [PERMISSIONS.READ_MEDICAL, PERMISSIONS.WRITE_MEDICAL],
    notes: 'Legacy injury records — migrate to medical_records in future phase.',
  },
];

export function isTenantScopedPath(path: string): boolean {
  return path.startsWith(`${ORGANIZATIONS_ROOT}/`) || path.startsWith('reports/') || path.startsWith('injuries/');
}

export function isGlobalCatalogPath(path: string): boolean {
  return path.startsWith(`${CATALOG_ROOT}/`) || path.startsWith('catalog_');
}

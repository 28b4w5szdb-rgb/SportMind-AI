export {
  SCIENTIFIC_COLLECTION_POLICIES,
  isTenantScopedPath,
  isGlobalCatalogPath,
} from './collectionPolicy';
export type {
  CollectionSecurityPolicy,
  CollectionScope,
  AccessLevel,
} from './collectionPolicy';

export { PERMISSIONS, ALL_PERMISSIONS, CLINICAL_PERMISSIONS, RESEARCH_PERMISSIONS } from './permissions';
export type { PermissionKey } from './permissions';

export {
  SYSTEM_ROLE_KEYS,
  SYSTEM_ROLES,
  permissionsForRoles,
  isClinicalRole,
} from './roles';
export type { SystemRoleKey, SystemRoleDefinition } from './roles';

export {
  CUSTOM_CLAIMS_VERSION,
  CUSTOM_CLAIM_KEYS,
  normalizeCustomClaims,
} from './customClaims';
export type {
  SportMindCustomClaims,
  DecodedCustomClaims,
  CustomClaimKey,
} from './customClaims';

export {
  buildSecurityContext,
  isOrgMember,
  isActiveOrgMember,
  resolveEffectivePermissions,
  hasPermission,
  hasAnyPermission,
  hasRole,
  canReadAthletes,
  canWriteAthletes,
  canReadAssessments,
  canWriteAssessments,
  canManageOrg,
  canManageUsers,
} from './accessControl';
export type { SecurityContext } from './accessControl';

export {
  COACH_VISIBLE_MEDICAL_FIELDS,
  RESTRICTED_MEDICAL_FIELDS,
  canReadFullMedicalRecord,
  canWriteMedicalRecord,
  canReadLimitedMedicalStatus,
  filterCoachMedicalView,
  stripRestrictedMedicalFields,
  isCoachSafeAthleteField,
  canAccessAthleteForClinicalReview,
} from './clinicalAccess';
export type { AthleteAvailabilityStatus } from './clinicalAccess';

export {
  PII_FIELD_KEYS,
  canReadResearchData,
  canExportResearch,
  isDeIdentifiedRecord,
  assertResearchSafeRecord,
  toResearchView,
  canAccessResearchDataset,
} from './researchAccess';
export type { DeIdentifiedResearchRecord, PseudonymId } from './researchAccess';

export {
  AUDIT_EVENT_TYPES,
  AUDIT_EVENT_SEVERITY,
  AUDIT_RETENTION_DAYS,
  buildAuditEvent,
  requiresAuditOnRead,
} from './auditPolicy';
export type { AuditEventType, AuditEventPayload, AuditSeverity } from './auditPolicy';

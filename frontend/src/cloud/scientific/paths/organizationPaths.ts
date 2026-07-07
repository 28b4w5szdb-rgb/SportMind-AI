/**
 * Organization-scoped collection paths — tenant isolation root.
 */

export const ORGANIZATIONS_ROOT = 'organizations' as const;

export function organizationPath(orgId: string): string {
  return `${ORGANIZATIONS_ROOT}/${orgId}`;
}

export function orgUsersPath(orgId: string): string {
  return `${organizationPath(orgId)}/users`;
}

export function orgUserPath(orgId: string, userId: string): string {
  return `${orgUsersPath(orgId)}/${userId}`;
}

export function orgTeamsPath(orgId: string): string {
  return `${organizationPath(orgId)}/teams`;
}

export function orgTeamPath(orgId: string, teamId: string): string {
  return `${orgTeamsPath(orgId)}/${teamId}`;
}

export function orgAthletesPath(orgId: string): string {
  return `${organizationPath(orgId)}/athletes`;
}

export function orgAthletePath(orgId: string, athleteId: string): string {
  return `${orgAthletesPath(orgId)}/${athleteId}`;
}

export function orgSeasonsPath(orgId: string): string {
  return `${organizationPath(orgId)}/seasons`;
}

export function orgSeasonPath(orgId: string, seasonId: string): string {
  return `${orgSeasonsPath(orgId)}/${seasonId}`;
}

export function orgLocationsPath(orgId: string): string {
  return `${organizationPath(orgId)}/locations`;
}

export function orgLocationPath(orgId: string, locationId: string): string {
  return `${orgLocationsPath(orgId)}/${locationId}`;
}

export function orgEquipmentPath(orgId: string): string {
  return `${organizationPath(orgId)}/equipment`;
}

export function orgEquipmentInstancePath(orgId: string, equipmentId: string): string {
  return `${orgEquipmentPath(orgId)}/${equipmentId}`;
}

export function orgSportConfigsPath(orgId: string): string {
  return `${organizationPath(orgId)}/sport_configs`;
}

export function orgSportConfigPath(orgId: string, sportConfigId: string): string {
  return `${orgSportConfigsPath(orgId)}/${sportConfigId}`;
}

export function orgRoleDefinitionsPath(orgId: string): string {
  return `${organizationPath(orgId)}/role_definitions`;
}

export function orgRoleDefinitionPath(orgId: string, roleId: string): string {
  return `${orgRoleDefinitionsPath(orgId)}/${roleId}`;
}

export const MEDICAL_RECORDS_SUBCOLLECTION = 'medical_records' as const;
export const REPORTS_SUBCOLLECTION = 'reports' as const;
export const AUDIT_LOGS_SUBCOLLECTION = 'audit_logs' as const;
export const RESEARCH_DATASETS_SUBCOLLECTION = 'research_datasets' as const;

export const ORG_SUBCOLLECTIONS = [
  'users',
  'teams',
  'athletes',
  'seasons',
  'locations',
  'equipment',
  'sport_configs',
  'role_definitions',
  MEDICAL_RECORDS_SUBCOLLECTION,
  REPORTS_SUBCOLLECTION,
  AUDIT_LOGS_SUBCOLLECTION,
  RESEARCH_DATASETS_SUBCOLLECTION,
] as const;

export type OrgSubcollection = (typeof ORG_SUBCOLLECTIONS)[number];

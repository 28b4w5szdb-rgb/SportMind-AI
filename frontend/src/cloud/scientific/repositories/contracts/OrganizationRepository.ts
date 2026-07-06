/**
 * Organization-scoped repository contracts.
 * Implementations deferred; mock adapters remain default.
 */

import type {
  OrgAthlete,
  OrgAthleteInput,
  OrgEquipment,
  OrgEquipmentInput,
  OrgEquipmentMaintenanceLog,
  OrgLocation,
  OrgLocationInput,
  OrgMember,
  OrgMemberInput,
  OrgRoleDefinition,
  OrgRoleDefinitionInput,
  OrgSeason,
  OrgSeasonInput,
  OrgSportConfig,
  OrgSportConfigInput,
  OrgTeam,
  OrgTeamInput,
  OrgTeamMembership,
  ScientificOrganization,
  ScientificOrganizationInput,
} from '../../models/organization';

export interface OrganizationRootRepository {
  getById(orgId: string): Promise<ScientificOrganization | null>;
  create(input: ScientificOrganizationInput): Promise<ScientificOrganization>;
  update(orgId: string, patch: Partial<ScientificOrganizationInput>): Promise<ScientificOrganization>;
}

export interface OrgMemberRepository {
  listByOrganization(orgId: string): Promise<OrgMember[]>;
  getById(orgId: string, userId: string): Promise<OrgMember | null>;
  create(orgId: string, input: OrgMemberInput): Promise<OrgMember>;
  update(orgId: string, userId: string, patch: Partial<OrgMemberInput>): Promise<OrgMember>;
}

export interface OrgTeamRepository {
  listByOrganization(orgId: string): Promise<OrgTeam[]>;
  getById(orgId: string, teamId: string): Promise<OrgTeam | null>;
  create(orgId: string, input: OrgTeamInput): Promise<OrgTeam>;
  update(orgId: string, teamId: string, patch: Partial<OrgTeamInput>): Promise<OrgTeam>;
  listMemberships(orgId: string, teamId: string): Promise<OrgTeamMembership[]>;
}

export interface OrgAthleteRepository {
  listByOrganization(orgId: string): Promise<OrgAthlete[]>;
  listByTeam(orgId: string, teamId: string): Promise<OrgAthlete[]>;
  getById(orgId: string, athleteId: string): Promise<OrgAthlete | null>;
  create(orgId: string, input: OrgAthleteInput): Promise<OrgAthlete>;
  update(orgId: string, athleteId: string, patch: Partial<OrgAthleteInput>): Promise<OrgAthlete>;
}

export interface OrgSeasonRepository {
  listByOrganization(orgId: string): Promise<OrgSeason[]>;
  listByTeam(orgId: string, teamId: string): Promise<OrgSeason[]>;
  getById(orgId: string, seasonId: string): Promise<OrgSeason | null>;
  create(orgId: string, input: OrgSeasonInput): Promise<OrgSeason>;
  update(orgId: string, seasonId: string, patch: Partial<OrgSeasonInput>): Promise<OrgSeason>;
}

export interface OrgLocationRepository {
  listByOrganization(orgId: string): Promise<OrgLocation[]>;
  getById(orgId: string, locationId: string): Promise<OrgLocation | null>;
  create(orgId: string, input: OrgLocationInput): Promise<OrgLocation>;
  update(orgId: string, locationId: string, patch: Partial<OrgLocationInput>): Promise<OrgLocation>;
}

export interface OrgEquipmentRepository {
  listByOrganization(orgId: string): Promise<OrgEquipment[]>;
  getById(orgId: string, equipmentId: string): Promise<OrgEquipment | null>;
  create(orgId: string, input: OrgEquipmentInput): Promise<OrgEquipment>;
  update(orgId: string, equipmentId: string, patch: Partial<OrgEquipmentInput>): Promise<OrgEquipment>;
  listMaintenanceLogs(orgId: string, equipmentId: string): Promise<OrgEquipmentMaintenanceLog[]>;
}

export interface OrgSportConfigRepository {
  listByOrganization(orgId: string): Promise<OrgSportConfig[]>;
  getBySportKey(orgId: string, sportKey: string): Promise<OrgSportConfig | null>;
  upsert(orgId: string, input: OrgSportConfigInput): Promise<OrgSportConfig>;
}

export interface OrgRoleDefinitionRepository {
  listByOrganization(orgId: string): Promise<OrgRoleDefinition[]>;
  getById(orgId: string, roleId: string): Promise<OrgRoleDefinition | null>;
  getByKey(orgId: string, key: string): Promise<OrgRoleDefinition | null>;
  create(orgId: string, input: OrgRoleDefinitionInput): Promise<OrgRoleDefinition>;
  update(orgId: string, roleId: string, patch: Partial<OrgRoleDefinitionInput>): Promise<OrgRoleDefinition>;
}

/** Aggregated organization scientific repositories — DI root. */
export interface ScientificOrganizationRepository {
  organization: OrganizationRootRepository;
  members: OrgMemberRepository;
  teams: OrgTeamRepository;
  athletes: OrgAthleteRepository;
  seasons: OrgSeasonRepository;
  locations: OrgLocationRepository;
  equipment: OrgEquipmentRepository;
  sportConfigs: OrgSportConfigRepository;
  roleDefinitions: OrgRoleDefinitionRepository;
}

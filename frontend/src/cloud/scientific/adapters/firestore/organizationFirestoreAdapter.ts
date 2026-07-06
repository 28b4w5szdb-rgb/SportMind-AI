/**
 * Firestore organization repository — read-only with memory cache.
 */

import type {
  OrgAthlete,
  OrgEquipment,
  OrgEquipmentMaintenanceLog,
  OrgLocation,
  OrgMember,
  OrgRoleDefinition,
  OrgSeason,
  OrgSportConfig,
  OrgTeam,
  OrgTeamMembership,
  ScientificOrganization,
} from '../../models/organization';
import type {
  OrgAthleteRepository,
  OrgEquipmentRepository,
  OrgLocationRepository,
  OrgMemberRepository,
  OrgRoleDefinitionRepository,
  OrgSeasonRepository,
  OrgSportConfigRepository,
  OrgTeamRepository,
  OrganizationRootRepository,
  ScientificOrganizationRepository,
} from '../../repositories/contracts/OrganizationRepository';
import { getCatalogMemoryCache } from '../../cache/memoryCache';
import { ORGANIZATIONS_ROOT } from '../../paths/organizationPaths';
import { ScientificReadOnlyError } from '../errors';
import {
  readDocument,
  readNestedSubcollection,
  readSubDocument,
  readSubcollection,
  readSubcollectionFiltered,
} from './firestoreReadHelper';

const ORG_ROOT = ORGANIZATIONS_ROOT;

function cacheKey(scope: string, id: string): string {
  return `firestore:org:${scope}:${id}`;
}

async function cached<T>(scope: string, id: string, loader: () => Promise<T>): Promise<T> {
  const cache = getCatalogMemoryCache();
  const key = cacheKey(scope, id);
  const hit = cache.get<T>(key);
  if (hit !== undefined) return hit;
  const value = await loader();
  cache.set(key, value);
  return value;
}

function readOnly<T>(operation: string): Promise<T> {
  return Promise.reject(new ScientificReadOnlyError(operation));
}

function createOrganizationRootRepository(): OrganizationRootRepository {
  return {
    async getById(orgId) {
      return cached('organization', orgId, () => readDocument<ScientificOrganization>(ORG_ROOT, orgId));
    },
    async create() {
      return readOnly('organization.create');
    },
    async update() {
      return readOnly('organization.update');
    },
  };
}

function createMemberRepository(): OrgMemberRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`members:list`, orgId, () => readSubcollection<OrgMember>(ORG_ROOT, orgId, 'users'));
    },
    async getById(orgId, userId) {
      return cached(`members:id:${orgId}`, userId, () =>
        readSubDocument<OrgMember>(ORG_ROOT, orgId, 'users', userId)
      );
    },
    async create() {
      return readOnly<OrgMember>('members.create');
    },
    async update() {
      return readOnly<OrgMember>('members.update');
    },
  };
}

function createTeamRepository(): OrgTeamRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`teams:list`, orgId, () => readSubcollection<OrgTeam>(ORG_ROOT, orgId, 'teams'));
    },
    async getById(orgId, teamId) {
      return cached(`teams:id:${orgId}`, teamId, () =>
        readSubDocument<OrgTeam>(ORG_ROOT, orgId, 'teams', teamId)
      );
    },
    async create() {
      return readOnly<OrgTeam>('teams.create');
    },
    async update() {
      return readOnly<OrgTeam>('teams.update');
    },
    async listMemberships(orgId, teamId) {
      return cached(`teams:memberships:${orgId}`, teamId, () =>
        readNestedSubcollection<OrgTeamMembership>(ORG_ROOT, orgId, 'teams', teamId, 'memberships')
      );
    },
  };
}

function createAthleteRepository(): OrgAthleteRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`athletes:list`, orgId, () =>
        readSubcollection<OrgAthlete>(ORG_ROOT, orgId, 'athletes')
      );
    },
    async listByTeam(orgId, teamId) {
      return cached(`athletes:team:${orgId}`, teamId, () =>
        readSubcollectionFiltered<OrgAthlete>(ORG_ROOT, orgId, 'athletes', [
          { field: 'team_ids', op: 'array-contains', value: teamId },
        ])
      );
    },
    async getById(orgId, athleteId) {
      return cached(`athletes:id:${orgId}`, athleteId, () =>
        readSubDocument<OrgAthlete>(ORG_ROOT, orgId, 'athletes', athleteId)
      );
    },
    async create() {
      return readOnly<OrgAthlete>('athletes.create');
    },
    async update() {
      return readOnly<OrgAthlete>('athletes.update');
    },
  };
}

function createSeasonRepository(): OrgSeasonRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`seasons:list`, orgId, () => readSubcollection<OrgSeason>(ORG_ROOT, orgId, 'seasons'));
    },
    async listByTeam(orgId, teamId) {
      return cached(`seasons:team:${orgId}`, teamId, () =>
        readSubcollectionFiltered<OrgSeason>(ORG_ROOT, orgId, 'seasons', [
          { field: 'team_id', op: '==', value: teamId },
        ])
      );
    },
    async getById(orgId, seasonId) {
      return cached(`seasons:id:${orgId}`, seasonId, () =>
        readSubDocument<OrgSeason>(ORG_ROOT, orgId, 'seasons', seasonId)
      );
    },
    async create() {
      return readOnly<OrgSeason>('seasons.create');
    },
    async update() {
      return readOnly<OrgSeason>('seasons.update');
    },
  };
}

function createLocationRepository(): OrgLocationRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`locations:list`, orgId, () =>
        readSubcollection<OrgLocation>(ORG_ROOT, orgId, 'locations')
      );
    },
    async getById(orgId, locationId) {
      return cached(`locations:id:${orgId}`, locationId, () =>
        readSubDocument<OrgLocation>(ORG_ROOT, orgId, 'locations', locationId)
      );
    },
    async create() {
      return readOnly<OrgLocation>('locations.create');
    },
    async update() {
      return readOnly<OrgLocation>('locations.update');
    },
  };
}

function createEquipmentRepository(): OrgEquipmentRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`equipment:list`, orgId, () =>
        readSubcollection<OrgEquipment>(ORG_ROOT, orgId, 'equipment')
      );
    },
    async getById(orgId, equipmentId) {
      return cached(`equipment:id:${orgId}`, equipmentId, () =>
        readSubDocument<OrgEquipment>(ORG_ROOT, orgId, 'equipment', equipmentId)
      );
    },
    async create() {
      return readOnly<OrgEquipment>('equipment.create');
    },
    async update() {
      return readOnly<OrgEquipment>('equipment.update');
    },
    async listMaintenanceLogs(orgId, equipmentId) {
      return cached(`equipment:maintenance:${orgId}`, equipmentId, () =>
        readNestedSubcollection<OrgEquipmentMaintenanceLog>(
          ORG_ROOT,
          orgId,
          'equipment',
          equipmentId,
          'maintenance_logs'
        )
      );
    },
  };
}

function createSportConfigRepository(): OrgSportConfigRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`sportConfigs:list`, orgId, () =>
        readSubcollection<OrgSportConfig>(ORG_ROOT, orgId, 'sport_configs')
      );
    },
    async getBySportKey(orgId, sportKey) {
      return cached(`sportConfigs:key:${orgId}`, sportKey, async () => {
        const matches = await readSubcollectionFiltered<OrgSportConfig>(
          ORG_ROOT,
          orgId,
          'sport_configs',
          [{ field: 'sport_key', op: '==', value: sportKey }]
        );
        return matches[0] ?? null;
      });
    },
    async upsert() {
      return readOnly<OrgSportConfig>('sportConfigs.upsert');
    },
  };
}

function createRoleDefinitionRepository(): OrgRoleDefinitionRepository {
  return {
    async listByOrganization(orgId) {
      return cached(`roleDefinitions:list`, orgId, () =>
        readSubcollection<OrgRoleDefinition>(ORG_ROOT, orgId, 'role_definitions')
      );
    },
    async getById(orgId, roleId) {
      return cached(`roleDefinitions:id:${orgId}`, roleId, () =>
        readSubDocument<OrgRoleDefinition>(ORG_ROOT, orgId, 'role_definitions', roleId)
      );
    },
    async getByKey(orgId, key) {
      return cached(`roleDefinitions:key:${orgId}`, key, async () => {
        const matches = await readSubcollectionFiltered<OrgRoleDefinition>(
          ORG_ROOT,
          orgId,
          'role_definitions',
          [{ field: 'key', op: '==', value: key }]
        );
        return matches[0] ?? null;
      });
    },
    async create() {
      return readOnly<OrgRoleDefinition>('roleDefinitions.create');
    },
    async update() {
      return readOnly<OrgRoleDefinition>('roleDefinitions.update');
    },
  };
}

export function createOrganizationFirestoreRepository(): ScientificOrganizationRepository {
  return {
    organization: createOrganizationRootRepository(),
    members: createMemberRepository(),
    teams: createTeamRepository(),
    athletes: createAthleteRepository(),
    seasons: createSeasonRepository(),
    locations: createLocationRepository(),
    equipment: createEquipmentRepository(),
    sportConfigs: createSportConfigRepository(),
    roleDefinitions: createRoleDefinitionRepository(),
  };
}

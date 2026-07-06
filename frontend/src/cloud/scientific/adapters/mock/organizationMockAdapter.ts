/**
 * In-memory organization repository — default when cloud mode is off.
 * Read-only stubs; writes throw until a future phase.
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
import { ScientificReadOnlyError } from '../errors';

function readOnly<T>(operation: string): Promise<T> {
  return Promise.reject(new ScientificReadOnlyError(operation));
}

function createOrganizationRootRepository(): OrganizationRootRepository {
  return {
    async getById() {
      return null;
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
    async listByOrganization() {
      return [];
    },
    async getById() {
      return null;
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
    async listByOrganization() {
      return [];
    },
    async getById() {
      return null;
    },
    async create() {
      return readOnly<OrgTeam>('teams.create');
    },
    async update() {
      return readOnly<OrgTeam>('teams.update');
    },
    async listMemberships() {
      return [] as OrgTeamMembership[];
    },
  };
}

function createAthleteRepository(): OrgAthleteRepository {
  return {
    async listByOrganization() {
      return [];
    },
    async listByTeam() {
      return [];
    },
    async getById() {
      return null;
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
    async listByOrganization() {
      return [];
    },
    async listByTeam() {
      return [];
    },
    async getById() {
      return null;
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
    async listByOrganization() {
      return [];
    },
    async getById() {
      return null;
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
    async listByOrganization() {
      return [];
    },
    async getById() {
      return null;
    },
    async create() {
      return readOnly<OrgEquipment>('equipment.create');
    },
    async update() {
      return readOnly<OrgEquipment>('equipment.update');
    },
    async listMaintenanceLogs() {
      return [] as OrgEquipmentMaintenanceLog[];
    },
  };
}

function createSportConfigRepository(): OrgSportConfigRepository {
  return {
    async listByOrganization() {
      return [];
    },
    async getBySportKey() {
      return null;
    },
    async upsert() {
      return readOnly<OrgSportConfig>('sportConfigs.upsert');
    },
  };
}

function createRoleDefinitionRepository(): OrgRoleDefinitionRepository {
  return {
    async listByOrganization() {
      return [];
    },
    async getById() {
      return null;
    },
    async getByKey() {
      return null;
    },
    async create() {
      return readOnly<OrgRoleDefinition>('roleDefinitions.create');
    },
    async update() {
      return readOnly<OrgRoleDefinition>('roleDefinitions.update');
    },
  };
}

export function createOrganizationMockRepository(): ScientificOrganizationRepository {
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

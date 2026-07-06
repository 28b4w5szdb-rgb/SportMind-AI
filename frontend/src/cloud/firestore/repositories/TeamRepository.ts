import type { Team, TeamInput } from '@/src/cloud/firestore/models';

export interface TeamRepository {
  listByOrganization(organizationId: string): Promise<Team[]>;
  getById(teamId: string): Promise<Team | null>;
  create(input: TeamInput): Promise<Team>;
  update(teamId: string, patch: Partial<TeamInput>): Promise<Team>;
  remove(teamId: string): Promise<void>;
}

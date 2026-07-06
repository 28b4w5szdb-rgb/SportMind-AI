import type { Athlete, AthleteInput } from '@/src/cloud/firestore/models';

export interface AthleteRepository {
  listByOrganization(organizationId: string): Promise<Athlete[]>;
  listByTeam(teamId: string): Promise<Athlete[]>;
  getById(athleteId: string): Promise<Athlete | null>;
  create(input: AthleteInput): Promise<Athlete>;
  update(athleteId: string, patch: Partial<AthleteInput>): Promise<Athlete>;
  remove(athleteId: string): Promise<void>;
}

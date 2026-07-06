import type { Report, ReportInput } from '@/src/cloud/firestore/models';

export interface ReportRepository {
  listByOrganization(organizationId: string): Promise<Report[]>;
  listByAthlete(athleteId: string): Promise<Report[]>;
  getById(reportId: string): Promise<Report | null>;
  create(input: ReportInput): Promise<Report>;
  update(reportId: string, patch: Partial<ReportInput>): Promise<Report>;
  remove(reportId: string): Promise<void>;
}

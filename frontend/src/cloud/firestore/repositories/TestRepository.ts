import type { TestResult, TestResultInput } from '@/src/cloud/firestore/models';

export interface TestRepository {
  listByAthlete(athleteId: string): Promise<TestResult[]>;
  listByOrganization(organizationId: string): Promise<TestResult[]>;
  getById(testId: string): Promise<TestResult | null>;
  create(input: TestResultInput): Promise<TestResult>;
  update(testId: string, patch: Partial<TestResultInput>): Promise<TestResult>;
  remove(testId: string): Promise<void>;
}

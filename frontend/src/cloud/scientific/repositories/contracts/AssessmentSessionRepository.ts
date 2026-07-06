/**
 * Assessment session repository contract — read-only (Phase 6C.5).
 * Firestore adapter deferred; mock reads from in-memory append-only store.
 */

import type { AssessmentSession } from '../../models/session';

export interface AssessmentSessionRepository {
  getById(organizationId: string, sessionId: string): Promise<AssessmentSession | null>;
  listByOrganization(organizationId: string): Promise<AssessmentSession[]>;
  listByAthlete(organizationId: string, athleteId: string): Promise<AssessmentSession[]>;
  listByAssessmentDefinition(
    organizationId: string,
    assessmentDefinitionKey: string
  ): Promise<AssessmentSession[]>;
  listAssessmentSessions(): Promise<AssessmentSession[]>;
}

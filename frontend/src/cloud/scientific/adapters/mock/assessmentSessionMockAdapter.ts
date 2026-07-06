/**
 * Mock assessment session repository — reads from append-only memory store.
 */

import type { AssessmentSessionRepository } from '../../repositories/contracts/AssessmentSessionRepository';
import {
  getAssessmentSessionById,
  listAssessmentSessions,
  listAssessmentSessionsByAthlete,
  listAssessmentSessionsByDefinition,
  listAssessmentSessionsByOrganization,
} from '../../session/sessionMemoryStore';

export function createAssessmentSessionMockRepository(): AssessmentSessionRepository {
  return {
    async getById(organizationId, sessionId) {
      return getAssessmentSessionById(organizationId, sessionId);
    },
    async listByOrganization(organizationId) {
      return listAssessmentSessionsByOrganization(organizationId);
    },
    async listByAthlete(organizationId, athleteId) {
      return listAssessmentSessionsByAthlete(organizationId, athleteId);
    },
    async listByAssessmentDefinition(organizationId, assessmentDefinitionKey) {
      return listAssessmentSessionsByDefinition(organizationId, assessmentDefinitionKey);
    },
    async listAssessmentSessions() {
      return listAssessmentSessions();
    },
  };
}

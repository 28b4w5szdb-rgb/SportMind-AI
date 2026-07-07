/**
 * Mock assessment session persistence adapter.
 */

import type { RawMeasurement } from '../../models/session';
import type { SessionMetadataRecord, PersistedRawMeasurementRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { AssessmentSessionRepository } from '../../repositories/contracts/AssessmentSessionRepository';
import {
  getPersistedSession,
  listPersistedSessions,
  listPersistedSessionsByAthlete,
  listPersistedSessionsByDefinition,
  listPersistedSessionsByOrganization,
  persistMetadataRecord,
  persistRawMeasurementRecords,
  persistenceBundleExists,
} from '../../persistence/persistenceMemoryStore';

export function createAssessmentSessionMockRepository(): AssessmentSessionRepository {
  return {
    async getById(organizationId, sessionId) {
      return getPersistedSession(organizationId, sessionId);
    },
    async listByOrganization(organizationId) {
      return listPersistedSessionsByOrganization(organizationId);
    },
    async listByAthlete(organizationId, athleteId) {
      return listPersistedSessionsByAthlete(organizationId, athleteId);
    },
    async listByAssessmentDefinition(organizationId, assessmentDefinitionKey) {
      return listPersistedSessionsByDefinition(organizationId, assessmentDefinitionKey);
    },
    async listAssessmentSessions() {
      return listPersistedSessions();
    },
    async exists(organizationId, sessionId) {
      return persistenceBundleExists(organizationId, sessionId);
    },
    async appendMetadata(metadata) {
      return persistMetadataRecord(metadata);
    },
    async appendRawMeasurements(organizationId, sessionId, measurements) {
      const records: PersistedRawMeasurementRecord[] = measurements.map((m) => ({
        ...m,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
      }));
      return persistRawMeasurementRecords(organizationId, sessionId, records);
    },
  };
}

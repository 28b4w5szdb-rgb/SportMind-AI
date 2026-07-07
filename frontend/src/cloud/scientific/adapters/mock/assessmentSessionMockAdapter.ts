/**
 * Mock assessment session persistence adapter.
 */

import type { RawMeasurement } from '../../models/session';
import type { SessionMetadataRecord, PersistedRawMeasurementRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { ScientificListPagination } from '../../models/common/ListPagination';
import { DEFAULT_SESSION_LIST_LIMIT } from '../../models/common/ListPagination';
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

function slicePage<T>(items: T[], pagination?: ScientificListPagination): T[] {
  const cap = pagination?.limit ?? DEFAULT_SESSION_LIST_LIMIT;
  return cap > 0 ? items.slice(0, cap) : items;
}

export function createAssessmentSessionMockRepository(): AssessmentSessionRepository {
  return {
    async getById(organizationId, sessionId) {
      return getPersistedSession(organizationId, sessionId);
    },
    async listByOrganization(organizationId, pagination) {
      return slicePage(await listPersistedSessionsByOrganization(organizationId), pagination);
    },
    async listByAthlete(organizationId, athleteId, pagination) {
      return slicePage(await listPersistedSessionsByAthlete(organizationId, athleteId), pagination);
    },
    async listByAssessmentDefinition(organizationId, assessmentDefinitionKey, pagination) {
      return slicePage(
        await listPersistedSessionsByDefinition(organizationId, assessmentDefinitionKey),
        pagination
      );
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

/**
 * Mock SSID interpretation persistence adapter.
 */

import type { SessionInterpretationState } from '../../models/session';
import type { PersistedInterpretationRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { ScientificInterpretationRepository } from '../../repositories/contracts/ScientificInterpretationRepository';
import {
  getInterpretationForSession,
  persistInterpretationRecord,
} from '../../persistence/persistenceMemoryStore';

export function createScientificInterpretationMockRepository(): ScientificInterpretationRepository {
  return {
    async appendInterpretation(organizationId, sessionId, interpretation) {
      const record: PersistedInterpretationRecord = {
        ...interpretation,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
      };
      return persistInterpretationRecord(record);
    },
    async getBySession(organizationId, sessionId) {
      return getInterpretationForSession(organizationId, sessionId);
    },
    async existsForSession(organizationId, sessionId) {
      return getInterpretationForSession(organizationId, sessionId) !== null;
    },
  };
}

/**
 * Mock normative snapshot persistence adapter.
 */

import type { NormativeComparisonSnapshot } from '../../models/session';
import type { PersistedNormativeSnapshotRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { NormativeSnapshotRepository } from '../../repositories/contracts/NormativeSnapshotRepository';
import {
  getNormativeSnapshotForSession,
  persistNormativeSnapshotRecord,
  persistenceBundleExists,
} from '../../persistence/persistenceMemoryStore';

export function createNormativeSnapshotMockRepository(): NormativeSnapshotRepository {
  return {
    async appendSnapshot(organizationId, sessionId, snapshot) {
      const record: PersistedNormativeSnapshotRecord = {
        ...snapshot,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
        reference_version: snapshot.profile_key ?? null,
      };
      return persistNormativeSnapshotRecord(record);
    },
    async getBySession(organizationId, sessionId) {
      return getNormativeSnapshotForSession(organizationId, sessionId);
    },
    async existsForSession(organizationId, sessionId) {
      return getNormativeSnapshotForSession(organizationId, sessionId) !== null;
    },
  };
}

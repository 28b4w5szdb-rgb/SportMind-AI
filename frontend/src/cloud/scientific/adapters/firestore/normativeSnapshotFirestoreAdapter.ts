/**
 * Firestore normative snapshot persistence adapter.
 */

import type { NormativeComparisonSnapshot } from '../../models/session';
import type { PersistedNormativeSnapshotRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { NormativeSnapshotRepository } from '../../repositories/contracts/NormativeSnapshotRepository';
import {
  NORMATIVE_SNAPSHOT_DOC_ID,
  NORMATIVE_SNAPSHOT_SUBCOLLECTION,
} from '../../paths/sessionPaths';
import {
  createOrgSessionSubDocumentIfNotExists,
  readOrgSessionSubDocument,
} from './firestoreReadHelper';

export function createNormativeSnapshotFirestoreRepository(): NormativeSnapshotRepository {
  return {
    async appendSnapshot(organizationId, sessionId, snapshot) {
      const record: PersistedNormativeSnapshotRecord = {
        ...snapshot,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
        reference_version: snapshot.profile_key ?? null,
      };
      await createOrgSessionSubDocumentIfNotExists(
        organizationId,
        sessionId,
        NORMATIVE_SNAPSHOT_SUBCOLLECTION,
        NORMATIVE_SNAPSHOT_DOC_ID,
        record
      );
      return record;
    },
    async getBySession(organizationId, sessionId) {
      return readOrgSessionSubDocument<PersistedNormativeSnapshotRecord>(
        organizationId,
        sessionId,
        NORMATIVE_SNAPSHOT_SUBCOLLECTION,
        NORMATIVE_SNAPSHOT_DOC_ID
      );
    },
    async existsForSession(organizationId, sessionId) {
      const snap = await readOrgSessionSubDocument<PersistedNormativeSnapshotRecord>(
        organizationId,
        sessionId,
        NORMATIVE_SNAPSHOT_SUBCOLLECTION,
        NORMATIVE_SNAPSHOT_DOC_ID
      );
      return snap !== null;
    },
  };
}

/**
 * Firestore SSID interpretation persistence adapter.
 */

import type { SessionInterpretationState } from '../../models/session';
import type { PersistedInterpretationRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { ScientificInterpretationRepository } from '../../repositories/contracts/ScientificInterpretationRepository';
import { INTERPRETATION_DOC_ID, INTERPRETATIONS_SUBCOLLECTION } from '../../paths/sessionPaths';
import {
  createOrgSessionSubDocumentIfNotExists,
  readOrgSessionSubDocument,
} from './firestoreReadHelper';

export function createScientificInterpretationFirestoreRepository(): ScientificInterpretationRepository {
  return {
    async appendInterpretation(organizationId, sessionId, interpretation) {
      const record: PersistedInterpretationRecord = {
        ...interpretation,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
      };
      await createOrgSessionSubDocumentIfNotExists(
        organizationId,
        sessionId,
        INTERPRETATIONS_SUBCOLLECTION,
        INTERPRETATION_DOC_ID,
        record
      );
      return record;
    },
    async getBySession(organizationId, sessionId) {
      return readOrgSessionSubDocument<PersistedInterpretationRecord>(
        organizationId,
        sessionId,
        INTERPRETATIONS_SUBCOLLECTION,
        INTERPRETATION_DOC_ID
      );
    },
    async existsForSession(organizationId, sessionId) {
      const record = await readOrgSessionSubDocument<PersistedInterpretationRecord>(
        organizationId,
        sessionId,
        INTERPRETATIONS_SUBCOLLECTION,
        INTERPRETATION_DOC_ID
      );
      return record !== null;
    },
  };
}

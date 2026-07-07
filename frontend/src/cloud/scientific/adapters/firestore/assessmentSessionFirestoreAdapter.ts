/**
 * Firestore assessment session persistence adapter — append-only writes.
 */

import type { PersistedRawMeasurementRecord, SessionMetadataRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { AssessmentSession } from '../../models/session';
import type { AssessmentSessionRepository } from '../../repositories/contracts/AssessmentSessionRepository';
import { ORGANIZATIONS_ROOT } from '../../paths/organizationPaths';
import { ASSESSMENT_SESSIONS_SUBCOLLECTION, RAW_MEASUREMENTS_SUBCOLLECTION } from '../../paths/sessionPaths';
import {
  createOrgSessionSubcollectionDocumentsIfNotExists,
  readSubcollection,
  readSubDocument,
} from './firestoreReadHelper';
import { createDocumentIfNotExists, documentExists } from './firestoreWriteHelper';
import { assembleAssessmentSessionFromFirestore } from './persistenceFirestoreAssembler';

function orgSessionPath(orgId: string, sessionId: string): string[] {
  return [ORGANIZATIONS_ROOT, orgId, ASSESSMENT_SESSIONS_SUBCOLLECTION, sessionId];
}

export function createAssessmentSessionFirestoreRepository(): AssessmentSessionRepository {
  return {
    async getById(organizationId, sessionId) {
      return assembleAssessmentSessionFromFirestore(organizationId, sessionId);
    },
    async listByOrganization(organizationId) {
      const sessions = await readSubcollection<SessionMetadataRecord>(
        ORGANIZATIONS_ROOT,
        organizationId,
        ASSESSMENT_SESSIONS_SUBCOLLECTION
      );
      const assembled: AssessmentSession[] = [];
      for (const meta of sessions) {
        const session = await assembleAssessmentSessionFromFirestore(
          organizationId,
          meta.session_id
        );
        if (session) assembled.push(session);
      }
      return assembled;
    },
    async listByAthlete(organizationId, athleteId) {
      const all = await this.listByOrganization(organizationId);
      return all.filter((s) => s.athlete_id === athleteId);
    },
    async listByAssessmentDefinition(organizationId, assessmentDefinitionKey) {
      const all = await this.listByOrganization(organizationId);
      return all.filter((s) => s.assessment_definition_key === assessmentDefinitionKey);
    },
    async listAssessmentSessions() {
      return [];
    },
    async exists(organizationId, sessionId) {
      return documentExists(orgSessionPath(organizationId, sessionId));
    },
    async appendMetadata(metadata) {
      await createDocumentIfNotExists(orgSessionPath(metadata.organization_id, metadata.session_id), {
        ...metadata,
      });
      return metadata;
    },
    async appendRawMeasurements(organizationId, sessionId, measurements) {
      const records: PersistedRawMeasurementRecord[] = measurements.map((m) => ({
        ...m,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
      }));
      await createOrgSessionSubcollectionDocumentsIfNotExists(
        organizationId,
        sessionId,
        RAW_MEASUREMENTS_SUBCOLLECTION,
        records.map((r) => ({ id: r.measurement_id, data: r }))
      );
      return records;
    },
  };
}

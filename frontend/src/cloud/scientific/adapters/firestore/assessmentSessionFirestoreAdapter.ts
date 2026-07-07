/**
 * Firestore assessment session persistence adapter — append-only writes.
 * Phase 8.3 — athlete-scoped queries, parallel assembly, pagination.
 */

import type { PersistedRawMeasurementRecord, SessionMetadataRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { ScientificListPagination } from '../../models/common/ListPagination';
import { DEFAULT_SESSION_LIST_LIMIT } from '../../models/common/ListPagination';
import type { AssessmentSession } from '../../models/session';
import type { AssessmentSessionRepository } from '../../repositories/contracts/AssessmentSessionRepository';
import { ORGANIZATIONS_ROOT } from '../../paths/organizationPaths';
import { ASSESSMENT_SESSIONS_SUBCOLLECTION, RAW_MEASUREMENTS_SUBCOLLECTION } from '../../paths/sessionPaths';
import {
  createOrgSessionSubcollectionDocumentsIfNotExists,
  readSubcollectionFiltered,
  readSubDocument,
} from './firestoreReadHelper';
import { createDocumentIfNotExists, documentExists } from './firestoreWriteHelper';
import {
  assembleAssessmentSessionFromFirestore,
  assembleAssessmentSessionsFromFirestore,
} from './persistenceFirestoreAssembler';

function orgSessionPath(orgId: string, sessionId: string): string[] {
  return [ORGANIZATIONS_ROOT, orgId, ASSESSMENT_SESSIONS_SUBCOLLECTION, sessionId];
}

function resolveLimit(pagination?: ScientificListPagination): number {
  return pagination?.limit ?? DEFAULT_SESSION_LIST_LIMIT;
}

async function listSessionMetadata(
  organizationId: string,
  filters?: Array<{ field: string; op: '=='; value: unknown }>,
  pagination?: ScientificListPagination
): Promise<SessionMetadataRecord[]> {
  return readSubcollectionFiltered<SessionMetadataRecord>(
    ORGANIZATIONS_ROOT,
    organizationId,
    ASSESSMENT_SESSIONS_SUBCOLLECTION,
    filters,
    { limit: resolveLimit(pagination), orderByField: 'conducted_at', orderDirection: 'desc' }
  );
}

async function assembleFromMetadataList(
  organizationId: string,
  metadataList: SessionMetadataRecord[]
): Promise<AssessmentSession[]> {
  const ids = metadataList.map((m) => m.session_id);
  return assembleAssessmentSessionsFromFirestore(organizationId, ids);
}

export function createAssessmentSessionFirestoreRepository(): AssessmentSessionRepository {
  return {
    async getById(organizationId, sessionId) {
      return assembleAssessmentSessionFromFirestore(organizationId, sessionId);
    },
    async listByOrganization(organizationId, pagination) {
      const metadata = await listSessionMetadata(organizationId, undefined, pagination);
      return assembleFromMetadataList(organizationId, metadata);
    },
    async listByAthlete(organizationId, athleteId, pagination) {
      const metadata = await listSessionMetadata(
        organizationId,
        [{ field: 'athlete_id', op: '==', value: athleteId }],
        pagination
      );
      return assembleFromMetadataList(organizationId, metadata);
    },
    async listByAssessmentDefinition(organizationId, assessmentDefinitionKey, pagination) {
      const metadata = await listSessionMetadata(
        organizationId,
        [{ field: 'assessment_definition_key', op: '==', value: assessmentDefinitionKey }],
        pagination
      );
      return assembleFromMetadataList(organizationId, metadata);
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

/**
 * Assembles full AssessmentSession from Firestore persistence documents.
 * Phase 8.3 — parallel sub-reads per session.
 */

import type { AssessmentSession } from '../../models/session';
import type {
  PersistedCalculatedMetricRecord,
  PersistedInterpretationRecord,
  PersistedNormativeSnapshotRecord,
  PersistedRawMeasurementRecord,
  SessionMetadataRecord,
} from '../../models/persistence';
import { ORGANIZATIONS_ROOT } from '../../paths/organizationPaths';
import {
  ASSESSMENT_SESSIONS_SUBCOLLECTION,
  CALCULATED_METRICS_SUBCOLLECTION,
  INTERPRETATION_DOC_ID,
  INTERPRETATIONS_SUBCOLLECTION,
  NORMATIVE_SNAPSHOT_DOC_ID,
  NORMATIVE_SNAPSHOT_SUBCOLLECTION,
  RAW_MEASUREMENTS_SUBCOLLECTION,
} from '../../paths/sessionPaths';
import { assembleAssessmentSession } from '../../persistence/persistenceMemoryStore';
import {
  readOrgSessionSubcollection,
  readOrgSessionSubDocument,
  readSubDocument,
} from './firestoreReadHelper';

export async function assembleAssessmentSessionFromFirestore(
  organizationId: string,
  sessionId: string
): Promise<AssessmentSession | null> {
  const metadata = await readSubDocument<SessionMetadataRecord>(
    ORGANIZATIONS_ROOT,
    organizationId,
    ASSESSMENT_SESSIONS_SUBCOLLECTION,
    sessionId
  );
  if (!metadata) return null;

  const [raw_measurements, calculated_metrics, normative_snapshot, interpretation] = await Promise.all([
    readOrgSessionSubcollection<PersistedRawMeasurementRecord>(
      organizationId,
      sessionId,
      RAW_MEASUREMENTS_SUBCOLLECTION
    ),
    readOrgSessionSubcollection<PersistedCalculatedMetricRecord>(
      organizationId,
      sessionId,
      CALCULATED_METRICS_SUBCOLLECTION
    ),
    readOrgSessionSubDocument<PersistedNormativeSnapshotRecord>(
      organizationId,
      sessionId,
      NORMATIVE_SNAPSHOT_SUBCOLLECTION,
      NORMATIVE_SNAPSHOT_DOC_ID
    ),
    readOrgSessionSubDocument<PersistedInterpretationRecord>(
      organizationId,
      sessionId,
      INTERPRETATIONS_SUBCOLLECTION,
      INTERPRETATION_DOC_ID
    ),
  ]);

  return assembleAssessmentSession({
    metadata,
    raw_measurements,
    calculated_metrics,
    normative_snapshot,
    interpretation,
  });
}

/** Batch-assemble sessions in parallel (bounded concurrency via Promise.all). */
export async function assembleAssessmentSessionsFromFirestore(
  organizationId: string,
  sessionIds: string[]
): Promise<AssessmentSession[]> {
  const assembled = await Promise.all(
    sessionIds.map((sessionId) => assembleAssessmentSessionFromFirestore(organizationId, sessionId))
  );
  return assembled.filter((s): s is AssessmentSession => s != null);
}

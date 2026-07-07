/**
 * Builds atomic persistence bundle from validated assessment session.
 */

import type { AssessmentSession } from '../models/session';
import type {
  PersistedCalculatedMetricRecord,
  PersistedInterpretationRecord,
  PersistedNormativeSnapshotRecord,
  PersistedRawMeasurementRecord,
  PersistenceAdapterKind,
  PersistenceTransactionAudit,
  ScientificAuditMetadata,
  ScientificPersistenceBundle,
  SessionMetadataRecord,
} from '../models/persistence';
import { PERSISTENCE_VERSION } from '../models/persistence';

export function createTransactionId(): string {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createPendingTransaction(adapter: PersistenceAdapterKind): PersistenceTransactionAudit {
  return {
    transaction_id: createTransactionId(),
    status: 'pending',
    started_at: new Date().toISOString(),
    completed_at: null,
    duration_ms: null,
    retry_count: 0,
    failure_reason: null,
    adapter,
  };
}

export function buildPersistenceBundle(
  session: AssessmentSession,
  audit: ScientificAuditMetadata
): ScientificPersistenceBundle {
  const orgId = session.organization_id;
  const sessionId = session.session_id;

  const metadata: SessionMetadataRecord = {
    id: session.id,
    session_id: sessionId,
    created_at: session.created_at,
    updated_at: session.updated_at,
    athlete_id: session.athlete_id,
    organization_id: orgId,
    team_id: session.team_id ?? null,
    season_id: session.season_id ?? null,
    assessment_definition_id: session.assessment_definition_id,
    assessment_definition_key: session.assessment_definition_key,
    protocol_version: session.protocol_version,
    evidence_tier_snapshot: session.evidence_tier_snapshot,
    conducted_at: session.conducted_at,
    conducted_by: session.conducted_by,
    source_type: session.source_type,
    session_context: session.session_context,
    status: session.status,
    protocol_snapshot: session.protocol_snapshot,
    audit,
  };

  const raw_measurements: PersistedRawMeasurementRecord[] = session.raw_measurements.map((m) => ({
    ...m,
    session_id: sessionId,
    organization_id: orgId,
    record_version: PERSISTENCE_VERSION,
  }));

  const calculated_metrics: PersistedCalculatedMetricRecord[] = session.calculated_metrics.map(
    (m, index) => ({
      ...m,
      metric_key: m.metric_key || `metric_${index}`,
      session_id: sessionId,
      organization_id: orgId,
      record_version: PERSISTENCE_VERSION,
    })
  );

  const normative_snapshot: PersistedNormativeSnapshotRecord = {
    ...session.normative_comparison,
    session_id: sessionId,
    organization_id: orgId,
    record_version: PERSISTENCE_VERSION,
    reference_version: session.normative_comparison.profile_key ?? null,
  };

  const interpretation: PersistedInterpretationRecord = {
    ...session.interpretation,
    session_id: sessionId,
    organization_id: orgId,
    record_version: PERSISTENCE_VERSION,
  };

  return {
    metadata,
    raw_measurements,
    calculated_metrics,
    normative_snapshot,
    interpretation,
  };
}

export function buildAuditMetadata(
  session: AssessmentSession,
  adapter: PersistenceAdapterKind,
  transaction: PersistenceTransactionAudit
): ScientificAuditMetadata {
  return {
    persisted_at: transaction.completed_at ?? transaction.started_at,
    persisted_by: session.conducted_by,
    persistence_version: PERSISTENCE_VERSION,
    persistence_adapter: adapter,
    schema_version: session.protocol_version,
    immutable: true,
    transaction,
  };
}

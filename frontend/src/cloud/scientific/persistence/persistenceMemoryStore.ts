/**
 * Append-only in-memory scientific persistence store — mock adapter backing.
 * Phase 6C.8.1: atomic commit, rollback, and transaction audit log.
 */

import type { AssessmentSession } from '../models/session';
import type {
  PersistedCalculatedMetricRecord,
  PersistedInterpretationRecord,
  PersistedNormativeSnapshotRecord,
  PersistedRawMeasurementRecord,
  PersistenceTransactionAudit,
  ScientificPersistenceBundle,
  SessionMetadataRecord,
} from '../models/persistence';
import { ScientificPersistenceError } from '../adapters/errors';

interface MemoryBundle {
  metadata: SessionMetadataRecord;
  raw_measurements: PersistedRawMeasurementRecord[];
  calculated_metrics: PersistedCalculatedMetricRecord[];
  normative_snapshot: PersistedNormativeSnapshotRecord | null;
  interpretation: PersistedInterpretationRecord | null;
}

const bundles = new Map<string, MemoryBundle>();
const transactionLog = new Map<string, PersistenceTransactionAudit>();
const staging = new Map<string, MemoryBundle>();

let mockCommitFailureReason: string | null = null;
let mockSimulatePartialWrite = false;

function bundleKey(organizationId: string, sessionId: string): string {
  return `${organizationId}::${sessionId}`;
}

function bundleFromScientific(bundle: ScientificPersistenceBundle): MemoryBundle {
  return {
    metadata: bundle.metadata,
    raw_measurements: bundle.raw_measurements,
    calculated_metrics: bundle.calculated_metrics,
    normative_snapshot: bundle.normative_snapshot,
    interpretation: bundle.interpretation,
  };
}

export function setMockAtomicPersistenceFailure(reason: string | null): void {
  mockCommitFailureReason = reason;
}

export function setMockAtomicPartialWriteSimulation(enabled: boolean): void {
  mockSimulatePartialWrite = enabled;
}

export function getPersistenceTransactionLog(
  transactionId: string
): PersistenceTransactionAudit | null {
  return transactionLog.get(transactionId) ?? null;
}

export function listPersistenceTransactions(): PersistenceTransactionAudit[] {
  return [...transactionLog.values()];
}

export function assembleAssessmentSession(bundle: MemoryBundle): AssessmentSession {
  const { metadata, raw_measurements, calculated_metrics, normative_snapshot, interpretation } =
    bundle;

  return {
    id: metadata.id,
    session_id: metadata.session_id,
    created_at: metadata.created_at,
    updated_at: metadata.updated_at,
    athlete_id: metadata.athlete_id,
    organization_id: metadata.organization_id,
    team_id: metadata.team_id ?? null,
    season_id: metadata.season_id ?? null,
    assessment_definition_id: metadata.assessment_definition_id,
    assessment_definition_key: metadata.assessment_definition_key,
    protocol_version: metadata.protocol_version,
    evidence_tier_snapshot: metadata.evidence_tier_snapshot,
    conducted_at: metadata.conducted_at,
    conducted_by: metadata.conducted_by,
    source_type: metadata.source_type as AssessmentSession['source_type'],
    session_context: metadata.session_context as AssessmentSession['session_context'],
    status: metadata.status as AssessmentSession['status'],
    raw_measurements: raw_measurements.map(
      ({ session_id, organization_id, record_version, ...rest }) => rest
    ),
    calculated_metrics: calculated_metrics.map(
      ({ session_id, organization_id, record_version, ...rest }) => rest
    ),
    normative_comparison: normative_snapshot ?? {
      profile_key: null,
      performance_band: null,
      percentile: null,
      z_score: null,
      confidence: null,
      source_quality: null,
      classification: null,
      reason: null,
      recommendation: null,
    },
    interpretation: interpretation ?? {
      status: 'pending',
      generated: false,
      reviewed: false,
    },
    protocol_snapshot: metadata.protocol_snapshot,
  };
}

export function persistenceBundleExists(organizationId: string, sessionId: string): boolean {
  return bundles.has(bundleKey(organizationId, sessionId));
}

export function commitAtomicBundle(
  bundle: ScientificPersistenceBundle,
  transaction: PersistenceTransactionAudit
): PersistenceTransactionAudit {
  const key = bundleKey(bundle.metadata.organization_id, bundle.metadata.session_id);
  const memoryBundle = bundleFromScientific(bundle);

  if (bundles.has(key)) {
    const failed: PersistenceTransactionAudit = {
      ...transaction,
      status: 'failed',
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - Date.parse(transaction.started_at),
      failure_reason: 'persistence_duplicate:session',
    };
    transactionLog.set(transaction.transaction_id, failed);
    throw new ScientificPersistenceError('persistence_duplicate:session');
  }

  if (mockCommitFailureReason) {
    const failed: PersistenceTransactionAudit = {
      ...transaction,
      status: 'failed',
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - Date.parse(transaction.started_at),
      failure_reason: mockCommitFailureReason,
    };
    transactionLog.set(transaction.transaction_id, failed);
    throw new ScientificPersistenceError('mock_commit_failed', mockCommitFailureReason);
  }

  if (mockSimulatePartialWrite) {
    staging.set(key, memoryBundle);
    const rolledBack: PersistenceTransactionAudit = {
      ...transaction,
      status: 'rolled_back',
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - Date.parse(transaction.started_at),
      failure_reason: 'mock_partial_write_rolled_back',
    };
    staging.delete(key);
    transactionLog.set(transaction.transaction_id, rolledBack);
    throw new ScientificPersistenceError('mock_partial_write', 'rolled_back');
  }

  const completed: PersistenceTransactionAudit = {
    ...transaction,
    status: 'completed',
    completed_at: new Date().toISOString(),
    duration_ms: Date.now() - Date.parse(transaction.started_at),
    failure_reason: null,
  };

  memoryBundle.metadata = {
    ...memoryBundle.metadata,
    audit: {
      ...memoryBundle.metadata.audit,
      persisted_at: completed.completed_at!,
      transaction: completed,
    },
  };

  try {
    staging.set(key, memoryBundle);
    bundles.set(key, memoryBundle);
    staging.delete(key);

    transactionLog.set(transaction.transaction_id, completed);
    return completed;
  } catch (error) {
    staging.delete(key);
    bundles.delete(key);

    const rolledBack: PersistenceTransactionAudit = {
      ...transaction,
      status: 'rolled_back',
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - Date.parse(transaction.started_at),
      failure_reason: error instanceof Error ? error.message : 'rollback',
    };
    transactionLog.set(transaction.transaction_id, rolledBack);
    throw error;
  }
}

export function persistMetadataRecord(metadata: SessionMetadataRecord): SessionMetadataRecord {
  const key = bundleKey(metadata.organization_id, metadata.session_id);
  if (bundles.has(key)) {
    throw new Error('persistence_duplicate:session_metadata');
  }
  bundles.set(key, {
    metadata,
    raw_measurements: [],
    calculated_metrics: [],
    normative_snapshot: null,
    interpretation: null,
  });
  return metadata;
}

export function persistRawMeasurementRecords(
  organizationId: string,
  sessionId: string,
  records: PersistedRawMeasurementRecord[]
): PersistedRawMeasurementRecord[] {
  const bundle = bundles.get(bundleKey(organizationId, sessionId));
  if (!bundle) throw new Error('persistence_not_found:session_metadata');
  if (bundle.raw_measurements.length > 0) throw new Error('persistence_duplicate:raw_measurement');
  bundle.raw_measurements = records;
  return records;
}

export function persistCalculatedMetricRecords(
  organizationId: string,
  sessionId: string,
  records: PersistedCalculatedMetricRecord[]
): PersistedCalculatedMetricRecord[] {
  const bundle = bundles.get(bundleKey(organizationId, sessionId));
  if (!bundle) throw new Error('persistence_not_found:session_metadata');
  if (bundle.calculated_metrics.length > 0) {
    throw new Error('persistence_duplicate:calculated_metric');
  }
  bundle.calculated_metrics = records;
  return records;
}

export function persistNormativeSnapshotRecord(
  record: PersistedNormativeSnapshotRecord
): PersistedNormativeSnapshotRecord {
  const bundle = bundles.get(bundleKey(record.organization_id, record.session_id));
  if (!bundle) throw new Error('persistence_not_found:session_metadata');
  if (bundle.normative_snapshot) throw new Error('persistence_duplicate:normative_snapshot');
  bundle.normative_snapshot = record;
  return record;
}

export function persistInterpretationRecord(
  record: PersistedInterpretationRecord
): PersistedInterpretationRecord {
  const bundle = bundles.get(bundleKey(record.organization_id, record.session_id));
  if (!bundle) throw new Error('persistence_not_found:session_metadata');
  if (bundle.interpretation) throw new Error('persistence_duplicate:ssid_interpretation');
  bundle.interpretation = record;
  return record;
}

export function getPersistedSession(
  organizationId: string,
  sessionId: string
): AssessmentSession | null {
  const bundle = bundles.get(bundleKey(organizationId, sessionId));
  return bundle ? assembleAssessmentSession(bundle) : null;
}

export function listPersistedSessions(): AssessmentSession[] {
  return [...bundles.values()].map(assembleAssessmentSession);
}

export function listPersistedSessionsByOrganization(organizationId: string): AssessmentSession[] {
  return listPersistedSessions().filter((s) => s.organization_id === organizationId);
}

export function listPersistedSessionsByAthlete(
  organizationId: string,
  athleteId: string
): AssessmentSession[] {
  return listPersistedSessionsByOrganization(organizationId).filter(
    (s) => s.athlete_id === athleteId
  );
}

export function listPersistedSessionsByDefinition(
  organizationId: string,
  assessmentDefinitionKey: string
): AssessmentSession[] {
  return listPersistedSessionsByOrganization(organizationId).filter(
    (s) => s.assessment_definition_key === assessmentDefinitionKey
  );
}

export function getCalculatedMetricsForSession(
  organizationId: string,
  sessionId: string
): PersistedCalculatedMetricRecord[] {
  return bundles.get(bundleKey(organizationId, sessionId))?.calculated_metrics ?? [];
}

export function getNormativeSnapshotForSession(
  organizationId: string,
  sessionId: string
): PersistedNormativeSnapshotRecord | null {
  return bundles.get(bundleKey(organizationId, sessionId))?.normative_snapshot ?? null;
}

export function getInterpretationForSession(
  organizationId: string,
  sessionId: string
): PersistedInterpretationRecord | null {
  return bundles.get(bundleKey(organizationId, sessionId))?.interpretation ?? null;
}

export function resetScientificPersistenceMemoryStore(): void {
  bundles.clear();
  staging.clear();
  transactionLog.clear();
  mockCommitFailureReason = null;
  mockSimulatePartialWrite = false;
}

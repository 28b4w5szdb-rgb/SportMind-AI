/**
 * Scientific persistence entity types — Phase 6C.8 / 6C.8.1.
 */

import type { CalculatedMetric, NormativeComparisonSnapshot, RawMeasurement } from '../session/AssessmentSession';
import type {
  AssessmentSessionContext,
  ProtocolSnapshot,
  SessionInterpretationState,
} from '../session/AssessmentSession';
import type { CloudDocumentMeta, DataSourceType, EvidenceTier } from '../common';

export const PERSISTENCE_VERSION = '1.1.0';

export const PERSISTENCE_ENTITY_TYPES = [
  'session_metadata',
  'raw_measurement',
  'calculated_metric',
  'normative_snapshot',
  'ssid_interpretation',
  'audit_metadata',
] as const;

export type PersistenceEntityType = (typeof PERSISTENCE_ENTITY_TYPES)[number];

export const PERSISTENCE_ENTITIES_COUNT = PERSISTENCE_ENTITY_TYPES.length;

export type PersistenceAdapterKind = 'mock' | 'firestore';

/** Single atomic operation persisting all six entity types together. */
export const ATOMIC_PERSISTENCE_OPERATION = 'persist_session_bundle' as const;

export const ATOMIC_OPERATIONS_SUPPORTED = 1;

export type PersistenceTransactionStatus =
  | 'pending'
  | 'writing'
  | 'completed'
  | 'failed'
  | 'rolled_back';

export interface PersistenceTransactionAudit {
  transaction_id: string;
  status: PersistenceTransactionStatus;
  started_at: string;
  completed_at?: string | null;
  duration_ms?: number | null;
  retry_count: number;
  failure_reason?: string | null;
  adapter: PersistenceAdapterKind;
}

export interface ScientificAuditMetadata {
  persisted_at: string;
  persisted_by: string;
  persistence_version: string;
  persistence_adapter: PersistenceAdapterKind;
  schema_version: string;
  immutable: true;
  transaction: PersistenceTransactionAudit;
}

export interface SessionMetadataRecord extends CloudDocumentMeta {
  session_id: string;
  athlete_id: string;
  organization_id: string;
  team_id?: string | null;
  season_id?: string | null;
  assessment_definition_id: string;
  assessment_definition_key: string;
  protocol_version: string;
  evidence_tier_snapshot: EvidenceTier;
  conducted_at: string;
  conducted_by: string;
  source_type: DataSourceType;
  session_context: AssessmentSessionContext;
  status: string;
  protocol_snapshot: ProtocolSnapshot;
  audit: ScientificAuditMetadata;
}

export interface PersistedRawMeasurementRecord extends RawMeasurement {
  session_id: string;
  organization_id: string;
  record_version: string;
}

export interface PersistedCalculatedMetricRecord extends CalculatedMetric {
  session_id: string;
  organization_id: string;
  record_version: string;
}

export interface PersistedNormativeSnapshotRecord extends NormativeComparisonSnapshot {
  session_id: string;
  organization_id: string;
  record_version: string;
  reference_version?: string | null;
}

export interface PersistedInterpretationRecord extends SessionInterpretationState {
  session_id: string;
  organization_id: string;
  record_version: string;
}

export interface ScientificPersistenceBundle {
  metadata: SessionMetadataRecord;
  raw_measurements: PersistedRawMeasurementRecord[];
  calculated_metrics: PersistedCalculatedMetricRecord[];
  normative_snapshot: PersistedNormativeSnapshotRecord;
  interpretation: PersistedInterpretationRecord;
}

export interface ScientificPersistenceResult {
  session_id: string;
  organization_id: string;
  persisted_at: string;
  adapter: PersistenceAdapterKind;
  entity_count: number;
  atomic: true;
  operation: typeof ATOMIC_PERSISTENCE_OPERATION;
  transaction: PersistenceTransactionAudit;
}

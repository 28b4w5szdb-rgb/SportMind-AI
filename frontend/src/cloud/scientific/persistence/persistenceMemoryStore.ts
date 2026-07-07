/**
 * Append-only in-memory scientific persistence store — mock adapter backing.
 */

import type { AssessmentSession } from '../models/session';
import type {
  PersistedCalculatedMetricRecord,
  PersistedInterpretationRecord,
  PersistedNormativeSnapshotRecord,
  PersistedRawMeasurementRecord,
  SessionMetadataRecord,
} from '../models/persistence';

interface MemoryBundle {
  metadata: SessionMetadataRecord;
  raw_measurements: PersistedRawMeasurementRecord[];
  calculated_metrics: PersistedCalculatedMetricRecord[];
  normative_snapshot: PersistedNormativeSnapshotRecord | null;
  interpretation: PersistedInterpretationRecord | null;
}

const bundles = new Map<string, MemoryBundle>();

function bundleKey(organizationId: string, sessionId: string): string {
  return `${organizationId}::${sessionId}`;
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
}

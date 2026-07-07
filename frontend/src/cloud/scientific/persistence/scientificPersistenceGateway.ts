/**
 * Scientific Persistence Gateway — sole write path for scientific records (Phase 6C.8).
 *
 * Scientific Core → Repository Layer → Persistence Adapter → Firestore OR Mock
 */

import type { AssessmentSession } from '../models/session';
import type {
  PersistedCalculatedMetricRecord,
  PersistedInterpretationRecord,
  PersistedNormativeSnapshotRecord,
  PersistedRawMeasurementRecord,
  PersistenceAdapterKind,
  ScientificAuditMetadata,
  ScientificPersistenceResult,
  SessionMetadataRecord,
} from '../models/persistence';
import { PERSISTENCE_ENTITIES_COUNT, PERSISTENCE_VERSION } from '../models/persistence';
import type { AssessmentSessionRepository } from '../repositories/contracts/AssessmentSessionRepository';
import type { NormativeSnapshotRepository } from '../repositories/contracts/NormativeSnapshotRepository';
import type { ScientificCalculationRepository } from '../repositories/contracts/ScientificCalculationRepository';
import type { ScientificInterpretationRepository } from '../repositories/contracts/ScientificInterpretationRepository';
import { ScientificPersistenceError } from '../adapters/errors';
import { validatePersistableAssessmentSession } from '../validation/persistenceValidators';

export interface ScientificPersistenceGatewayDependencies {
  sessions: AssessmentSessionRepository;
  calculations: ScientificCalculationRepository;
  normative: NormativeSnapshotRepository;
  interpretations: ScientificInterpretationRepository;
  adapter: PersistenceAdapterKind;
}

function buildAudit(session: AssessmentSession, adapter: PersistenceAdapterKind): ScientificAuditMetadata {
  return {
    persisted_at: new Date().toISOString(),
    persisted_by: session.conducted_by,
    persistence_version: PERSISTENCE_VERSION,
    persistence_adapter: adapter,
    schema_version: session.protocol_version,
    immutable: true,
  };
}

function buildMetadata(
  session: AssessmentSession,
  audit: ScientificAuditMetadata
): SessionMetadataRecord {
  return {
    id: session.id,
    session_id: session.session_id,
    created_at: session.created_at,
    updated_at: session.updated_at,
    athlete_id: session.athlete_id,
    organization_id: session.organization_id,
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
}

export class ScientificPersistenceGateway {
  constructor(private readonly deps: ScientificPersistenceGatewayDependencies) {}

  get adapter(): PersistenceAdapterKind {
    return this.deps.adapter;
  }

  async persist(session: AssessmentSession): Promise<ScientificPersistenceResult> {
    const validation = validatePersistableAssessmentSession(session);
    if (!validation.valid) {
      throw new ScientificPersistenceError(
        'validation_failed',
        validation.errors.join(';')
      );
    }

    const exists = await this.deps.sessions.exists(session.organization_id, session.session_id);
    if (exists) {
      throw new ScientificPersistenceError('persistence_duplicate:session');
    }

    const audit = buildAudit(session, this.deps.adapter);
    const metadata = buildMetadata(session, audit);

    await this.deps.sessions.appendMetadata(metadata);

    const rawRecords: PersistedRawMeasurementRecord[] =
      session.raw_measurements.length > 0
        ? await this.deps.sessions.appendRawMeasurements(
            session.organization_id,
            session.session_id,
            session.raw_measurements
          )
        : [];

    const metricRecords: PersistedCalculatedMetricRecord[] =
      session.calculated_metrics.length > 0
        ? await this.deps.calculations.appendMetrics(
            session.organization_id,
            session.session_id,
            session.calculated_metrics
          )
        : [];

    const normativeRecord: PersistedNormativeSnapshotRecord =
      await this.deps.normative.appendSnapshot(
        session.organization_id,
        session.session_id,
        session.normative_comparison
      );

    const interpretationRecord: PersistedInterpretationRecord =
      await this.deps.interpretations.appendInterpretation(
        session.organization_id,
        session.session_id,
        session.interpretation
      );

    const entityCount =
      1 +
      rawRecords.length +
      metricRecords.length +
      1 +
      1 +
      1;

    return {
      session_id: session.session_id,
      organization_id: session.organization_id,
      persisted_at: audit.persisted_at,
      adapter: this.deps.adapter,
      entity_count: entityCount,
    };
  }

  async getSession(organizationId: string, sessionId: string): Promise<AssessmentSession | null> {
    return this.deps.sessions.getById(organizationId, sessionId);
  }
}

export function createScientificPersistenceGateway(
  deps: ScientificPersistenceGatewayDependencies
): ScientificPersistenceGateway {
  return new ScientificPersistenceGateway(deps);
}

export { PERSISTENCE_ENTITIES_COUNT };

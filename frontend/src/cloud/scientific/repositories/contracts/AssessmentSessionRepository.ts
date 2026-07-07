/**
 * Assessment session repository contract — read + append-only persist (Phase 6C.8).
 */

import type { AssessmentSession, RawMeasurement } from '../../models/session';
import type {
  PersistedRawMeasurementRecord,
  SessionMetadataRecord,
} from '../../models/persistence';

export interface AssessmentSessionRepository {
  getById(organizationId: string, sessionId: string): Promise<AssessmentSession | null>;
  listByOrganization(organizationId: string): Promise<AssessmentSession[]>;
  listByAthlete(organizationId: string, athleteId: string): Promise<AssessmentSession[]>;
  listByAssessmentDefinition(
    organizationId: string,
    assessmentDefinitionKey: string
  ): Promise<AssessmentSession[]>;
  listAssessmentSessions(): Promise<AssessmentSession[]>;
  exists(organizationId: string, sessionId: string): Promise<boolean>;
  appendMetadata(metadata: SessionMetadataRecord): Promise<SessionMetadataRecord>;
  appendRawMeasurements(
    organizationId: string,
    sessionId: string,
    measurements: RawMeasurement[]
  ): Promise<PersistedRawMeasurementRecord[]>;
}

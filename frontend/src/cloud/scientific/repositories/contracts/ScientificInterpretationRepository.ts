/**
 * SSID interpretation persistence repository contract.
 */

import type { SessionInterpretationState } from '../../models/session';
import type { PersistedInterpretationRecord } from '../../models/persistence';

export interface ScientificInterpretationRepository {
  appendInterpretation(
    organizationId: string,
    sessionId: string,
    interpretation: SessionInterpretationState
  ): Promise<PersistedInterpretationRecord>;
  getBySession(
    organizationId: string,
    sessionId: string
  ): Promise<PersistedInterpretationRecord | null>;
  existsForSession(organizationId: string, sessionId: string): Promise<boolean>;
}

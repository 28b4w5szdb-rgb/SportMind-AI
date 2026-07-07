/**
 * Normative snapshot persistence repository contract.
 */

import type { NormativeComparisonSnapshot } from '../../models/session';
import type { PersistedNormativeSnapshotRecord } from '../../models/persistence';

export interface NormativeSnapshotRepository {
  appendSnapshot(
    organizationId: string,
    sessionId: string,
    snapshot: NormativeComparisonSnapshot
  ): Promise<PersistedNormativeSnapshotRecord>;
  getBySession(
    organizationId: string,
    sessionId: string
  ): Promise<PersistedNormativeSnapshotRecord | null>;
  existsForSession(organizationId: string, sessionId: string): Promise<boolean>;
}

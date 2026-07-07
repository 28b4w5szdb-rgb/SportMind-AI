/**
 * Scientific atomic persistence repository contract — Phase 6C.8.1.
 */

import type {
  PersistenceTransactionAudit,
  ScientificPersistenceBundle,
} from '../../models/persistence';

export interface ScientificAtomicPersistenceRepository {
  persistAtomically(
    bundle: ScientificPersistenceBundle,
    transaction: PersistenceTransactionAudit
  ): Promise<PersistenceTransactionAudit>;
  sessionExists(organizationId: string, sessionId: string): Promise<boolean>;
}

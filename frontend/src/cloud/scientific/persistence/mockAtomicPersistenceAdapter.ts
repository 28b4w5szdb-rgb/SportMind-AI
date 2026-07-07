/**
 * Mock atomic scientific persistence adapter — Phase 6C.8.1.
 */

import type {
  PersistenceTransactionAudit,
  ScientificPersistenceBundle,
} from '../models/persistence';
import type { ScientificAtomicPersistenceRepository } from '../repositories/contracts/ScientificAtomicPersistenceRepository';
import {
  commitAtomicBundle,
  persistenceBundleExists,
} from './persistenceMemoryStore';

export function createMockAtomicPersistenceRepository(): ScientificAtomicPersistenceRepository {
  return {
    async sessionExists(organizationId, sessionId) {
      return persistenceBundleExists(organizationId, sessionId);
    },
    async persistAtomically(bundle, transaction) {
      const writing: PersistenceTransactionAudit = {
        ...transaction,
        status: 'writing',
      };
      return commitAtomicBundle(bundle, writing);
    },
  };
}

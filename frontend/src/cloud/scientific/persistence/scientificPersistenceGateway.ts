/**
 * Scientific Persistence Gateway — sole write path for scientific records (Phase 6C.8 / 6C.8.1).
 *
 * Scientific Core → Repository Layer → Atomic Persistence Adapter → Firestore OR Mock
 */

import type { AssessmentSession } from '../models/session';
import type {
  PersistenceAdapterKind,
  ScientificPersistenceResult,
} from '../models/persistence';
import {
  ATOMIC_OPERATIONS_SUPPORTED,
  ATOMIC_PERSISTENCE_OPERATION as ATOMIC_OP,
  PERSISTENCE_ENTITIES_COUNT,
} from '../models/persistence';
import type { AssessmentSessionRepository } from '../repositories/contracts/AssessmentSessionRepository';
import type { ScientificAtomicPersistenceRepository } from '../repositories/contracts/ScientificAtomicPersistenceRepository';
import { ScientificPersistenceError } from '../adapters/errors';
import { validatePersistableAssessmentSession } from '../validation/persistenceValidators';
import {
  buildAuditMetadata,
  buildPersistenceBundle,
  createPendingTransaction,
} from './atomicBundleBuilder';
import { logPersistence } from './persistenceLogger';
import { isTransientPersistenceError, withPersistenceRetry } from './retryPolicy';

export interface ScientificPersistenceGatewayDependencies {
  sessions: AssessmentSessionRepository;
  atomic: ScientificAtomicPersistenceRepository;
  adapter: PersistenceAdapterKind;
}

function countBundleEntities(bundle: ReturnType<typeof buildPersistenceBundle>): number {
  return (
    1 +
    bundle.raw_measurements.length +
    bundle.calculated_metrics.length +
    1 +
    1 +
    1
  );
}

export class ScientificPersistenceGateway {
  constructor(private readonly deps: ScientificPersistenceGatewayDependencies) {}

  get adapter(): PersistenceAdapterKind {
    return this.deps.adapter;
  }

  async persist(session: AssessmentSession): Promise<ScientificPersistenceResult> {
    const validation = validatePersistableAssessmentSession(session);
    if (!validation.valid) {
      logPersistence({
        level: 'error',
        event: 'validation_failed',
        transaction_id: 'none',
        session_id: session.session_id,
        organization_id: session.organization_id,
        adapter: this.deps.adapter,
        detail: { errors: validation.errors },
      });
      throw new ScientificPersistenceError(
        'validation_failed',
        validation.errors.join(';')
      );
    }

    const exists = await this.deps.atomic.sessionExists(
      session.organization_id,
      session.session_id
    );
    if (exists) {
      throw new ScientificPersistenceError('persistence_duplicate:session');
    }

    let transaction = createPendingTransaction(this.deps.adapter);

    logPersistence({
      level: 'info',
      event: 'transaction_pending',
      transaction_id: transaction.transaction_id,
      session_id: session.session_id,
      organization_id: session.organization_id,
      adapter: this.deps.adapter,
    });

    const audit = buildAuditMetadata(session, this.deps.adapter, {
      ...transaction,
      status: 'writing',
    });
    const bundle = buildPersistenceBundle(session, audit);

    logPersistence({
      level: 'info',
      event: 'transaction_writing',
      transaction_id: transaction.transaction_id,
      session_id: session.session_id,
      organization_id: session.organization_id,
      adapter: this.deps.adapter,
      detail: { entity_count: countBundleEntities(bundle) },
    });

    try {
      const { result: completedTransaction, retryCount } = await withPersistenceRetry(
        () =>
          this.deps.atomic.persistAtomically(bundle, {
            ...transaction,
            status: 'writing',
            retry_count: transaction.retry_count,
          }),
        { maxAttempts: 3 }
      );

      transaction = {
        ...completedTransaction,
        retry_count: retryCount,
      };

      logPersistence({
        level: 'info',
        event: 'transaction_completed',
        transaction_id: transaction.transaction_id,
        session_id: session.session_id,
        organization_id: session.organization_id,
        adapter: this.deps.adapter,
        detail: {
          duration_ms: transaction.duration_ms,
          retry_count: transaction.retry_count,
        },
      });

      return {
        session_id: session.session_id,
        organization_id: session.organization_id,
        persisted_at: transaction.completed_at ?? audit.persisted_at,
        adapter: this.deps.adapter,
        entity_count: countBundleEntities(bundle),
        atomic: true,
        operation: ATOMIC_OP,
        transaction,
      };
    } catch (error) {
      const failureReason =
        error instanceof Error ? error.message : 'atomic_persist_failed';

      transaction = {
        ...transaction,
        status: isTransientPersistenceError(error) ? 'failed' : 'failed',
        completed_at: new Date().toISOString(),
        duration_ms: Date.now() - Date.parse(transaction.started_at),
        failure_reason: failureReason,
      };

      if (
        error &&
        typeof error === 'object' &&
        'transactionAudit' in error &&
        (error as { transactionAudit?: typeof transaction }).transactionAudit
      ) {
        transaction = (error as { transactionAudit: typeof transaction }).transactionAudit;
      }

      logPersistence({
        level: 'error',
        event: 'transaction_failed',
        transaction_id: transaction.transaction_id,
        session_id: session.session_id,
        organization_id: session.organization_id,
        adapter: this.deps.adapter,
        detail: {
          failure_reason: transaction.failure_reason,
          retry_count: transaction.retry_count,
        },
      });

      if (error instanceof ScientificPersistenceError) {
        throw error;
      }
      throw new ScientificPersistenceError('atomic_persist_failed', failureReason);
    }
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

export {
  ATOMIC_OPERATIONS_SUPPORTED,
  ATOMIC_OP as ATOMIC_PERSISTENCE_OPERATION,
  PERSISTENCE_ENTITIES_COUNT,
};

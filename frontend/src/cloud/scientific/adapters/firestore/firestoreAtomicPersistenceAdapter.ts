/**
 * Firestore atomic scientific persistence — WriteBatch + read-before-write transaction.
 */

import {
  doc,
  getDoc,
  runTransaction,
  type DocumentData,
  type Firestore,
} from 'firebase/firestore';

import { getCloudFirestore } from '@/src/cloud/firebase/firestore';

import { ScientificPersistenceError } from '../errors';
import type {
  PersistenceTransactionAudit,
  ScientificPersistenceBundle,
} from '../../models/persistence';
import type { ScientificAtomicPersistenceRepository } from '../../repositories/contracts/ScientificAtomicPersistenceRepository';
import { ORGANIZATIONS_ROOT } from '../../paths/organizationPaths';
import {
  ASSESSMENT_SESSIONS_SUBCOLLECTION,
  CALCULATED_METRICS_SUBCOLLECTION,
  INTERPRETATION_DOC_ID,
  INTERPRETATIONS_SUBCOLLECTION,
  NORMATIVE_SNAPSHOT_DOC_ID,
  NORMATIVE_SNAPSHOT_SUBCOLLECTION,
  RAW_MEASUREMENTS_SUBCOLLECTION,
} from '../../paths/sessionPaths';
import { getScientificFirestoreForWrite } from './firestoreWriteHelper';

function orgSessionSegments(orgId: string, sessionId: string): [string, ...string[]] {
  return [ORGANIZATIONS_ROOT, orgId, ASSESSMENT_SESSIONS_SUBCOLLECTION, sessionId];
}

function sessionSubDocSegments(
  orgId: string,
  sessionId: string,
  subcollection: string,
  docId: string
): [string, ...string[]] {
  return [...orgSessionSegments(orgId, sessionId), subcollection, docId];
}

async function persistBundleInTransaction(
  db: Firestore,
  bundle: ScientificPersistenceBundle,
  completedTransaction: PersistenceTransactionAudit
): Promise<void> {
  const orgId = bundle.metadata.organization_id;
  const sessionId = bundle.metadata.session_id;
  const sessionRef = doc(db, ...orgSessionSegments(orgId, sessionId));

  const metadata = {
    ...bundle.metadata,
    audit: {
      ...bundle.metadata.audit,
      persisted_at: completedTransaction.completed_at!,
      transaction: completedTransaction,
    },
  };

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(sessionRef);
    if (existing.exists()) {
      throw new ScientificPersistenceError('persistence_duplicate:session');
    }

    transaction.set(sessionRef, metadata as DocumentData);

    for (const raw of bundle.raw_measurements) {
      const rawRef = doc(
        db,
        ...sessionSubDocSegments(orgId, sessionId, RAW_MEASUREMENTS_SUBCOLLECTION, raw.measurement_id)
      );
      transaction.set(rawRef, raw as DocumentData);
    }

    for (const [index, metric] of bundle.calculated_metrics.entries()) {
      const metricId = metric.metric_key || `metric_${index}`;
      const metricRef = doc(
        db,
        ...sessionSubDocSegments(orgId, sessionId, CALCULATED_METRICS_SUBCOLLECTION, metricId)
      );
      transaction.set(metricRef, { ...metric, metric_key: metricId } as DocumentData);
    }

    const normativeRef = doc(
      db,
      ...sessionSubDocSegments(
        orgId,
        sessionId,
        NORMATIVE_SNAPSHOT_SUBCOLLECTION,
        NORMATIVE_SNAPSHOT_DOC_ID
      )
    );
    transaction.set(normativeRef, bundle.normative_snapshot as DocumentData);

    const interpretationRef = doc(
      db,
      ...sessionSubDocSegments(
        orgId,
        sessionId,
        INTERPRETATIONS_SUBCOLLECTION,
        INTERPRETATION_DOC_ID
      )
    );
    transaction.set(interpretationRef, bundle.interpretation as DocumentData);
  });
}

export function createFirestoreAtomicPersistenceRepository(): ScientificAtomicPersistenceRepository {
  return {
    async sessionExists(organizationId, sessionId) {
      const db = getScientificFirestoreForWrite();
      if (!db) return false;
      const snap = await getDoc(doc(db, ...orgSessionSegments(organizationId, sessionId)));
      return snap.exists();
    },
    async persistAtomically(bundle, transaction) {
      const db = getCloudFirestore();
      if (!db) {
        throw new ScientificPersistenceError('firestore_unavailable');
      }

      const writing: PersistenceTransactionAudit = {
        ...transaction,
        status: 'writing',
      };

      try {
        const completed: PersistenceTransactionAudit = {
          ...writing,
          status: 'completed',
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - Date.parse(writing.started_at),
          failure_reason: null,
        };

        await persistBundleInTransaction(db, bundle, completed);
        return completed;
      } catch (error) {
        const failed: PersistenceTransactionAudit = {
          ...writing,
          status: 'failed',
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - Date.parse(writing.started_at),
          failure_reason:
            error instanceof Error ? error.message : 'firestore_atomic_persist_failed',
        };
        throw Object.assign(
          error instanceof Error ? error : new ScientificPersistenceError('firestore_write_failed'),
          { transactionAudit: failed }
        );
      }
    },
  };
}

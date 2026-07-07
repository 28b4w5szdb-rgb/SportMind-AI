/**
 * Firestore scientific calculation persistence adapter.
 */

import type { CalculatedMetric } from '../../models/session';
import type { PersistedCalculatedMetricRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { ScientificCalculationRepository } from '../../repositories/contracts/ScientificCalculationRepository';
import { CALCULATED_METRICS_SUBCOLLECTION } from '../../paths/sessionPaths';
import {
  createOrgSessionSubcollectionDocumentsIfNotExists,
  readOrgSessionSubcollection,
} from './firestoreReadHelper';

export function createScientificCalculationFirestoreRepository(): ScientificCalculationRepository {
  return {
    async appendMetrics(organizationId, sessionId, metrics) {
      const records: PersistedCalculatedMetricRecord[] = metrics.map((metric, index) => ({
        ...metric,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
        metric_key: metric.metric_key || `metric_${index}`,
      }));
      await createOrgSessionSubcollectionDocumentsIfNotExists(
        organizationId,
        sessionId,
        CALCULATED_METRICS_SUBCOLLECTION,
        records.map((r) => ({ id: r.metric_key, data: r }))
      );
      return records;
    },
    async listBySession(organizationId, sessionId) {
      return readOrgSessionSubcollection<PersistedCalculatedMetricRecord>(
        organizationId,
        sessionId,
        CALCULATED_METRICS_SUBCOLLECTION
      );
    },
    async existsForSession(organizationId, sessionId) {
      const items = await readOrgSessionSubcollection<PersistedCalculatedMetricRecord>(
        organizationId,
        sessionId,
        CALCULATED_METRICS_SUBCOLLECTION
      );
      return items.length > 0;
    },
  };
}

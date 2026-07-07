/**
 * Mock scientific calculation persistence adapter.
 */

import type { CalculatedMetric } from '../../models/session';
import type { PersistedCalculatedMetricRecord } from '../../models/persistence';
import { PERSISTENCE_VERSION } from '../../models/persistence';
import type { ScientificCalculationRepository } from '../../repositories/contracts/ScientificCalculationRepository';
import {
  getCalculatedMetricsForSession,
  persistCalculatedMetricRecords,
  persistenceBundleExists,
} from '../../persistence/persistenceMemoryStore';

export function createScientificCalculationMockRepository(): ScientificCalculationRepository {
  return {
    async appendMetrics(organizationId, sessionId, metrics) {
      const records: PersistedCalculatedMetricRecord[] = metrics.map((metric, index) => ({
        ...metric,
        session_id: sessionId,
        organization_id: organizationId,
        record_version: PERSISTENCE_VERSION,
        metric_key: metric.metric_key || `metric_${index}`,
      }));
      return persistCalculatedMetricRecords(organizationId, sessionId, records);
    },
    async listBySession(organizationId, sessionId) {
      return getCalculatedMetricsForSession(organizationId, sessionId);
    },
    async existsForSession(organizationId, sessionId) {
      return getCalculatedMetricsForSession(organizationId, sessionId).length > 0;
    },
  };
}

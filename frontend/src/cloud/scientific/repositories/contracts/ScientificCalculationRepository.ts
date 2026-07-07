/**
 * Scientific Calculation persistence repository contract.
 */

import type { CalculatedMetric } from '../../models/session';
import type { PersistedCalculatedMetricRecord } from '../../models/persistence';

export interface ScientificCalculationRepository {
  appendMetrics(
    organizationId: string,
    sessionId: string,
    metrics: CalculatedMetric[]
  ): Promise<PersistedCalculatedMetricRecord[]>;
  listBySession(organizationId: string, sessionId: string): Promise<PersistedCalculatedMetricRecord[]>;
  existsForSession(organizationId: string, sessionId: string): Promise<boolean>;
}

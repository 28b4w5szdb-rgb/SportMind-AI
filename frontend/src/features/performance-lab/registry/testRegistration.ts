import type { SsidMetricId } from '@/src/features/ssid-engine';

import type { CatalogRowInput } from './factory';
import type { TestDefinition } from '../types';

export const TEST_SSID_METRIC_MAP: Partial<Record<string, SsidMetricId>> = {
  bmi: 'bmi',
  body_fat: 'body_fat',
  skeletal_muscle_mass: 'muscle_mass',
};

/** Part 9 — future hook: validate row has knowledge + SSID bridge before registry merge. */
export function validateTestRegistration(row: CatalogRowInput): void {
  if (!row.copy.protocol?.en || !row.copy.purpose?.en) {
    throw new Error(`Test ${row.key} missing required protocol or purpose copy`);
  }
}

export function attachSsidMetadata(row: CatalogRowInput, def: TestDefinition): TestDefinition {
  return {
    ...def,
    ssidMetricId: row.ssidMetricId ?? TEST_SSID_METRIC_MAP[row.key],
  };
}

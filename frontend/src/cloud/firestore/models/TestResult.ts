import type { CloudDocumentMeta } from './common';

/** Performance test result. Collection: `test_results/{id}`. */
export interface TestResult extends CloudDocumentMeta {
  organization_id: string;
  athlete_id: string;
  athlete_name: string;
  test_type: string;
  test_type_key: string;
  value: number;
  unit: string;
  date: string;
  notes?: string;
  /** Serialized SSID interpretation blob for cloud persistence. */
  ssid_payload?: Record<string, unknown>;
  demographic_context?: Record<string, unknown>;
  reference_profile?: Record<string, unknown>;
}

export type TestResultInput = Omit<TestResult, keyof CloudDocumentMeta>;

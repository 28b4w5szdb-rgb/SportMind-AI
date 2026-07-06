import type { CloudDocumentMeta } from './common';

export type WearableProviderId =
  | 'apple_health'
  | 'apple_watch'
  | 'garmin'
  | 'polar'
  | 'fitbit'
  | 'coros'
  | 'suunto'
  | 'samsung_health'
  | 'huawei_health'
  | 'google_health_connect'
  | 'whoop'
  | 'oura'
  | 'amazfit'
  | 'strava'
  | 'trainingpeaks';

/** Wearable sync record. Collection: `wearable_records/{id}`. */
export interface WearableRecord extends CloudDocumentMeta {
  organization_id: string;
  athlete_id: string;
  provider_id: WearableProviderId;
  date: string;
  recorded_at: string;
  metrics: Record<string, number | string>;
  source: 'mock_sync' | 'device' | 'import';
}

export type WearableRecordInput = Omit<WearableRecord, keyof CloudDocumentMeta>;

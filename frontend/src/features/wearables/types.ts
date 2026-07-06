/** Wearables & device integration domain model — mock-backed, adapter-ready. */

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

export type WearableConnectionStatus = 'not_connected' | 'connected' | 'mock_sync';

export type WearableMetricType =
  | 'resting_heart_rate'
  | 'heart_rate'
  | 'hrv'
  | 'sleep_duration'
  | 'sleep_quality'
  | 'sleep_stages'
  | 'steps'
  | 'calories'
  | 'distance'
  | 'gps_summary'
  | 'training_duration'
  | 'training_load'
  | 'spo2'
  | 'body_temperature'
  | 'recovery_score';

export type MockSyncType = 'sleep' | 'hr_hrv' | 'activity' | 'calories' | 'steps' | 'training_load';

export interface WearableProviderDefinition {
  id: WearableProviderId;
  labelKey: string;
  icon: string;
  brandColor: string;
  supportedMetrics: WearableMetricType[];
  defaultPermissions: WearableMetricType[];
}

export interface WearableProviderConnection {
  athlete_id: string;
  provider_id: WearableProviderId;
  status: WearableConnectionStatus;
  permissions: WearableMetricType[];
  last_sync_at?: string;
  connected_at?: string;
}

export interface WearableSleepStages {
  deep: number;
  rem: number;
  light: number;
  awake: number;
}

export interface WearableDataRecord {
  id: string;
  athlete_id: string;
  provider_id: WearableProviderId;
  date: string;
  recorded_at: string;
  metrics: Partial<Record<WearableMetricType, number | string>>;
  source: 'mock_sync' | 'device';
}

export interface WearableDailySnapshot {
  athleteId: string;
  date: string;
  primaryProviderId?: WearableProviderId;
  connectedCount: number;
  mockSyncCount: number;
  lastSyncAt?: string;
  restingHeartRate?: number;
  heartRateAvg?: number;
  hrv?: number;
  sleepDurationHours?: number;
  sleepQuality?: number;
  sleepStages?: WearableSleepStages;
  steps?: number;
  calories?: number;
  distanceKm?: number;
  trainingDurationMin?: number;
  trainingLoad?: number;
  spo2?: number;
  bodyTemperature?: number;
  recoveryScore?: number;
  readinessImpact: number;
  fatigueImpact: number;
  hydrationHint?: 'low' | 'normal' | 'high';
  connections: WearableProviderConnection[];
}

export interface WearableSyncResult {
  record: WearableDataRecord;
  connection: WearableProviderConnection;
  snapshot: WearableDailySnapshot;
}

import type { WearableMetricType, WearableProviderDefinition, WearableProviderId } from '../types';

const CORE_METRICS: WearableMetricType[] = [
  'resting_heart_rate',
  'heart_rate',
  'hrv',
  'sleep_duration',
  'sleep_quality',
  'steps',
  'calories',
  'training_load',
];

export const WEARABLE_PROVIDERS: WearableProviderDefinition[] = [
  {
    id: 'apple_health',
    labelKey: 'wearables.providers.apple_health',
    icon: 'logo-apple',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'gps_summary', 'training_duration', 'spo2', 'body_temperature', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages', 'distance'],
  },
  {
    id: 'garmin',
    labelKey: 'wearables.providers.garmin',
    icon: 'watch',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'gps_summary', 'training_duration', 'spo2', 'body_temperature'],
    defaultPermissions: [...CORE_METRICS, 'gps_summary', 'training_duration'],
  },
  {
    id: 'polar',
    labelKey: 'wearables.providers.polar',
    icon: 'heart',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'training_duration', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'hrv', 'recovery_score'],
  },
  {
    id: 'fitbit',
    labelKey: 'wearables.providers.fitbit',
    icon: 'fitness',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'spo2'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages'],
  },
  {
    id: 'coros',
    labelKey: 'wearables.providers.coros',
    icon: 'navigate',
    supportedMetrics: [...CORE_METRICS, 'distance', 'gps_summary', 'training_duration'],
    defaultPermissions: [...CORE_METRICS, 'gps_summary'],
  },
  {
    id: 'suunto',
    labelKey: 'wearables.providers.suunto',
    icon: 'compass',
    supportedMetrics: [...CORE_METRICS, 'distance', 'gps_summary', 'training_duration', 'spo2'],
    defaultPermissions: [...CORE_METRICS, 'gps_summary'],
  },
  {
    id: 'samsung_health',
    labelKey: 'wearables.providers.samsung_health',
    icon: 'phone-portrait',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'spo2', 'body_temperature'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages'],
  },
  {
    id: 'huawei_health',
    labelKey: 'wearables.providers.huawei_health',
    icon: 'hardware-chip',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'spo2', 'body_temperature'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages'],
  },
  {
    id: 'google_health_connect',
    labelKey: 'wearables.providers.google_health_connect',
    icon: 'logo-google',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'training_duration', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'distance'],
  },
  {
    id: 'whoop',
    labelKey: 'wearables.providers.whoop',
    icon: 'pulse',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'recovery_score', 'hrv'],
    defaultPermissions: [...CORE_METRICS, 'hrv', 'recovery_score'],
  },
  {
    id: 'oura',
    labelKey: 'wearables.providers.oura',
    icon: 'ellipse-outline',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'hrv', 'body_temperature', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'hrv', 'sleep_stages', 'recovery_score'],
  },
  {
    id: 'strava',
    labelKey: 'wearables.providers.strava',
    icon: 'bicycle',
    supportedMetrics: ['heart_rate', 'distance', 'gps_summary', 'training_duration', 'training_load', 'calories'],
    defaultPermissions: ['distance', 'gps_summary', 'training_duration', 'training_load', 'calories'],
  },
  {
    id: 'trainingpeaks',
    labelKey: 'wearables.providers.trainingpeaks',
    icon: 'trending-up',
    supportedMetrics: ['training_duration', 'training_load', 'heart_rate', 'calories', 'recovery_score'],
    defaultPermissions: ['training_load', 'training_duration', 'recovery_score'],
  },
];

export function getProviderById(id: WearableProviderId): WearableProviderDefinition {
  return WEARABLE_PROVIDERS.find((p) => p.id === id) ?? WEARABLE_PROVIDERS[0];
}

export function listProviderIds(): WearableProviderId[] {
  return WEARABLE_PROVIDERS.map((p) => p.id);
}

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

/** Premium device center — primary providers shown in Phase 4A.1 UI. */
export const PREMIUM_PROVIDER_IDS: WearableProviderId[] = [
  'apple_health',
  'apple_watch',
  'garmin',
  'polar',
  'whoop',
  'fitbit',
  'huawei_health',
  'google_health_connect',
  'samsung_health',
  'oura',
  'coros',
  'suunto',
  'amazfit',
];

export const WEARABLE_PROVIDERS: WearableProviderDefinition[] = [
  {
    id: 'apple_health',
    labelKey: 'wearables.providers.apple_health',
    icon: 'logo-apple',
    brandColor: '#FF2D55',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'gps_summary', 'training_duration', 'spo2', 'body_temperature', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages', 'distance'],
  },
  {
    id: 'apple_watch',
    labelKey: 'wearables.providers.apple_watch',
    icon: 'watch',
    brandColor: '#1D1D1F',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'gps_summary', 'training_duration', 'spo2', 'body_temperature', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'heart_rate', 'hrv', 'training_load'],
  },
  {
    id: 'garmin',
    labelKey: 'wearables.providers.garmin',
    icon: 'watch',
    brandColor: '#007CC3',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'gps_summary', 'training_duration', 'spo2', 'body_temperature'],
    defaultPermissions: [...CORE_METRICS, 'gps_summary', 'training_duration'],
  },
  {
    id: 'polar',
    labelKey: 'wearables.providers.polar',
    icon: 'heart',
    brandColor: '#E30613',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'training_duration', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'hrv', 'recovery_score'],
  },
  {
    id: 'whoop',
    labelKey: 'wearables.providers.whoop',
    icon: 'pulse',
    brandColor: '#111111',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'recovery_score', 'hrv'],
    defaultPermissions: [...CORE_METRICS, 'hrv', 'recovery_score'],
  },
  {
    id: 'fitbit',
    labelKey: 'wearables.providers.fitbit',
    icon: 'fitness',
    brandColor: '#00B0B9',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'spo2'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages'],
  },
  {
    id: 'huawei_health',
    labelKey: 'wearables.providers.huawei_health',
    icon: 'hardware-chip',
    brandColor: '#CF0A2C',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'spo2', 'body_temperature'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages'],
  },
  {
    id: 'google_health_connect',
    labelKey: 'wearables.providers.google_health_connect',
    icon: 'logo-google',
    brandColor: '#4285F4',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'training_duration', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'distance'],
  },
  {
    id: 'samsung_health',
    labelKey: 'wearables.providers.samsung_health',
    icon: 'phone-portrait',
    brandColor: '#1428A0',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'spo2', 'body_temperature'],
    defaultPermissions: [...CORE_METRICS, 'sleep_stages'],
  },
  {
    id: 'oura',
    labelKey: 'wearables.providers.oura',
    icon: 'ellipse-outline',
    brandColor: '#7C6CB4',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'hrv', 'body_temperature', 'recovery_score'],
    defaultPermissions: [...CORE_METRICS, 'hrv', 'sleep_stages', 'recovery_score'],
  },
  {
    id: 'coros',
    labelKey: 'wearables.providers.coros',
    icon: 'navigate',
    brandColor: '#FF6B00',
    supportedMetrics: [...CORE_METRICS, 'distance', 'gps_summary', 'training_duration'],
    defaultPermissions: [...CORE_METRICS, 'gps_summary'],
  },
  {
    id: 'suunto',
    labelKey: 'wearables.providers.suunto',
    icon: 'compass',
    brandColor: '#000000',
    supportedMetrics: [...CORE_METRICS, 'distance', 'gps_summary', 'training_duration', 'spo2'],
    defaultPermissions: [...CORE_METRICS, 'gps_summary'],
  },
  {
    id: 'amazfit',
    labelKey: 'wearables.providers.amazfit',
    icon: 'watch-outline',
    brandColor: '#FF6700',
    supportedMetrics: [...CORE_METRICS, 'sleep_stages', 'distance', 'spo2', 'body_temperature'],
    defaultPermissions: [...CORE_METRICS, 'steps', 'sleep_duration'],
  },
  {
    id: 'strava',
    labelKey: 'wearables.providers.strava',
    icon: 'bicycle',
    brandColor: '#FC4C02',
    supportedMetrics: ['heart_rate', 'distance', 'gps_summary', 'training_duration', 'training_load', 'calories'],
    defaultPermissions: ['distance', 'gps_summary', 'training_duration', 'training_load', 'calories'],
  },
  {
    id: 'trainingpeaks',
    labelKey: 'wearables.providers.trainingpeaks',
    icon: 'trending-up',
    brandColor: '#0066CC',
    supportedMetrics: ['training_duration', 'training_load', 'heart_rate', 'calories', 'recovery_score'],
    defaultPermissions: ['training_load', 'training_duration', 'recovery_score'],
  },
];

export function getProviderById(id: WearableProviderId): WearableProviderDefinition {
  return WEARABLE_PROVIDERS.find((p) => p.id === id) ?? WEARABLE_PROVIDERS[0];
}

export function getPremiumProviders(): WearableProviderDefinition[] {
  return PREMIUM_PROVIDER_IDS.map((id) => getProviderById(id));
}

export function listProviderIds(): WearableProviderId[] {
  return WEARABLE_PROVIDERS.map((p) => p.id);
}

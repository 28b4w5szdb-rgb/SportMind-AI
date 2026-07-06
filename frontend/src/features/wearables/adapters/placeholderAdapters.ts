import { createMockAdapter } from './mockAdapter';
import type { WearableProviderAdapter } from './baseAdapter';
import type { WearableProviderId } from '../types';

/** Placeholder adapters — same mock behavior until real SDK/OAuth is wired. */
const PLACEHOLDER_IDS: WearableProviderId[] = [
  'apple_health',
  'garmin',
  'polar',
  'fitbit',
  'huawei_health',
  'google_health_connect',
];

const adapterCache = new Map<WearableProviderId, WearableProviderAdapter>();

export function getWearableAdapter(providerId: WearableProviderId): WearableProviderAdapter {
  const cached = adapterCache.get(providerId);
  if (cached) return cached;
  const adapter = createMockAdapter(providerId);
  adapterCache.set(providerId, adapter);
  return adapter;
}

export function isPlaceholderProvider(providerId: WearableProviderId): boolean {
  return PLACEHOLDER_IDS.includes(providerId);
}

export function listWearableAdapters(): WearableProviderAdapter[] {
  return PLACEHOLDER_IDS.map(getWearableAdapter);
}

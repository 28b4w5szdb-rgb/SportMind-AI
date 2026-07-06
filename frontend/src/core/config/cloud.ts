/**
 * Cloud data mode — feature flag for Firebase-backed repositories.
 * Default: mock/local store (v0.9 alpha safe).
 */

import { isFirebaseConfigured } from './firebase';

function parseBool(value: string | undefined): boolean {
  return value === 'true' || value === '1';
}

const rawUseCloud =
  process.env.EXPO_PUBLIC_USE_CLOUD_DATA ?? process.env.USE_CLOUD_DATA;

/** When true AND Firebase is configured, repositories may use cloud adapters. */
export const USE_CLOUD_DATA = parseBool(rawUseCloud);

export type DataMode = 'mock' | 'cloud';

export function getDataMode(): DataMode {
  if (USE_CLOUD_DATA && isFirebaseConfigured()) return 'cloud';
  return 'mock';
}

export function isCloudDataEnabled(): boolean {
  return getDataMode() === 'cloud';
}

export const cloudConfig = {
  useCloudData: USE_CLOUD_DATA,
  getDataMode,
  isCloudDataEnabled,
  isFirebaseConfigured,
};

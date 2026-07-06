/**
 * Cloud readiness diagnostics for settings UI.
 */

import { FIREBASE_ENV_KEYS, firebaseEnv, isFirebaseConfigured } from '@/src/core/config/firebase';
import { USE_CLOUD_DATA, getDataMode, type DataMode } from '@/src/core/config/cloud';

export interface FirebaseEnvCheck {
  key: string;
  envVar: string;
  configured: boolean;
}

export function getFirebaseEnvChecks(): FirebaseEnvCheck[] {
  return (Object.entries(FIREBASE_ENV_KEYS) as [string, string][]).map(([key, envVar]) => ({
    key,
    envVar,
    configured: Boolean(firebaseEnv[key as keyof typeof firebaseEnv]),
  }));
}

export interface CloudReadinessSnapshot {
  firebaseConfigured: boolean;
  useCloudDataFlag: boolean;
  dataMode: DataMode;
  requiredKeysMissing: string[];
}

export function getCloudReadinessSnapshot(): CloudReadinessSnapshot {
  const checks = getFirebaseEnvChecks();
  const required = checks.filter((c) => c.key !== 'measurementId' && !c.configured);

  return {
    firebaseConfigured: isFirebaseConfigured(),
    useCloudDataFlag: USE_CLOUD_DATA,
    dataMode: getDataMode(),
    requiredKeysMissing: required.map((c) => c.envVar),
  };
}

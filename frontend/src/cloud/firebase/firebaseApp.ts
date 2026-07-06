/**
 * Firebase app singleton — lazy init when configured.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';

import { getFirebaseClientConfig, isFirebaseConfigured } from './config';

let cachedApp: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;

  if (cachedApp) return cachedApp;

  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = getApp();
    return cachedApp;
  }

  const config = getFirebaseClientConfig();
  if (!config) return null;

  cachedApp = initializeApp(config);
  return cachedApp;
}

export function isFirebaseAppReady(): boolean {
  return getFirebaseApp() !== null;
}

/**
 * Cloud Firestore accessor — returns null when not configured.
 */

import { getFirestore, type Firestore } from 'firebase/firestore';

import { getFirebaseApp } from './firebaseApp';

let cachedDb: Firestore | null | undefined;

export function getCloudFirestore(): Firestore | null {
  if (cachedDb !== undefined) return cachedDb;

  const app = getFirebaseApp();
  if (!app) {
    cachedDb = null;
    return null;
  }

  cachedDb = getFirestore(app);
  return cachedDb;
}

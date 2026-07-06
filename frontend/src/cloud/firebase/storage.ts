/**
 * Firebase Storage accessor — returns null when not configured.
 */

import { getStorage, type FirebaseStorage } from 'firebase/storage';

import { getFirebaseApp } from './firebaseApp';

let cachedStorage: FirebaseStorage | null | undefined;

export function getCloudStorage(): FirebaseStorage | null {
  if (cachedStorage !== undefined) return cachedStorage;

  const app = getFirebaseApp();
  if (!app) {
    cachedStorage = null;
    return null;
  }

  cachedStorage = getStorage(app);
  return cachedStorage;
}

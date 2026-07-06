/**
 * Firebase Auth accessor — returns null when not configured.
 */

import { getAuth, type Auth } from 'firebase/auth';

import { getFirebaseApp } from './firebaseApp';

let cachedAuth: Auth | null | undefined;

export function getFirebaseAuth(): Auth | null {
  if (cachedAuth !== undefined) return cachedAuth;

  const app = getFirebaseApp();
  if (!app) {
    cachedAuth = null;
    return null;
  }

  cachedAuth = getAuth(app);
  return cachedAuth;
}

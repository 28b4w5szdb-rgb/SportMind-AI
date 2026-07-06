/**
 * Firebase Auth — web persistence via SDK defaults (localStorage / IndexedDB).
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

  try {
    cachedAuth = getAuth(app);
  } catch {
    cachedAuth = null;
  }

  return cachedAuth;
}

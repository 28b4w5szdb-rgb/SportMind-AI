/**
 * Firebase Auth — native persistence via AsyncStorage (iOS / Android).
 * Metro resolves auth.web.ts on web.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';

import { getFirebaseApp } from './firebaseApp';

let cachedAuth: Auth | null | undefined;

function createNativePersistence(): unknown | undefined {
  try {
    const authModule = require('firebase/auth') as {
      getReactNativePersistence?: (storage: typeof AsyncStorage) => unknown;
    };
    return authModule.getReactNativePersistence?.(AsyncStorage);
  } catch {
    return undefined;
  }
}

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
    try {
      const persistence = createNativePersistence();
      cachedAuth = persistence
        ? initializeAuth(app, { persistence: persistence as never })
        : initializeAuth(app);
    } catch {
      cachedAuth = null;
    }
  }

  return cachedAuth;
}

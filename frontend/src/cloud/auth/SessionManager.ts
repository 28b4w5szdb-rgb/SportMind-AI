/**
 * Firebase session lifecycle — refresh, reload, and resolve current user.
 */

import {
  onIdTokenChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

import { getFirebaseAuth } from '@/src/cloud/firebase/auth';
import type { AuthUser } from './types';
import { resolveAuthUserWithProfile } from './userMapper';

export class SessionManager {
  /** Returns mapped auth user or null when signed out / unavailable. */
  static async getCurrentUser(): Promise<AuthUser | null> {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return null;
    return resolveAuthUserWithProfile(auth.currentUser);
  }

  /** Reloads Firebase user record and merges Firestore profile when present. */
  static async reloadUser(): Promise<AuthUser | null> {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return null;

    try {
      await auth.currentUser.reload();
      return resolveAuthUserWithProfile(auth.currentUser);
    } catch {
      return null;
    }
  }

  /** Forces token refresh; returns updated user or null. */
  static async refreshSession(): Promise<AuthUser | null> {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return null;

    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      return resolveAuthUserWithProfile(auth.currentUser);
    } catch {
      return null;
    }
  }

  /** True when no active user or the ID token has expired. */
  static async isSessionExpired(): Promise<boolean> {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return true;

    try {
      const tokenResult = await auth.currentUser.getIdTokenResult();
      const expiresAt = new Date(tokenResult.expirationTime).getTime();
      return Date.now() >= expiresAt;
    } catch {
      return true;
    }
  }

  /** Subscribe to ID token changes (session refresh / sign-out). */
  static onSessionChange(callback: (user: AuthUser | null) => void): () => void {
    const auth = getFirebaseAuth();
    if (!auth) {
      callback(null);
      return () => undefined;
    }

    return onIdTokenChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      void resolveAuthUserWithProfile(firebaseUser)
        .then(callback)
        .catch(() => callback(null));
    });
  }
}

/**
 * Firebase session lifecycle — refresh and resolve current user.
 */

import {
  onIdTokenChanged,
  type User as FirebaseUser,
} from 'firebase/auth';

import { getFirebaseAuth } from '@/src/cloud/firebase/auth';
import type { AuthUser } from './types';
import { mapFirebaseUserToAuthUser } from './userMapper';

export class SessionManager {
  /** Returns mapped auth user or null when signed out / unavailable. */
  static async getCurrentUser(): Promise<AuthUser | null> {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return null;
    return mapFirebaseUserToAuthUser(auth.currentUser);
  }

  /** Forces token refresh; returns updated user or null. */
  static async refreshSession(): Promise<AuthUser | null> {
    const auth = getFirebaseAuth();
    if (!auth?.currentUser) return null;

    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      return mapFirebaseUserToAuthUser(auth.currentUser);
    } catch {
      return null;
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
      callback(firebaseUser ? mapFirebaseUserToAuthUser(firebaseUser) : null);
    });
  }
}

/**
 * Firebase auth state subscription wrapper.
 */

import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';

import { getFirebaseAuth } from '@/src/cloud/firebase/auth';
import type { AuthUser } from './types';
import { mapFirebaseUserToAuthUser, resolveAuthUserWithProfile } from './userMapper';

export type AuthStateCallback = (user: AuthUser | null) => void;

export class AuthStateListener {
  private unsubscribe: (() => void) | null = null;

  start(callback: AuthStateCallback): () => void {
    this.stop();

    const auth = getFirebaseAuth();
    if (!auth) {
      callback(null);
      return () => undefined;
    }

    this.unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (!firebaseUser) {
        callback(null);
        return;
      }

      void resolveAuthUserWithProfile(firebaseUser)
        .then(callback)
        .catch(() => callback(mapFirebaseUserToAuthUser(firebaseUser)));
    });

    return () => this.stop();
  }

  stop(): void {
    this.unsubscribe?.();
    this.unsubscribe = null;
  }
}

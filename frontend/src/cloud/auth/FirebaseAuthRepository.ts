import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';

import { getFirebaseAuth } from '@/src/cloud/firebase/auth';
import type { AuthRepository } from './AuthRepository';
import type { AuthUser } from './types';
import { AuthStateListener } from './AuthStateListener';
import { SessionManager } from './SessionManager';
import { mapFirebaseUserToAuthUser } from './userMapper';

function requireAuth() {
  const auth = getFirebaseAuth();
  if (!auth) {
    throw new Error('firebase_not_configured');
  }
  return auth;
}

export class FirebaseAuthRepository implements AuthRepository {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const auth = requireAuth();
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return mapFirebaseUserToAuthUser(credential.user);
  }

  async signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
    const auth = requireAuth();
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

    if (displayName.trim()) {
      await updateProfile(credential.user, { displayName: displayName.trim() });
    }

    try {
      await sendEmailVerification(credential.user);
    } catch {
      // Non-fatal — account created
    }

    await credential.user.reload();
    return mapFirebaseUserToAuthUser(auth.currentUser ?? credential.user);
  }

  async signOut(): Promise<void> {
    const auth = requireAuth();
    await firebaseSignOut(auth);
  }

  async resetPassword(email: string): Promise<void> {
    const auth = requireAuth();
    await sendPasswordResetEmail(auth, email.trim());
  }

  async sendVerificationEmail(): Promise<void> {
    const auth = requireAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('auth/no-current-user');
    await sendEmailVerification(user);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    return SessionManager.getCurrentUser();
  }

  async refreshSession(): Promise<AuthUser | null> {
    return SessionManager.refreshSession();
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    const listener = new AuthStateListener();
    return listener.start(callback);
  }
}

export function createFirebaseAuthRepository(): FirebaseAuthRepository {
  return new FirebaseAuthRepository();
}

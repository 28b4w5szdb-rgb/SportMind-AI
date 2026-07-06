import type { UserProfile, UserProfileInput } from '@/src/cloud/firestore/models';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthRepository {
  /** Returns current authenticated user id, or null. */
  getCurrentUserId(): Promise<string | null>;

  /** Email/password sign-in (Firebase Auth). */
  signInWithEmail(credentials: AuthCredentials): Promise<string>;

  /** Create account with email/password. */
  signUpWithEmail(credentials: AuthCredentials, profile: Pick<UserProfileInput, 'full_name'>): Promise<string>;

  signOut(): Promise<void>;

  /** Fetch Firestore user profile for uid. */
  getUserProfile(uid: string): Promise<UserProfile | null>;

  /** Upsert user profile document. */
  upsertUserProfile(uid: string, patch: Partial<UserProfileInput>): Promise<UserProfile>;

  /** Subscribe to auth state; returns unsubscribe. */
  onAuthStateChanged(callback: (uid: string | null) => void): () => void;
}

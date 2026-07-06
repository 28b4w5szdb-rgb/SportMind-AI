import type { User as FirebaseUser } from 'firebase/auth';

import type { ProductionUserProfile } from './UserProfile';
import { UserProfileService } from './UserProfileService';
import type { AuthUser } from './types';

export function buildProductionProfile(fbUser: FirebaseUser): ProductionUserProfile {
  const now = new Date().toISOString();
  return {
    uid: fbUser.uid,
    email: fbUser.email ?? '',
    displayName: fbUser.displayName ?? fbUser.email?.split('@')[0] ?? '',
    photoURL: fbUser.photoURL,
    organizationId: null,
    role: 'coach',
    language: 'en',
    createdAt: fbUser.metadata.creationTime ?? now,
    updatedAt: now,
    lastLogin: fbUser.metadata.lastSignInTime ?? now,
    isEmailVerified: fbUser.emailVerified,
    status: fbUser.emailVerified ? 'active' : 'pending',
  };
}

export function mapFirebaseUserToAuthUser(fbUser: FirebaseUser): AuthUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    isEmailVerified: fbUser.emailVerified,
    profile: buildProductionProfile(fbUser),
  };
}

/** Merges Firestore profile when available; falls back to Auth-derived profile. */
export async function resolveAuthUserWithProfile(fbUser: FirebaseUser): Promise<AuthUser> {
  const base = mapFirebaseUserToAuthUser(fbUser);

  try {
    const stored = await UserProfileService.getProfile(fbUser.uid);
    if (stored) {
      return { ...base, profile: stored };
    }
  } catch {
    // Keep auth-derived profile
  }

  return base;
}

/**
 * Firestore user profile lifecycle for `users/{uid}`.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type DocumentData,
} from 'firebase/firestore';
import type { User as FirebaseUser } from 'firebase/auth';

import { getCloudFirestore } from '@/src/cloud/firebase/firestore';
import type { AppLanguage } from '@/src/cloud/firestore/models/common';

import { ProfileError } from './profileErrors';
import type { ProductionUserProfile, UserAccountStatus } from './UserProfile';

const USERS_COLLECTION = 'users';

function nowIso(): string {
  return new Date().toISOString();
}

function resolveDisplayName(fbUser: FirebaseUser, displayName?: string): string {
  const trimmed = displayName?.trim();
  if (trimmed) return trimmed;
  if (fbUser.displayName?.trim()) return fbUser.displayName.trim();
  return fbUser.email?.split('@')[0] ?? '';
}

function resolveAccountStatus(isEmailVerified: boolean): UserAccountStatus {
  return isEmailVerified ? 'active' : 'pending';
}

function parseProfileData(uid: string, data: DocumentData): ProductionUserProfile | null {
  if (typeof data.email !== 'string') return null;

  return {
    uid,
    email: data.email,
    displayName: typeof data.displayName === 'string' ? data.displayName : '',
    photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
    organizationId: typeof data.organizationId === 'string' ? data.organizationId : null,
    role: (data.role as ProductionUserProfile['role']) ?? 'coach',
    language: (data.language as AppLanguage) ?? 'en',
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : nowIso(),
    updatedAt: typeof data.updatedAt === 'string' ? data.updatedAt : nowIso(),
    lastLogin: typeof data.lastLogin === 'string' ? data.lastLogin : null,
    isEmailVerified: Boolean(data.isEmailVerified),
    status: (data.status as UserAccountStatus) ?? 'pending',
  };
}

function buildNewProfile(fbUser: FirebaseUser, displayName: string): ProductionUserProfile {
  const now = nowIso();
  return {
    uid: fbUser.uid,
    email: fbUser.email ?? '',
    displayName: resolveDisplayName(fbUser, displayName),
    photoURL: fbUser.photoURL,
    organizationId: null,
    role: 'coach',
    language: 'en',
    createdAt: now,
    updatedAt: now,
    lastLogin: now,
    isEmailVerified: fbUser.emailVerified,
    status: resolveAccountStatus(fbUser.emailVerified),
  };
}

export class UserProfileService {
  /** Reads profile document; returns null when missing or Firestore unavailable. */
  static async getProfile(uid: string): Promise<ProductionUserProfile | null> {
    const db = getCloudFirestore();
    if (!db) return null;

    try {
      const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
      if (!snap.exists()) return null;
      return parseProfileData(uid, snap.data());
    } catch {
      return null;
    }
  }

  /**
   * Creates profile on sign-up. Existing documents are never overwritten —
   * only lastLogin, updatedAt, and isEmailVerified are refreshed.
   */
  static async ensureProfileOnSignUp(
    fbUser: FirebaseUser,
    displayName: string
  ): Promise<ProductionUserProfile> {
    const db = getCloudFirestore();
    if (!db) {
      throw new ProfileError('auth.errors.profileCreateFailed');
    }

    const ref = doc(db, USERS_COLLECTION, fbUser.uid);

    try {
      const existing = await getDoc(ref);
      if (existing.exists()) {
        await UserProfileService.touchLogin(fbUser.uid, fbUser.emailVerified);
        const profile = await UserProfileService.getProfile(fbUser.uid);
        if (profile) return profile;
        const parsed = parseProfileData(fbUser.uid, existing.data());
        if (parsed) return parsed;
        throw new ProfileError('auth.errors.profileDuplicate');
      }

      const profile = buildNewProfile(fbUser, displayName);
      await setDoc(ref, profile);
      return profile;
    } catch (err) {
      if (err instanceof ProfileError) throw err;
      throw new ProfileError('auth.errors.profileCreateFailed', err);
    }
  }

  /** Updates login metadata without overwriting other profile fields. */
  static async touchLogin(uid: string, isEmailVerified: boolean): Promise<void> {
    const db = getCloudFirestore();
    if (!db) return;

    const ref = doc(db, USERS_COLLECTION, uid);

    try {
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const now = nowIso();
      await updateDoc(ref, {
        lastLogin: now,
        updatedAt: now,
        isEmailVerified,
      });
    } catch {
      // Non-fatal — auth session remains valid
    }
  }
}

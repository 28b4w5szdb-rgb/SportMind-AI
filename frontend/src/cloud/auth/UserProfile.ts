import type { AppLanguage, UserRole } from '@/src/cloud/firestore/models/common';

/**
 * Production user profile — Firebase Auth + Firestore alignment.
 * Stored at `users/{uid}` when cloud data is enabled.
 */
export interface ProductionUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  organizationId: string | null;
  role: UserRole;
  language: AppLanguage;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  isEmailVerified: boolean;
}

export type ProductionUserProfileInput = Omit<
  ProductionUserProfile,
  'uid' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'isEmailVerified'
> & {
  uid?: string;
};

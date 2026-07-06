import type { AppLanguage, UserRole } from '@/src/cloud/firestore/models/common';

export type UserAccountStatus = 'active' | 'pending' | 'disabled';

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
  status: UserAccountStatus;
}

export type ProductionUserProfileInput = Omit<
  ProductionUserProfile,
  'uid' | 'createdAt' | 'updatedAt' | 'lastLogin' | 'isEmailVerified' | 'status'
> & {
  uid?: string;
};

export interface CloudProfileDocumentStatus {
  loading: boolean;
  exists: boolean;
  lastLogin: string | null;
  accountCreated: string | null;
  errorKey: string | null;
}

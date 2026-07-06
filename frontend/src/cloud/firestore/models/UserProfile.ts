import type { AppLanguage, AppThemePreference, CloudDocumentMeta, UserRole } from './common';

/** Firebase Auth user profile stored in Firestore `users/{uid}`. */
export interface UserProfile extends CloudDocumentMeta {
  uid: string;
  email: string;
  full_name: string;
  language: AppLanguage;
  theme: AppThemePreference;
  avatar_url?: string;
  organization_id?: string;
  role: UserRole;
  is_onboarded: boolean;
  notification_settings?: Record<string, unknown>;
}

export type UserProfileInput = Omit<UserProfile, keyof CloudDocumentMeta | 'uid'> & {
  uid?: string;
};

import type { ProductionUserProfile } from './UserProfile';

/** Minimal authenticated user surface — never expose tokens in UI. */
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isEmailVerified: boolean;
  profile: ProductionUserProfile | null;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignUpPayload extends AuthCredentials {
  displayName: string;
}

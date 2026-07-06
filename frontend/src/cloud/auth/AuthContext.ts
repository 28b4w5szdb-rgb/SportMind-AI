/**
 * Unified authentication context — Supabase, Firebase, or dev bypass.
 */

import type { Session, User } from '@supabase/supabase-js';

import type { Profile } from '@/src/types/supabase';
import type { AuthBackend } from './config';
import type { AuthUser } from './types';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  initializing: boolean;
  actionLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isConfigured: boolean;
  isDevBypass: boolean;
  authBackend: AuthBackend;
  /** Present when Firebase auth is active — not for UI display of uid/token. */
  cloudAuthUser?: AuthUser | null;
  errorKey: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ needsVerification: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  resendVerificationEmail: (email?: string) => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

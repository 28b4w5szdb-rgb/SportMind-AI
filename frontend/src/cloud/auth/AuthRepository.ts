import type { AuthUser } from './types';

export interface AuthRepository {
  signIn(email: string, password: string): Promise<AuthUser>;
  signUp(email: string, password: string, displayName: string): Promise<AuthUser>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  sendVerificationEmail(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  refreshSession(): Promise<AuthUser | null>;
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;
}

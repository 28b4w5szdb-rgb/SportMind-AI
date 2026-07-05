/**
 * Global authentication context backed by Supabase Auth.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';

import { isSupabaseConfigured } from '@/src/core/config/supabase';
import { AUTH_ROUTES } from '@/src/core/constants/routes';
import * as authService from '@/src/services/supabase/auth.service';
import * as profileService from '@/src/services/supabase/profile.service';
import type { Profile } from '@/src/types/supabase';
import { getAuthErrorKey } from '@/src/utils/auth/errors';

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** True while restoring persisted session on cold start. */
  initializing: boolean;
  /** True during sign-in, sign-up, sign-out, etc. */
  actionLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  isConfigured: boolean;
  /** i18n key under auth.errors.* */
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

const AuthContext = createContext<AuthContextValue | null>(null);

async function loadProfile(userId: string): Promise<Profile | null> {
  try {
    return await profileService.getProfile(userId);
  } catch {
    return null;
  }
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [initializing, setInitializing] = useState(isSupabaseConfigured);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const user = session?.user ?? null;
  const isAuthenticated = Boolean(session?.user);
  const isEmailVerified = Boolean(user?.email_confirmed_at);

  const refreshProfile = useCallback(async () => {
    if (!user?.id || !isSupabaseConfigured) {
      setProfile(null);
      return;
    }
    const nextProfile = await loadProfile(user.id);
    setProfile(nextProfile);
  }, [user?.id]);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setInitializing(false);
      return;
    }

    let mounted = true;

    authService
      .getSession()
      .then(async (currentSession) => {
        if (!mounted) return;
        setSession(currentSession);
        if (currentSession?.user?.id) {
          const p = await loadProfile(currentSession.user.id);
          if (mounted) setProfile(p);
        }
      })
      .catch((err) => {
        if (mounted) setErrorKey(getAuthErrorKey(err));
      })
      .finally(() => {
        if (mounted) setInitializing(false);
      });

    const { data } = authService.onAuthStateChange(async (event, nextSession) => {
      if (!mounted) return;

      setSession(nextSession);

      if (nextSession?.user?.id) {
        const p = await loadProfile(nextSession.user.id);
        if (mounted) setProfile(p);
      } else {
        setProfile(null);
      }

      if (event === 'PASSWORD_RECOVERY') {
        router.replace(AUTH_ROUTES.resetPassword);
      }
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [router]);

  const runAction = useCallback(async (action: () => Promise<void>) => {
    setActionLoading(true);
    setErrorKey(null);
    try {
      await action();
    } catch (err) {
      setErrorKey(getAuthErrorKey(err));
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await runAction(async () => {
        const { session: nextSession } = await authService.signIn(email.trim(), password);
        if (!nextSession) {
          throw new Error('email_not_confirmed');
        }
      });
    },
    [runAction]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      let needsVerification = false;

      await runAction(async () => {
        const data = await authService.signUp(email.trim(), password, {
          full_name: fullName.trim(),
        });

        needsVerification = Boolean(data.user && !data.session);
      });

      return { needsVerification };
    },
    [runAction]
  );

  const signOut = useCallback(async () => {
    await runAction(async () => {
      await authService.signOut();
      setProfile(null);
    });
  }, [runAction]);

  const resetPassword = useCallback(
    async (email: string) => {
      await runAction(async () => {
        await authService.resetPasswordForEmail(email.trim());
      });
    },
    [runAction]
  );

  const updatePassword = useCallback(
    async (password: string) => {
      await runAction(async () => {
        await authService.updatePassword(password);
      });
    },
    [runAction]
  );

  const resendVerificationEmail = useCallback(
    async (email?: string) => {
      const targetEmail = email?.trim() || user?.email;
      if (!targetEmail) {
        setErrorKey('auth.errors.generic');
        return;
      }

      await runAction(async () => {
        await authService.resendVerificationEmail(targetEmail);
      });
    },
    [runAction, user?.email]
  );

  const clearError = useCallback(() => setErrorKey(null), []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      profile,
      initializing,
      actionLoading,
      isAuthenticated,
      isEmailVerified,
      isConfigured: isSupabaseConfigured,
      errorKey,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      resendVerificationEmail,
      clearError,
      refreshProfile,
    }),
    [
      session,
      user,
      profile,
      initializing,
      actionLoading,
      isAuthenticated,
      isEmailVerified,
      errorKey,
      signIn,
      signUp,
      signOut,
      resetPassword,
      updatePassword,
      resendVerificationEmail,
      clearError,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth() must be used inside <AuthProvider>.');
  }
  return ctx;
}

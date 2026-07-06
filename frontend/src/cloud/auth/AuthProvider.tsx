/**
 * Global authentication — Supabase (legacy), Firebase (cloud), or dev bypass.
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';

import { isSupabaseConfigured } from '@/src/core/config/supabase';
import { DEV_BYPASS_AUTH } from '@/src/core/config/dev';
import { AUTH_ROUTES } from '@/src/core/constants/routes';
import { createMockDevSession, MOCK_DEV_PROFILE } from '@/src/data/mock/auth';
import * as authService from '@/src/services/supabase/auth.service';
import * as profileService from '@/src/services/supabase/profile.service';
import type { Profile } from '@/src/types/supabase';
import { getAuthErrorKey } from '@/src/utils/auth/errors';

import { AuthContext, type AuthContextValue } from './useAuth';
import { shouldUseFirebaseAuth, type AuthBackend } from './config';
import { FirebaseAuthProvider } from './FirebaseAuthProvider';
import { FirebaseAuthBridge } from './FirebaseAuthBridge';

async function loadProfile(userId: string): Promise<Profile | null> {
  try {
    return await profileService.getProfile(userId);
  } catch {
    return null;
  }
}

function SupabaseAuthProviderInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(
    DEV_BYPASS_AUTH ? createMockDevSession() : null
  );
  const [profile, setProfile] = useState<Profile | null>(
    DEV_BYPASS_AUTH ? MOCK_DEV_PROFILE : null
  );
  const [initializing, setInitializing] = useState(
    DEV_BYPASS_AUTH ? false : isSupabaseConfigured
  );
  const [actionLoading, setActionLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const user = session?.user ?? null;
  const isAuthenticated = Boolean(session?.user);
  const isEmailVerified = Boolean(user?.email_confirmed_at);

  const authBackend: AuthBackend = DEV_BYPASS_AUTH ? 'dev-bypass' : 'supabase';

  const refreshProfile = useCallback(async () => {
    if (!user?.id || !isSupabaseConfigured) {
      setProfile(null);
      return;
    }
    const nextProfile = await loadProfile(user.id);
    setProfile(nextProfile);
  }, [user?.id]);

  useEffect(() => {
    if (DEV_BYPASS_AUTH) return;

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
      if (DEV_BYPASS_AUTH) {
        setSession(null);
        setProfile(null);
        return;
      }
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
      isConfigured: DEV_BYPASS_AUTH ? true : isSupabaseConfigured,
      isDevBypass: DEV_BYPASS_AUTH,
      authBackend,
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
      authBackend,
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

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  if (shouldUseFirebaseAuth()) {
    return (
      <FirebaseAuthProvider>
        <FirebaseAuthBridge>{children}</FirebaseAuthBridge>
      </FirebaseAuthProvider>
    );
  }

  return <SupabaseAuthProviderInner>{children}</SupabaseAuthProviderInner>;
}

export { useAuth } from './useAuth';

/**
 * Firebase Auth React context — active when cloud auth mode is enabled.
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { createFirebaseAuthRepository } from './FirebaseAuthRepository';
import { SessionManager } from './SessionManager';
import { getFirebaseAuthErrorKey } from './errors';
import type { AuthUser } from './types';

export interface FirebaseAuthContextValue {
  authUser: AuthUser | null;
  initializing: boolean;
  actionLoading: boolean;
  errorKey: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ needsVerification: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  clearError: () => void;
  refreshSession: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null);

export interface FirebaseAuthProviderProps {
  children: React.ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const repositoryRef = useRef(createFirebaseAuthRepository());
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const repo = repositoryRef.current;

    repo
      .refreshSession()
      .then((user) => {
        if (mounted) setAuthUser(user);
      })
      .catch(() => {
        if (mounted) setAuthUser(null);
      })
      .finally(() => {
        if (mounted) setInitializing(false);
      });

    const unsubscribe = repo.onAuthStateChanged((user) => {
      if (mounted) setAuthUser(user);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const runAction = useCallback(async (action: () => Promise<void>) => {
    setActionLoading(true);
    setErrorKey(null);
    try {
      await action();
    } catch (err) {
      const key =
        err instanceof Error && err.message === 'firebase_not_configured'
          ? 'auth.errors.firebaseNotConfigured'
          : getFirebaseAuthErrorKey(err);
      setErrorKey(key);
      throw err;
    } finally {
      setActionLoading(false);
    }
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await runAction(async () => {
        const user = await repositoryRef.current.signIn(email, password);
        setAuthUser(user);
      });
    },
    [runAction]
  );

  const signUp = useCallback(
    async (email: string, password: string, displayName: string) => {
      let needsVerification = false;
      await runAction(async () => {
        const user = await repositoryRef.current.signUp(email, password, displayName);
        setAuthUser(user);
        needsVerification = !user.isEmailVerified;
      });
      return { needsVerification };
    },
    [runAction]
  );

  const signOut = useCallback(async () => {
    await runAction(async () => {
      await repositoryRef.current.signOut();
      setAuthUser(null);
    });
  }, [runAction]);

  const resetPassword = useCallback(
    async (email: string) => {
      await runAction(async () => {
        await repositoryRef.current.resetPassword(email);
      });
    },
    [runAction]
  );

  const resendVerificationEmail = useCallback(async () => {
    await runAction(async () => {
      await repositoryRef.current.sendVerificationEmail();
    });
  }, [runAction]);

  const refreshSession = useCallback(async () => {
    const user = await SessionManager.refreshSession();
    setAuthUser(user);
  }, []);

  const clearError = useCallback(() => setErrorKey(null), []);

  const value = useMemo<FirebaseAuthContextValue>(
    () => ({
      authUser,
      initializing,
      actionLoading,
      errorKey,
      isAuthenticated: Boolean(authUser),
      isEmailVerified: Boolean(authUser?.isEmailVerified),
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerificationEmail,
      clearError,
      refreshSession,
    }),
    [
      authUser,
      initializing,
      actionLoading,
      errorKey,
      signIn,
      signUp,
      signOut,
      resetPassword,
      resendVerificationEmail,
      clearError,
      refreshSession,
    ]
  );

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
}

export function useFirebaseAuthContext(): FirebaseAuthContextValue {
  const ctx = useContext(FirebaseAuthContext);
  if (!ctx) {
    throw new Error('useFirebaseAuthContext() must be used inside <FirebaseAuthProvider>.');
  }
  return ctx;
}

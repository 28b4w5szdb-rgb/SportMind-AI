/**
 * Bridges FirebaseAuthProvider state to the legacy AuthContextValue API.
 */

import React, { useMemo } from 'react';

import { AuthContext, type AuthContextValue } from './useAuth';
import { authUserToCompatProfile, authUserToCompatSession, authUserToCompatUser } from './compatAdapter';
import { useFirebaseAuthContext } from './FirebaseAuthProvider';

interface FirebaseAuthBridgeProps {
  children: React.ReactNode;
}

export function FirebaseAuthBridge({ children }: FirebaseAuthBridgeProps) {
  const firebase = useFirebaseAuthContext();

  const value = useMemo<AuthContextValue>(() => {
    const session = firebase.authUser ? authUserToCompatSession(firebase.authUser) : null;
    const user = firebase.authUser ? authUserToCompatUser(firebase.authUser) : null;
    const profile = firebase.authUser ? authUserToCompatProfile(firebase.authUser) : null;

    return {
      session,
      user,
      profile,
      initializing: firebase.initializing,
      actionLoading: firebase.actionLoading,
      isAuthenticated: firebase.isAuthenticated,
      isEmailVerified: firebase.isEmailVerified,
      isConfigured: true,
      isDevBypass: false,
      authBackend: 'firebase',
      cloudAuthUser: firebase.authUser,
      errorKey: firebase.errorKey,
      signIn: firebase.signIn,
      signUp: firebase.signUp,
      signOut: firebase.signOut,
      resetPassword: firebase.resetPassword,
      updatePassword: async () => {
        throw new Error('Use password reset email flow for Firebase accounts.');
      },
      resendVerificationEmail: async (email?: string) => {
        void email;
        await firebase.resendVerificationEmail();
      },
      clearError: firebase.clearError,
      refreshProfile: firebase.refreshSession,
    };
  }, [firebase]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

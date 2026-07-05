/**
 * Redirects unauthenticated users to auth and authenticated users away from auth.
 */

import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { LoadingSpinner } from '@/src/components/common/LoadingSpinner';
import { AUTH_ROUTES, APP_ROUTES } from '@/src/core/constants/routes';
import { useAuth } from '@/src/providers/AuthProvider';

export interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { initializing, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (initializing) return;

    const segmentRoot = segments[0] as string | undefined;
    const inAuthGroup = segmentRoot === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace(AUTH_ROUTES.signIn);
      return;
    }

    if (isAuthenticated && inAuthGroup) {
      router.replace(APP_ROUTES.dashboard);
    }
  }, [initializing, isAuthenticated, segments, router]);

  if (initializing) {
    return <LoadingSpinner fullScreen message={t('auth.restoringSession')} />;
  }

  return <>{children}</>;
}

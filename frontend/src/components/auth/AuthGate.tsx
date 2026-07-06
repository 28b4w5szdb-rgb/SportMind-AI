/**
 * Redirects unauthenticated users to auth and authenticated users away from auth.
 * Onboarding routes are never blocked.
 */

import React, { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { LoadingSpinner } from '@/src/components/common/LoadingSpinner';
import { AUTH_ROUTES, APP_ROUTES } from '@/src/core/constants/routes';
import { DEV_BYPASS_AUTH } from '@/src/core/config/dev';
import { useAuth } from '@/src/cloud/auth/useAuth';

export interface AuthGateProps {
  children: React.ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
  const { initializing, isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (DEV_BYPASS_AUTH || initializing) return;

    const segmentRoot = segments[0] as string | undefined;
    const inAuthGroup = segmentRoot === '(auth)';
    const inOnboarding = segmentRoot === 'onboarding';

    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
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

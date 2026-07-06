/**
 * SportMind AI - Entry Point
 * Onboarding → auth-aware redirect to main app or sign-in.
 */

import { Redirect } from 'expo-router';

import { LoadingSpinner } from '@/src/components/common/LoadingSpinner';
import { AUTH_ROUTES, APP_ROUTES, ONBOARDING_ROUTES } from '@/src/core/constants/routes';
import { DEV_BYPASS_AUTH } from '@/src/core/config/dev';
import { useAuth } from '@/src/providers/AuthProvider';
import { useOnboarding } from '@/src/hooks/useOnboarding';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { initializing, isAuthenticated } = useAuth();
  const { ready: onboardingReady, complete: onboardingComplete } = useOnboarding();
  const { t } = useTranslation();

  if (!onboardingReady || initializing) {
    return <LoadingSpinner fullScreen message={t('auth.restoringSession')} />;
  }

  if (!onboardingComplete) {
    return <Redirect href={ONBOARDING_ROUTES.index} />;
  }

  if (DEV_BYPASS_AUTH) {
    return <Redirect href={APP_ROUTES.dashboard} />;
  }

  if (isAuthenticated) {
    return <Redirect href={APP_ROUTES.dashboard} />;
  }

  return <Redirect href={AUTH_ROUTES.signIn} />;
}

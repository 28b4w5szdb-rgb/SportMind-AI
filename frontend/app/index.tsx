/**
 * SportMind AI - Entry Point
 * Auth-aware redirect to main app or sign-in.
 */

import { Redirect } from 'expo-router';

import { LoadingSpinner } from '@/src/components/common/LoadingSpinner';
import { AUTH_ROUTES, APP_ROUTES } from '@/src/core/constants/routes';
import { DEV_BYPASS_AUTH } from '@/src/core/config/dev';
import { useAuth } from '@/src/providers/AuthProvider';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { initializing, isAuthenticated } = useAuth();
  const { t } = useTranslation();

  if (DEV_BYPASS_AUTH) {
    return <Redirect href={APP_ROUTES.dashboard} />;
  }

  if (initializing) {
    return <LoadingSpinner fullScreen message={t('auth.restoringSession')} />;
  }

  if (isAuthenticated) {
    return <Redirect href={APP_ROUTES.dashboard} />;
  }

  return <Redirect href={AUTH_ROUTES.signIn} />;
}

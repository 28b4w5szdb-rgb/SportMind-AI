import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AuthScreenLayout, AuthErrorBanner, AuthSuccessBanner } from '@/src/components/auth';
import { Button } from '@/src/components/common/Button';
import { useAuth } from '@/src/providers/AuthProvider';
import { AUTH_ROUTES } from '@/src/core/constants/routes';
import { useTheme } from '@/src/core/theme';

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === 'string' ? params.email : '';

  const { resendVerificationEmail, actionLoading, errorKey, clearError, isConfigured } = useAuth();
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    clearError();
    if (!email || !isConfigured) return;

    try {
      await resendVerificationEmail(email);
      setResent(true);
    } catch {
      setResent(false);
    }
  };

  return (
    <AuthScreenLayout
      title={t('auth.verifyEmail.title')}
      subtitle={t('auth.verifyEmail.subtitle', { email: email || t('auth.verifyEmail.yourEmail') })}
    >
      {!isConfigured ? <AuthErrorBanner errorKey="auth.errors.notConfigured" /> : null}
      <AuthErrorBanner errorKey={errorKey} />
      {resent ? <AuthSuccessBanner message={t('auth.verifyEmail.resent')} /> : null}

      <View style={styles.actions}>
        <Button
          title={t('auth.verifyEmail.resend')}
          onPress={handleResend}
          loading={actionLoading}
          variant="outline"
          fullWidth
          disabled={!email}
        />
        <Button
          title={t('auth.verifyEmail.backToSignIn')}
          onPress={() => router.replace(AUTH_ROUTES.signIn)}
          variant="ghost"
          fullWidth
          style={{ marginTop: theme.spacing.sm }}
        />
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  actions: { width: '100%' },
});

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AuthScreenLayout, AuthErrorBanner, AuthSuccessBanner } from '@/src/components/auth';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { useAuth } from '@/src/providers/AuthProvider';
import { AUTH_ROUTES } from '@/src/core/constants/routes';
import { useTheme } from '@/src/core/theme';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { resetPassword, actionLoading, errorKey, clearError, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setEmailError(t('auth.validation.emailRequired'));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(t('auth.validation.emailInvalid'));
      return false;
    }
    setEmailError(undefined);
    return true;
  };

  const handleSubmit = async () => {
    clearError();
    if (!validate() || !isConfigured) return;

    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      setSent(false);
    }
  };

  return (
    <AuthScreenLayout
      title={t('auth.forgotPassword.title')}
      subtitle={t('auth.forgotPassword.subtitle')}
      footer={
        <Button
          title={t('auth.forgotPassword.backToSignIn')}
          onPress={() => router.replace(AUTH_ROUTES.signIn)}
          variant="ghost"
          fullWidth
        />
      }
    >
      {!isConfigured ? <AuthErrorBanner errorKey="auth.errors.notConfigured" /> : null}
      <AuthErrorBanner errorKey={errorKey} />
      {sent ? <AuthSuccessBanner message={t('auth.forgotPassword.emailSent', { email: email.trim() })} /> : null}

      {!sent ? (
        <View style={styles.form}>
          <Input
            label={t('auth.fields.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.placeholders.email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            icon="mail-outline"
            error={emailError}
          />
          <Button
            title={t('auth.forgotPassword.submit')}
            onPress={handleSubmit}
            loading={actionLoading}
            fullWidth
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>
      ) : null}
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: { width: '100%' },
});

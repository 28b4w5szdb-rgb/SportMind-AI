import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AuthScreenLayout, AuthErrorBanner, AuthSuccessBanner } from '@/src/components/auth';
import { Button } from '@/src/components/common/Button';
import { PasswordInput } from '@/src/components/auth/PasswordField';
import { useAuth } from '@/src/providers/AuthProvider';
import { AUTH_ROUTES } from '@/src/core/constants/routes';
import { useTheme } from '@/src/core/theme';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { updatePassword, actionLoading, errorKey, clearError, isConfigured, session } = useAuth();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const next: Record<string, string> = {};
    if (!password) next.password = t('auth.validation.passwordRequired');
    else if (password.length < 8) next.password = t('auth.validation.passwordMin');
    if (password !== confirmPassword) next.confirmPassword = t('auth.validation.passwordMismatch');
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    clearError();
    if (!validate() || !isConfigured) return;

    if (!session) {
      setFieldErrors({ password: t('auth.resetPassword.sessionRequired') });
      return;
    }

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => router.replace(AUTH_ROUTES.signIn), 2000);
    } catch {
      setSuccess(false);
    }
  };

  return (
    <AuthScreenLayout
      title={t('auth.resetPassword.title')}
      subtitle={t('auth.resetPassword.subtitle')}
    >
      {!isConfigured ? <AuthErrorBanner errorKey="auth.errors.notConfigured" /> : null}
      <AuthErrorBanner errorKey={errorKey} />
      {success ? <AuthSuccessBanner message={t('auth.resetPassword.success')} /> : null}

      {!success ? (
        <View style={styles.form}>
          <PasswordInput
            label={t('auth.fields.newPassword')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.placeholders.passwordMin')}
            error={fieldErrors.password}
            autoComplete="password-new"
          />
          <View style={{ height: theme.spacing.md }} />
          <PasswordInput
            label={t('auth.fields.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('auth.placeholders.confirmPassword')}
            error={fieldErrors.confirmPassword}
            autoComplete="password-new"
          />
          <Button
            title={t('auth.resetPassword.submit')}
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

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AuthScreenLayout, AuthErrorBanner } from '@/src/components/auth';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { PasswordInput } from '@/src/components/auth/PasswordField';
import { AUTH_ROUTES, APP_ROUTES } from '@/src/core/constants/routes';
import { useAuth } from '@/src/providers/AuthProvider';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { REGISTER } from '@/constants/testIds/auth';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { textAlign } = useDirection();
  const router = useRouter();
  const { signUp, actionLoading, errorKey, clearError, isConfigured } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = t('auth.validation.nameRequired');
    if (!email.trim()) next.email = t('auth.validation.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = t('auth.validation.emailInvalid');
    }
    if (!password) next.password = t('auth.validation.passwordRequired');
    else if (password.length < 8) next.password = t('auth.validation.passwordMin');
    if (password !== confirmPassword) next.confirmPassword = t('auth.validation.passwordMismatch');
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    clearError();
    if (!validate() || !isConfigured) return;

    try {
      const { needsVerification } = await signUp(email, password, fullName);
      if (needsVerification) {
        router.replace(AUTH_ROUTES.verifyEmail(email.trim()));
      } else {
        router.replace(APP_ROUTES.dashboard);
      }
    } catch {
      // error handled by provider
    }
  };

  return (
    <AuthScreenLayout
      title={t('auth.signUp.title')}
      subtitle={t('auth.signUp.subtitle')}
      footer={
        <View style={styles.footer}>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, textAlign: textAlign('center') }]}>
            {t('auth.signUp.hasAccount')}{' '}
          </Text>
          <Link href={AUTH_ROUTES.signIn} asChild>
            <TouchableOpacity testID={REGISTER.loginLink}>
              <Text style={[theme.typography.body, { color: theme.colors.primary, fontWeight: '600' }]}>
                {t('auth.signUp.signInLink')}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      }
    >
      {!isConfigured ? <AuthErrorBanner errorKey="auth.errors.notConfigured" /> : null}
      <AuthErrorBanner errorKey={errorKey} />

      <View style={styles.form}>
        <Input
          label={t('auth.fields.fullName')}
          value={fullName}
          onChangeText={setFullName}
          placeholder={t('auth.placeholders.fullName')}
          autoComplete="name"
          textContentType="name"
          icon="person-outline"
          error={fieldErrors.fullName}
          testID={REGISTER.nameInput}
        />
        <View style={{ height: theme.spacing.md }} />
        <Input
          label={t('auth.fields.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.placeholders.email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          icon="mail-outline"
          error={fieldErrors.email}
          testID={REGISTER.emailInput}
        />
        <View style={{ height: theme.spacing.md }} />
        <PasswordInput
          label={t('auth.fields.password')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.placeholders.passwordMin')}
          error={fieldErrors.password}
          autoComplete="password-new"
          testID={REGISTER.passwordInput}
        />
        <View style={{ height: theme.spacing.md }} />
        <PasswordInput
          label={t('auth.fields.confirmPassword')}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={t('auth.placeholders.confirmPassword')}
          error={fieldErrors.confirmPassword}
          autoComplete="password-new"
          testID={REGISTER.passwordConfirmInput}
        />
        <Button
          title={t('auth.signUp.submit')}
          onPress={handleSubmit}
          loading={actionLoading}
          fullWidth
          style={{ marginTop: theme.spacing.lg }}
        />
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  form: { width: '100%' },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

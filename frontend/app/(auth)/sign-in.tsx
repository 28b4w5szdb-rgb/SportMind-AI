import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

import {
  AuthScreenLayout,
  AuthErrorBanner,
} from '@/src/components/auth';
import { Button } from '@/src/components/common/Button';
import { Input } from '@/src/components/common/Input';
import { PasswordInput } from '@/src/components/auth/PasswordField';
import { AUTH_ROUTES, APP_ROUTES } from '@/src/core/constants/routes';
import { useAuth } from '@/src/providers/AuthProvider';
import { useTheme } from '@/src/core/theme';
import { useDirection } from '@/src/providers/DirectionProvider';
import { LOGIN } from '@/constants/testIds/auth';

export default function SignInScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { textAlign } = useDirection();
  const router = useRouter();
  const { signIn, actionLoading, errorKey, clearError, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validate = () => {
    const next: typeof fieldErrors = {};
    if (!email.trim()) next.email = t('auth.validation.emailRequired');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = t('auth.validation.emailInvalid');
    }
    if (!password) next.password = t('auth.validation.passwordRequired');
    setFieldErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    clearError();
    if (!validate()) return;

    if (!isConfigured) return;

    try {
      await signIn(email, password);
      router.replace(APP_ROUTES.dashboard);
    } catch {
      // errorKey set by provider
    }
  };

  return (
    <AuthScreenLayout
      title={t('auth.signIn.title')}
      subtitle={t('auth.signIn.subtitle')}
      footer={
        <View style={styles.footer}>
          <Text style={[theme.typography.body, { color: theme.colors.textSecondary, textAlign: textAlign('center') }]}>
            {t('auth.signIn.noAccount')}{' '}
          </Text>
          <Link href={AUTH_ROUTES.signUp} asChild>
            <TouchableOpacity testID={LOGIN.registerLink}>
              <Text style={[theme.typography.body, { color: theme.colors.primary, fontWeight: '600' }]}>
                {t('auth.signIn.createAccount')}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      }
    >
      {!isConfigured ? (
        <AuthErrorBanner errorKey="auth.errors.notConfigured" />
      ) : null}

      <AuthErrorBanner errorKey={errorKey} />

      <View style={styles.form}>
        <Input
          label={t('auth.fields.email')}
          value={email}
          onChangeText={setEmail}
          placeholder={t('auth.placeholders.email')}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          icon="mail-outline"
          error={fieldErrors.email}
          testID={LOGIN.emailInput}
        />

        <View style={{ height: theme.spacing.md }} />

        <PasswordInput
          label={t('auth.fields.password')}
          value={password}
          onChangeText={setPassword}
          placeholder={t('auth.placeholders.password')}
          error={fieldErrors.password}
          testID={LOGIN.passwordInput}
        />

        <TouchableOpacity
          onPress={() => router.push(AUTH_ROUTES.forgotPassword)}
          style={{ alignSelf: 'flex-end', marginTop: theme.spacing.sm }}
          testID={LOGIN.forgotPasswordLink}
        >
          <Text style={[theme.typography.bodySm, { color: theme.colors.primary }]}>
            {t('auth.signIn.forgotPassword')}
          </Text>
        </TouchableOpacity>

        <Button
          title={t('auth.signIn.submit')}
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

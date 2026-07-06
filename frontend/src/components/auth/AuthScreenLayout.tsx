/**
 * Responsive auth screen shell with branding, language toggle, and keyboard handling.
 */

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { BrandLogo } from '@/src/components/brand';
import { LanguageToggle } from '@/src/components/common/LanguageToggle';
import { useTheme, useTypography } from '@/src/core/theme';
import { brandGradients } from '@/src/core/theme/brand';
import { useDirection } from '@/src/providers/DirectionProvider';

export interface AuthScreenLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthScreenLayout({ title, subtitle, children, footer }: AuthScreenLayoutProps) {
  const theme = useTheme();
  const type = useTypography();
  const { textAlign } = useDirection();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const gradient = theme.isDark ? brandGradients.splashDark : brandGradients.splashLight;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={[...gradient]} style={StyleSheet.absoluteFill} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingHorizontal: isWide ? theme.spacing.xl : theme.spacing.md,
              paddingBottom: theme.spacing.xl,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.topBar, { marginBottom: theme.spacing.sm }]}>
            <LanguageToggle variant="compact" testID="auth-language-toggle" />
          </View>

          <View style={[styles.content, { maxWidth: isWide ? 440 : undefined, alignSelf: 'center', width: '100%' }]}>
            <BrandLogo size="lg" showTagline tagline={t('brand.tagline')} />

            <Text
              style={[
                type.h2,
                {
                  color: theme.colors.text,
                  textAlign: textAlign('center'),
                  marginTop: theme.spacing.xl,
                },
              ]}
            >
              {title}
            </Text>

            {subtitle ? (
              <Text
                style={[
                  type.body,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: textAlign('center'),
                    marginTop: theme.spacing.sm,
                    marginBottom: theme.spacing.lg,
                  },
                ]}
              >
                {subtitle}
              </Text>
            ) : (
              <View style={{ height: theme.spacing.lg }} />
            )}

            <View
              style={[
                styles.formCard,
                {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius['2xl'],
                  borderColor: theme.colors.border,
                  padding: theme.spacing.lg,
                  ...theme.shadows.md,
                },
              ]}
            >
              {children}
            </View>

            {footer ? <View style={{ marginTop: theme.spacing.lg }}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center' },
  topBar: { width: '100%', alignItems: 'flex-end' },
  content: { alignItems: 'center' },
  formCard: {
    width: '100%',
    borderWidth: 1,
  },
});

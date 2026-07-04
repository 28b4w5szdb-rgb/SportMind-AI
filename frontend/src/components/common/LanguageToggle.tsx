/**
 * SportMind AI — LanguageToggle
 *
 * Segmented control that switches between EN and AR at runtime.
 * Uses DirectionProvider to trigger the instant mirror flip described
 * in UIUX Doc 06 §6.7. Fully accessible with proper roles + labels.
 *
 * Usage:
 *   <LanguageToggle />                    // default segmented style
 *   <LanguageToggle variant="compact" />  // small chip for headers
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useDirection } from '@/src/providers/DirectionProvider';
import { useTheme } from '@/src/core/theme';
import { useTranslation } from 'react-i18next';

export interface LanguageToggleProps {
  variant?: 'segmented' | 'compact';
  testID?: string;
}

export function LanguageToggle({ variant = 'segmented', testID }: LanguageToggleProps) {
  const theme = useTheme();
  const { language, setLanguage, flexRow } = useDirection();
  const { t } = useTranslation();

  if (variant === 'compact') {
    const nextLang = language === 'en' ? 'ar' : 'en';
    const nextLabel = nextLang === 'en' ? 'EN' : 'ع';
    return (
      <Pressable
        testID={testID}
        onPress={() => setLanguage(nextLang)}
        accessibilityRole="button"
        accessibilityLabel={t('language.switchLanguage')}
        style={({ pressed }) => [
          styles.compactBtn,
          {
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Text style={{ color: theme.colors.text, fontWeight: '600', fontSize: 13 }}>
          {nextLabel}
        </Text>
      </Pressable>
    );
  }

  const options: Array<{ code: 'en' | 'ar'; label: string }> = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'ع' },
  ];

  return (
    <View
      testID={testID}
      accessibilityRole="tablist"
      accessibilityLabel={t('language.switchLanguage')}
      style={[
        styles.segmented,
        {
          backgroundColor: theme.colors.backgroundTertiary,
          borderColor: theme.colors.border,
          flexDirection: flexRow(true),
        },
      ]}
    >
      {options.map((opt) => {
        const active = language === opt.code;
        return (
          <Pressable
            key={opt.code}
            onPress={() => setLanguage(opt.code)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.code === 'en' ? t('language.english') : t('language.arabic')}
            style={({ pressed }) => [
              styles.segment,
              {
                backgroundColor: active ? theme.colors.surface : 'transparent',
                opacity: pressed ? 0.75 : 1,
              },
              active && styles.segmentActive,
              active && { shadowColor: '#000' },
            ]}
          >
            <Text
              style={{
                color: active ? theme.colors.text : theme.colors.textSecondary,
                fontWeight: active ? '700' : '500',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  segmented: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 3,
    alignSelf: 'flex-start',
  },
  segment: {
    minWidth: 44,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  compactBtn: {
    minWidth: 44,
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

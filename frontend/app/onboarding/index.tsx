/**
 * SportMind AI — First-launch onboarding (product identity, no backend).
 */

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import { BrandMark } from '@/src/components/brand';
import { Button } from '@/src/components/common/Button';
import { LanguageToggle } from '@/src/components/common/LanguageToggle';
import { AUTH_ROUTES, APP_ROUTES } from '@/src/core/constants/routes';
import { DEV_BYPASS_AUTH } from '@/src/core/config/dev';
import { useTheme, useTypography } from '@/src/core/theme';
import { brandGradients } from '@/src/core/theme/brand';
import { useDirection } from '@/src/providers/DirectionProvider';
import { useOnboarding } from '@/src/hooks/useOnboarding';

type SlideIcon = keyof typeof Ionicons.glyphMap;

const SLIDE_KEYS = ['welcome', 'audience', 'features', 'start'] as const;
const SLIDE_ICONS: Record<(typeof SLIDE_KEYS)[number], SlideIcon> = {
  welcome: 'sparkles',
  audience: 'people',
  features: 'analytics',
  start: 'rocket',
};

export default function OnboardingScreen() {
  const theme = useTheme();
  const type = useTypography();
  const { t } = useTranslation();
  const { flexRow, textAlign, isRTL } = useDirection();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { markComplete } = useOnboarding();
  const listRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const gradient = theme.isDark ? brandGradients.splashDark : brandGradients.splashLight;

  const finish = async () => {
    await markComplete();
    router.replace(DEV_BYPASS_AUTH ? APP_ROUTES.dashboard : AUTH_ROUTES.signIn);
  };

  const goNext = () => {
    if (index >= SLIDE_KEYS.length - 1) {
      finish();
      return;
    }
    const next = index + 1;
    listRef.current?.scrollToIndex({ index: next, animated: true });
    setIndex(next);
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(next);
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <LinearGradient colors={[...gradient]} style={StyleSheet.absoluteFill} />

      <View style={[styles.topBar, { flexDirection: flexRow(true), paddingHorizontal: theme.spacing.md }]}>
        <BrandMark size="sm" />
        <LanguageToggle variant="compact" />
      </View>

      <FlatList
        ref={listRef}
        data={SLIDE_KEYS as unknown as string[]}
        keyExtractor={(item) => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        inverted={isRTL}
        renderItem={({ item }) => {
          const key = item as (typeof SLIDE_KEYS)[number];
          return (
            <View style={[styles.slide, { width }]}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: theme.colors.primary + (theme.isDark ? '28' : '14'),
                    borderRadius: theme.borderRadius['3xl'],
                  },
                ]}
              >
                <Ionicons name={SLIDE_ICONS[key]} size={40} color={theme.colors.primary} />
              </View>
              <Text
                style={[
                  type.overline,
                  {
                    color: theme.colors.primary,
                    textAlign: textAlign('center'),
                    marginTop: theme.spacing.lg,
                    letterSpacing: 2,
                  },
                ]}
              >
                {t(`onboarding.${key}.eyebrow`)}
              </Text>
              <Text
                style={[
                  type.h2,
                  {
                    color: theme.colors.text,
                    textAlign: textAlign('center'),
                    marginTop: theme.spacing.sm,
                    paddingHorizontal: theme.spacing.lg,
                  },
                ]}
              >
                {t(`onboarding.${key}.title`)}
              </Text>
              <Text
                style={[
                  type.body,
                  {
                    color: theme.colors.textSecondary,
                    textAlign: textAlign('center'),
                    marginTop: theme.spacing.md,
                    paddingHorizontal: theme.spacing.xl,
                    lineHeight: 24,
                  },
                ]}
              >
                {t(`onboarding.${key}.body`)}
              </Text>
            </View>
          );
        }}
      />

      <View style={{ paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
        <View style={[styles.dots, { flexDirection: flexRow(true) }]}>
          {SLIDE_KEYS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === index ? theme.colors.primary : theme.colors.border,
                  width: i === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={index === SLIDE_KEYS.length - 1 ? t('onboarding.getStarted') : t('common.next')}
          onPress={goNext}
          fullWidth
          icon={index === SLIDE_KEYS.length - 1 ? 'arrow-forward' : undefined}
          style={{ marginTop: theme.spacing.lg }}
        />

        {index < SLIDE_KEYS.length - 1 ? (
          <Button
            title={t('onboarding.skip')}
            onPress={finish}
            variant="ghost"
            fullWidth
            style={{ marginTop: theme.spacing.sm }}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 8,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 24,
  },
  iconWrap: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

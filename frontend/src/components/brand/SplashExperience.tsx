/**
 * SportMind AI — Branded Splash Experience
 * Animated-ready launch screen (light/dark, EN/AR).
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@/src/core/theme';
import { brandGradients, brandMotion } from '@/src/core/theme/brand';
import { BrandLogo } from './BrandLogo';

interface SplashExperienceProps {
  /** When true, plays exit fade (caller hides after animation). */
  exiting?: boolean;
}

export function SplashExperience({ exiting = false }: SplashExperienceProps) {
  const theme = useTheme();
  const { t } = useTranslation();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.92);
  const pulse = useSharedValue(1);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: brandMotion.stateEnterMs, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: brandMotion.splashFadeMs, easing: Easing.out(Easing.cubic) });
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 900, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, [opacity, scale, pulse]);

  useEffect(() => {
    if (exiting) {
      opacity.value = withTiming(0, { duration: brandMotion.splashFadeMs });
    }
  }, [exiting, opacity]);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value * pulse.value }],
  }));

  const gradient = theme.isDark ? brandGradients.splashDark : brandGradients.splashLight;

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[...gradient]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.center, contentStyle]}>
        <BrandLogo
          size="xl"
          showWordmark
          showTagline
          tagline={t('brand.tagline')}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
});
